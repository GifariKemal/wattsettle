# WattSettle Website Refactor Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Refactor `web/` dari deck strategi 18 halaman menjadi product showcase publik WattSettle 7 halaman, dengan design system fresh premium (dipilih dari 2 sampai 3 arah taste-skill), konten produk yang akurat, dan island interaktif yang dipertahankan.

**Architecture:** Reuse stack Astro 5.18 + Tailwind v4 + React islands + Motion/GSAP. Routing tetap via `src/pages/[...slug].astro` plus `src/content/nav.ts`. Konten sebagai single source of truth di `src/content/*.ts`. Design direction dieksplor dulu (checkpoint pilih user), lalu design system dikunci, lalu halaman dibangun paralel per-agent.

**Tech Stack:** Astro, TypeScript, Tailwind v4, React 19 islands, Motion (`motion/react`), GSAP/ScrollTrigger, Playwright (E2E), taste skills (frontend-design, huashu-design, high-end-visual-design), ponytail.

---

## Prinsip Eksekusi (semua task)

1. **Design skills dimuat di Task 0** dan diikuti untuk semua kerja visual.
2. **Public-safety:** tidak ada konten internal-kompetitif (win-probability, path-to-90, benchmark antar-opsi, kill-shot, teardown kompetitor) dan tidak ada detail infra (IP/host VPS, credential). Aman untuk publik.
3. **Akurasi:** angka load-bearing dari sumber (WattSettle bible + contract), jangan mengada-ada. Semua teks di `src/content/*.ts`.
4. **Character rule:** prosa konten bebas em-dash dan en-dash sebagai pemisah kalimat. Identifier/kode/URL tetap utuh.
5. **Ponytail:** styling kaya tetapi tidak over-engineer. Reuse island dan pola existing. Konten lebih penting dari dekorasi.
6. **Commit per fase**, bukan per file. Commit hanya bila Gifari mengizinkan; jika belum, kumpulkan diff dan lapor. Kerja di branch, bukan langsung main.

---

## Peta File

```
web/
├── src/
│   ├── content/
│   │   ├── nav.ts               ROMBAK: 7 halaman produk
│   │   ├── site.ts              ROMBAK: identitas + hero + footer produk
│   │   ├── home.ts              BARU: proof-points, one-loop copy
│   │   ├── howItWorks.ts        BARU: konsep, loop, 3-layer, no oracle gap
│   │   ├── demo.ts              REUSE+edit: dari simulator.ts + machine.ts
│   │   ├── enovatek.ts          BARU: PM20H20Q, CaaS, value flow
│   │   ├── tech.ts              BARU: kontrak, AI verifier, BNB/ERC-8004, token, bukti on-chain
│   │   ├── roadmap.ts           BARU: posisi sekarang + visi produk
│   │   ├── about.ts             BARU: SURIOTA, builder, moat positif, tautan, kontak
│   │   ├── simulator.ts         PERTAHANKAN (dipakai Demo)
│   │   ├── machine.ts           PERTAHANKAN (dipakai Demo)
│   │   └── [HAPUS] scoring.ts, codex.ts, swot.ts, why.ts, options.ts, problem.ts, scenarios.ts
│   ├── layouts/PageShell.astro  REDESIGN: sesuai design system terpilih
│   ├── styles/                  global.css / tokens: REDESIGN (verifikasi path via PageShell import)
│   ├── pages/[...slug].astro    UPDATE: map slug -> komponen 7 halaman
│   ├── components/
│   │   ├── ui/                  base components design system (BARU sesuai arah)
│   │   ├── sections/            ROMBAK: Hero + 6 section produk baru; HAPUS section strategi
│   │   └── islands/
│   │       ├── Simulator.tsx        PERTAHANKAN (restyle)
│   │       ├── SettleMachine.tsx    PERTAHANKAN (restyle)
│   │       ├── ThemeToggle.tsx      PERTAHANKAN
│   │       ├── SoundToggle.tsx      PERTAHANKAN
│   │       └── [HAPUS] OptionToggle.tsx, SwotBoard.tsx
│   └── lib/                     nav.ts, theme.ts, sound.ts, heroCanvas.ts: sesuaikan
└── scratchpad/ atau reports/    e2e Playwright (gitignored)
```

