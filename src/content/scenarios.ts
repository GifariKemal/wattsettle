// 8 skenario pasar — satu mesin, banyak pintu.

export type Scenario = {
  tag: string;
  title: string;
  body: string;
  icon: string; // nama ikon Phosphor (ph:*)
  demo?: boolean;
  accent?: "watt" | "flow" | "gold" | "heat" | "volt";
};

export const scenarios = {
  eyebrow: "Pasar · Satu mesin, banyak pintu",
  headline: "Delapan skenario. Semua pasar, satu rel.",
  lead:
    "Prior art (WeatherXM/Arkreen/Powerledger) mengerjakan potongannya. Tidak ada yang menguasai kombinasi industrial + AI-reasoning + pasar Indonesia + owned-hardware.",
  items: [
    { tag: "Demo", title: "HVAC · Enovatek", body: "Penyewa AC bayar per-pakai via PM20H20Q. Opsi 6.", icon: "ph:snowflake", demo: true, accent: "flow" },
    { tag: "REC / ESG", title: "Solar → pabrik", body: "Produsen hijau dibayar; pembeli dapat sertifikat tak-terpalsukan.", icon: "ph:sun", accent: "watt" },
    { tag: "CBAM", title: "Eksportir", body: "Buktikan listrik hijau → hindari denda karbon Uni Eropa.", icon: "ph:boat", accent: "gold" },
    { tag: "P2P", title: "Microgrid", body: "Tetangga ber-solar jual surplus → meter → auto-settle.", icon: "ph:share-network", accent: "flow" },
    { tag: "Mobility", title: "EV charging", body: "Charger ukur kWh → pengendara auto-bayar per-sesi.", icon: "ph:plug-charging", accent: "volt" },
    { tag: "ESCO", title: "Performance contract", body: "Bukti penghematan energi → pembayaran berbasis kinerja.", icon: "ph:chart-line-up", accent: "watt" },
    { tag: "Carbon", title: "MRV otomatis", body: "Pembangkitan terverifikasi → penerbitan carbon credit.", icon: "ph:leaf", accent: "gold" },
    { tag: "Subsidi", title: "Diesel displacement", body: "Buktikan EBT menggantikan genset → klaim subsidi/kredit.", icon: "ph:gas-pump", accent: "heat" },
  ] as Scenario[],
} as const;
