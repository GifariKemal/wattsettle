# Spec Desain: Refactor Website WattSettle (Product Showcase)

**Tanggal:** 8 Juli 2026
**Penyusun:** Gifari Kemal Suryo (SURIOTA) bersama Claude
**Status:** Disetujui, lanjut ke writing-plans
**Proyek:** Indonesia Web3 Hackathon 2026, website WattSettle (folder `web/`)

---

## 1. Tujuan dan Ruang Lingkup

Refactor total website `web/` dari deck strategi pitch 18 halaman menjadi **product showcase publik** yang memaparkan WattSettle end to end: konten, UI/UX, dan workflow. Audiens utama publik, investor, dan mitra, bukan lagi juri secara khusus.

Prinsip: reuse stack yang sudah ada (Astro, Tailwind v4, React islands, Motion, GSAP), refactor di tempat, redesign visual lewat taste skills. Konten diselaraskan ke WattSettle build bible, ditulis ulang dalam bahasa produk.

Di luar ruang lingkup: mengubah kontrak, dokumentasi bible, atau firmware. Hanya website.

---

## 2. Keputusan yang Dikunci

| Topik | Keputusan |
|:--|:--|
| Tujuan site | Product showcase publik |
| Struktur | Multi-page fokus, 7 halaman |
| Stack | Reuse Astro + Tailwind v4 + React islands + Motion/GSAP, refactor di tempat |
| Arah desain | Fresh premium, dieksplor taste skills (2 sampai 3 arah hi-fi lalu dipilih) |
| Identitas | WattSettle: energi hijau `22c55e`, flow cyan `06b6d4`, BNB gold `f0b90b` |
| Bahasa | Indonesia untuk narasi, English untuk istilah teknis |

---

## 3. Arsitektur Halaman (7 halaman)

Routing tetap lewat `src/pages/[...slug].astro` plus `src/content/nav.ts` (dirombak).

| # | URL | Isi inti | Island |
|:--|:--|:--|:--|
| 1 | `/` Beranda | Hero satu kalimat, animated one-loop, tesis "meter adalah transaksi", 3 proof-point, CTA ke Demo | animated loop |
| 2 | `/cara-kerja` | Konsep dan mental model, loop Reading ke Attestation ke Settlement, arsitektur 3-layer, kenapa no oracle gap | reveal/motion |
| 3 | `/demo` | Interaktif: Simulator (approve/reject) plus Mesin settlement (sandbox), attestation on-chain plus BscScan | Simulator, SettleMachine |
| 4 | `/enovatek` | Use-case nyata PM20H20Q, Cooling as a Service, aliran nilai penyewa ke meter ke AI ke bayar plus fee | value-flow |
| 5 | `/teknologi` | Kontrak WattSettle (evolve ProofOfWatt), AI verifier otonom, BNB Chain plus ERC-8004, token suriota, bukti on-chain | — |
| 6 | `/roadmap` | Posisi sekarang plus visi produk (device-NFT financing, VeriFaktur, white-label), scope jujur | timeline |
| 7 | `/tentang` | SURIOTA plus builder, kenapa SURIOTA unik (moat framing positif), tautan repo/demo/BscScan, kontak, footer | — |

### Islands
- **Dipertahankan:** `Simulator.tsx`, `SettleMachine.tsx`, `ThemeToggle.tsx`, `SoundToggle.tsx`.
- **Dibuang:** `OptionToggle.tsx` (5 vs 6 internal), `SwotBoard.tsx` (teardown kompetitor internal).

---

## 4. Yang Dibuang (internal atau kompetitif, sudah ada di bible)

Benchmark skor antar-opsi, peluang/win-probability, path-to-90, pivot Codex/AgentCart, "kenapa menang" (di-reframe positif jadi moat di Tentang), SWOT teardown kompetitor, banding 5-vs-6, prediksi (dilebur ke Roadmap).

Alasan: konten ini kompetitif dan internal. Website publik memaparkan produk, bukan strategi memenangkan hackathon. Semua tetap tersimpan di build bible `WattSettle/`.

---

## 5. Sumber Konten

Subset outward-facing dari WattSettle build bible, terutama bab 00 Ikhtisar, 01 Latar Belakang, 02 Konsep, 03 Arsitektur, 05 Device, 06 Kontrak, 07 AI Verifier, 08 Tokenomics, 14 Bisnis/Enovatek, 18 Roadmap. Ditulis ulang dari register strategi menjadi register produk (mengajak, jelas, meyakinkan), tetap formal engineering bilingual.

