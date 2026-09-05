#!/usr/bin/env python3
"""WattSettle AI verifier, agent otonom yang menutup loop dari bacaan ke pembayaran.

Empat langkah, tanpa satu pun klik manusia:

1. Scan   : baca event ReadingSubmitted dari kontrak lewat web3.py.
2. Recompute : hitung ulang delta terhadap baseline dan skor anomali dari ruleset yang
               dipublish di repo. Deterministik, aritmetika bilangan bulat, tanpa LLM.
3. Attest : rakit struct Attestation lengkap dengan rulesetHash dan modelVersionHash.
4. Settle : panggil attestAndSettle. KONTRAK yang memutus approve atau reject lewat gate
            on-chain, agent hanya memasok angka.

LLM sengaja tidak berada di jalur keputusan. Keputusan uang harus reproducible dan tahan
audit, dan itu hanya bisa dijamin aritmetika deterministik. LLM di Hermes dipakai untuk
menyusun penjelasan bagi manusia, sesudah keputusan diambil, di luar jalur kritis.

Jalankan:
    python agent/verifier.py            # settle semua bacaan Pending
    python agent/verifier.py --dry-run  # hitung dan tampilkan saja, tidak kirim transaksi
"""

from __future__ import annotations

import argparse
import json
import sys
from pathlib import Path

from web3 import Web3
from web3.middleware import ExtraDataToPOAMiddleware

REPO = Path(__file__).resolve().parent.parent
SECRETS = REPO.parent / ".secrets" / "wattsettle-roles.env"
RULESET_PATH = REPO / "ruleset" / "anomaly_v1.json"
ARTIFACT = REPO / "out" / "WattSettle.sol" / "WattSettle.json"

MODEL_VERSION = "wattsettle-verifier/1.0.0"

# Status enum di kontrak: 0 None, 1 Pending, 2 Approved, 3 Rejected.
STATUS_PENDING = 1
STATUS_NAME = {0: "None", 1: "Pending", 2: "Approved", 3: "Rejected"}


def load_env(path: Path) -> dict[str, str]:
    """Parser env minimal. Sengaja tidak menarik dependency demi lima baris ini."""
    env: dict[str, str] = {}
    for line in path.read_text(encoding="utf-8").splitlines():
        line = line.strip()
        if line and not line.startswith("#") and "=" in line:
            key, _, value = line.partition("=")
            env[key.strip()] = value.strip()
    return env


