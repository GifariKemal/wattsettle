// Copy intro untuk halaman Demo. Data mesin ada di simulator.ts & machine.ts;
// di sini HANYA teks pembuka + konteks tiap section. Jangan menduplikasi data island.
// Suara: protocol docs, imperatif, tanpa sapaan "kamu".

export const demo = {
  intro: {
    eyebrow: "Demo",
    title: "Kirim reading, lihat kontrak memutus.",
    lead:
      "Halaman ini bukan tayangan slide. Reading dikirim dari layar ini, agent menilai angkanya, lalu kontrak membayar atau menolak tanpa satu klik manusia.",
  },

  simulator: {
    eyebrow: "Alur otomatis",
    title: "Satu tombol, satu putusan penuh.",
    lead:
      "Tekan kirim, lalu ikuti datanya dari meter ke rantai. Coba bacaan yang wajar, lalu coba yang mustahil, dan bandingkan putusan akhirnya.",
  },

  machine: {
    eyebrow: "Sandbox",
    title: "Susun sendiri inputnya, jalankan mesinnya.",
    lead:
      "Atur input di kiri, kirim ke rantai, amati proses dan output di kanan. Dua mode hanya mengganti sumber dan penerima, mesinnya sama persis.",
  },

  proof: {
    eyebrow: "Bukti publik",
    title: "Tiap settlement tercatat di ledger publik.",
    lead:
      "Approve maupun reject meninggalkan jejak on-chain yang bisa diperiksa siapa pun. Tidak ada catatan tersembunyi, tidak ada yang bisa dihapus.",
    cta: "Buka BscScan Testnet",
    note:
      "Setiap keputusan agent, pembayaran, dan penolakan ditulis ke BNB Smart Chain Testnet. Buka penjelajah blok untuk memastikan angka di layar ini memang tersimpan di rantai, bukan animasi.",
  },
} as const;