---

## Task 0: Eksplor design direction dan pilih (CHECKPOINT USER)

**Files:**
- Create: `web/design-explore/dir-A.html`, `dir-B.html`, `dir-C.html` (prototipe hi-fi standalone, gitignored/temp)

- [ ] **Step 1: Muat design skills**

Invoke via Skill tool: `frontend-design`, lalu `huashu-design`, lalu `high-end-visual-design`. Ikuti arahannya.

- [ ] **Step 2: Riset referensi visual energy-tech/DePIN**

Kumpulkan arah: (A) dark premium tech (OLED, aurora, glass), (B) light editorial korporat-modern, (C) industrial energy (blueprint, mono, data-dense). Tiap arah = identitas WattSettle (hijau/cyan/gold).

- [ ] **Step 3: Produksi 3 prototipe hi-fi**

Untuk tiap arah, buat 1 file HTML standalone berisi Hero + 1 section sample (mis. one-loop atau proof-points), lengkap dengan tipografi, warna, spacing, komponen kartu, dan micro-motion. Self-contained, bisa dibuka di browser.

- [ ] **Step 4: Presentasikan ke Gifari, minta pilih**

Screenshot ketiga arah (Playwright) atau buka lokal. Gifari memilih satu. STOP di sini sampai ada pilihan. Ini satu-satunya checkpoint wajib.

- [ ] **Step 5: Dokumentasikan pilihan**

Catat arah terpilih plus token (font, palet lengkap, radius, shadow, motion easing) di `web/design-explore/CHOSEN.md` sebagai acuan design system.

---

## Task 1: Kunci design system (foundation)

**Files:**
- Modify: `web/src/styles/global.css` (atau file token yang di-import PageShell, verifikasi dulu)
- Modify: `web/src/layouts/PageShell.astro`
- Create: `web/src/components/ui/*` (base: Button, Card, Eyebrow, Section wrapper, dst sesuai arah)

- [ ] **Step 1: Terapkan tokens**

Tulis CSS variables/`@theme` sesuai `CHOSEN.md`: warna brand (`--watt` 22c55e, `--flow` 06b6d4, `--gold` f0b90b), skala tipografi, spacing, radius, shadow, easing. Hormati `prefers-reduced-motion`.

- [ ] **Step 2: Redesign PageShell**

Header/nav produk (bukan deck counter/rail), footer, ClientRouter transitions, theme init anti-FOUC, slot konten. Nav = 7 halaman dari `nav.ts`.

- [ ] **Step 3: Base UI components**

Buat komponen dasar reusable (Button dengan varian, Card double-bezel bila arah dark, Eyebrow tag, Section wrapper dengan reveal). Satu tanggung jawab per file.

- [ ] **Step 4: Verifikasi build**

Run: `cd web && npm run build`
Expected: sukses (halaman lama mungkin masih ada; fokus tidak ada error dari foundation).

---

## Task 2: Rombak routing dan konten kerangka

**Files:**
- Modify: `web/src/content/nav.ts`, `web/src/content/site.ts`
- Modify: `web/src/pages/[...slug].astro`

- [ ] **Step 1: Tulis `nav.ts` 7 halaman**

```ts
export const pages: NavPage[] = [
  { slug: "", label: "Beranda", desc: "Rel settlement on-chain untuk energi terverifikasi" },
  { slug: "cara-kerja", label: "Cara Kerja", desc: "Reading ditandatangani, AI menilai, kontrak membayar" },
  { slug: "demo", label: "Demo", desc: "Coba sendiri: approve, reject, settle" },
  { slug: "enovatek", label: "Enovatek", desc: "Cooling as a Service dengan meter PM20H20Q" },
  { slug: "teknologi", label: "Teknologi", desc: "Kontrak, AI verifier, BNB Chain, token" },
  { slug: "roadmap", label: "Roadmap", desc: "Posisi sekarang dan arah produk" },
  { slug: "tentang", label: "Tentang", desc: "SURIOTA dan cara menghubungi" },
];
```

