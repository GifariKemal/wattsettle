// Single source of truth, identitas situs, nav, hero, footer.
// Semua angka & klaim diambil dari STRATEGI-MASTER-*.md (jangan mengada-ada).

export const site = {
  name: "WattSettle",
  tagline: "Bukti dulu, baru dibayar.",
  title: "WattSettle, Opsi 5 & 6 · Indonesia Web3 Hackathon 2026",
  description:
    "Data energi kerap hanya berupa klaim yang mudah dipalsukan. WattSettle membuatnya dapat dibuktikan: perangkat menandatangani angkanya, AI menilai keabsahannya, lalu smart contract menyelesaikan pembayaran, di BNB Chain.",
  event: {
    name: "Indonesia Web3 Hackathon 2026",
    organizers: "Binance Academy × BNB Chain × Coinvestasi × Dev Web3 Jogja",
    track: "Finance & Commerce",
    demoDay: "31 Oktober 2026",
    submission: "1 sampai 30 September 2026",
    finalist: "14 Oktober 2026",
    chain: "BNB Smart Chain Testnet · chainId 97",
  },
  builder: {
    name: "Gifari Kemal Suryo",
    role: "CEO & Founder",
    company: "PT Surya Inovasi Prioritas (SURIOTA)",
  },
} as const;

export const hero = {
  kicker: "Track Finance & Commerce · AI × Web3",
  // dipecah agar bisa di-stagger reveal per baris (baris tengah = aksen gradien)
  headline: ["Angka energi mudah dipalsukan.", "Kami ubah menjadi bukti,", "lalu dibayar otomatis oleh AI."],
  lead:
    "Angka dari meter energi mudah dipalsukan, dan selama ini kita hanya bisa mempercayainya. WattSettle membuat angka itu dapat dibuktikan: perangkat menandatanganinya sendiri, AI memeriksa kewajarannya, lalu pembayaran berjalan otomatis, tanpa perlu saling percaya.",
  ctas: [
    { href: "/simulator", label: "Lihat simulasinya", kind: "primary" as const },
    { href: "/menang", label: "Kenapa bisa juara", kind: "ghost" as const },
  ],
  stats: [
    { value: "90", suffix: "/100", label: "skor benchmark dari 8 opsi" },
    { value: "84", suffix: " sampai 90%", label: "peluang nominasi" },
    { value: "45", suffix: " sampai 58%", label: "peluang juara-1 in-track" },
  ],
} as const;

export const footer = {
  eyebrow: "Demo Day · 31 Oktober 2026",
  headline: ["Kami menaruh perusahaan nyata on-chain", "dalam satu akhir pekan."],
  lead:
    "Setiap tim lain mensimulasikan ini. Kami tidak. AI kami baru saja menolak satu reading palsu dan membayar satu reading sah, live, di BNB Chain.",
  bismillah: "بسم الله · Bismillah, WattSettle × Enovatek",
} as const;
