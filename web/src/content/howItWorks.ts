// Konten halaman Cara Kerja. Fakta dari WattSettle build bible (02, 03, 05), jangan mengada-ada.

export const intro = {
  eyebrow: "Cara Kerja",
  title: "Rel settlement plus wasit AI untuk energi terverifikasi",
  lead:
    "Pahami WattSettle sebagai gabungan dua benda: sebuah rel pembayaran yang men-settle, dan seorang wasit AI yang menilai. Ketika sebuah bacaan energi dinyatakan sah, kontrak membayar produsen secara otomatis. Sebelum itu, verifier AI otonom memeriksa ulang angkanya dan menuliskan alasannya on-chain. Wasit ini tidak sekadar menekan setuju, ia mengevaluasi, dan ia bisa menolak.",
  model: [
    {
      ic: "ph:coins",
      tone: "watt",
      t: "Rel pembayaran",
      d: "Bagian yang men-settle. Bacaan sah memicu transfer token settlement ke produsen plus fee protokol, tanpa invoice manual, tanpa bank, tanpa klik manusia.",
    },
    {
      ic: "ph:scales",
      tone: "volt",
      t: "Wasit AI",
      d: "Bagian yang menilai. Verifier memeriksa angka masuk terhadap baseline perangkat, menghitung simpangannya, lalu menulis alasan keputusannya ke rantai sebelum rel membayar.",
    },
  ],
} as const;

export const reading = {
  eyebrow: "Yang ditandatangani perangkat",
  title: "struct Reading",
  lead:
    "Semuanya bermula dari sebuah Reading, paket data yang ditandatangani secara kriptografis oleh perangkat SRT-MGATE-1210 di titik sumber, memakai skema EIP-712 di domain ProofOfWatt/1. Karena ditandatangani di perangkat, angka di dalamnya tidak bisa diubah sepanjang jalur tanpa merusak tanda tangan.",
  fields: [
    { name: "deviceId", type: "bytes32", d: "Identitas unik perangkat yang sudah terdaftar via registerDevice." },
    { name: "kWh", type: "uint256", d: "Angka energi yang diklaim untuk periode ini." },
    { name: "timestamp", type: "uint64", d: "Waktu bacaan, dijaga monotonik naik agar tidak bisa mundur." },
    { name: "nonce", type: "uint256", d: "Penghitung unik per perangkat, penjaga terhadap replay." },
    { name: "signature", type: "bytes", d: "Tanda tangan ECDSA atas keempat field di atas." },
  ],
  guards: [
    { ic: "ph:arrows-clockwise", t: "Replay guard", d: "usedDigest menolak digest yang sama dua kali." },
    { ic: "ph:clock-countdown", t: "Monotonic guard", d: "lastTs menolak timestamp yang tidak lebih baru dari bacaan sebelumnya." },
  ],
} as const;

export const attestation = {
  eyebrow: "Yang ditulis verifier",
  title: "struct Attestation",
  lead:
    "Setelah verifier AI selesai memeriksa, ia tidak hanya menyimpulkan sah atau tidak. Ia membangun Attestation, rekaman alasan yang ditulis ke rantai. Struktur inilah yang mengubah autonomy AI dari sesuatu yang tak terlihat menjadi sesuatu yang bisa diaudit publik. Keputusan bukan lagi boolean tak terbaca, melainkan rationale yang legible on-chain.",
  fields: [
    { name: "kwhDeltaVsBaseline", type: "int256", d: "Selisih antara kWh yang diklaim dan baseline perangkat, rationale numerik." },
    { name: "anomalyScoreBps", type: "uint16", d: "Skor anomali dalam basis poin, rentang 0 sampai 10000." },
    { name: "modelVersionHash", type: "bytes32", d: "keccak256 dari versi model yang dipin, auditable dan tidak sekadar diklaim." },
    { name: "rulesetHash", type: "bytes32", d: "keccak256 dari file ruleset yang dipublikasikan, cocok dengan file di repo." },
    { name: "evaluatedAt", type: "uint64", d: "Waktu evaluasi dilakukan oleh verifier." },
  ],
  note:
    "Karena modelVersionHash dan rulesetHash tertulis di rantai dan cocok dengan file di repo, siapa pun bisa memverifikasi bahwa keputusan itu dihitung, bukan di-hardcode. Gerbang persetujuan lalu bersifat sederhana: approve jika anomalyScoreBps di bawah ambang dan besar kwhDeltaVsBaseline masih di dalam batas.",
} as const;

