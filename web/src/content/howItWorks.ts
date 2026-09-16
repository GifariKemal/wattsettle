// Konten halaman Cara Kerja. Fakta dari WattSettle build bible (02, 03, 05), jangan mengada-ada.
// Suara: protocol docs. Leksikon dikunci di docs/Voice.md.

export const intro = {
  eyebrow: "Cara Kerja",
  title: "Satu kontrak yang men-settle, satu agent yang menilai",
  lead:
    "WattSettle punya dua bagian. Kontrak menyelesaikan pembayaran, agent menilai angkanya. Agent tidak mengirim persetujuan, ia mengirim angka, dan kontrak yang memutus.",
  model: [
    {
      ic: "ph:coins",
      tone: "watt",
      t: "Kontrak settlement",
      d: "Bagian yang membayar. Bacaan yang lolos gate memicu transfer token ke produsen plus fee protokol. Tanpa invoice, tanpa bank, tanpa klik manusia.",
    },
    {
      ic: "ph:scales",
      tone: "volt",
      t: "Agent verifier",
      d: "Bagian yang menilai. Agent membandingkan angka masuk dengan baseline perangkat, menghitung simpangannya, lalu menulis alasannya ke rantai sebelum kontrak membayar.",
    },
  ],
} as const;

export const reading = {
  eyebrow: "Yang ditandatangani perangkat",
  title: "struct Reading",
  lead:
    "Semuanya bermula dari Reading, paket data yang ditandatangani perangkat SRT-MGATE-1210 di titik sumber dengan EIP-712, domain ProofOfWatt/1. Angka di dalamnya tidak bisa diubah tanpa merusak tanda tangannya.",
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
  eyebrow: "Yang ditulis agent",
  title: "struct Attestation",
  lead:
    "Agent tidak menyimpulkan sah atau tidak sah. Ia menulis Attestation, rekaman angka dan alasan yang tersimpan di rantai. Keputusan berhenti menjadi boolean yang tak terbaca dan menjadi rationale yang bisa diaudit siapa pun.",
  fields: [
    { name: "kwhDeltaVsBaseline", type: "int256", d: "Selisih antara kWh yang diklaim dan baseline perangkat, rationale numerik." },
    { name: "anomalyScoreBps", type: "uint16", d: "Skor anomali dalam basis poin, rentang 0 sampai 10000." },
    { name: "modelVersionHash", type: "bytes32", d: "keccak256 dari versi model yang dipakai, bisa dihitung ulang, bukan sekadar diklaim." },
    { name: "rulesetHash", type: "bytes32", d: "keccak256 dari file ruleset yang dipublikasikan, cocok dengan file di repo." },
    { name: "evaluatedAt", type: "uint64", d: "Waktu evaluasi dilakukan oleh agent." },
  ],
  note:
    "modelVersionHash dan rulesetHash tertulis di rantai dan cocok dengan file di repo, jadi siapa pun bisa menghitungnya sendiri dan membuktikan keputusan itu dihitung, bukan di-hardcode. Gate-nya sederhana: approve bila anomalyScoreBps di bawah ambang dan kwhDeltaVsBaseline masih di dalam batas.",
} as const;

export const loop = {
  eyebrow: "Loop end-to-end",
  title: "Dari tanda tangan perangkat sampai pembayaran tercatat",
  lead:
    "Satu putaran penuh tanpa sentuhan manusia di jalur kritis. Approve maupun reject sama-sama memancarkan ReadingAttested dengan rationale yang bisa didecode di BscScan.",
  steps: [
    { ic: "ph:plug", tone: "flow", k: "01", t: "Perangkat", call: "submitReading", d: "Perangkat mengirim Reading yang sudah ditandatangani di titik sumber." },
    { ic: "ph:file-text", tone: "gold", k: "02", t: "Kontrak", call: "ReadingSubmitted", d: "Kontrak memeriksa tanda tangan, melewatkan replay dan monotonic guard, lalu memancarkan event." },
    { ic: "ph:cpu", tone: "volt", k: "03", t: "Agent", call: "attestAndSettle", d: "Agent berjalan terjadwal, menghitung ulang delta dan anomali, lalu merakit Attestation." },
    { ic: "ph:coins", tone: "watt", k: "04", t: "Settlement", call: "safeTransfer", d: "Gate lolos: kontrak membayar produsen dan memungut fee. Tidak lolos: nol token, anomali tetap tercatat." },
  ],
  branches: [
    { ic: "ph:check-circle", tone: "watt", t: "Approve", d: "Kontrak membayar produsen via safeTransfer dan memungut fee. ReadingAttested dipancarkan dengan rationale penuh." },
    { ic: "ph:x-circle", tone: "heat", t: "Reject", d: "Nol token dibayar. Anomalinya tetap tercatat di rantai dan tidak bisa dihapus." },
  ],
} as const;

export const architecture = {
  eyebrow: "Arsitektur",
  title: "Tiga layer, satu loop",
  lead:
    "Batas antar layer dijaga tegas, dan tidak ada dependency runtime eksternal yang berdiri di jalur kritis. Satu-satunya jaringan yang harus hidup adalah BSC testnet 97.",
  layers: [
    {
      ic: "ph:plug",
      tone: "flow",
      k: "Layer 1",
      t: "Physical dan Edge",
      d: "Dunia fisik. SRT-MGATE-1210, gateway ESP32 yang menjembatani Modbus ke MQTT, memegang private key ECDSA dan menandatangani bacaan kWh dengan EIP-712. Meter Enovatek PM20H20Q memberi angka mentahnya.",
      tag: "device signer",
    },
    {
      ic: "ph:file-text",
      tone: "gold",
      k: "Layer 2",
      t: "Settlement Contract",
      d: "WattSettle.sol di BSC testnet chainId 97, evolusi dari ProofOfWatt.sol. submitReading dipertahankan verbatim, lengkap dengan EIP-712 recover, replay guard, dan monotonic guard. verifyReading digantikan attestAndSettle yang menjalankan gate, membayar via safeTransfer, dan memungut fee.",
      tag: "chainId 97",
    },
    {
      ic: "ph:cpu",
      tone: "volt",
      k: "Layer 3",
      t: "Autonomous Verifier Agent",
      d: "Proses Python terjadwal. Ia memindai event ReadingSubmitted lewat RPC, menghitung ulang kwhDeltaVsBaseline dan skor anomali, merakit Attestation, lalu memanggil attestAndSettle dengan VERIFIER_ROLE tanpa klik manusia.",
      tag: "VERIFIER_ROLE",
    },
  ],
} as const;

export const thesis = {
  eyebrow: "Kenapa tidak ada oracle gap",
  quote: "Yang di-settle bukan klaim tentang bacaan meter, melainkan bacaan meter bertanda tangan itu sendiri.",
  body:
    "Di sistem oracle biasa ada jarak antara bukti fisik dan pembayaran, dan jarak itu diisi perantara yang bisa berbohong. Di sini jarak itu tidak ada, sebab objek yang dibayar dan objek yang dibuktikan adalah benda yang sama. Angka ditandatangani sejak titik nol, agent menghitungnya ulang secara independen, dan seluruh keputusan tercatat sebagai transaksi publik.",
} as const;
