// Single source of truth: identitas situs, hero, footer. Register produk (bukan strategi).
// Angka load-bearing diambil dari WattSettle build bible, jangan mengada-ada.

export const site = {
  name: "WattSettle",
  tagline: "Bukti dulu, baru dibayar.",
  title: "WattSettle · Settlement rail on-chain untuk energi terverifikasi",
  description:
    "WattSettle membayar produsen energi hanya atas kWh yang terbukti sah. Perangkat menandatangani bacaan dengan EIP-712, agent menghitung ulang penyimpangannya, kontrak di BNB Chain yang memutus dan membayar.",
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
  headline: ["Perangkat menandatangani kWh.", "Agent menghitung ulang.", "Kontrak yang memutus dan membayar."],
  lead:
    "WattSettle adalah settlement rail untuk energi fisik. Bacaan kWh ditandatangani di titik sumber, dihitung ulang oleh agent otonom, lalu dibayar oleh kontrak yang menyimpan aturannya sendiri di rantai. Live di BNB testnet.",
  ctas: [
    { href: "/demo", label: "Coba demonya", kind: "primary" as const },
    { href: "/cara-kerja", label: "Lihat cara kerja", kind: "ghost" as const },
  ],
  proof: [
    { k: "Live", v: "chain 97", d: "kontrak verified di BscScan, 12 transaksi settlement publik" },
    { k: "Otonom", v: "zero-click", d: "hanya agent yang memegang VERIFIER_ROLE, deployer sudah melepasnya" },
    { k: "Perangkat nyata", v: "SRT-MGATE", d: "gateway SURIOTA yang sudah dijual dan terpasang" },
  ],
} as const;

export const footer = {
  eyebrow: "WattSettle × SURIOTA",
  headline: ["Energi nyata,", "settlement on-chain."],
  lead:
    "Perangkat menandatangani, agent menghitung ulang, kontrak membayar. Bacaan meter berhenti menjadi klaim dan menjadi transaksi.",
  cta: { href: "/demo", label: "Coba demonya" },
  bismillah: "بسم الله",
} as const;