- [ ] **Step 2: Rewrite `site.ts`**

Identitas produk (name, tagline, description publik), hero (headline produk, lead, CTA ke `/demo` dan `/cara-kerja`, 3 proof-point non-strategi mis. "on-chain di BNB testnet", "AI verifier otonom", "hardware nyata SURIOTA"), footer produk (tanpa punch strategi). Angka dari sumber.

- [ ] **Step 3: Update `[...slug].astro`**

Map 7 slug ke komponen halaman baru (dibuat di task berikut). getStaticPaths dari `nav.ts`.

- [ ] **Step 4: Verifikasi**

Run: `cd web && npm run build`
Expected: 7 route ter-generate (halaman boleh minimal dulu).

---

## Task 3 sampai 9: Bangun halaman (pola identik per halaman)

**Pola per halaman** (diulang untuk tiap halaman di bawah):

- [ ] **Step A: Tulis content file** (`src/content/<nama>.ts`) dengan teks produk akurat dari sumber, character-rule patuh.
- [ ] **Step B: Bangun section component(s)** (`src/components/sections/<Nama>.astro`) memakai base UI + design system, wire island bila ada.
- [ ] **Step C: Wire ke `[...slug].astro`** (map slug).
- [ ] **Step D: Verifikasi** `cd web && npm run build` sukses; cek visual via Playwright screenshot (desktop + mobile).

### Task 3: Beranda (`/`)
- Content `home.ts` + rework `Hero.astro`. Hero satu kalimat, animated one-loop (reuse aset atau heroCanvas), tesis "meter adalah transaksi", 3 proof-point, CTA ke `/demo`. Section ringkas "apa itu WattSettle" + link ke Cara Kerja.

### Task 4: Cara Kerja (`/cara-kerja`)
- Content `howItWorks.ts` + `HowItWorks.astro`. Konsep + mental model, loop Reading{deviceId,kWh,timestamp,nonce} -> Attestation{delta,anomalyScore,modelHash,rulesetHash} -> Settlement, arsitektur 3-layer (device / kontrak / AI verifier) dengan diagram, kenapa no oracle gap. Sumber: bible 02, 03.

### Task 5: Demo (`/demo`)
- Content `demo.ts` (dari `simulator.ts` + `machine.ts`) + `DemoSection.astro`. Wire `Simulator.tsx` (approve/reject scripted, attestation, tx) + `SettleMachine.tsx` (sandbox input->proses->output). Restyle island ke design system. Tunjukkan tautan BscScan.

### Task 6: Enovatek (`/enovatek`)
- Content `enovatek.ts` + `Enovatek.astro`. PM20H20Q, Cooling as a Service, diagram aliran nilai (penyewa -> meter -> kontrak -> AI -> bayar Enovatek + fee 1%). Catatan produksi pakai stablecoin, demo pakai suriota. Grounding jujur (spec PM20H20Q indikatif). Sumber: bible 14, 05, docs Archive 03.

### Task 7: Teknologi (`/teknologi`)
- Content `tech.ts` + `Tech.astro`. Kontrak WattSettle (evolve ProofOfWatt, attestAndSettle, SafeERC20/ReentrancyGuard), AI verifier otonom (Hermes, zero-click, generik tanpa detail infra), BNB Chain + integrasi ERC-8004 live, token `suriota` (address, verified), bukti on-chain (kontrak verified, tx BscScan). Sumber: bible 06, 07, 08, 10. Public-safe (tanpa IP/host).

### Task 8: Roadmap (`/roadmap`)
- Content `roadmap.ts` + `Roadmap.astro`. Posisi sekarang (hackathon build, testnet) + visi produk (device-NFT financing, VeriFaktur, white-label) sebagai timeline. Framing scope jujur. Sumber: bible 18.

### Task 9: Tentang (`/tentang`)
- Content `about.ts` + `About.astro`. SURIOTA + builder Gifari, kenapa SURIOTA unik (moat 5-hal framing POSITIF, tanpa teardown kompetitor), tautan (repo github.com/GifariKemal/wattsettle, live demo, BscScan token/kontrak), kontak. Sumber: bible 01, 22.

