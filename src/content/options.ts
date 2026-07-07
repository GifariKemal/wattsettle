// Opsi 5 (platform) & Opsi 6 (Enovatek/PM20H20Q), alur, perbandingan.

export type FlowStep = { num: string; title: string; body: string };

export const flowSteps: FlowStep[] = [
  {
    num: "01",
    title: "Tanda tangani pembacaan",
    body: "Device tanda-tangani kWh secara kriptografis (EIP-712) — bukti data berasal dari alat terdaftar.",
  },
  {
    num: "02",
    title: "Kirim ke rantai",
    body: "submitReading() — signature, timestamp monotonik, & anti-replay diverifikasi on-chain.",
  },
  {
    num: "03",
    title: "AI verifier menilai",
    body: "Agent otonom (pola Hermes) cek bounds fisik → z-score anomaly → cross-source, lalu tulis attestation.",
  },
  {
    num: "04",
    title: "Selesaikan otomatis",
    body: "Approve → transfer token ke produsen + fee 1% ke treasury. Reject → 0, alasan tercatat permanen.",
  },
];

export const options = {
  eyebrow: "Dua Opsi · Satu Mesin",
  headline: "Satu sistem, dua penerapan.",
  lead:
    "Mesin di dalamnya sama persis. Opsi 5 (WattSettle) menjualnya sebagai platform umum yang dapat dihubungkan ke meter apa pun. Opsi 6 (Enovatek) memasang sistem yang sama pada satu produk nyata: layanan sewa AC Enovatek dengan meter PM20H20Q.",

  five: {
    tab: "Opsi 5 · WattSettle",
    kicker: "Platform · Horizontal",
    title: "WattSettle · platform pembayaran energi",
    lead:
      "Sistem pembayaran untuk energi yang telah terbukti benar. Dapat dihubungkan ke meter apa pun — solar, EV, industri, PLN. Yang dijual adalah buktinya, bukan sekadar listriknya.",
    tags: ["Finance & Commerce", "RWA", "Autonomous AI", "BNB-native"],
    attestationNote:
      'Yang membedakan dari "tombol approve": AI menulis alasannya ke rantai.',
    // dirender sebagai HUD mono
    attestation: [
      "Attestation {",
      "  approved:      true",
      "  kwhDelta:      +3.2 kWh",
      "  expectedRange: 480–540 kWh",
      "  anomalyBps:    200",
      "  crossCheck:    “irradiance OK”",
      "  modelHash:     0x7a1b…",
      "  rulesetHash:   0x9f04…",
      "}",
    ],
  },

  six: {
    tab: "Opsi 6 · Enovatek",
    kicker: "Produk Nyata · Vertikal",
    title: "Enovatek × PM20H20Q · Cooling-as-a-Service",
    lead:
      "PT Enovatek menyewakan AC hybrid yang dipantau meter PM20H20Q. Penyewa bayar sesuai pemakaian — otomatis, on-chain.",
    tags: ["Produk shipping", "Revenue nyata", "Demo deterministik", "B2B customer"],
    whyDemoTitle: "Kenapa ini mesin demo",
    whyDemo: [
      'Pembayar jelas: penyewa AC (bukan "bayangkan sebuah PLTS").',
      "Produk + perusahaan + revenue nyata → skeptisisme juri runtuh.",
      "After-sales sudah ada (model rental Enovatek).",
    ],
    valueStreams: {
      a: {
        title: "A · Billing pemakaian",
        body: "Penyewa menggunakan AC → PM20H20Q mengukur → pembayaran otomatis ke Enovatek per-kWh.",
        emphasis: "Revenue utama.",
      },
      mid: "protokol ambil fee (take-rate)",
      b: {
        title: "B · Nilai hijau / karbon",
        body: "AC efisien/hybrid → data terverifikasi jadi carbon/REC/ESG credit atau bukti CBAM.",
        emphasis: "Upside.",
      },
    },
    prodNote:
      "Catatan produksi: billing sungguhan menggunakan stablecoin (bukan token volatil). Demo menggunakan token suriota yang sudah aktif & terverifikasi di BscScan.",
  },
} as const;

export type CompareRow = { aspect: string; five: string; six: string; sixWin?: boolean };

export const comparison = {
  eyebrow: "Opsi 5 vs Opsi 6",
  headline: "Bukan memilih salah satu — keduanya dipakai berlapis.",
  rows: [
    { aspect: "Peran", five: "Rel / platform (horizontal)", six: "Rel yang sama di 1 produk (vertikal)" },
    { aspect: "Konkret", five: "Agak abstrak", six: "Sangat konkret — produk nyata", sixWin: true },
    { aspect: "Pembeli", five: "Perlu dijelaskan", six: "Sudah ada (penyewa AC)", sixWin: true },
    { aspect: "Pasar / TAM", five: "Lebih besar (8 skenario)", six: "Fokus, tapi nyata & recurring" },
    { aspect: "Peran di pitch", five: "Visi platform (slide)", six: "Mesin demo (panggung)" },
  ] as CompareRow[],
  strategy:
    "Di panggung, tunjukkan satu keran yang berjalan sempurna (Enovatek/PM20H20Q); di slide, ceritakan pipa ke semua pasar (WattSettle). Persis pola pemenang OwnaFarm — tetapi kami satu tingkat di atas: hardware + revenue nyata.",
} as const;
