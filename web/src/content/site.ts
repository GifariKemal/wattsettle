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
    // Deploy 5 September 2026. Sumber terverifikasi di Sourcify dengan status exact_match.
    contract: "0xdA149c0939c0C3450EDE5c8a0A0e8cF3AF36481a",
    // Wallet agent AI, satu-satunya pemegang VERIFIER_ROLE. Terdaftar di Identity
    // Registry ERC-8004 yang live di chain 97 sebagai agentId 2116.
    agent: "0xce4D51524eDECD04B5417F6C8B6E6B6b9e594291",
    agentId: 2116,
    // Dua transaksi settlement nyata: satu disetujui dan dibayar, satu ditolak.
    settleTx: "0xebc5365420395715815d912ee6b75c337039fc858358412debae319a64d0d553",
    rejectTx: "0xdca33d634ca3bb317fcf33a7983975cee87395246bfb2ca04c710b0fbc5d8d40",
    sourcify: "https://repo.sourcify.dev/97/0xdA149c0939c0C3450EDE5c8a0A0e8cF3AF36481a",
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
    { k: "On-chain", v: "BNB testnet", d: "kontrak live di chain 97, tiap settlement tercatat di BscScan" },
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
