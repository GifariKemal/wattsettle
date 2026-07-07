// Opsi hasil riset Codex: challenger di track Finance & Commerce/ecommerce.

export const codexOptions = {
  eyebrow: "Codex Deep Dive · Opsi 7/8",
  headline: 'Pivot cadangan: <span class="text-gradient-flow">AgentCart TrustPay</span>.',
  lead:
    "Riset Codex menemukan celah di luar energi: agentic ecommerce. Ini bukan pengganti build utama, tetapi opsi pivot jika track Finance terlalu ramai energy/RWA. Problemnya jelas: saat AI agent membeli atas nama user, yang hilang adalah bukti izin, escrow, delivery, refund, dan tanggung jawab.",
  verdict: {
    score: "92.5",
    label: "skor hype/pivot",
    title: "Opsi 7.5 · AgentCart TrustPay",
    body:
      "Escrow dan refund layer untuk AI shopping agent. Skornya tinggi karena novelty, tetapi tidak mengalahkan WattSettle sebagai build utama karena tidak punya hardware moat dan partner lapangan.",
  },
  flow: [
    {
      k: "01",
      title: "User beri mandat",
      body: "Buyer sign intent: kategori, budget, merchant allowlist, deadline, dan refund rule.",
    },
    {
      k: "02",
      title: "AI pilih merchant",
      body: "Agent membandingkan offer, menolak seller risk tinggi, lalu submit cart yang memenuhi policy.",
    },
    {
      k: "03",
      title: "Escrow lock dana",
      body: "Stablecoin/test token masuk vault. Seller hanya menerima dana setelah delivery proof valid.",
    },
    {
      k: "04",
      title: "Settle atau refund",
      body: "AI verifier cek bukti delivery. Approve -> seller dibayar. Reject -> refund/dispute.",
    },
  ],
  compare: [
    {
      name: "AgentCart SafePay",
      score: "89.5",
      body: "Versi murni AI shopping wallet. Hype tinggi, demo visual kuat, tetapi lebih mudah dikloning.",
      winner: false,
    },
    {
      name: "TrustCart Escrow",
      score: "86.5",
      body: "Versi escrow social commerce. Problem sangat nyata, tetapi novelty kurang jika tanpa agentic layer.",
      winner: false,
    },
    {
      name: "AgentCart TrustPay",
      score: "92.5",
      body: "Gabungan terbaik: AI buyer policy + escrow + proof-of-delivery + refund + reputation.",
      winner: true,
    },
  ],
  swot: [
    ["S", "Selaras dengan BNB 2026: ERC-8004, x402, ERC-8183, stablecoin, agent commerce."],
    ["W", "Tidak punya hardware moat seperti WattSettle; perlu demo yang sangat rapi agar tidak terlihat mock."],
    ["O", "Social commerce Indonesia, COD risk, refund abuse, dan agentic checkout sedang menuju titik ledak."],
    ["T", "Visa/Mastercard/Google/Stripe bergerak cepat; posisi kita harus local trust layer, bukan AP2 universal."],
  ],
  demo:
    "Demo panggung: user minta AI beli powerbank <250 ribu; agent pilih merchant valid; contract lock escrow; proof delivery masuk; AI approve; dana settle. Failure path: agent coba beli di atas budget, contract reject.",
  recommendation:
    "Keputusan: WattSettle x Enovatek tetap build utama. AgentCart TrustPay disimpan sebagai pivot jika juri/track ternyata lebih condong ke agentic commerce daripada RWA/energy settlement.",
} as const;
