// Kenapa Menang: 3 lever blackbox + moat 5-lapis + selera juri + referensi + prediksi.

export const levers = {
  eyebrow: "Kenapa Menang",
  headline: "Tiga lever tersembunyi yang 100% kami kendalikan.",
  lead:
    'Bukan keberuntungan, ini "blackbox" yang mendorong peluang nominasi ke ujung atas rentang, di kompetisi yang mayoritas diisi pemula.',
  items: [
    {
      no: "01",
      title: "Track arbitrage",
      body: "Hindari track AI Agents yang penuh tiruan chatbot. Masuk ke Finance & Commerce, nyaris tak ada pemula yang mampu merilis payment-settlement contract yang benar-benar berjalan. Menang nyaris tanpa lawan.",
    },
    {
      no: "02",
      title: "Moat nyata di 15 detik pertama",
      body: "Satu-satunya PT dengan hardware + revenue nyata. Tampilkan klip lapangan PM20H20Q + invoice redacted → runtuhkan skeptisisme sebelum terbentuk.",
    },
    {
      no: "03",
      title: "AI autonomy legible on-chain",
      body: "Tulis alasan keputusan AI ke rantai, lalu integrasikan registry ERC-8004/BEP-620 BNB yang sudah aktif sejak 4 Feb 2026. Poin teknis tertinggi dibanding kompetitor yang mayoritas chatbot.",
    },
  ],
  warn: {
    label: "Koreksi fatal",
    body: 'Jangan pernah mengklaim "self-contained mirror of ERC-8004", juri BNB tahu registry-nya sudah aktif di rantai yang sama. Integrasikan yang asli sebagai babak kedua demo.',
  },
} as const;

export const moat = {
  eyebrow: "Moat",
  headline: "Kenapa orang lain tak bisa meniru.",
  lead:
    "Butuh lima hal langka sekaligus pada satu pemain, kombinasi yang nyaris tak ada duanya.",
  bigTitle: "Berada di celah yang tak ada yang mau mengisinya.",
  bigBody:
    '"Terlalu enterprise bagi kerumunan crypto, terlalu crypto bagi pemain energi lama." Kecuali mereka yang berpijak di dua dunia sekaligus.',
  layers: [
    { k: "1", body: "Hardware nyata, pemain crypto umumnya software-only, hanya simulasi." },
    { k: "2", body: "Domain energi / OT industrial (Modbus / MQTT)." },
    { k: "3", body: "Penyelesaian last-mile trust (memerlukan perangkat + fisika nyata)." },
    { k: "4", body: "Customer & distribusi (siapa yang memasang meter)." },
    { k: "5", body: "Timing regulasi, CBAM & OJK live Jan 2026." },
  ],
  cells: [
    { lab: "Selera juri", title: "zkPull", body: "Juara Mantle: real-world event → verifikasi → auto-release. Struktur persis WattSettle." },
    { lab: "Selera juri", title: "OwnaFarm", body: "Juara RWA invoice financing dari UKDW Jogja, satu ekosistem juri kita." },
    { lab: "BNB 2026", title: "Stablecoin · RWA · Agentic Finance", body: "WattSettle memenuhi ketiganya sekaligus, perwakilan BNB terdorong mengadvokasinya secara internal." },
    { lab: "Kurikulum", title: "Reference architecture panitia", body: 'Sesi 6 = "API + AI Auto-verify". Kami wujudkan jawaban kanonik kelas mereka dengan kualitas produksi.' },
  ],
} as const;

export const references = {
  eyebrow: "Referensi & Arah",
  headline: "Berdiri di pola yang sudah terbukti menang.",
  items: [
    {
      tag: "Juara Mantle 2025",
      accent: "flow" as const,
      title: "zkPull",
      body: "PR GitHub merged → verifikasi zkTLS → EigenLayer AVS enforce → auto-payout. Fee success-based 5%. Strukturnya identik dengan WattSettle.",
      link: '"WattSettle = zkPull untuk energi fisik"',
    },
    {
      tag: "Juara · RWA",
      accent: "heat" as const,
      title: "OwnaFarm",
      body: "Invoice tani → tokenisasi jadi 'benih' (game Hay Day). Founder dari UKDW Blockchain Club Yogyakarta, satu ekosistem Dev Web3 Jogja. Menang dengan 1 kasus konkret + visi besar.",
      link: "pola yang kami tiru, satu tingkat di atasnya",
    },
  ],
} as const;

export const prediction = {
  eyebrow: "Prediksi Arah · Kenapa future-proof",
  headline: "Arah pasar sudah kelihatan, dan kami sudah di titiknya.",
  lead:
    "Arah BNB 2026 telah jelas: Stablecoin, RWA, dan Agentic Finance, lengkap dengan primitif native seperti ERC-8004 & x402. Bersamaan, regulasi Indonesia (OJK & CBAM berlaku Jan 2026) menjadikan 'energi nyata, terverifikasi on-chain, oleh perusahaan berizin' sebagai contoh Web3 dewasa yang justru dicari regulator maupun BNB.",
  pills: [
    "RWA · kWh nyata",
    "Agentic Finance · AI verifier",
    "Settlement · auto-pay",
    "ERC-8004 / BEP-620",
  ],
  close:
    "Pasca-hackathon: tiap gateway SURIOTA/Enovatek di lapangan menjadi income node, volume RWA baru, dibangun di Indonesia, di BNB Chain.",
} as const;
