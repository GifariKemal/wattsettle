// SWOT Opsi 5 & 6 + peta kompetitor. Ringkas agar fit 1 layar; detail penuh di
// ../../SWOT-Opsi5-6.md.

export type Swot = { s: string[]; w: string[]; o: string[]; t: string[] };

export const swot = {
  eyebrow: "Analisis · SWOT & Kompetitor",
  headline: "Kekuatan, celah, dan siapa lawannya.",

  five: {
    s: [
      "Rel horizontal → TAM besar (8 pasar)",
      "Attestation AI legible on-chain (bukan boolean)",
      "Kontrak teruji (6 test) + token suriota verified",
      "Fee-split take-rate = revenue model on-chain",
    ],
    w: [
      "Abstrak, pembeli perlu dijelaskan",
      "Rel 2-fungsi terlihat 'tipis' vs pemain DeFi",
      "Bergantung AI verifier off-chain",
    ],
    o: [
      "Track arbitrage (Finance lebih sepi)",
      "Tailwind regulasi: CBAM & OJK live Jan 2026",
      "Ekosistem RWA BNB + white-label operator lain",
    ],
    t: [
      "Finance bisa padat oleh tiruan oracle/settlement",
      "Framing 'mirror ERC-8004' = fatal (harus integrate)",
      "Prior art energi (WeatherXM / Arkreen / Powerledger)",
    ],
  } as Swot,

  six: {
    s: [
      "Konkret, perusahaan + produk + revenue nyata",
      "Pembayar jelas (penyewa AC)",
      "Demo deterministik; after-sales sudah ada",
      "Revenue recurring (model rental)",
    ],
    w: [
      "Fokus 1 vertikal (HVAC) → TAM sempit",
      "Bergantung partnership Enovatek",
      "Spec PM20H20Q & angka rental disajikan sebagai lampiran demo redacted",
      "Billing nyata butuh stablecoin (bukan token volatil)",
    ],
    o: [
      "Land-and-expand: 1 meter → full-site → multi-site",
      "Upside carbon / REC / CBAM",
      "Pilot → case study + PO/invoice = collateral",
    ],
    t: [
      "Ketergantungan & konsentrasi 1 customer/partner",
      "Vendor metering / HVAC-IoT lain",
      "Konsistensi token demo vs stablecoin produksi",
    ],
  } as Swot,

  competitors: [
    { name: "WeatherXM", does: "DePIN cuaca (hardware + data)", gap: "Punya hardware, tapi bukan settlement + AI-reasoning billing energi" },
    { name: "Arkreen", does: "DePIN energi terbarukan, agregasi REC", gap: "Software/agregator; tanpa hardware industrial owned + pasar Indonesia" },
    { name: "Powerledger", does: "Trading energi P2P (mapan)", gap: "Bukan attestation AI-verified; bukan industrial Indonesia; bukan BNB" },
    { name: "GenLayer / UMA / Kleros", does: "Oracle verifikasi optimistic / AI (umum)", gap: "General-purpose; tak sentuh last-mile trust energi fisik + device" },
    { name: "AgentKarma", does: "Reputasi agent di ERC-8004", gap: "Reputasi agent, bukan settlement energi fisik" },
    { name: "zkPull / OwnaFarm", does: "Pattern-setter (juara Mantle / RWA)", gap: "Bukan kompetitor, referensi selera juri; kita 1 level di atas" },
  ],

  verdict:
    "Kompetitor langsung di celah ini praktis tidak ada. WattSettle memerlukan lima hal langka sekaligus, hardware nyata + domain energi/OT + last-mile trust + customer/distribusi + timing regulasi Indonesia, yang tak dimiliki satu pun pemain di atas.",
} as const;
