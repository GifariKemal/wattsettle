// Konten halaman Teknologi. Register produk, kredibel teknis.
// Sumber kebenaran: WattSettle build bible bab 06, 07, 08, 10. Jangan mengada-ada.
// PUBLIC-SAFE: tidak ada IP, hostname, credential, atau detail infra internal.

export const techHero = {
  eyebrow: "Teknologi WattSettle",
  headline: ["Kontrak yang membaca alasan,", "agent yang menekan tombol,", "rantai yang menyimpan bukti."],
  lead:
    "WattSettle berdiri di atas tiga lapis yang saling menutup: smart contract Solidity di BNB Chain, agent AI otonom yang menilai lalu menyelesaikan pembayaran, dan integrasi ke registry validasi resmi ekosistem BNB. Semuanya deterministik, semuanya bisa dibuktikan on-chain.",
} as const;

// ── LAPIS 1: KONTRAK ──
export const contract = {
  eyebrow: "Lapis 1 · Smart Contract",
  title: "Evolusi ProofOfWatt, bukan rewrite",
  lead:
    "Kontrak WattSettle adalah pertumbuhan terkendali dari ProofOfWatt yang sudah teruji, bukan proyek baru. Permukaan yang disentuh sesedikit mungkin: satu struct Attestation, event rationale baru, dan satu fungsi attestAndSettle yang menggantikan boolean approve.",
  points: [
    {
      ic: "ph:file-code",
      tone: "flow",
      t: "attestAndSettle",
      d: "Menerima rationale AI berupa struct Attestation, menjalankan gate ruleset on-chain, memutuskan approve atau reject secara deterministik, lalu menyelesaikan pembayaran. Verifier memasok angka, kontrak yang memutus.",
    },
    {
      ic: "ph:brackets-curly",
      tone: "volt",
      t: "Struct Attestation",
      d: "Rationale numerik AI diangkat jadi data on-chain: delta kWh terhadap baseline, skor anomali dalam basis points, plus hash model dan ruleset. Hash cocok dengan file yang dipublish di repo, jadi siapa pun bisa hitung sendiri dan buktikan.",
    },
    {
      ic: "ph:coins",
      tone: "watt",
      t: "Fee split on-chain",
      d: "reward dihitung dari kWh dikali rewardPerKwh, fee protokol 1% (feeBps 100) dipungut ke treasury, sisanya dibayar ke produsen. Revenue model-nya provable on-chain, bukan klaim slide.",
    },
  ],
  // Cuplikan Solidity kecil, sumber verbatim dari bab 06 (dipangkas untuk keterbacaan).
  code: `struct Attestation {
    int256  kwhDeltaVsBaseline;  // selisih kWh vs baseline (bisa negatif)
    uint16  anomalyScoreBps;     // skor anomali 0..10000 bps
    bytes32 modelVersionHash;    // keccak256(versi model) auditable
    bytes32 rulesetHash;         // keccak256(ruleset) match file repo
    uint64  evaluatedAt;         // timestamp evaluasi verifier
}

function attestAndSettle(uint256 id, Attestation calldata a)
    external
    onlyRole(VERIFIER_ROLE)
    nonReentrant
{
    Submission storage s = submissions[id];
    if (s.status != Status.Pending) revert NotPending();

    // GATE RULESET ON-CHAIN (deterministik, bukan cap karet)
    bool approved = (a.anomalyScoreBps <= maxAnomalyBps)
                 && (_abs(a.kwhDeltaVsBaseline) <= maxDeltaBound);

    // EFFECTS: status di-set sebelum interaksi eksternal
    s.status = approved ? Status.Approved : Status.Rejected;

    if (approved) {
        uint256 reward = s.kWh * rewardPerKwh;
        uint256 fee = (reward * feeBps) / 10_000;         // 1% pada feeBps = 100
        if (rewardToken.balanceOf(address(this)) < reward)
            revert InsufficientRewardPool();               // solvency guard
        rewardToken.safeTransfer(devices[s.deviceId].owner, reward - fee);
        if (fee > 0) rewardToken.safeTransfer(treasury, fee);
    }
    emit ReadingAttested(id, s.deviceId, approved, a);      // rationale decoded di BscScan
}`,
} as const;

