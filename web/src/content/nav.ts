// Urutan halaman = urutan URL. slug "" = "/" (Beranda). Satu sumber untuk routing,
// nav produk, menu, prev/next, footer.

export type NavPage = { slug: string; label: string; desc: string };

export const pages: NavPage[] = [
  { slug: "", label: "Beranda", desc: "Rel settlement on-chain untuk energi terverifikasi" },
  { slug: "cara-kerja", label: "Cara Kerja", desc: "Reading ditandatangani, AI menilai, kontrak membayar" },
  { slug: "demo", label: "Demo", desc: "Coba sendiri: approve, reject, settle di layar" },
  { slug: "enovatek", label: "Enovatek", desc: "Cooling as a Service dengan meter PM20H20Q" },
  { slug: "teknologi", label: "Teknologi", desc: "Kontrak, AI verifier, BNB Chain, token" },
  { slug: "roadmap", label: "Roadmap", desc: "Posisi sekarang dan arah produk" },
  { slug: "tentang", label: "Tentang", desc: "SURIOTA dan cara menghubungi" },
];

export const href = (slug: string) => (slug ? `/${slug}` : "/");
export const total = pages.length;
