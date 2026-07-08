// Konten Roadmap. Sumber tunggal: WattSettle "18 Roadmap Pasca-Hackathon".
// Register produk, jujur soal scope. Jangan mengada-ada angka atau probabilitas.

export const intro = {
  eyebrow: "Roadmap pasca-hackathon",
  title: "Hackathon hanya langkah pertama dari rel yang jauh lebih panjang",
  lead:
    "Produk sudah hidup di BNB Chain testnet, kontrak attestation, verifier AI otonom, dan demo end to end sudah jalan. Fondasi itu yang menahan seluruh arah di halaman ini. Semua yang di bawah adalah rencana, bukan klaim yang sudah selesai.",
} as const;

// Posisi sekarang: apa yang sudah ada sebagai fondasi.
export const now = {
  eyebrow: "Posisi sekarang",
  title: "Yang sudah ada sebagai fondasi",
  lead:
    "Base sudah lulus 6 test dan berjalan on-chain. Inilah permukaan sekecil mungkin yang dibekukan untuk hackathon, dan menjadi pijakan setiap arah produk berikutnya.",
  items: [
    { ic: "ph:plug", tone: "flow", t: "Satu signer device", d: "Perangkat menandatangani Reading kWh secara kriptografis di titik sumber." },
    { ic: "ph:cpu", tone: "volt", t: "Satu verifier AI otonom", d: "Agent Hermes menilai keabsahan reading lalu menuliskan alasannya on-chain." },
    { ic: "ph:file-text", tone: "gold", t: "Satu attestation contract", d: "WattSettle.sol memverifikasi tanda tangan, menahan replay, dan mencatat hasilnya." },
    { ic: "ph:coins", tone: "watt", t: "Settlement loop dan fee on-chain", d: "Loop deterministik membayar produsen, memungut take-rate, dan menambah reputation counter." },
  ],
} as const;

// Timeline fase indikatif (loop-flow / timeline).
export const timeline = {
  eyebrow: "Timeline indikatif",
  title: "Ke mana rel ini tumbuh setelah Demo Day",
  lead:
    "Lima fase berurut. Setiap fase menaikkan ceiling tanpa mengubah moat inti, yaitu hardware nyata, domain OT, last mile trust, customer, dan timing regulasi.",
  phases: [
    { k: "Q4 2026", tone: "flow", t: "Harden core", d: "Merapikan scope hackathon dan menutup finalist window.", sifat: "Melanjutkan scope hackathon" },
    { k: "Q1 2027", tone: "gold", t: "Pilot berbayar", d: "Beachhead komersial dengan case study dan fee yang live.", sifat: "Komersialisasi beachhead" },
    { k: "Q2 2027", tone: "volt", t: "VeriFaktur dan device NFT", d: "Dogfood VeriFaktur plus proof of concept Device-NFT.", sifat: "Ekspansi produk RWA" },
    { k: "Q3 2027", tone: "watt", t: "WattBond dan white-label", d: "Pilot WattBond dan white-label pertama ke operator lain.", sifat: "Menaikkan ceiling" },
    { k: "Q4 2027", tone: "flow", t: "Land and expand", d: "Multi-site dan membuka jalur menuju mainnet.", sifat: "Skala dan produksi" },
  ],
} as const;

// Arah produk (kartu). Semua di luar critical path hackathon.
export const directions = {
  eyebrow: "Arah produk",
  title: "Empat arah di atas moat yang sama",
  lead:
    "Semuanya duduk di atas kombinasi lima hal langka yang sama dan memetakan langsung ke tesis RWA yang sudah diinvestasikan para juri. Semua ini roadmap, bukan scope demo.",
  cards: [
    {
      ic: "ph:bank",
      tone: "gold",
      t: "WattBond",
      tag: "Machine-yield note",
      d:
        "Yield note yang coupon-nya di-gate oleh kWh nyata yang di-settle. Underlying-nya adalah arus kas mesin yang terverifikasi on-chain, bukan janji. Ceiling tertinggi, sengaja ditaruh off critical path karena beban accounting-nya paling berat.",
    },
    {
      ic: "ph:coins",
      tone: "watt",
      t: "Device-NFT",
      tag: "Revenue-share financing",
      d:
        "Terinspirasi model Dominate-to-Earn PiggyCell. Tiap gateway punya NFT digital-twin yang membagi settlement flow-nya ke pemodal berbasis revenue nyata, bukan inflasi token. Jalur pembiayaan aset produktif nyata ala pola OwnaFarm.",
    },
    {
      ic: "ph:receipt",
      tone: "flow",
      t: "VeriFaktur",
      tag: "Machine-verified receivable",
      d:
        "Invoice financing yang tidak bisa bohong. Device menandatangani bukti commissioning sebagai syarat eligibility, underwriter AI memutus advance-rate secara legible on-chain, dan canonical field-hash mematikan double-financing. Kandidat komersial paling nyata karena bisa dogfood invoice B2B SURIOTA asli.",
    },
    {
      ic: "ph:globe-hemisphere-west",
      tone: "volt",
      t: "White-label",
      tag: "Lisensi rail B2B2X",
      d:
        "Lisensikan kontrak plus verifier ke operator energy-DePIN SEA lain sebagai software. Rail yang sama, skin dan customer yang berbeda, tanpa perlu menaruh hardware sendiri di tiap site. Memperlebar TAM tanpa memperlebar beban operasional.",
    },
  ],
} as const;

// Framing scope jujur: sudah ada vs direncanakan.
export const scope = {
  eyebrow: "Scope yang jujur",
  title: "Apa yang sudah ada, apa yang direncanakan",
  lead:
    "Roadmap yang baik dimulai dari garis yang jelas antara yang dikerjakan sekarang dan yang ditunda. Menyeret satu pun item rencana ke critical path hackathon adalah pelanggaran disiplin.",
  done: {
    t: "Sudah ada sekarang",
    items: [
      "Satu signer device menandatangani Reading kWh",
      "Satu verifier AI otonom menulis attestation on-chain",
      "Satu attestation contract dengan proteksi replay",
      "Satu settlement loop deterministik plus fee on-chain",
      "Satu reputation counter on-chain",
      "Integrasi ERC-8004 live sebagai act kedua",
    ],
  },
  planned: {
    t: "Masih direncanakan",
    items: [
      "WattBond dan share-accounting coupon pro-rata",
      "Device-NFT dan pembiayaan revenue-share",
      "VeriFaktur dan waterfall settlement receivable",
      "White-label ke operator energy-DePIN lain",
      "Multi-chain dan multi-layer arsitektur",
      "Jalur menuju deploy mainnet",
    ],
  },
} as const;
