// Data untuk Simulator island. Mesin animasi ada di komponen; ini source-of-truth
// untuk teks tiap node + dua skenario putusan AI (approve / reject).
// Field attestation mengikuti struct on-chain di WattSettle.sol (§3.3 master doc).

export type SimNode = { glyph: string; title: string; sub: string };

export const simNodes: SimNode[] = [
  { glyph: "⌁", title: "Meter / Gateway", sub: "PM20H20Q · SRT-MGATE" },
  { glyph: "⛓", title: "Smart Contract", sub: "submitReading()" },
  { glyph: "◈", title: "AI Verifier", sub: "otonom · cron" },
  { glyph: "◎", title: "Settlement", sub: "auto-pay / refund" },
];

export type SimScenario = {
  key: "approve" | "reject";
  /** teks status yang muncul berurutan di tiap node (0..3) */
  nodeValues: [string, string, string, string];
  /** progress ticker kecil di controls */
  ticks: [string, string, string, string];
  verdict: string;
  /** attestation on-chain (di-render sebagai JSON HUD) */
  attestation: Record<string, string | number | boolean>;
  settlement: string;
  note: string;
};

export const scenarios: Record<"approve" | "reject", SimScenario> = {
  approve: {
    key: "approve",
    nodeValues: [
      "512.4 kWh · EIP-712 ✓",
      "nonce 1187 · anti-replay ✓",
      "bounds · z-score · cross-source",
      "+512 suriota · fee 1%",
    ],
    ticks: ["mengirim…", "on-chain", "AI menilai…", "settled ✓"],
    verdict: "APPROVE, pembacaan wajar dalam rentang fisik.",
    attestation: {
      approved: true,
      kwhDeltaVsBaseline: "+3.2 kWh",
      expectedRange: "480 sampai 540 kWh",
      anomalyScoreBps: 200,
      crossCheck: "irradiance OK",
      modelVersionHash: "0x7a1b…c4",
      rulesetHash: "0x9f04…2e",
    },
    settlement: "+512 suriota → produsen · fee 1% → treasury",
    note: "Signature valid, data lolos plausibilitas → dibayar otomatis, tanpa klik manusia.",
  },
  reject: {
    key: "reject",
    nodeValues: [
      "5000 kWh @ 02:14 · signed",
      "nonce 1188 · anti-replay ✓",
      "malam · irradiance = 0 · TOLAK",
      "0 dibayar · penolakan tercatat",
    ],
    ticks: ["mengirim…", "on-chain", "AI menilai…", "rejected ✕"],
    verdict: "REJECT, di luar batas fisik & kontradiksi cross-source.",
    attestation: {
      approved: false,
      kwhDeltaVsBaseline: "+4460 kWh",
      expectedRange: "480 sampai 540 kWh",
      anomalyScoreBps: 9700,
      crossCheck: "generation at night · irradiance = 0",
      reason: "exceeds nameplate · impossible",
    },
    settlement: "0 suriota · penolakan tercatat permanen on-chain",
    note: "Signature valid, tapi data tak lolos plausibilitas → garbage-in ditolak.",
  },
};

export const simulator = {
  eyebrow: "Cara Kerja · Interaktif",
  headline: "Coba sendiri: kirim pembacaan, biarkan AI menilai.",
  lead:
    "Data mengalir: dari meter, ke rantai, dinilai AI, lalu diselesaikan pembayarannya. Yang sah diterima, yang palsu ditolak, otomatis, langsung di layar.",
  idle:
    "Menunggu pembacaan… AI verifier akan menuliskan alasan keputusannya di sini, lalu menandatangani transaksinya sendiri.",
} as const;
