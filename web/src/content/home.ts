// Konten Beranda. Angka dari WattSettle build bible, jangan mengada-ada.

export const loop = {
  eyebrow: "Satu loop",
  title: "Reading ditandatangani, AI menilai, kontrak membayar",
  lead:
    "Empat langkah, semuanya on-chain. Tidak ada celah antara bukti fisik dan pembayaran karena yang di-settle adalah bacaan meter itu sendiri.",
  steps: [
    { ic: "ph:plug", tone: "flow", k: "01", t: "Device", d: "Perangkat menandatangani Reading kWh secara kriptografis (EIP-712) di titik sumber." },
    { ic: "ph:file-text", tone: "gold", k: "02", t: "Kontrak", d: "submitReading memverifikasi tanda tangan dan menahan replay, lalu memancarkan event." },
    { ic: "ph:cpu", tone: "volt", k: "03", t: "AI Verifier", d: "Agent otonom menghitung ulang delta dan anomali, menulis attestation on-chain." },
    { ic: "ph:coins", tone: "watt", k: "04", t: "Settlement", d: "Kontrak membayar produsen dan memungut fee 1%, atau menolak dan mencatatnya." },
  ],
} as const;

export const thesis = {
  eyebrow: "Kenapa berbeda",
  quote: "Meter bukan lagi klaim yang harus dipercaya. Meter adalah transaksi yang bisa dibuktikan.",
  body:
    "Untuk data harga kripto, banyak sumber bisa saling cek. Untuk kerja fisik, tidak ada. WattSettle menutup lubang itu dengan dua lapis pertahanan: tanda tangan kriptografis di perangkat, lalu verifier AI yang menuliskan alasannya on-chain sebelum pembayaran jalan.",
} as const;

export const teasers = [
  { href: "/cara-kerja", label: "Cara Kerja", d: "Konsep, loop end-to-end, dan arsitektur 3-layer.", ic: "ph:flow-arrow" },
  { href: "/demo", label: "Demo", d: "Coba sendiri: kirim reading, lihat AI approve atau reject.", ic: "ph:play-circle" },
  { href: "/enovatek", label: "Enovatek", d: "Cooling as a Service nyata dengan meter PM20H20Q.", ic: "ph:wind" },
] as const;
