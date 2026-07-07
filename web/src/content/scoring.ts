// Benchmark opsi utama + kandidat Codex. Satu source of truth untuk tabel scoring.

export type ScoreRow = {
  id: string;
  name: string;
  track: string;
  score: number; // /100
  nomination: string;
  win: string;
  badge?: string;
  variant?: "chosen" | "pivot";
  winner?: boolean;
  archived?: boolean;
  note: string;
};

export const scoring = {
  eyebrow: "Benchmark",
  headline: "Keputusan build, bukan sekadar skor hype.",
  lead:
    "AgentCart TrustPay menang di hype/novelty sebagai pivot Finance & Commerce. Build utama tetap WattSettle x Enovatek karena demo lebih defensible: hardware nyata, partner nyata, revenue path, dan bukti on-chain yang sulit dikloning.",
  rows: [
    {
      id: "5",
      name: "WattSettle x Enovatek",
      track: "Finance",
      score: 90,
      nomination: "84 sampai 90%",
      win: "45 sampai 58%",
      badge: "Chosen build",
      variant: "chosen",
      winner: true,
      note: "Keputusan utama: moat + Finance fit + demo deterministik + hardware/partner/revenue nyata.",
    },
    {
      id: "7.5",
      name: "AgentCart TrustPay",
      track: "Finance",
      score: 92.5,
      nomination: "82 sampai 91%",
      win: "44 sampai 61%",
      badge: "Highest hype score",
      variant: "pivot",
      note: "Pivot candidate: agentic checkout + escrow/refund + proof-of-delivery + reputation.",
    },
    {
      id: "7",
      name: "AgentCart SafePay",
      track: "Finance",
      score: 89.5,
      nomination: "78 sampai 88%",
      win: "38 sampai 54%",
      note: "Hype tertinggi sebagai AI shopping wallet, tetapi lebih mudah dikloning tanpa escrow/delivery layer.",
    },
    {
      id: "8",
      name: "TrustCart Escrow",
      track: "Finance",
      score: 86.5,
      nomination: "72 sampai 84%",
      win: "32 sampai 48%",
      note: "Problem ecommerce sangat nyata; novelty naik jika digabung agentic commerce.",
    },
    {
      id: "1",
      name: "ProofOfWatt",
      track: "AI Agents",
      score: 74.5,
      nomination: "80 sampai 86%",
      win: "38 sampai 48%",
      note: "Base contract kuat (6 test PASS), tapi boolean verify = autonomy invisible; track padat.",
    },
    {
      id: "4",
      name: "Karmakhet",
      track: "AI Agents",
      score: 58,
      nomination: "40 sampai 50%",
      win: "15 sampai 24%",
      archived: true,
      note: "Dependency ERC-8004/platform eksternal berisiko; klaim 'registry kosong' salah.",
    },
    {
      id: "3",
      name: "ProofOfAlpha",
      track: "Finance",
      score: 54,
      nomination: "35 sampai 45%",
      win: "12 sampai 20%",
      archived: true,
      note: "Clonable + ERC-8004 singleton tak bisa self-deploy + near-clone Veil ada.",
    },
    {
      id: "2",
      name: "JanjiChain",
      track: "Consumer",
      score: 48,
      nomination: "25 sampai 35%",
      win: "8 sampai 15%",
      archived: true,
      note: "Mekanisme tak novel (GenLayer/UMA/Kleros) + demo rapuh + AI-theater.",
    },
  ] as ScoreRow[],
} as const;

export type ProbStat = {
  value: string;
  prefix?: string;
  suffix: string;
  label: string;
  accent: "watt" | "flow" | "gold" | "ink";
};

export const probability = {
  eyebrow: "Kejujuran Angka",
  headline: "Peluang nyata, tanpa dilebih-lebihkan.",
  lead:
    "Setelah semua fix: nominasi 84 sampai 90%, juara-1 in-track 45 sampai 58%, bukan >90%. Angka ini sudah di-red-team; sisanya faktor di luar kendali. Yang kami lakukan: dorong sekeras mungkin.",
  stats: [
    { value: "90", suffix: "", label: "skor benchmark /100", accent: "watt" },
    { value: "84", suffix: " sampai 90%", label: "peluang nominasi", accent: "flow" },
    { value: "45", suffix: " sampai 58%", label: "juara 1 in-track", accent: "gold" },
    { value: "5", prefix: "USD ", suffix: "K", label: "prize pool total · 3 track", accent: "ink" },
  ] as ProbStat[],
};

export const pathTo90 = {
  eyebrow: "Path-to-90",
  headline: "Yang harus benar untuk sampai ke sana.",
  items: [
    "Integrasikan registry ERC-8004 BNB yang live (jangan tiruan/mirror).",
    "Demo pakai 1 signature hardware asli (PM20H20Q/SRT-MGATE lapangan) sebagai seed.",
    "Tunjukkan reject + approve (AI tolak anomali live), bukan approve saja.",
    "Tutup semua hard-gate: commit harian public, verify contract, ≥2 tx on-chain, README + roadmap + video + tweet (tag @BNBChain @BinanceAcademy @coinvestasi @devweb3jogja).",
    "Validasi track pakai data registrasi nyata akhir September.",
    "Taruh fee-split on-chain, substansi Finance yang terlihat.",
    "Demo deterministik: pre-seed state, pre-fund pool, fallback RPC + video cadangan, rehearse ≥20×.",
  ],
} as const;
