// Single source of truth: identitas situs, hero, footer. Register produk (bukan strategi).
// Angka load-bearing diambil dari WattSettle build bible, jangan mengada-ada.

export const site = {
  name: "WattSettle",
  tagline: "Bukti dulu, baru dibayar.",
  title: "WattSettle · Rel settlement on-chain untuk energi terverifikasi",
  description:
    "Angka energi mudah dipalsukan. WattSettle membuatnya dapat dibuktikan: perangkat menandatangani angkanya, AI otonom menilai keabsahannya, lalu smart contract menyelesaikan pembayaran, di BNB Chain.",
  repo: "https://github.com/GifariKemal/wattsettle",
  chain: {
    name: "BNB Smart Chain Testnet",
    chainId: 97,
    token: "0x5f730750388176206cC3A7FE894c413675381B05",
    tokenSymbol: "suriota",
    scan: "https://testnet.bscscan.com",
  },
  builder: {
    name: "Gifari Kemal Suryo",
    role: "CEO & Founder",
    company: "PT Surya Inovasi Prioritas (SURIOTA)",
    email: "gifariksuryo@gmail.com",
  },
} as const;

export const hero = {
  kicker: "DePIN · RWA · Agentic Finance di BNB Chain",
  // dipecah agar bisa di-stagger reveal per baris (baris tengah = aksen gradien)
  headline: ["Angka energi mudah dipalsukan.", "Kami ubah jadi bukti,", "lalu dibayar otomatis oleh AI."],
  lead:
    "WattSettle adalah rel settlement untuk energi fisik. Perangkat di lapangan menandatangani angka kWh secara kriptografis, sebuah verifier AI otonom memeriksa kewajarannya, lalu kontrak membayar produsen tanpa perlu saling percaya. Setiap langkah tercatat on-chain di BNB Chain.",
  ctas: [
    { href: "/demo", label: "Coba demonya", kind: "primary" as const },
    { href: "/cara-kerja", label: "Lihat cara kerja", kind: "ghost" as const },
  ],
  proof: [
    { k: "On-chain", v: "BNB testnet", d: "kontrak verified, tiap settlement tercatat di BscScan" },
    { k: "AI otonom", v: "zero-click", d: "verifier menilai lalu membayar sendiri, tanpa tangan manusia" },
    { k: "Hardware nyata", v: "SRT-MGATE", d: "gateway SURIOTA yang sudah dijual dan ter-deploy" },
  ],
} as const;

export const footer = {
  eyebrow: "WattSettle × SURIOTA",
  headline: ["Perusahaan nyata,", "energi nyata, on-chain."],
  lead:
    "Perangkat menandatangani, AI menilai, kontrak membayar. Meter bukan lagi klaim yang harus dipercaya, melainkan transaksi yang bisa dibuktikan.",
  cta: { href: "/demo", label: "Coba demonya" },
  bismillah: "بسم الله",
} as const;
