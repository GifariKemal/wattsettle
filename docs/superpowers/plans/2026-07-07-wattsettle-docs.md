# WattSettle Documentation Build Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Bangun folder `/WattSettle/` berisi 24 file dokumentasi build bible berkelas standar GitHub, plus aset visual, arsipkan seluruh `docs/` lama, dengan loop validasi dan audit otomatis sampai final.

**Architecture:** Folder datar bernomor di root, tiap file satu fokus, template gaya bersama (banner, nav, footer) supaya konsisten. Validasi dilakukan lewat script lokal (scan em-dash, cek link, cek Mermaid) yang dijalankan tiap fase. Aset visual (banner SVG, diagram animated SVG dengan fallback GIF) disimpan lokal di `/WattSettle/assets/`.

**Tech Stack:** Markdown (GitHub Flavored), Mermaid, shields.io badges, SVG (SMIL), Node.js untuk script validasi (repo `web/` sudah punya Node), skill desain (frontend-design, huashu-design, high-end-visual-design), ponytail.

---

## Prinsip Eksekusi (berlaku semua task)

1. **Skill desain dimuat sekali di awal** (Task 1) dan diikuti untuk semua penulisan visual.
2. **Aturan karakter:** prosa bebas em-dash, en-dash, dan hyphen atau underscore sebagai pemisah kalimat. Kode, path, URL, identifier tetap utuh.
3. **Tiap file harus lulus 3 validasi** sebelum ditandai selesai: scan prosa bersih, semua link internal valid, semua blok Mermaid parse.
4. **Sumber kebenaran konten:** dokumen strategi lama (`docs/02`, `docs/03`, `docs/04`, `docs/01`, `docs/Codex Opsi 7 8/`) dan memory (`project-web3-hackathon-2026`, `ref-piggycell-depin`). Jangan mengarang angka. Jika ragu, tandai dengan catatan grounding.
5. **Ponytail:** styling kaya tetapi tidak berlebih. Aset dibuat hanya untuk flow kunci. Konten lebih penting dari dekorasi.
6. **Commit per fase** (bukan per file) supaya history bersih tetapi tidak spam. Commit hanya bila Gifari sudah mengizinkan commit di sesi ini; jika belum, kumpulkan diff dan lapor.

---

## Peta File dan Tanggung Jawab

```
Web3 Hackathon 2026/
├── WattSettle/                         👈 rumah dokumentasi aktif (BARU)
│   ├── README.md                       hub folder, peta baca, style guide ringkas
│   ├── 00 Ikhtisar.md
│   ├── 01 Latar Belakang.md
│   ├── 02 Konsep dan Cara Kerja.md
│   ├── 03 Arsitektur.md
│   ├── 04 Setup Lingkungan.md
│   ├── 05 Device dan Firmware.md
│   ├── 06 Kontrak WattSettle.md
│   ├── 07 AI Verifier.md
│   ├── 08 Tokenomics.md
│   ├── 09 Keamanan.md
│   ├── 10 Deployment dan On-chain Ops.md
│   ├── 11 Testing dan QA.md
│   ├── 12 Frontend dan dApp UI.md
│   ├── 13 Workflow Build.md
│   ├── 14 Bisnis dan GTM.md
│   ├── 15 Demo dan Pitch.md
│   ├── 16 Risiko dan Kill-shots.md
│   ├── 17 SWOT dan Kompetitor.md
│   ├── 18 Roadmap Pasca-Hackathon.md
│   ├── 19 Referensi.md
│   ├── 20 Glosarium.md
│   ├── 21 Checklist Submission.md
│   ├── 22 Decision Log.md
│   ├── assets/                         banner SVG, diagram, ikon, gif
│   └── _templates/                     potongan banner/nav/footer (opsional, referensi)
├── scripts/
│   └── docs-check.mjs                  validator: scan em-dash, link, mermaid (BARU)
├── docs/
│   ├── README.md                       diubah jadi penunjuk ke /WattSettle/
│   └── Archive/                        seluruh docs lama dipindah ke sini
└── README.md                           root hub, diarahkan ke /WattSettle/
```

