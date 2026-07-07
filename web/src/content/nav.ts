// Urutan halaman = urutan URL. slug "" = "/" (Intro). Satu sumber untuk routing,
// menu, rail dots, prev/next, counter.

export type NavPage = { slug: string; label: string; desc: string };

export const pages: NavPage[] = [
  { slug: "", label: "Intro", desc: "Rel pembayaran + wasit-AI untuk energi terverifikasi" },
  { slug: "masalah", label: "Masalah", desc: "Kepercayaan buta di pasar energi & karbon" },
  { slug: "simulator", label: "Simulator", desc: "Simulasi interaktif: kirim reading, AI menilai & bayar sendiri" },
  { slug: "opsi", label: "Opsi 5 & 6", desc: "Rel platform (5) vs produk nyata Enovatek (6)" },
  { slug: "codex", label: "Opsi Codex", desc: "AgentCart TrustPay: pivot cadangan finance/ecommerce" },
  { slug: "mesin", label: "Mesin", desc: "Main sendiri: susun input → AI menilai → bayar (Opsi 5 & 6)" },
  { slug: "aliran-uang", label: "Aliran Uang", desc: "Siapa bayar siapa, WattSettle jadi wasit + kasir" },
  { slug: "banding", label: "5 vs 6", desc: "Perbandingan Opsi 5 (platform) vs Opsi 6 (produk)" },
  { slug: "swot", label: "SWOT", desc: "Kekuatan, celah & peta kompetitor" },
  { slug: "menang", label: "Kenapa Menang", desc: "Tiga lever blackbox yang 100% kami kontrol" },
  { slug: "moat", label: "Moat", desc: "Lima hal langka sekaligus, tak bisa ditiru" },
  { slug: "benchmark", label: "Benchmark", desc: "Keputusan build utama + opsi pivot Codex" },
  { slug: "skenario", label: "Skenario", desc: "8 pasar, satu rel: solar, CBAM, EV, karbon" },
  { slug: "peluang", label: "Peluang", desc: "Angka jujur: nominasi & juara, tanpa inflasi" },
  { slug: "path", label: "Path-to-90", desc: "Checklist yang harus benar untuk menang" },
  { slug: "referensi", label: "Referensi", desc: "Pola pemenang: zkPull & OwnaFarm" },
  { slug: "prediksi", label: "Prediksi", desc: "Kenapa future-proof: RWA + Agentic Finance" },
  { slug: "penutup", label: "Penutup", desc: "Kami taruh perusahaan nyata on-chain" },
];

export const href = (slug: string) => (slug ? `/${slug}` : "/");
export const total = pages.length;
