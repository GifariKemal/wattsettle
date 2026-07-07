> 🗄️ **ARSIP.** Opsi ini sudah divalidasi dan bukan fokus submission. Disimpan sebagai referensi dan roadmap. Fokus aktif: [Opsi 5 WattSettle](<../02 Opsi 5 WattSettle.md>) · [Opsi 6 Enovatek](<../03 Opsi 6 Enovatek.md>) · [Codex 7 dan 8](<../Codex Opsi 7 8/>). Index arsip: [README](README.md).

---

# PROMPT SIAP-PASTE (setelah restart Claude Code)

> Salin seluruh blok di bawah ini ke sesi baru.

---

Lanjutkan project Indonesia Web3 Hackathon 2026 (WattSettle). **Full autonomous, end-to-end, jangan tanya-tanya**: kerja keras, terstruktur, no gap. Bismillah.

## 0. Bootstrap konteks (WAJIB dulu, urut)
1. Baca memory: `MEMORY.md` + `project-web3-hackathon-2026.md` di folder memory project ini. Itu berisi semua keputusan: 6 opsi, pilihan final **Opsi 5 (WattSettle) + Opsi 6 (Enovatek/PM20H20Q)**, blackbox, path-to-90, referensi zkPull/OwnaFarm, scoring.
2. Baca `STRATEGI-MASTER-6-OPSI.md` (index) + `STRATEGI-MASTER-Opsi5-JUARA.md` (detail Opsi 5).
3. Lihat website v1 (static HTML) di `Presentasi Opsi 5 6/`, itu REFERENSI konten & narasi. Semua section-nya harus diangkut ulang, JANGAN dihapus.
4. Konfirmasi **Context7 MCP aktif** (ToolSearch `context7`). Kalau aktif, WAJIB pakai untuk cek versi & API terbaru tiap library sebelum menulis kode. Kalau belum, fallback argus.
5. Load **≥10 skill relevan** sebelum build: `frontend-design`, `huashu-design`, `design-taste-frontend`, `gpt-taste`, `high-end-visual-design`, `stitch-design-taste`, `minimalist-ui`, `brainstorming`, `writing-plans`, `using-superpowers`. Patuhi Ponytail.

## 1. Tujuan
Bangun ULANG website pemaparan Opsi 5 & 6 sebagai **codebase production-grade** (bukan single static HTML). Aku dev/engineer berpengalaman, mau toolchain modern, arsitektur komponen bersih, DX bagus, performa tinggi, animasi kelas Awwwards, dan mudah dikembangkan jangka panjang. Tetap **concept-explainer** (bukan engine/contract), tujuannya juri tertarik & aku bisa jelaskan ke tim.

## 2. Stack (verifikasi versi terbaru via Context7 dulu, lalu putuskan)
Rekomendasi awal (brainstorm singkat + konfirmasi via Context7, boleh diganti kalau ada yang lebih baik/terbaru):
- **Astro 5 + TypeScript** (content-first, SSG, kirim JS minimal, island architecture), ideal untuk explainer cepat & modern.
- **Tailwind v4** (via `@tailwindcss/vite`) untuk design system + tokens.
- **React islands** hanya untuk bagian interaktif (simulator, toggle Opsi 5/6, sound).
- **Motion** (`motion/react`) + **GSAP/ScrollTrigger** untuk scroll-telling & choreography.
- **Lenis** untuk smooth scroll.
- Font distinctive (bukan Inter) di-*self-host* (Sora/Outfit/JetBrains Mono atau yang lebih baik), offline-safe.
Cek SEMUA versi & pola API terkini lewat Context7 (`get-library-docs`) sebelum menulis. Kalau ada yang deprecated, ganti ke yang current.

## 3. Arsitektur (wajib bersih & modular)
- Folder baru, mis. `web/` (Astro project penuh: `package.json`, `astro.config`, `src/`, `public/`). JANGAN timpa `Presentasi Opsi 5 6/` (biarkan sbg v1 fallback).
- **Content-driven**: semua teks/section/data di file TS terpisah (`src/content/*.ts`), bukan hardcode di markup. Satu section = satu komponen (`src/components/sections/*`).
- Komponen kecil, satu tanggung jawab, tipe eksplisit. Data 6-opsi & scoring dari satu source of truth.
- Interaktif sebagai React island (`client:visible`/`client:load`): `Simulator.tsx`, `OptionToggle.tsx`, `SoundToggle.tsx`.
- `prefers-reduced-motion` dihormati; performa: animasi hanya `transform`/`opacity`; Core Web Vitals bagus.

## 4. Konten (angkut dari v1, JANGAN ada yang hilang, no gap)
Semua section ini wajib ada, lebih kaya dari v1:
Hero → Masalah → **Simulator interaktif** (kirim reading asli/palsu → meter→rantai→AI verifier→settlement, approve hijau / reject oranye, attestation JSON + tx hash + sound) → Toggle **Opsi 5 (platform) ↔ Opsi 6 (Enovatek/PM20H20Q)** → Aliran uang (siapa bayar siapa) → Perbandingan 5 vs 6 → Kenapa Menang (blackbox 3-lever + moat 5-lapis + tabel scoring 6 opsi) → 8 Skenario pasar → Probabilitas jujur + Path-to-90 → Referensi (zkPull/OwnaFarm) + Prediksi arah → Footer (bismillah). Angka & klaim ambil dari master doc (jangan mengada-ada).

## 5. Kualitas visual & interaksi (standar tinggi)
- Tema energi-elektrik, dark, colorful tapi disiplin: palette semantik (hijau=approve/bayar, oranye=reject, cyan=data, gold=token). Bukan AI-slop, bukan generic.
- Motion bermakna: hero cinematic, scroll-reveal berjenjang, pinned/scrub section untuk alur, hover physics, count-up. Sound Web Audio (toggle, default mati).
- Responsif penuh (mobile single-column), aksesibel, tanpa horizontal scroll.
- Elevate jauh di atas v1: layout asimetris/bento bergrid rapi (tanpa sel kosong), tipografi kelas agency, micro-interactions.

## 6. Quality gate (wajib sebelum selesai)
- `npm run build` sukses, `npm run dev`/`preview` jalan.
- Verifikasi via Playwright: 0 console error, screenshot hero + simulator (approve & reject) + toggle Opsi 6 + section Kenapa Menang; cek reveal benar-benar muncul.
- Jalankan `/ponytail-review` pada diff akhir.
- Kalau butuh, pakai multi-agent (Workflow) untuk riset/komponen paralel, tapi jaga koherensi.

## 7. Deliverable akhir
- Codebase `web/` lengkap + `README.md` (cara `dev`/`build`/`preview`).
- Update memory: catat stack final + lokasi + cara jalankan.
- Ringkas: apa yang dibangun, cara buka, dan langkah lanjut (riset PM20H20Q/Enovatek, lalu implementation plan contract).

Mulai sekarang, autonomous sampai jadi.