---

## Task 1: Muat skill desain dan tetapkan sistem gaya

**Files:**
- Create: `WattSettle/README.md` (berisi style guide ringkas + hub)
- Create: `WattSettle/_templates/banner-nav-footer.md` (potongan referensi)

- [ ] **Step 1: Muat skill desain**

Invoke via Skill tool, satu per satu: `frontend-design`, lalu `huashu-design`, lalu `high-end-visual-design`. Ikuti arahannya untuk banner, hierarki visual, dan anti generic. Konfirmasi ketiganya termuat sebelum lanjut.

- [ ] **Step 2: Tetapkan palet dan peta emoji**

Palet brand (untuk badge shields.io dan tema Mermaid):
- watt hijau `22c55e` (approve, energi)
- flow cyan `06b6d4` (data, aliran)
- BNB gold `f0b90b` (chain, on-chain)
- riset ungu `a855f7` (analisa, referensi)
- bahaya merah `ef4444` (reject, peringatan, kill-shot)

Peta emoji per tema (dipakai konsisten): ⚡ energi/WattSettle · 🤖 AI verifier · 📄 kontrak · 🔌 device · 💸 settlement · 🚫 reject · 🏦 fee/tokenomics · 🔐 keamanan · 🚀 deploy · 🧪 testing · 🖥️ frontend · 🗓️ workflow · 🏢 bisnis · 🎤 pitch · ⚠️ risiko · 📊 SWOT · 🔭 roadmap · 📚 referensi · 🔤 glosarium · ✅ checklist · 🧭 decision.

- [ ] **Step 3: Buat template banner, nav, footer**

Tulis `WattSettle/_templates/banner-nav-footer.md` berisi 3 potongan yang dipakai ulang tiap file:

Banner (contoh, sesuaikan judul dan badge tiap file):
```html
<div align="center">

![Bab](https://img.shields.io/badge/BAB-00%20Ikhtisar-06b6d4?style=for-the-badge)
&nbsp;
![WattSettle](https://img.shields.io/badge/WattSettle-Build%20Bible-22c55e?style=for-the-badge)

# ⚡ Judul Bab

### Subjudul singkat

</div>
```

Nav (di bawah banner):
```markdown
**Navigasi:** [Hub](README.md) · [Sebelumnya](<...>.md) · [Berikutnya](<...>.md)
```

Footer (akhir tiap file):
```html
<div align="center">
<sub>© 2026 PT Surya Inovasi Prioritas (SURIOTA) · <a href="README.md">Hub WattSettle</a> · Update 7 Juli 2026</sub>
</div>
```

- [ ] **Step 4: Tulis `WattSettle/README.md`**

Isi: banner hub, ringkas apa itu folder ini, tabel 24 file dengan link dan satu baris deskripsi, style guide ringkas (palet, peta emoji, aturan karakter), diagram Mermaid urutan baca, footer. Ini juga jadi acuan konsistensi.

- [ ] **Step 5: Validasi awal**

Pastikan `WattSettle/README.md` render benar (mermaid parse, badge muncul), prosa bebas em-dash. Karena `docs-check.mjs` belum ada, cek manual dulu; validator dibuat di Task 2.

---

## Task 2: Buat script validator dokumentasi

**Files:**
- Create: `scripts/docs-check.mjs`

- [ ] **Step 1: Tulis validator**

`scripts/docs-check.mjs` (Node, tanpa dependency eksternal) melakukan 3 cek atas semua `.md` di `WattSettle/`:

```js
// Usage: node scripts/docs-check.mjs
// Cek 1: prosa bebas em-dash (—), en-dash (–). Abaikan baris di dalam blok kode ```...```.
// Cek 2: link markdown relatif [..](file) dan <a href="file"> menunjuk file yang ada.
// Cek 3: hitung blok ```mermaid dan pastikan tidak kosong (parse ringan: ada minimal 1 baris isi).
import { readdirSync, readFileSync, existsSync } from 'node:fs';
import { join, dirname, resolve } from 'node:path';