// Jaminan keamanan kontrak.
export const guards = {
  eyebrow: "Trust boundary",
  title: "Yang dijaga, byte for byte",
  lead:
    "Bagian paling rawan salah, kriptografi dan proteksi replay, tetap verbatim dari base yang sudah lolos test. Keamanan, validasi, dan trust boundary 100% tidak dipangkas.",
  items: [
    { ic: "ph:signature", tone: "flow", t: "EIP-712 recover", d: "submitReading membuktikan bacaan datang dari signer device sah lewat ECDSA.recover. Ini inti trust boundary fisik ke on-chain." },
    { ic: "ph:shield-check", tone: "watt", t: "Replay guard", d: "usedDigest memastikan satu digest diproses sekali, dan lastTs monotonic menolak timestamp yang tidak maju. Jaminan anti double pay." },
    { ic: "ph:arrows-clockwise", tone: "volt", t: "ReentrancyGuard", d: "Modifier nonReentrant di jalur payout, sabuk pengaman kedua di atas disiplin checks-effects-interactions yang sudah benar." },
    { ic: "ph:swap", tone: "gold", t: "SafeERC20", d: "Semua transfer lewat safeTransfer, aman untuk token yang tidak mengembalikan boolean sesuai standar. Zero new deps, dari OpenZeppelin yang sudah ada." },
  ],
} as const;

// ── LAPIS 2: AI VERIFIER ──
export const verifier = {
  eyebrow: "Lapis 2 · AI Verifier",
  title: "Agent otonom, zero-click",
  lead:
    "Kontrak tidak bisa memanggil dirinya sendiri. Yang menekan tombol adalah agent otonom SURIOTA, sebuah proses Python yang berjalan terjadwal, memegang wallet ber-VERIFIER_ROLE, dan menyelesaikan seluruh loop tanpa satu klik manusia.",
  steps: [
    { ic: "ph:broadcast", tone: "flow", k: "01", t: "Subscribe", d: "Agent memindai event ReadingSubmitted dari kontrak lewat web3.py, memakai block filter sederhana dari block terakhir yang diproses." },
    { ic: "ph:calculator", tone: "volt", k: "02", t: "Recompute", d: "Untuk tiap bacaan, agent menghitung delta terhadap baseline device lalu menjalankan anomaly ruleset yang dipublish di repo. Aritmetika murni, deterministik." },
    { ic: "ph:note-pencil", tone: "gold", k: "03", t: "Build Attestation", d: "Agent merakit struct lengkap dengan skor anomali, modelVersionHash, rulesetHash, dan evaluatedAt." },
    { ic: "ph:lightning", tone: "watt", k: "04", t: "Settle", d: "Agent memanggil attestAndSettle dengan wallet ber-VERIFIER_ROLE. Kontrak yang memutus approve atau reject lewat gate on-chain." },
  ],
  note:
    "LLM tidak berada di jalur kritis keputusan. Fungsi evaluasi sepenuhnya deterministik terhadap baseline, sehingga keputusan uang reproducible dan tahan audit. LLM dipakai untuk lapisan penjelasan dan operasional, bukan untuk memutuskan bayar atau tolak.",
  code: `def evaluate(device_id: bytes, kwh: int) -> dict:
    """Recompute delta vs baseline + skor anomali.
    Deterministik, tanpa LLM di jalur kritis."""
    baseline = RULESET["baselines"][device_id.hex()]
    delta = kwh - baseline["expected_kwh"]

    # Skor anomali dalam bps: makin jauh dari baseline, makin tinggi.
    span = max(baseline["expected_kwh"], 1)
    anomaly_bps = min(10_000, abs(delta) * 10_000 // span)

    return {
        "kwhDeltaVsBaseline": int(delta),
        "anomalyScoreBps": int(anomaly_bps),
        "modelVersionHash": MODEL_VERSION_HASH,   # keccak256, computed not hardcoded
        "rulesetHash": RULESET_HASH,              # cocok dengan file di repo
        "evaluatedAt": w3.eth.get_block("latest")["timestamp"],
    }`,
} as const;

