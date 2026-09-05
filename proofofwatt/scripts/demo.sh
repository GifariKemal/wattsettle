#!/usr/bin/env bash
# Runner demo WattSettle, satu perintah untuk tiga beat panggung.
#
# Beat 1  bacaan wajar   -> agent menyetujui, produsen dibayar
# Beat 2  bacaan anomali -> agent menolak, nol pembayaran
# Beat 3  verifier BERBOHONG -> kontrak menghitung sendiri dan tetap menolak
#
# Beat 3 adalah puncaknya. Penolakan lebih meyakinkan daripada persetujuan, dan penolakan
# terhadap AI-nya sendiri jauh lebih meyakinkan lagi.
#
# Script mencetak tautan BscScan tiap transaksi supaya bisa langsung dibuka saat merekam.
# Jalankan night-before.sh lebih dulu, script ini menolak jalan kalau state belum aman.
set -uo pipefail

cd "$(dirname "$0")/.."
set -a; source "../.secrets/wattsettle-roles.env"; set +a
export DEPLOYER_PK=$(grep -m1 "^-Private Key:" "../.secrets/Wallet Testnet.txt" | sed "s/.*: *//" | tr -d "\r")

find_python() {
  for cand in "${PYTHON:-}" python python3 /mnt/c/Python313/python.exe; do
    [ -n "$cand" ] || continue
    if command -v "$cand" >/dev/null 2>&1 && "$cand" -c "import web3" >/dev/null 2>&1; then
      echo "$cand"; return 0
    fi
  done
  return 1
}
PY=$(find_python) || { echo "Tidak menemukan Python yang punya web3. Set PYTHON=..."; exit 1; }

SCAN="https://testnet.bscscan.com"
R=(--rpc-url "$BSC_TESTNET_RPC")

echo "== Pemeriksaan state sebelum demo =="
bash scripts/night-before.sh || { echo "State belum aman, demo dibatalkan."; exit 1; }

# Timestamp disemai dari lastTs on-chain, bukan dari jam dinding, supaya guard monotonic
# tidak menolak bacaan demo hanya karena rehearsal sebelumnya sudah memajukan lastTs.
LAST_TS=$(cast call "$WATTSETTLE_CONTRACT" "devices(bytes32)(address,address,uint64,uint96)" "$DEVICE_ID" "${R[@]}" | sed -n 3p | awk '{print $1}')
NOW_TS=$(date +%s)
BASE_TS=$(( LAST_TS > NOW_TS ? LAST_TS : NOW_TS ))

kirim() { # kirim <kWh> <offset_detik> <label>
  echo
  echo "== $3, $1 kWh =="
  KWH=$1 READING_TS=$((BASE_TS + $2)) READING_NONCE=$((BASE_TS + $2)) \
    forge script script/SubmitReading.s.sol:SubmitReading "${R[@]}" --broadcast >/dev/null 2>&1 \
    || { echo "   gagal mengirim bacaan"; return 1; }
  ID=$(( $(cast call "$WATTSETTLE_CONTRACT" "submissionCount()(uint256)" "${R[@]}" | awk '{print $1}') - 1 ))
  echo "   reading id $ID terkirim"
}

kirim 105 60 "Beat 1, bacaan wajar" || exit 1
kirim 4200 120 "Beat 2, bacaan anomali" || exit 1

echo
echo "== Agent AI menilai keduanya, tanpa satu klik manusia =="
"$PY" agent/verifier.py

# Beat 3, bacaan yang dipakai untuk membuktikan verifier tidak bisa memaksa pembayaran.
kirim 900 180 "Beat 3, bahan uji verifier berbohong" || exit 1
LIE_ID=$ID

echo
echo "== Kontrak menilai sendiri bacaan itu =="
cast call "$WATTSETTLE_CONTRACT" "assess(bytes32,uint256)(int256,uint16)" "$DEVICE_ID" 900 "${R[@]}"

echo
echo "== Verifier sengaja BERBOHONG, mengaku nol penyimpangan dan nol anomali =="
MODEL=$(cast keccak "wattsettle-verifier/1.0.0")
RULES=$(cast keccak 0x$(xxd -p -c 999999 ruleset/anomaly_v1.json))
TX=$(cast send "$WATTSETTLE_CONTRACT" \
  "attestAndSettle(uint256,(int256,uint16,bytes32,bytes32,uint64))" \
  "$LIE_ID" "(0,0,$MODEL,$RULES,$(date +%s))" \
  "${R[@]}" --private-key "$VERIFIER_PK" --json 2>/dev/null | grep -o '"transactionHash":"[^"]*"' | cut -d'"' -f4)
STATUS=$(cast call "$WATTSETTLE_CONTRACT" "submissions(uint256)(bytes32,uint256,uint64,uint256,uint8)" "$LIE_ID" "${R[@]}" | tail -1 | awk '{print $1}')

echo "   status akhir bacaan $LIE_ID: $STATUS (3 berarti Rejected)"
echo "   $SCAN/tx/$TX"

echo
echo "== Ringkasan untuk dibuka di layar =="
echo "kontrak  : $SCAN/address/$WATTSETTLE_CONTRACT"
echo "produsen : $SCAN/address/$DEVICE_OWNER_ADDR"
echo "treasury : $SCAN/address/$TREASURY_ADDR"
echo "agent    : $SCAN/address/$VERIFIER_ADDR"
echo
echo "rulesetHash yang bisa dihitung ulang siapa pun:"
echo "  $RULES"
