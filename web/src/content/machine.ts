// Data untuk "Mesin Settlement" interaktif (input → proses → output) · Opsi 5 & 6.
// Mesinnya identik; mode hanya mengganti skin/sumber/penerima. Logika putusan
// (judge) ada di island, ini source-of-truth teks + parameter skenario.

export type Mode = "5" | "6";

export type Source = {
  id: string;
  label: string;
  sub: string;
  unit: string;
  min: number;
  max: number;
  step: number;
  expLo: number; // batas bawah rentang wajar
  expHi: number; // batas atas rentang wajar
  nameplate: number; // batas fisik mutlak
  start: number; // nilai awal slider (di dalam rentang)
  tamperLabel: string; // skenario kecurangan spesifik sumber
  tamperReason: string;
};

export type Station = { key: string; title: string; sub: string; icon: "meter" | "contract" | "ai" | "settle" };

export const machine = {
  eyebrow: "Playground · Interaktif",
  title: "Mesin settlement: main sendiri.",
  lead:
    "Susun input, kirim ke rantai, lalu lihat AI menilai dan menyelesaikan pembayarannya sendiri. Beralih antara Opsi 5 (platform) dan Opsi 6 (Enovatek), mesin di dalamnya sama persis.",
  hintHonest: "Tempatkan nilai di zona hijau (rentang wajar) → AI menyetujui dan membayar otomatis.",
  hintTamper: "Aktifkan mode curang → kirim data mustahil → AI menangkap dan menolaknya.",
  stations: [
    { key: "meter", title: "Meter / Gateway", sub: "tanda-tangan EIP-712", icon: "meter" },
    { key: "contract", title: "Smart Contract", sub: "nonce · anti-replay", icon: "contract" },
    { key: "ai", title: "AI Verifier", sub: "bounds · z-score · cross-source", icon: "ai" },
    { key: "settle", title: "Settlement", sub: "auto-pay / refund", icon: "settle" },
  ] as Station[],

  modes: {
    "5": {
      tab: "Opsi 5 · WattSettle",
      accent: "watt" as const, // hijau
      payee: "Produsen",
      token: "suriota",
      device: "meter apa pun",
      sources: [
        { id: "solar", label: "Solar rooftop", sub: "siang · irradiance normal", unit: "kWh", min: 0, max: 800, step: 4, expLo: 480, expHi: 540, nameplate: 600, start: 512, tamperLabel: "malam", tamperReason: "generation di malam hari · irradiance = 0" },
        { id: "ev", label: "EV charger", sub: "per sesi charge", unit: "kWh", min: 0, max: 140, step: 1, expLo: 40, expHi: 80, nameplate: 100, start: 62, tamperLabel: "meter dicabut", tamperReason: "arus mengalir tanpa sesi aktif" },
        { id: "industri", label: "Pabrik / IPP", sub: "shift produksi", unit: "kWh", min: 0, max: 6000, step: 20, expLo: 2800, expHi: 3400, nameplate: 4200, start: 3120, tamperLabel: "pabrik libur", tamperReason: "output saat jadwal shutdown terdaftar" },
      ] as Source[],
    },
    "6": {
      tab: "Opsi 6 · Enovatek",
      accent: "flow" as const, // cyan
      payee: "Enovatek",
      token: "suriota",
      device: "PM20H20Q",
      sources: [
        { id: "ac", label: "AC Hybrid · PM20H20Q", sub: "sewa harian · per tenant", unit: "kWh", min: 0, max: 70, step: 0.5, expLo: 12, expHi: 28, nameplate: 38, start: 19, tamperLabel: "unit mati", tamperReason: "konsumsi tercatat saat unit off · kontradiksi" },
      ] as Source[],
    },
  },

  labels: {
    input: "Input · susun pembacaan",
    process: "Proses · pipeline on-chain",
    output: "Output · settlement",
    launch: "Kirim ke rantai",
    again: "Kirim lagi",
    honest: "Jujur",
    tamper: "Curang",
    idle: "Susun input di kiri, lalu tekan “Kirim ke rantai”. AI verifier menuliskan alasannya, lalu menyelesaikan transaksinya sendiri.",
    statRuns: "dikirim",
    statPaid: "di-approve",
    statCaught: "fraud ditangkap",
  },
} as const;
