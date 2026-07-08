// Konten halaman Enovatek. Register produk, bukan strategi.
// Fakta dari WattSettle build bible (14 Bisnis dan GTM, 05 Device dan Firmware)
// serta docs Archive 03 Opsi 6. Jangan mengada-ada.

export const intro = {
  kicker: "Use case · Cooling as a Service",
  headline: ["Rel generik WattSettle,", "dipasang di satu produk nyata."],
  lead:
    "WattSettle adalah rel settlement yang generik. Enovatek adalah tempat rel itu terpasang pada produk yang benar benar ada, sehingga demo punya perusahaan, produk, dan revenue yang nyata.",
  cta: { href: "/demo", label: "Coba demonya" },
  facts: [
    { k: "Mitra", v: "PT Enovatek Energy", d: "perusahaan green energy nyata, bukan startup imajiner" },
    { k: "Produk", v: "PM20H20Q", d: "DC meter untuk model rental AC alias Cooling as a Service" },
    { k: "Pembayar", v: "Penyewa AC", d: "membayar per pemakaian, bukan bayangkan sebuah PLTS" },
  ],
} as const;

export const partner = {
  eyebrow: "Profil mitra",
  title: "PT Enovatek Energy",
  lead:
    "Mitra green energy dengan empat lini. Homepage Enovatek menonjolkan solar, wind, dan LED. Hybrid HVAC beserta PM20H20Q adalah fokus use case ini.",
  lines: [
    { ic: "ph:sun", tone: "gold", t: "Solar", d: "Mengaktifkan atap kosong menjadi pembangkit bersih tanpa investasi awal." },
    { ic: "ph:wind", tone: "flow", t: "Wind turbine", d: "Turbin angin kecil untuk microgeneration di titik pemakaian." },
    { ic: "ph:lightbulb", tone: "volt", t: "LED lights", d: "Hemat hingga 80 persen energi dibanding lampu konvensional." },
    { ic: "ph:snowflake", tone: "watt", t: "Hybrid HVAC + PM20H20Q", d: "DC meter untuk model rental AC, fokus use case Cooling as a Service." },
  ],
} as const;

export const loop = {
  eyebrow: "Aliran nilai",
  title: "Penyewa memakai AC, meter mengukur, kontrak membayar",
  lead:
    "Lima langkah dari pemakaian fisik sampai pembayaran otomatis. Yang di-settle adalah bacaan meter itu sendiri, sehingga tidak ada celah antara pemakaian dan tagihan.",
  steps: [
    { ic: "ph:snowflake", tone: "flow", k: "01", t: "Penyewa pakai AC", d: "Pemakaian Cooling as a Service berjalan sebagai konsumsi DC yang nyata." },
    { ic: "ph:gauge", tone: "flow", k: "02", t: "PM20H20Q ukur", d: "DC meter mencatat pemakaian, gateway SRT-MGATE menandatangani angkanya secara kriptografis." },
    { ic: "ph:file-text", tone: "gold", k: "03", t: "Kontrak WattSettle", d: "Kontrak memverifikasi tanda tangan reading dan menahan replay, lalu memancarkan event." },
    { ic: "ph:cpu", tone: "volt", k: "04", t: "AI verify", d: "Verifier otonom memeriksa kewajaran dan anomali anti-tamper, lalu menulis alasannya on-chain." },
    { ic: "ph:coins", tone: "watt", k: "05", t: "Settle", d: "Approve, penyewa bayar Enovatek per pemakaian plus fee 1 persen. Reject, 0 token dan anomali tercatat." },
  ],
} as const;

export const streams = {
  eyebrow: "Dua aliran nilai",
  title: "Satu meter, dua sumber pendapatan",
  lead:
    "Bacaan yang sama membuka dua aliran. Yang pertama adalah revenue utama hari ini, yang kedua adalah upside dari data yang sudah terverifikasi.",
  cards: [
    {
      ic: "ph:lightning",
      tone: "watt",
      tag: "Revenue utama",
      t: "Billing pemakaian per kWh",
      d: "Penyewa membayar per pemakaian yang terukur. Karena tiap kWh terverifikasi memicu settlement, penjualan meter berubah dari transaksi satu kali menjadi pendapatan recurring.",
    },
    {
      ic: "ph:leaf",
      tone: "flow",
      tag: "Upside",
      t: "Carbon, REC, ESG, dan CBAM",
      d: "Data yang sudah bertanda tangan dan ter-attestasi bisa dijual sebagai proof source-class plus CO2e ke pembeli ESG. Ini ekstensi di atas billing, bukan menggantikannya.",
    },
  ],
} as const;

export const production = {
  eyebrow: "Catatan produksi",
  quote: "Billing nyata memakai stablecoin. Demo memakai suriota.",
  body:
    "Di produksi, billing memakai stablecoin agar harga tidak berayun terhadap tagihan. Demo hackathon memakai token suriota untuk menghindari risiko token baru. Swap ke MockUSD di kontrak adalah perubahan satu baris.",
} as const;

export const grounding = {
  title: "Grounding jujur",
  body:
    "Homepage Enovatek menonjolkan solar, wind, dan LED. Detail spesifikasi PM20H20Q dan angka model rental bersifat indikatif, berasal dari pengetahuan internal SURIOTA dan belum tervalidasi publik. Yang load bearing untuk WattSettle adalah bahwa PM20H20Q memberi angka kWh yang lalu ditandatangani gateway, bukan spesifikasi internal meter itu sendiri.",
} as const;