Aturan: angka load-bearing (chainId 97, token address, fee 1%, timeline, dst) diambil dari sumber, jangan mengada-ada. Semua konten di `src/content/*.ts` sebagai single source of truth.

**Public-safety:** tidak boleh ada detail infra internal (IP/host VPS, credential), tidak ada angka win-probability atau kill-shot. Konten aman untuk publik.

---

## 6. Proses Desain (taste skills)

Fase awal eksekusi, sebelum membangun semua halaman:
1. Muat `frontend-design`, `huashu-design`, `high-end-visual-design`.
2. Produksi 2 sampai 3 arah hi-fi (hero plus satu section sample) sebagai prototipe.
3. Gifari memilih satu arah.
4. Kunci design system (palet, tipografi, spacing, komponen kartu, motion language) sebagai fondasi semua halaman.

Baru setelah arah terkunci, halaman-halaman dibangun konsisten.

---

## 7. Pendekatan Teknis

- Routing: `[...slug].astro` plus `nav.ts` dirombak ke 7 halaman baru.
- Konten: rewrite `src/content/*.ts` (buang file strategi: scoring, codex, swot, probability-related; tambah/ubah: site, howItWorks, demo, enovatek, tech, roadmap, about).
- Layout: redesign `PageShell.astro` plus `global.css` sesuai design system terpilih.
- Komponen: rewrite/rework komponen section di `src/components/sections/` mengikuti design system. Hapus section strategi yang tidak dipakai.
- Islands: pertahankan yang dipakai, sesuaikan styling ke design system baru.
- Aset: self-contained di `web/public/` atau `src/assets`, sesuai pola existing.

Bila komponen atau file tumbuh terlalu besar saat refactor, pecah per tanggung jawab. Ikuti pola existing bila tidak ada alasan kuat mengubah.

---

## 8. Eksekusi Multi-Agent

Setelah design system terkunci:
1. Agent paralel per-halaman menulis konten plus markup section di design system yang sama (file berbeda, tanpa konflik).
2. Agent review per-halaman: spec-compliance (konten sesuai brief plus akurat vs sumber), kualitas visual (patuh design system), a11y (focus, aria, kontras).
3. Perbaikan loop sampai bersih.
4. QA E2E menyeluruh di akhir.

Controller (Claude) menyusun design system dan brief tiap halaman, menjaga konsistensi lintas agent.

---

## 9. QA Gates

- `astro check` 0 error 0 warning.
- `npm run build` sukses (7 route statis).
- Playwright E2E: tiap route load 200, 0 console error, 0 horizontal overflow di desktop dan mobile, island berfungsi (Simulator approve plus reject, Mesin sandbox, theme toggle persist, sound toggle), nav antar-halaman jalan, light dan dark mode.
- Tidak ada em-dash atau en-dash sebagai pemisah kalimat di konten (konsisten dengan konvensi proyek).
- Public-safety scan: tidak ada IP/host/credential internal.

---

## 10. Urutan Eksekusi (dirinci di writing-plans)

1. Fase 0: eksplor design direction (taste skills), pilih, kunci design system plus `global.css`/tokens.
2. Fase 1: rombak `nav.ts` plus scaffold 7 route, rewrite `site.ts` plus content files kerangka.
3. Fase 2: bangun Beranda plus Cara Kerja (fondasi + design system terpakai penuh).
4. Fase 3: Demo (wire islands) plus Enovatek.
5. Fase 4: Teknologi plus Roadmap plus Tentang.
6. Fase 5: aset, motion polish, QA E2E, public-safety scan, build.

---

## 11. Definition of Done

- 7 halaman produk hidup di `web/`, konten produk (bukan strategi), akurat vs sumber.
- Konten internal-kompetitif dan islands usang sudah dibuang.
- Design system fresh premium terpilih diterapkan konsisten di semua halaman.
- Island Simulator dan Mesin settlement berfungsi di site baru.
- Semua QA gate hijau (astro check, build, Playwright E2E desktop plus mobile, light plus dark).
- Tidak ada konten internal-kompetitif atau detail infra di publik.
- README web atau catatan cara jalan diperbarui bila perlu.

---

<div align="center">
<sub>© 2026 PT Surya Inovasi Prioritas (SURIOTA) · Spec refactor website WattSettle · 8 Juli 2026</sub>
</div>
