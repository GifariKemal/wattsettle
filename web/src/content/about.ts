// Konten halaman Tentang (About & Contact). Register produk, framing positif.
// Sumber: 01 Latar Belakang.md (lima keunggulan, kenapa SURIOTA) + site.ts.
// Tidak mengada-ada, tidak ada teardown kompetitor.
// Suara: protocol docs. Leksikon dikunci di docs/Voice.md.

export const intro = {
  eyebrow: "Tentang",
  title: "Dibangun perusahaan energi yang perangkatnya sudah terpasang",
  lead:
    "WattSettle dibangun SURIOTA (PT Surya Inovasi Prioritas), perusahaan energi dan IoT industrial. Kami mengapalkan perangkat, melayani customer, dan menjalankan infrastruktur AI sendiri, jadi dunia fisik di sini tidak disimulasikan.",
} as const;

export const builder = {
  eyebrow: "Builder",
  name: "Gifari Kemal Suryo",
  role: "CEO & Founder",
  company: "PT Surya Inovasi Prioritas (SURIOTA)",
  body:
    "SURIOTA memegang seluruh rantai dari firmware gateway sampai kontrak settlement: produk monitoring energi, agent verifier, dan kontrak di rantai. Tidak ada oracle, facilitator, atau vendor eksternal yang berdiri di jalur kritis atau ikut mengambil margin.",
} as const;

// Lima keunggulan yang dipegang sekaligus. Framing positif tentang SURIOTA saja.
export const moat = {
  eyebrow: "Kenapa SURIOTA",
  title: "Lima hal langka yang kami pegang sekaligus",
  lead:
    "Satu per satu, kelimanya biasa saja. Kekuatannya muncul karena semuanya berada pada satu pemain, di celah yang jarang ditempati.",
  items: [
    {
      no: "01",
      ic: "ph:cpu",
      tone: "flow",
      title: "Hardware nyata",
      body: "SRT-MGATE-1210, gateway ESP32 yang sudah dijual dan terpasang, menjadi device signer yang menandatangani angka kWh di titik sumber.",
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
      body: "Membuktikan kerja fisik butuh perangkat dan jam terbang lapangan. Bagian ini tidak bisa diselesaikan dengan kode saja.",
    },
    {
      no: "04",
      ic: "ph:handshake",
      tone: "watt",
      title: "Customer dan distribusi",
      body: "Sudah ada pihak yang memasang meter dan membayar. Produk berdiri di atas installed base yang nyata, tanpa cold start dari nol.",
    },
    {
      no: "05",
      ic: "ph:buildings",
      tone: "flow",
      title: "Timing regulasi",
      body: "CBAM dan supervisi kripto OJK sama-sama aktif sejak Januari 2026, jendela yang tepat bagi perusahaan berlisensi yang men-settle energi terukur on-chain.",
    },
  ],
} as const;

export const links = {
  eyebrow: "Tautan dan bukti",
  title: "Semuanya terbuka untuk diperiksa",
  lead:
    "Kode sumber, kontrak di rantai, dan demo interaktif tersedia supaya tiap klaim di situs ini bisa diperiksa langsung.",
} as const;

export const contact = {
  eyebrow: "Kontak",
  title: "Mari bicara",
  body:
    "Untuk kemitraan, pertanyaan teknis, atau rencana menaruh energi terukur on-chain, hubungi builder langsung.",
} as const;
