// Konten halaman Tentang (About & Contact). Register produk, framing positif.
// Sumber: 01 Latar Belakang.md (moat 5 hal, kenapa SURIOTA) + site.ts.
// Tidak mengada-ada, tidak ada teardown kompetitor.

export const intro = {
  eyebrow: "Tentang",
  title: "Perusahaan energi nyata yang membawa kilowatt-hour ke on-chain.",
  lead:
    "WattSettle dibangun oleh SURIOTA (PT Surya Inovasi Prioritas), perusahaan energi dan IoT industrial yang sudah mengapalkan perangkat, melayani customer, dan menjalankan infrastruktur AI sendiri. Kami tidak mensimulasikan dunia fisik, kami sudah berada di dalamnya.",
} as const;

export const builder = {
  eyebrow: "Builder",
  name: "Gifari Kemal Suryo",
  role: "CEO & Founder",
  company: "PT Surya Inovasi Prioritas (SURIOTA)",
  body:
    "SURIOTA menguasai seluruh rantai dari silikon sampai settlement, mulai dari firmware gateway, produk monitoring energi, verifier AI otonom, hingga kontrak di rantai. Tidak ada oracle, facilitator, atau vendor eksternal yang harus diajak berbagi margin atau yang bisa memblokir alur.",
} as const;

// Moat sebagai 5 keunggulan yang dipegang sekaligus. Framing positif tentang SURIOTA saja.
export const moat = {
  eyebrow: "Kenapa SURIOTA",
  title: "Lima hal langka yang kami pegang sekaligus.",
  lead:
    "Setiap keunggulan secara terpisah biasa saja. Kekuatannya lahir karena kelimanya berada pada satu pemain yang sama, di celah yang jarang ditempati siapa pun.",
  items: [
    {
      no: "01",
      ic: "ph:cpu",
      tone: "flow",
      title: "Hardware nyata",
      body: "SRT-MGATE-1210, gateway ESP32 yang sudah dijual dan ter-deploy, menjadi device signer yang menandatangani angka kWh di titik sumber.",
    },
    {
      no: "02",
      ic: "ph:scales",
      tone: "volt",
      title: "Domain energi dan OT",
      body: "Pemahaman Operational Technology, Modbus, dan perilaku meter di lapangan, bukan sekadar kemampuan menulis kontrak.",
    },
    {
      no: "03",
      ic: "ph:map-pin",
      tone: "gold",
      title: "Last-mile physical trust",
      body: "Membuktikan kerja fisik butuh perangkat plus pengalaman lapangan, sesuatu yang tidak bisa diselesaikan dengan kode saja.",
    },
    {
      no: "04",
      ic: "ph:handshake",
      tone: "watt",
      title: "Customer dan distribusi",
      body: "Sudah ada pihak yang memasang meter dan membayar. Produk berdiri di atas installed base yang nyata, tanpa cold-start dari nol.",
    },
    {
      no: "05",
      ic: "ph:buildings",
      tone: "flow",
      title: "Timing regulasi",
      body: "CBAM dan supervisi kripto OJK sama-sama aktif sejak Januari 2026, jendela yang tepat bagi perusahaan berlisensi yang men-settle energi metered on-chain.",
    },
  ],
} as const;

export const links = {
  eyebrow: "Tautan dan bukti",
  title: "Semuanya terbuka untuk diperiksa.",
  lead:
    "Kode sumber, kontrak di rantai, dan demo interaktif tersedia agar setiap klaim bisa dibuktikan langsung, bukan sekadar dipercaya.",
} as const;

export const contact = {
  eyebrow: "Kontak",
  title: "Mari bicara.",
  body:
    "Untuk kemitraan, pertanyaan teknis, atau peluang menaruh energi metered on-chain, hubungi builder langsung.",
} as const;
