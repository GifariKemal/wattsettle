// Copy intro untuk halaman Demo. Data mesin ada di simulator.ts & machine.ts;
// di sini HANYA teks pembuka + konteks tiap section. Jangan menduplikasi data island.

export const demo = {
  intro: {
    eyebrow: "Demo · Coba Langsung",
    title: "Kirim pembacaan, lihat AI memutuskan, settlement jalan sendiri.",
    lead:
      "Halaman ini bukan tayangan slide. Kamu yang mengirim reading, AI verifier menilai kewajarannya di depan matamu, lalu smart contract membayar atau menolak, otomatis, tanpa satu klik manusia pun.",
  },

  simulator: {
    eyebrow: "Alur Otomatis · Sekali Jalan",
    title: "Satu tombol, satu putusan penuh.",
    lead:
      "Tekan kirim, ikuti datanya mengalir dari meter ke rantai, dinilai AI, lalu diselesaikan. Coba yang asli lalu coba yang palsu, dan lihat bedanya di putusan akhir.",
  },

  machine: {
    eyebrow: "Sandbox · Kamu Yang Menyusun",
    title: "Rakit inputnya sendiri, jalankan mesinnya.",
    lead:
      "Susun input di kiri, kirim ke rantai, lalu amati proses dan output di kanan. Beralih antara Opsi 5 dan Opsi 6 hanyalah mengganti skin, mesin di dalamnya sama persis.",
  },

  proof: {
    eyebrow: "Bukti · Publik & Permanen",
    title: "Tiap settlement tercatat di ledger publik.",
    lead:
      "Approve maupun reject sama sama meninggalkan jejak on-chain yang bisa siapa pun periksa. Tidak ada catatan tersembunyi, tidak ada yang bisa dihapus diam diam.",
    cta: "Buka BscScan Testnet",
    note:
      "Setiap keputusan verifier, pembayaran, dan penolakan ditulis ke BNB Smart Chain Testnet. Buka penjelajah blok untuk memverifikasi bahwa angka di layar ini memang tersimpan permanen di rantai, bukan sekadar animasi.",
  },
} as const;