def evaluate(ruleset: dict, ruleset_hash: bytes, device_id: str, kwh: int, evaluated_at: int) -> dict:
    """Hitung ulang bacaan terhadap baseline device. Murni aritmetika, tanpa LLM.

    Rumusnya persis seperti yang tertulis di ruleset/anomaly_v1.json, sehingga siapa pun
    bisa menjalankan ulang perhitungan ini dan mendapat angka yang sama.
    """
    baseline = ruleset["baselines"].get(device_id)
    if baseline is None:
        raise KeyError(f"device {device_id} tidak punya baseline di ruleset, menolak menebak")

    expected = int(baseline["expected_kwh"])
    delta = kwh - expected
    span = max(expected, 1)
    anomaly_bps = min(10_000, abs(delta) * 10_000 // span)

    return {
        "kwhDeltaVsBaseline": delta,
        "anomalyScoreBps": anomaly_bps,
        "modelVersionHash": Web3.keccak(text=MODEL_VERSION),
        "rulesetHash": ruleset_hash,
        "evaluatedAt": evaluated_at,
    }


def passes_gate(delta: int, anomaly_bps: int, max_anomaly_bps: int, max_delta_bound: int) -> bool:
    """Cermin satu lapis gate on-chain, dipakai hanya untuk logging supaya operator tahu apa
    yang akan terjadi. Yang mengikat tetap keputusan kontrak, bukan fungsi ini."""
    return anomaly_bps <= max_anomaly_bps and abs(delta) <= max_delta_bound


def main() -> int:
    parser = argparse.ArgumentParser(description="WattSettle AI verifier")
    parser.add_argument("--dry-run", action="store_true", help="hitung saja, jangan kirim transaksi")
    parser.add_argument("--from-block", type=int, default=None, help="block awal pemindaian event")
    args = parser.parse_args()

    env = load_env(SECRETS)
    contract_addr = env.get("WATTSETTLE_CONTRACT", "")
    if not contract_addr:
        print("WATTSETTLE_CONTRACT belum diisi di .secrets/wattsettle-roles.env", file=sys.stderr)
        return 1

    w3 = Web3(Web3.HTTPProvider(env["BSC_TESTNET_RPC"]))
    # BSC memakai proof-of-authority, sehingga field extraData di header block lebih panjang
    # dari yang divalidasi web3.py secara default. Tanpa middleware ini setiap pembacaan
    # block akan melempar ExtraDataLengthError.
    w3.middleware_onion.inject(ExtraDataToPOAMiddleware, layer=0)
    if not w3.is_connected():
        print("RPC tidak terjangkau", file=sys.stderr)
        return 1

    abi = json.loads(ARTIFACT.read_text(encoding="utf-8"))["abi"]
    ws = w3.eth.contract(address=Web3.to_checksum_address(contract_addr), abi=abi)

    # rulesetHash dihitung dari byte file yang benar-benar ada di repo, bukan konstanta
    # yang ditulis tangan. Inilah yang membuat nilai on-chain bisa diaudit ulang.
    ruleset_bytes = RULESET_PATH.read_bytes()
    ruleset_hash = Web3.keccak(ruleset_bytes)
    ruleset = json.loads(ruleset_bytes)

    max_anomaly_bps = ws.functions.maxAnomalyBps().call()
    max_delta_bound = ws.functions.maxDeltaBound().call()

    account = w3.eth.account.from_key(env["VERIFIER_PK"])
    print(f"agent      : {account.address}")
    print(f"kontrak    : {ws.address}")
    print(f"rulesetHash: 0x{ruleset_hash.hex()}")
    print(f"gate       : maxAnomalyBps={max_anomaly_bps} maxDeltaBound={max_delta_bound}")

    # Baseline di ruleset HARUS sama dengan yang tersimpan di kontrak. Kalau berbeda,
    # kontrak dan agent akan menilai bacaan yang sama dengan angka berbeda, dan yang
    # terjadi bukan bug yang berisik melainkan penolakan diam-diam yang membingungkan.
    # Lebih baik diteriakkan di awal.
    for device_hex, meta in ruleset["baselines"].items():
        on_chain = ws.functions.devices(bytes.fromhex(device_hex[2:])).call()[3]
        if on_chain != int(meta["expected_kwh"]):
            print(
                f"PERINGATAN : baseline {meta['label']} berbeda, "
                f"ruleset={meta['expected_kwh']} kontrak={on_chain}"
            )

    total = ws.functions.submissionCount().call()
    print(f"bacaan     : {total} total on-chain")

    # Waktu chain diambil sekali per run, bukan sekali per bacaan. Satu panggilan RPC
    # lebih hemat, dan seluruh bacaan dalam satu run jadi punya evaluatedAt yang sama
    # sehingga hasilnya lebih mudah direproduksi saat diaudit.
    evaluated_at = int(w3.eth.get_block("latest")["timestamp"])

    settled = 0
    skipped = 0
    already_settled = 0
    # ponytail: pemindaian O(n) dari id nol tiap run. Cukup untuk skala demo dan
    # membuat agent idempoten tanpa berkas state. Kalau jumlah bacaan menembus
    # ribuan, ganti dengan kursor yang hanya maju melewati bacaan non-Pending
    # yang berurutan, jangan kursor "id terakhir" polos karena itu akan melewatkan
    # bacaan lama yang sempat gagal di-settle.
    for reading_id in range(total):
        device_id, kwh, timestamp, _nonce, status = ws.functions.submissions(reading_id).call()
        device_hex = "0x" + device_id.hex()

        if status != STATUS_PENDING:
            already_settled += 1
            continue

        # Device tanpa baseline TIDAK boleh menjatuhkan seluruh run. Kalau ini
        # dibiarkan melempar, satu perangkat asing membuat semua bacaan sesudahnya
        # ikut tidak ter-settle. Lewati yang ini saja, lanjutkan sisanya, dan
        # laporkan di akhir supaya tetap terlihat operator.
        try:
            att = evaluate(ruleset, ruleset_hash, device_hex, kwh, evaluated_at)
        except KeyError as exc:
            print(f"  #{reading_id} DILEWATI, {exc}")
            skipped += 1
            continue

        # Penilaian kontrak sendiri, dibaca langsung dari rantai. Agent TIDAK bisa
        # mempengaruhinya, dan menampilkannya di sini membuat perbedaan pendapat antara
        # kontrak dan agent langsung terlihat operator.
        chain_delta, chain_anomaly_bps = ws.functions.assess(device_id, kwh).call()

        mine_ok = passes_gate(att["kwhDeltaVsBaseline"], att["anomalyScoreBps"], max_anomaly_bps, max_delta_bound)
        chain_ok = passes_gate(chain_delta, chain_anomaly_bps, max_anomaly_bps, max_delta_bound)
        would_approve = mine_ok and chain_ok

        print(
            f"  #{reading_id} kWh={kwh} ts={timestamp}\n"
            f"      agent   : delta={att['kwhDeltaVsBaseline']:>8} anomali={att['anomalyScoreBps']:>5}bps "
            f"{'lolos' if mine_ok else 'tolak'}\n"
            f"      kontrak : delta={chain_delta:>8} anomali={chain_anomaly_bps:>5}bps "
            f"{'lolos' if chain_ok else 'tolak'}\n"
            f"      prediksi: {'APPROVE' if would_approve else 'REJECT'}"
        )
        if (att["kwhDeltaVsBaseline"], att["anomalyScoreBps"]) != (chain_delta, chain_anomaly_bps):
            print("      CATATAN : agent dan kontrak berbeda pendapat, periksa baseline di ruleset")

        if args.dry_run:
            continue

        attestation = (
            att["kwhDeltaVsBaseline"],
            att["anomalyScoreBps"],
            att["modelVersionHash"],
            att["rulesetHash"],
            att["evaluatedAt"],
        )
        fn = ws.functions.attestAndSettle(reading_id, attestation)
        tx = fn.build_transaction(
            {
                "from": account.address,
                "nonce": w3.eth.get_transaction_count(account.address),
                "gas": int(fn.estimate_gas({"from": account.address}) * 12 // 10),
                "gasPrice": w3.eth.gas_price,
                "chainId": int(env["CHAIN_ID"]),
            }
        )
        signed = account.sign_transaction(tx)
        tx_hash = w3.eth.send_raw_transaction(signed.raw_transaction)
        receipt = w3.eth.wait_for_transaction_receipt(tx_hash)

        # Keputusan dibaca kembali DARI KONTRAK, bukan dari prediksi agent.
        _, _, _, _, final_status = ws.functions.submissions(reading_id).call()
        print(
            f"     settled tx=0x{tx_hash.hex()} block={receipt['blockNumber']} "
            f"gas={receipt['gasUsed']} keputusan_kontrak={STATUS_NAME.get(final_status, final_status)}"
        )
        settled += 1

    if already_settled:
        print(f"  ({already_settled} bacaan sebelumnya sudah selesai, dilewati)")
    print(f"selesai, {settled} bacaan di-settle, {skipped} dilewati")
    # Keluar bukan nol bila ada bacaan yang tidak bisa dievaluasi, supaya cron atau
    # watchdog di server ikut menyalakan alarm dan tidak diam-diam menganggap sukses.
    return 1 if skipped else 0


if __name__ == "__main__":
    raise SystemExit(main())