---

## Task 10: Bersihkan konten dan komponen usang

**Files:**
- Delete: `src/content/{scoring,codex,swot,why,options,problem,scenarios}.ts` (yang tak dipakai lagi)
- Delete: `src/components/sections/{Comparison,Levers,Options,PathTo90,Swot,Probability,Scoring,References,Prediction,CodexOptions,Moat}.astro` (yang tak dipakai lagi)
- Delete: `src/components/islands/{OptionToggle,SwotBoard}.tsx`
- Modify: `src/components/sections/{MoneyFlow,Scenarios,Problem}.astro` bila kontennya diserap ke halaman baru (hapus bila tidak)

- [ ] **Step 1: Cari referensi mati**

Run: `cd web && npm run build` lalu grep import yang menunjuk file yang akan dihapus.

- [ ] **Step 2: Hapus file usang**, pastikan tidak ada import yang menggantung.

- [ ] **Step 3: Verifikasi** `astro check` dan `build` bersih.

---

## Task 11: Aset dan motion polish

**Files:**
- Create/modify: aset di `web/public/` atau `src/assets` (banner, ikon, diagram), `src/lib/heroCanvas.ts`, motion di section.

- [ ] **Step 1: Aset kunci** (hero visual, diagram one-loop, value-flow Enovatek) sesuai design system. Reuse aset bible bila cocok.
- [ ] **Step 2: Motion** reveal on-scroll (transform/opacity saja), micro-interaction pada kartu/CTA, hormati reduced-motion. Konsisten easing dari tokens.
- [ ] **Step 3: Verifikasi** tidak ada horizontal overflow, animasi GPU-safe.

---

## Task 12: QA E2E, public-safety, build final

**Files:**
- Create: `web/scratchpad/e2e.mjs` (Playwright, gitignored)

- [ ] **Step 1: astro check** — Run: `cd web && npm run check` — Expected: 0 error 0 warning.

- [ ] **Step 2: build** — Run: `cd web && npm run build` — Expected: 7 route sukses.

- [ ] **Step 3: E2E Playwright** (`scratchpad/e2e.mjs`): tiap 7 route load + 0 console error + 0 horizontal overflow (desktop 1366 + mobile 390); Simulator approve + reject; SettleMachine sandbox; ThemeToggle persist lintas-nav; SoundToggle; nav antar-halaman; light + dark. Expected: semua PASS.

- [ ] **Step 4: Public-safety scan** — grep konten build untuk IP/host/credential internal dan istilah win-probability/kill-shot. Expected: nihil.

- [ ] **Step 5: Character-rule scan** — cek konten (`src/content/*.ts`) bebas em-dash/en-dash pemisah kalimat.

- [ ] **Step 6: Laporan** — ringkas halaman, hasil QA, screenshot, dan diff untuk review Gifari sebelum commit/PR.

---

## Self-Review Plan (dijalankan penyusun)

**Spec coverage:** Tujuan/scope (spec §1) = Task 0-12. Keputusan (§2) = tercermin di semua task. Arsitektur 7 halaman (§3) = Task 3-9. Yang dibuang (§4) = Task 10. Sumber konten (§5) = Step A tiap halaman + brief per Task. Proses desain taste (§6) = Task 0. Teknis (§7) = Task 1-2, 10. Multi-agent (§8) = handoff subagent-driven. QA gates (§9) = Task 12. Urutan (§10) = urutan Task. DoD (§11) = Task 12 + keseluruhan. Tidak ada gap.

**Placeholder scan:** brief tiap halaman konkret dengan sumber. `nav.ts`/`site.ts` diberi kode. Tidak ada TODO menggantung. Design-direction sengaja dieksplor di Task 0 (bukan placeholder, itu checkpoint by-design).

**Type consistency:** `nav.ts` NavPage type dipertahankan; slug konsisten dengan `[...slug].astro` map dan nama content file; island yang dipertahankan konsisten di §peta file dan Task 5.

---

<div align="center">
<sub>© 2026 PT Surya Inovasi Prioritas (SURIOTA) · Plan refactor website WattSettle · 8 Juli 2026</sub>
</div>
