// Konten halaman Enovatek. Register produk, bukan strategi.
// Fakta dari WattSettle build bible (14 Bisnis dan GTM, 05 Device dan Firmware)
// serta docs Archive 03 Opsi 6. Jangan mengada-ada.
// Suara: protocol docs. Leksikon dikunci di docs/Voice.md.

export const intro = {
  kicker: "Use case · Cooling as a Service",
  headline: ["Rail yang sama,", "dipasang di produk nyata."],
  lead:
    "WattSettle adalah settlement rail yang generik. Enovatek adalah tempat rail itu terpasang: perusahaan yang beroperasi, meter yang terpasang, dan pemakai yang membayar per pemakaian.",
  cta: { href: "/demo", label: "Coba demonya" },
  facts: [
    { k: "Mitra", v: "PT Enovatek Energy", d: "perusahaan green energy yang sudah beroperasi" },
    { k: "Produk", v: "PM20H20Q", d: "DC meter untuk model rental AC, Cooling as a Service" },
    { k: "Pembayar", v: "Penyewa AC", d: "membayar per kWh terukur, bukan tarif borongan" },
  ],
} as const;

export const partner = {
  eyebrow: "Profil mitra",
  title: "PT Enovatek Energy",
  lead:
    "Mitra green energy dengan empat lini produk. Solar, wind, dan LED menonjol di halaman mereka. Hybrid HVAC beserta PM20H20Q adalah fokus use case ini.",
  lines: [
    { ic: "ph:sun", tone: "gold", t: "Solar", d: "Mengubah atap kosong menjadi pembangkit bersih tanpa investasi awal." },
    { ic: "ph:wind", tone: "flow", t: "Wind turbine", d: "Turbin angin kecil untuk microgeneration di titik pemakaian." },
    { ic: "ph:lightbulb", tone: "volt", t: "LED lights", d: "Hemat hingga 80 persen energi dibanding lampu konvensional." },
    { ic: "ph:snowflake", tone: "watt", t: "Hybrid HVAC + PM20H20Q", d: "DC meter untuk model rental AC, fokus use case Cooling as a Service." },
  ],
} as const;

export const loop = {
  eyebrow: "Aliran nilai",
  title: "Penyewa memakai AC, meter mengukur, kontrak membayar",
  lead:
    "Lima langkah dari pemakaian fisik sampai pembayaran. Yang di-settle adalah bacaan meter itu sendiri, jadi tidak ada celah antara pemakaian dan tagihan.",
  steps: [
    { ic: "ph:snowflake", tone: "flow", k: "01", t: "Penyewa pakai AC", d: "Pemakaian Cooling as a Service berjalan sebagai konsumsi DC yang nyata." },
    { ic: "ph:gauge", tone: "flow", k: "02", t: "PM20H20Q mengukur", d: "DC meter mencatat pemakaian, gateway SRT-MGATE menandatangani angkanya." },
    { ic: "ph:file-text", tone: "gold", k: "03", t: "Kontrak WattSettle", d: "Kontrak memeriksa tanda tangan, menolak replay, lalu memancarkan event." },
    { ic: "ph:cpu", tone: "volt", k: "04", t: "Agent menilai", d: "Agent menghitung ulang kewajaran dan anomali, lalu menulis alasannya on-chain." },
    { ic: "ph:coins", tone: "watt", k: "05", t: "Settle", d: "Approve: penyewa membayar Enovatek per pemakaian plus fee 1 persen. Reject: nol token, anomali tercatat." },
  ],
} as const;

export const streams = {
  eyebrow: "Dua aliran nilai",
  title: "Satu meter, dua sumber pendapatan",
  lead:
    "Bacaan yang sama membuka dua aliran. Yang pertama adalah revenue hari ini, yang kedua adalah upside dari data yang sudah terverifikasi.",
  cards: [
    {
      ic: "ph:lightning",
      tone: "watt",
      tag: "Revenue utama",
      t: "Billing pemakaian per kWh",
      d: "Penyewa membayar per kWh terukur. Karena tiap kWh terverifikasi memicu settlement, penjualan meter berubah dari transaksi satu kali menjadi pendapatan berulang.",
    },
    {
      ic: "ph:leaf",
      tone: "flow",
      tag: "Upside",
      t: "Carbon, REC, ESG, dan CBAM",
      d: "Data yang sudah bertanda tangan dan ter-attestasi bisa dijual sebagai proof source-class beserta CO2e kepada pembeli ESG. Ini ekstensi di atas billing, bukan penggantinya.",
    },
  ],
} as const;

export const production = {
  eyebrow: "Catatan produksi",
  quote: "Billing nyata memakai stablecoin. Demo memakai suriota.",
  body:
    "Di produksi, billing memakai stablecoin agar tagihan tidak berayun mengikuti harga token. Demo memakai suriota untuk menghindari risiko token baru. Swap ke MockUSD di kontrak adalah perubahan satu baris.",
} as const;

export const grounding = {
  title: "Grounding jujur",
  body:
    "Halaman Enovatek menonjolkan solar, wind, dan LED. Spesifikasi PM20H20Q dan angka model rental bersifat indikatif, berasal dari pengetahuan internal SURIOTA dan belum tervalidasi publik. Yang load bearing di sini hanya satu: PM20H20Q memberi angka kWh yang kemudian ditandatangani gateway.",
} as const;
