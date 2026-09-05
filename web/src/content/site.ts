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
    contract: "0xCA0A97a70fF720447051bDa247F8EE87e7B8Bb12",
    // Wallet agent AI, satu-satunya pemegang VERIFIER_ROLE. Terdaftar di Identity
    // Registry ERC-8004 yang live di chain 97 sebagai agentId 2116.
    agent: "0xce4D51524eDECD04B5417F6C8B6E6B6b9e594291",
    agentId: 2116,
    // Dua transaksi settlement nyata: satu disetujui dan dibayar, satu ditolak.
    settleTx: "0xff78c3ec3c97d0ef43b80c025e664d165d60ba09616f58a69f28304e4ee9254c",
    rejectTx: "0xbf21a81936edbde6d380444bd3d5badd63bc44ebb7bfd1acf929e5f71af49934",
    // Verifier sengaja dibuat berbohong, kontrak tetap menolak membayar.
    lyingVerifierTx: "0x7e8ba5a7b1e09f33a8015c043383500276fda8ad59e61bac861f78ce98391781",
    sourcify: "https://repo.sourcify.dev/97/0xCA0A97a70fF720447051bDa247F8EE87e7B8Bb12",
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
    { k: "On-chain", v: "BNB testnet", d: "kontrak verified di BscScan, tiap settlement tercatat di sana" },
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