const ROOT = 'WattSettle';
const files = readdirSync(ROOT).filter(f => f.endsWith('.md'));
let errors = 0;
const strip = (s) => s.replace(/```[\s\S]*?```/g, ''); // buang blok kode utk cek prosa

for (const f of files) {
  const p = join(ROOT, f);
  const raw = readFileSync(p, 'utf8');
  const prose = strip(raw);
  // Cek 1
  for (const bad of ['—', '–']) {
    if (prose.includes(bad)) { console.error(`[dash] ${f} mengandung ${bad === '—' ? 'em-dash' : 'en-dash'} di prosa`); errors++; }
  }
  // Cek 2 (link relatif, lewati http dan anchor #)
  const links = [...raw.matchAll(/\]\(<?([^)>#][^)>]*)>?\)/g), ...raw.matchAll(/href="([^"#][^"]*)"/g)]
    .map(m => m[1]).filter(u => !/^https?:/.test(u));
  for (const u of links) {
    const target = resolve(dirname(p), decodeURIComponent(u));
    if (!existsSync(target)) { console.error(`[link] ${f} -> ${u} tidak ditemukan`); errors++; }
  }
  // Cek 3
  const mer = raw.match(/```mermaid\n([\s\S]*?)```/g) || [];
  for (const b of mer) { if (b.replace(/```mermaid|```/g, '').trim().length < 5) { console.error(`[mermaid] ${f} punya blok mermaid kosong`); errors++; } }
}
console.log(errors === 0 ? 'OK semua cek lulus' : `GAGAL ${errors} masalah`);
process.exit(errors === 0 ? 0 : 1);
```

- [ ] **Step 2: Jalankan validator atas README**

Run: `node scripts/docs-check.mjs`
Expected: lulus untuk file yang sudah ada (README), atau laporkan link ke file yang belum dibuat (wajar di tahap ini, jadi acuan progres).

- [ ] **Step 3: Self-check validator**

Tambahkan sementara satu em-dash palsu ke README, jalankan, pastikan terdeteksi, lalu hapus lagi. Ini membuktikan validator bekerja.

---

## Task 3: Arsipkan docs lama

**Files:**
- Move: `docs/01 Master Strategi.md`, `docs/02 Opsi 5 WattSettle.md`, `docs/03 Opsi 6 Enovatek.md`, `docs/04 SWOT Opsi 5 6.md`, `docs/Codex Opsi 7 8/` ke `docs/Archive/`
- Modify: `docs/README.md`

- [ ] **Step 1: Pindahkan file ke Archive**

Gunakan `git mv` bila memungkinkan supaya history terjaga. Pindahkan keempat file plus folder Codex ke `docs/Archive/`. Biarkan file yang sudah ada di `docs/Archive/`.

- [ ] **Step 2: Ubah `docs/README.md` jadi penunjuk**

Ganti isi jadi banner ringkas plus kalimat: dokumentasi aktif kini di `/WattSettle/`, folder `docs/` menyimpan arsip. Beri link ke `../WattSettle/README.md` dan ke `Archive/`.

- [ ] **Step 3: Verifikasi tidak ada link putus di file yang dipindah**

Cek link internal antar file arsip (mereka saling menautkan dengan path relatif, jadi tetap valid setelah pindah bersama). Perbaiki bila ada yang menunjuk keluar Archive.

---

## Task 4 sampai 8: Tulis file per fase (pola sama)

Setiap file mengikuti **pola task identik** berikut. Diulang untuk tiap file di fase.

**Pola per file:**

- [ ] **Step A: Kumpulkan sumber**

Baca bagian relevan dari dokumen strategi arsip dan memory. Catat angka dan fakta load bearing yang harus dipertahankan.

- [ ] **Step B: Draf file**

Tulis file dengan struktur wajib: banner, nav, (TOC bila panjang), isi bab sesuai brief spec, footer copyright. Sisipkan Mermaid untuk flow, tabel untuk banding, callout blockquote untuk catatan dan peringatan, badge untuk status.

- [ ] **Step C: Self-review konten**

Cek terhadap brief spec bab ini: semua sub-topik tercakup, tidak ada placeholder, angka konsisten dengan sumber, prosa bersih.

- [ ] **Step D: Jalankan validator**

Run: `node scripts/docs-check.mjs`
Expected: 0 masalah untuk file ini (dash bersih, link valid, mermaid parse).

- [ ] **Step E: Perbaiki bila gagal, ulangi D sampai lulus.**

### Fase 1 (Task 4): Orientasi dan Fondasi

Brief isi tiap file:
- `00 Ikhtisar.md` — apa itu WattSettle satu paragraf, diagram one loop (Reading, Attestation, Settlement), tabel keputusan kunci, status terkini (kontrak 6 test PASS, token deployed, website live), link ke bab lanjutan.
- `01 Latar Belakang.md` — oracle problem untuk kerja fisik, konteks hackathon (track, tema, timeline resmi), kenapa SURIOTA (hardware, energy map, Hermes), moat 5 hal langka, pasar (M2M, DePIN, meter Indonesia) dan regulasi (CBAM 1 Jan 2026, OJK, PR 110/2025).
- `02 Konsep dan Cara Kerja.md` — mental model rel settlement, struct Reading dan Attestation dijelaskan naratif, one loop end to end dengan Mermaid sequence, kenapa meter adalah transaksi (no oracle gap).

### Fase 2 (Task 5): Teknis inti build

Brief isi tiap file:
- `03 Arsitektur.md` — 3 layer (physical edge, settlement contract, autonomous verifier) dengan Mermaid, dependency, zero external runtime di critical path, jalur scaling opBNB (roadmap, bukan demo).
- `04 Setup Lingkungan.md` — prasyarat, install Foundry (Git Bash), setup wallet Rabby, faucet tBNB, clone repo, `cd proofofwatt && forge test` sampai 6 test hijau, troubleshooting umum.
- `05 Device dan Firmware.md` — peran SRT-MGATE-1210 dan PM20H20Q, EIP-712 domain dan Reading typehash, cara device menandatangani, rencana menangkap 1 signature nyata untuk demo (kill shot 3), mocked for demo namun signer nyata.
- `06 Kontrak WattSettle.md` — evolve bukan rewrite, bagian yang JANGAN disentuh (`submitReading`, guards), struct Attestation, fungsi `attestAndSettle` dengan kode Solidity, SafeERC20, ReentrancyGuard, solvency check, fee split, reputation, error khusus, NatSpec.
- `07 AI Verifier.md` — Hermes agent Python, subscribe `ReadingSubmitted` via web3.py, recompute `kwhDeltaVsBaseline` dan anomaly, build Attestation, panggil `attestAndSettle` cron zero click, integrasi `validationResponse` ke ERC-8004 live, seksi Indexing (direct event scan, no subgraph, YAGNI), seksi keputusan API (BscScan first, no REST di critical path), determinism.
- `08 Tokenomics.md` — `suriota` default vs MockUSD cadangan, kenapa reuse, fee bps on-chain, pre-fund reward pool kira kira 500k sebelum demo (payout `transfer` dari saldo kontrak), framing utility bukan security, pelajaran dari PiggyCell (backed by real activity).
- `09 Keamanan.md` — threat model ringkas, EIP-712 replay guard dan monotonic ts, reentrancy dan checks effects interactions, role VERIFIER, key management device dan agent, testnet only untuk secret, carve out ponytail (keamanan tidak dipangkas).
- `10 Deployment dan On-chain Ops.md` — deploy ke testnet 97 dengan Foundry, `forge verify-contract`, kebutuhan wallet dan gas, state on chain aktual (alamat wallet, token suriota), pre-fund pool, fire minimal 2 tx dan simpan URL, night before checklist as code.
- `11 Testing dan QA.md` — filosofi TDD pada delta, test matrix kira kira 14 test (daftar nama test konkret), Foundry unit plus reentrancy mock, e2e rehearsal loop 20x, kaitannya dengan gate hygiene.
- `12 Frontend dan dApp UI.md` — keputusan BscScan sebagai UI utama plus halaman viewer tipis (field clip plus attestation decoded), kenapa minimal dApp (ponytail), relasi dengan website pitch `web/`, apa yang ditampilkan saat demo.

### Fase 3 (Task 6): Eksekusi dan Bisnis

Brief isi tiap file:
- `13 Workflow Build.md` — TULANG PUNGGUNG. Tabel besar per sesi (1 sampai 9 plus September): topik workshop, task WattSettle, bab rujukan, deliverable, gate yang ditutup. Tambah catatan mentor per blok sesi. Gate hygiene checklist ringkas. Prinsip commit harian genuine dan scope freeze.
- `14 Bisnis dan GTM.md` — razor and blades, tabel revenue streams, after sales (5 poin struktural), GTM 6 langkah, market anchor sebagai ceiling, use case Enovatek PM20H20Q Cooling as a Service dengan Mermaid aliran nilai.
- `15 Demo dan Pitch.md` — pitch arc 3 menit tabel beat, memorable line, runbook determinism (pre seed, video fallback, pin confirmed tx, two tab), 3 killer Q and A, know your judges (Yeheskiel OwnaFarm, Oktavianus zkPull, mentor lain), MockUSD escape hatch.

### Fase 4 (Task 7): Risiko, Posisi, Lampiran

Brief isi tiap file:
- `16 Risiko dan Kill-shots.md` — 6 kill shot dengan risiko dan fix wajib, path to 90 berurut leverage, probabilitas jujur (nominasi 84 sampai 90, juara 45 sampai 58).
- `17 SWOT dan Kompetitor.md` — SWOT opsi 5 dan 6 (quadrant tabel), peta kompetitor (WeatherXM, Arkreen, Powerledger, GenLayer dan UMA dan Kleros, PiggyCell), verdict posisi, celah moat 5 hal.
- `18 Roadmap Pasca-Hackathon.md` — batas scope freeze hackathon, roadmap produk (WattBond, device NFT financing ala PiggyCell Dominate to Earn, VeriFaktur, white label), tie ke selera juri RWA.
- `19 Referensi.md` — PiggyCell (ringkas dari memory plus link), zkPull, OwnaFarm, ERC-8004 dan BEP-620 (alamat CC0), x402, source ledger sumber terverifikasi.
- `20 Glosarium.md` — tabel istilah dan singkatan (DePIN, RWA, EIP-712, ERC-8004, x402, attestation, oracle gap, M2M, CBAM, MRV, dll).
- `21 Checklist Submission.md` — tick list hidup hard gate dengan kolom bukti link (deploy, verify, minimal 2 tx, open source commit history, README, roadmap, video, tweet exact handle plus hashtag).
- `22 Decision Log.md` — tabel keputusan bertanggal dengan alasan (ide 5 plus 6, nama WattSettle, token suriota, tooling Foundry plus OZ, track Finance, posisi vs PiggyCell, struktur docs).

---

## Task 9: Aset visual dan motion

**Files:**
- Create: `WattSettle/assets/*.svg`, `WattSettle/assets/*.gif` (flow kunci saja)

- [ ] **Step 1: Identifikasi flow kunci yang butuh gerak**

Maksimal 3: (a) one loop settlement (Reading ke Attestation ke Settlement), (b) approve vs reject di verifier, (c) aliran nilai Enovatek. Sisanya cukup Mermaid statis.

- [ ] **Step 2: Buat banner SVG folder (opsional, ponytail)**

Bila skill desain menyarankan banner hero, buat 1 SVG banner untuk `README` hub. Jangan lebih dari perlu.

- [ ] **Step 3: Buat animated SVG untuk flow kunci**

SVG SMIL (`<animate>`) untuk 1 sampai 3 flow. Simpan di `assets/`. Referensikan lewat `<img src="assets/loop.svg">` di bab terkait (`00`, `02`, `07`, `14`).

- [ ] **Step 4: Buat fallback GIF**

Karena animasi SVG tidak selalu render di GitHub, render tiap animated SVG jadi GIF (via headless browser di `web/` toolchain atau tool yang tersedia). Bila tooling GIF tidak tersedia di lingkungan, catat sebagai keterbatasan dan pertahankan Mermaid plus SVG. Jangan blokir seluruh plan karena ini.

- [ ] **Step 5: Verifikasi aset dirujuk dengan path relatif dan file ada**

Run: `node scripts/docs-check.mjs`
Expected: 0 link putus untuk aset.

---

## Task 10: Update hub root dan pemetaan

**Files:**
- Modify: `README.md` (root)

- [ ] **Step 1: Arahkan README root ke /WattSettle/**

Perbarui tabel Fokus Aktif: tunjuk ke `WattSettle/README.md` dan bab kunci, bukan lagi ke `docs/`. Perbarui Peta Direktori (tambah `WattSettle/`, tandai `docs/` sebagai arsip). Pertahankan bagian state on chain, roadmap, cara jalan.

- [ ] **Step 2: Validasi link root**

Cek manual link dari `README.md` root ke `WattSettle/` valid. (Validator fokus ke folder WattSettle, jadi link root dicek manual atau perluas script bila perlu.)

---

## Task 11: Audit menyeluruh dan loop perbaikan (self improvement)

**Files:** semua `WattSettle/*.md`

- [ ] **Step 1: Jalankan validator penuh**

Run: `node scripts/docs-check.mjs`
Expected: `OK semua cek lulus`. Bila gagal, perbaiki dan ulangi.

- [ ] **Step 2: Audit kualitas per file lewat subagent (adversarial)**

Untuk tiap file (atau batch), dispatch subagent review dengan instruksi: cek akurasi fakta vs dokumen strategi arsip, kelengkapan vs brief spec, kepatuhan gaya (banner, nav, footer, badge, emoji konsisten), keterbacaan, dan tidak ada em-dash atau en-dash di prosa. Subagent mengembalikan daftar temuan.

- [ ] **Step 3: Terapkan temuan**

Gunakan superpowers:receiving-code-review untuk menilai tiap temuan (terima yang benar, tolak yang keliru dengan alasan). Perbaiki file.

- [ ] **Step 4: Ulangi Step 1 sampai 3 sampai audit bersih**

Loop berhenti ketika validator lulus dan audit tidak menemukan temuan material.

- [ ] **Step 5: Cek render akhir**

Pastikan Mermaid parse (mmdc bila tersedia, atau inspeksi manual), badge tampil, `<details>` dan tabel benar, aset muncul. Catat hasil sebagai bukti (verification-before-completion).

- [ ] **Step 6: Ringkas dan lapor**

Laporkan: 24 file selesai, hasil validator, ringkasan audit, daftar aset, keterbatasan (mis. GIF), dan diff untuk direview Gifari sebelum commit.

---

## Self-Review Plan (dijalankan penyusun plan)

**Spec coverage:** tiap bab di manifes spec punya task penulisan (Task 4 sampai 7). Arsip (spec bagian 4) = Task 3. Gaya (spec bagian 5) = Task 1 plus validator Task 2. Motion (spec 5.3) = Task 9. Pemetaan sesi (spec 7) = file `13` di Task 6. Skill implementasi (spec 8) = Task 1 plus Task 11. Urutan eksekusi (spec 9) = fase Task 4 sampai 10. DoD (spec 10) = Task 11. Tidak ada gap.

**Placeholder scan:** brief per file berisi topik konkret, bukan TODO. Kode validator lengkap. Tidak ada "isi nanti".

**Type consistency:** nama file, palet, peta emoji, dan nama script (`scripts/docs-check.mjs`) dipakai konsisten di semua task.

---

<div align="center">
<sub>© 2026 PT Surya Inovasi Prioritas (SURIOTA) · Plan implementasi dokumentasi WattSettle · 7 Juli 2026</sub>
</div>
