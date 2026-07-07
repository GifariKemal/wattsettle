// Masalah + aliran uang.

export const problem = {
  eyebrow: "Masalah",
  headline: "Pasar energi & karbon berjalan di atas kepercayaan buta.",
  lead:
    "Triliunan nilai — klaim energi hijau, tagihan listrik, kredit karbon — masih diverifikasi melalui spreadsheet dan janji. Lambat, mahal, dan mudah dimanipulasi.",
  items: [
    {
      n: "01",
      title: "Data self-reported",
      body: "Produsen melaporkan angkanya sendiri. Tidak ada yang bisa membuktikan meterannya jujur.",
    },
    {
      n: "02",
      title: "Verifikasi manual & lambat",
      body: "Auditnya manual: berminggu-minggu, mahal, dan mustahil dilakukan untuk ribuan meter.",
    },
    {
      n: "03",
      title: "Double-counting & greenwashing",
      body: "Sertifikat hijau rentan diklaim dua kali. Pembeli (CBAM/ESG) tidak memegang bukti yang benar-benar tak dapat dipalsukan.",
    },
  ],
  solution: {
    kicker: "Solusi",
    headline: 'Ubah "percaya saya" jadi "cek buktinya di rantai".',
    body: "Setiap pembacaan ditandatangani langsung oleh perangkatnya. AI menilai kewajarannya, lalu menuliskan alasannya ke rantai. Pembayaran diselesaikan sendiri oleh smart contract, bukan oleh manusia.",
    result:
      "Hasilnya: data energi yang telah ditandatangani dan diperiksa AI, siap dibayar dan dijual — tanpa perantara dan tanpa perdebatan.",
  },
} as const;

export const moneyFlow = {
  eyebrow: "Aliran Uang",
  headline: "Yang punya energi tidak membayar. Mereka dibayar.",
  lead:
    "Ini kesalahpahaman yang paling umum: yang membayar adalah pembeli buktinya, bukan produsen. Produsen justru yang menerima uang. WattSettle berada di tengah sebagai wasit sekaligus kasir, dan mengambil fee kecil.",
  buyer: {
    tag: "Membayar",
    title: "Pembeli bukti hijau",
    items: [
      "Pabrik ekspor kena CBAM (live Jan 2026)",
      "Korporat butuh REC / laporan ESG",
      "Penyewa AC (Opsi 6) bayar pemakaian",
    ],
  },
  engine: {
    title: "WATTSETTLE",
    role: "Wasit + Kasir",
    detail: "AI verifikasi → penyelesaian otomatis → ambil fee 1%",
  },
  seller: {
    tag: "Dibayar",
    title: "Produsen energi",
    items: [
      "Pemilik solar rooftop / IPP",
      "Pabrik dengan pembangkit efisien",
      "Enovatek (operator meter / HVAC)",
    ],
  },
} as const;