// ── LAPIS 3: BNB CHAIN + ERC-8004 ──
export const chainIntegration = {
  eyebrow: "Lapis 3 · BNB Chain · ERC-8004",
  title: "Integrate, bukan mirror",
  lead:
    "Validation Registry ERC-8004 dan BEP-620 sudah live di BSC testnet 97. WattSettle tidak me-reimplement standar itu. Setelah attestAndSettle emit ReadingAttested, agent juga menulis validationResponse ke registry resmi BNB untuk bacaan yang sama.",
  points: [
    { ic: "ph:link", tone: "flow", t: "Validation Registry live", d: "Rationale AI tercatat di registry ERC-8004 yang live di testnet 97, bukan event bespoke yang meniru standar. Kontrak settlement tetap jadi core pembayaran." },
    { ic: "ph:plugs-connected", tone: "volt", t: "Warga ekosistem BNB", d: "Device physical-DePIN menjadi agent real-world yang menulis ke registry live BNB, dan settlement rail menjadi payment layer di atasnya. x402 relevan sebagai konteks arah agentic payment." },
    { ic: "ph:cpu", tone: "watt", t: "web3.py ke chainId 97", d: "Agent berbicara ke BSC testnet 97 lewat RPC publik. Indexing memakai direct event scan, bukan subgraph, keputusan YAGNI yang menjaga permukaan tetap kecil." },
  ],
} as const;

// ── TOKEN ──
export const token = {
  eyebrow: "Settlement token",
  title: "suriota, verified di testnet 97",
  lead:
    "WattSettle tidak menciptakan token baru. Ia memakai ulang ERC20 suriota yang sudah deployed dan verified di BscScan testnet 97 sebagai settlement token default, menghilangkan seluruh risiko token baru.",
  facts: [
    { k: "Standar", v: "ERC20", d: "OpenZeppelin ERC20 plus Ownable, 18 desimal" },
    { k: "Status", v: "Verified", d: "deployed dan verified di BscScan testnet 97" },
    { k: "Fee protokol", v: "1%", d: "feeBps 100, dipungut on-chain ke treasury" },
    { k: "Cadangan", v: "MockUSD", d: "mock stablecoin 6 desimal, one-line constructor swap (opsional)" },
  ],
  framing:
    "Positioning suriota tegas sebagai utility token, bukan security. Ia medium settlement untuk membayar produsen atas kWh terverifikasi, nilainya melekat pada aktivitas fisik nyata, bukan janji imbal hasil dari usaha pihak lain.",
} as const;

// ── BUKTI ON-CHAIN ──
export const proof = {
  eyebrow: "Bukti on-chain",
  title: "Semua bisa dicek di BscScan",
  lead:
    "Setiap keadaan yang perlu ditunjukkan sudah tersedia sebagai transaksi publik di BscScan. Event ReadingAttested membawa seluruh Attestation yang ter-decode, transfer suriota terlihat, fee ke treasury terlihat. BscScan menjadi UI sekaligus API.",
  links: [
    { ic: "ph:file-code", t: "Kontrak WattSettle", d: "Sumber terbaca publik, attestAndSettle ter-verify.", tone: "flow" },
    { ic: "ph:coins", t: "Token suriota", d: "ERC20 verified, address dari konfigurasi rantai.", tone: "gold" },
    { ic: "ph:receipt", t: "Transaksi settlement", d: "submitReading dan attestAndSettle sebagai tx nyata.", tone: "watt" },
  ],
} as const;
