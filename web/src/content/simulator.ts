// Data untuk Simulator island. Mesin animasi ada di komponen; ini source-of-truth
// untuk teks tiap node + dua skenario putusan AI (approve / reject).
// Field attestation mengikuti struct on-chain di WattSettle.sol (§3.3 master doc).

export type SimNode = { title: string; sub: string };

export const simNodes: SimNode[] = [
  { title: "Meter / Gateway", sub: "PM20H20Q · SRT-MGATE" },
  { title: "Smart Contract", sub: "submitReading()" },
  { title: "Agent verifier", sub: "otonom · terjadwal" },
  { title: "Settlement", sub: "auto-pay / refund" },
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
    ticks: ["mengirim…", "on-chain", "agent menilai…", "settled ✓"],
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
    note: "Tanda tangan sah dan angkanya wajar. Kontrak membayar tanpa klik manusia.",
  },
  reject: {
    key: "reject",
    nodeValues: [
      "5000 kWh @ 02:14 · signed",
      "nonce 1188 · anti-replay ✓",
      "malam · irradiance = 0 · TOLAK",
      "0 dibayar · penolakan tercatat",
    ],
    ticks: ["mengirim…", "on-chain", "agent menilai…", "rejected ✕"],
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
    note: "Tanda tangan sah, tetapi angkanya mustahil secara fisik. Kontrak menolak membayar.",
  },
};

export const simulator = {
  eyebrow: "Interaktif",
  headline: "Kirim pembacaan, lihat kontrak memutus.",
  lead:
    "Data mengalir dari meter ke rantai, dinilai agent, lalu diselesaikan. Yang wajar dibayar, yang mustahil ditolak, seluruhnya otomatis.",
  idle:
    "Menunggu pembacaan. Agent akan menuliskan angka dan alasannya di sini, lalu mengirim transaksinya sendiri.",
} as const;
