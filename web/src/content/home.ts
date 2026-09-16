// Konten Beranda. Angka dari WattSettle build bible, jangan mengada-ada.
// Suara: protocol docs. Kalimat pendek, klaim konkret, leksikon dikunci di docs/Voice.md.

export const about = {
  eyebrow: "Apa itu WattSettle",
  title: "Settlement rail untuk energi terverifikasi",
  lead:
    "WattSettle membayar produsen energi hanya atas kWh yang terbukti sah. Perangkat menandatangani bacaan di titik sumber, agent menghitung ulang penyimpangannya, kontrak yang memutus dan membayar.",
  cards: [
    {
      ic: "ph:warning",
      tone: "heat",
      t: "Masalahnya",
      d: "Kontrak tidak bisa melihat dunia fisik. Ia membayar angka yang dilaporkan, dan angka kWh mudah dipalsukan sebelum sampai ke rantai. Pembayaran otomatis lalu mengeksekusi angka palsu itu dengan patuh.",
    },
    {
      ic: "ph:shield-check",
      tone: "watt",
      t: "Pendekatan WattSettle",
      d: "Dua gate, keduanya harus lolos. Tanda tangan EIP-712 mengunci angka di titik sumber. Kontrak menyimpan baseline sendiri dan menghitung penyimpangannya, sehingga agent hanya bisa memveto.",
    },
  ],
} as const;

export const loop = {
  eyebrow: "Satu loop",
  title: "Ditandatangani, dihitung ulang, di-settle",
  lead:
    "Empat langkah, seluruhnya on-chain. Yang di-settle adalah bacaan bertanda tangan itu sendiri, bukan klaim tentangnya.",
  steps: [
    { ic: "ph:plug", tone: "flow", k: "01", t: "Perangkat", d: "Menandatangani Reading kWh dengan EIP-712 di titik sumber." },
    { ic: "ph:file-text", tone: "gold", k: "02", t: "Kontrak", d: "submitReading memeriksa tanda tangan, menolak replay, lalu memancarkan event." },
    { ic: "ph:cpu", tone: "volt", k: "03", t: "Agent", d: "Menghitung ulang delta terhadap baseline dan skor anomali, lalu menulis Attestation." },
    { ic: "ph:coins", tone: "watt", k: "04", t: "Settlement", d: "Kontrak membayar produsen dan memungut fee 1 persen, atau menolak dan mencatatnya." },
  ],
} as const;

export const thesis = {
  eyebrow: "Kenapa berbeda",
  quote: "Bacaan meter berhenti menjadi klaim yang harus dipercaya. Ia menjadi transaksi yang bisa dibuktikan.",
  body:
    "Harga kripto punya banyak sumber yang saling mengoreksi. Kerja fisik tidak punya satu pun. WattSettle menutup celah itu dengan dua gate: tanda tangan di perangkat, lalu perhitungan ulang yang ditulis ke rantai sebelum pembayaran jalan.",
} as const;

export const teasers = [
  { href: "/cara-kerja", label: "Cara Kerja", d: "Loop end to end dan arsitektur tiga layer.", ic: "ph:flow-arrow" },
  { href: "/demo", label: "Demo", d: "Kirim reading, lihat kontrak approve atau reject.", ic: "ph:play-circle" },
  { href: "/enovatek", label: "Enovatek", d: "Cooling as a Service dengan meter PM20H20Q.", ic: "ph:wind" },
] as const;