export const loop = {
  eyebrow: "Loop end-to-end",
  title: "Dari perangkat menandatangani sampai pembayaran tercatat",
  lead:
    "Satu putaran lengkap. Aktor manusia sama sekali tidak menyentuh tombol di jalur kritis ini. Kedua cabang, approve maupun reject, sama-sama memancarkan ReadingAttested dengan rationale yang bisa didecode di BscScan.",
  steps: [
    { ic: "ph:plug", tone: "flow", k: "01", t: "Device", call: "submitReading", d: "Perangkat memanggil submitReading dengan Reading yang sudah ditandatangani di titik sumber." },
    { ic: "ph:file-text", tone: "gold", k: "02", t: "Kontrak", call: "ReadingSubmitted", d: "Kontrak memverifikasi tanda tangan, melewatkan replay dan monotonic guard, lalu memancarkan event." },
    { ic: "ph:cpu", tone: "volt", k: "03", t: "AI Verifier", call: "attestAndSettle", d: "Agent yang berlangganan event bangun sendiri lewat cron, menghitung ulang delta dan anomali, membangun Attestation." },
    { ic: "ph:coins", tone: "watt", k: "04", t: "Settlement", call: "safeTransfer", d: "Ruleset gate lolos: kontrak membayar produsen dan memungut fee protokol. Tidak lolos: nol token, anomali tetap tercatat." },
  ],
  branches: [
    { ic: "ph:check-circle", tone: "watt", t: "Approve", d: "Kontrak membayar produsen via safeTransfer dan memungut fee. ReadingAttested dipancarkan dengan rationale penuh." },
    { ic: "ph:x-circle", tone: "heat", t: "Reject", d: "Nol token dibayar, tetapi anomali tetap tercatat sebagai bukti abadi on-chain. Satu penolakan lebih meyakinkan daripada hanya approval." },
  ],
} as const;

export const architecture = {
  eyebrow: "Arsitektur",
  title: "Tiga layer, satu loop, nol dependency eksternal di jalur kritis",
  lead:
    "Sistem dipecah menjadi tiga layer yang jelas batasnya, dengan aturan keras bahwa tidak ada satu pun dependency runtime eksternal yang berdiri di jalur kritis demo. Satu-satunya jaringan yang tetap live adalah BSC testnet 97 itu sendiri.",
  layers: [
    {
      ic: "ph:plug",
      tone: "flow",
      k: "Layer 1",
      t: "Physical dan Edge",
      d: "Dunia fisik, tempat moat berdiri. SRT-MGATE-1210, gateway ESP32 penjembatan Modbus ke MQTT, naik kelas menjadi device signer: ia memegang private key ECDSA dan menandatangani bacaan kWh dengan EIP-712. Enovatek PM20H20Q memberi angka kWh mentah.",
      tag: "device signer",
    },
    {
      ic: "ph:file-text",
      tone: "gold",
      k: "Layer 2",
      t: "Settlement Contract",
      d: "WattSettle.sol di BSC testnet chainId 97, evolusi dari ProofOfWatt.sol. submitReading dipertahankan verbatim (EIP-712 recover, replay guard, monotonic guard). verifyReading diganti menjadi attestAndSettle yang menerapkan ruleset gate, membayar via safeTransfer, dan memungut fee.",
      tag: "chainId 97",
    },
    {
      ic: "ph:cpu",
      tone: "volt",
      k: "Layer 3",
      t: "Autonomous Verifier Agent",
      d: "Verifier AI otonom berbasis cron dan tool-calling. Ia subscribe event ReadingSubmitted lewat RPC, recompute kwhDeltaVsBaseline plus anomaly ruleset, build Attestation, lalu memanggil attestAndSettle memakai VERIFIER_ROLE tanpa klik manusia.",
      tag: "VERIFIER_ROLE",
    },
  ],
} as const;

export const thesis = {
  eyebrow: "Kenapa tidak ada oracle gap",
  quote: "Yang di-settle bukan klaim tentang bacaan meter, melainkan bacaan meter yang ditandatangani itu sendiri.",
  body:
    "Di sistem oracle biasa, ada jarak antara bukti fisik dan pembayaran, dan jarak itu diisi pihak perantara yang bisa berbohong. Di WattSettle jarak itu hilang, karena objek yang dibayar dan objek yang dibuktikan adalah satu benda yang sama. Tiga sifat membuatnya kokoh: angka kWh ditandatangani di perangkat sejak titik nol, verifier AI menghitung ulang secara independen dan menulis alasannya, lalu seluruh keputusan dan pembayaran terjadi sebagai transaksi on-chain yang bisa dicek publik. Meter adalah transaksi.",
} as const;
