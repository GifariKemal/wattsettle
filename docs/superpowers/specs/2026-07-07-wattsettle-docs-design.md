# Spec Desain: Dokumentasi WattSettle (Build Bible)

**Tanggal:** 7 Juli 2026
**Penyusun:** Gifari Kemal Suryo (SURIOTA) bersama Claude
**Status:** Draf untuk direview sebelum writing-plans
**Proyek:** Indonesia Web3 Hackathon 2026, entri WattSettle

---

## 1. Tujuan dan Ruang Lingkup

Bangun satu rumah dokumentasi tunggal untuk WattSettle di folder root `/WattSettle/`, berupa **build bible internal yang mendalam**: bukan sekadar ringkasan strategi, melainkan latar belakang, konsep, workflow, spec teknis, dan runbook yang cukup detail untuk dipakai membangun proyek dari nol sampai Demo Day.

Karakter dokumen:
- Pembaca utama adalah builder (Gifari dan tim), bukan juri. Juri cukup melihat website dan README repo.
- Menyatukan sekaligus memperdalam konten dari dokumen strategi lama, ditambah konten build yang baru.
- Selaras penuh dengan 9 sesi workshop, sehingga tiap sesi punya bab rujukan yang konkret.
- Bahasa Indonesia untuk narasi, English untuk istilah teknis dan kode.

Di luar ruang lingkup: mengubah kode kontrak, website, atau firmware. Spec ini hanya soal dokumentasi.

---

## 2. Keputusan yang Sudah Dikunci

Diringkas di sini, detail penuh nanti di `22 Decision Log.md`.

| Topik | Keputusan |
|:--|:--|
| Ide | Opsi 5 plus 6 digabung |
| Nama produk | **WattSettle** (Enovatek adalah use case demo, bukan nama produk) |
| Token | `suriota` sebagai default, MockUSD sebagai cadangan swap satu baris |
| Tooling | Foundry plus OpenZeppelin Contracts (import langsung), bukan Wizard |
| Track | Finance and Commerce (AI Agents sebagai fallback sah) |
| Chain | BSC testnet, chainId 97, UI utama memakai BscScan |
| Lokasi folder docs | root `/WattSettle/` |
| Nasib docs lama | seluruh isi `docs/` termasuk Codex dipindah ke `docs/Archive/` |

---

## 3. Struktur Folder dan Manifes 24 File

Folder: `/WattSettle/` di root workspace, sejajar dengan `proofofwatt/` dan `web/`.
Aset visual: `/WattSettle/assets/` (svg, gif, ikon, banner).

Penomoran file berurutan, memakai spasi sebagai pemisah (konsisten dengan gaya penamaan docs yang sudah ada, sekaligus menghindari hyphen di nama file).

### Orientasi

| File | Isi inti | Sesi terkait |
|:--|:--|:--:|
| `README.md` | Hub folder: peta baca, status proyek, quick nav, ringkas keputusan | semua |
| `00 Ikhtisar.md` | TL;DR: apa itu WattSettle, satu loop, keputusan kunci, status terkini | semua |

### Fondasi

| File | Isi inti | Sesi terkait |
|:--|:--|:--:|
| `01 Latar Belakang.md` | Oracle problem energi, konteks hackathon, kenapa SURIOTA, moat 5 hal, pasar dan regulasi (CBAM, OJK) | 8 |
| `02 Konsep dan Cara Kerja.md` | Konsep inti, mental model, one loop data flow (Reading, Attestation, Settlement) | 2 |

### Teknis (inti build)

| File | Isi inti | Sesi terkait |
|:--|:--|:--:|
| `03 Arsitektur.md` | 3 layer (physical, settlement, verifier), diagram, dependency, jalur opBNB | 8 |
| `04 Setup Lingkungan.md` | Getting started: install Foundry, wallet Rabby, faucet tBNB, clone repo, `forge test` pertama | 1 |
| `05 Device dan Firmware.md` | SRT-MGATE-1210 dan PM20H20Q, EIP-712 signing, tangkap 1 signature nyata (kill shot 3) | 5 |
| `06 Kontrak WattSettle.md` | Evolve ProofOfWatt, struct Attestation, `attestAndSettle`, SafeERC20, ReentrancyGuard, fee, reputation | 2, 3, 4 |
| `07 AI Verifier.md` | Hermes agent, listen event, recompute delta dan anomaly, cron zero click, integrasi ERC-8004, seksi Indexing (sesi 5) dan keputusan API (sesi 6) | 5, 6 |
| `08 Tokenomics.md` | `suriota` vs MockUSD, fee split, pre-fund pool, framing utility bukan security | 3 |
| `09 Keamanan.md` | Threat model, EIP-712 replay dan monotonic, reentrancy, roles, key management | 4 |
| `10 Deployment dan On-chain Ops.md` | Deploy testnet 97, `forge verify-contract`, wallet dan gas, state on chain, minimal 2 tx | 1, 6 |
| `11 Testing dan QA.md` | TDD, test matrix kira kira 14 test, Foundry plus e2e, rehearsal loop | 3, 4 |
| `12 Frontend dan dApp UI.md` | Pendekatan UI demo: BscScan sebagai UI plus viewer tipis, keputusan minimal dApp | 7 |

### Eksekusi dan Bisnis

| File | Isi inti | Sesi terkait |
|:--|:--|:--:|
| `13 Workflow Build.md` | Playbook per sesi (tulang punggung): tiap sesi ke topik workshop, task WattSettle, link bab, deliverable, gate | semua |
| `14 Bisnis dan GTM.md` | Razor and blades, revenue streams, after sales, GTM, market anchor, use case Enovatek PM20H20Q (Cooling as a Service) | 8 |
| `15 Demo dan Pitch.md` | Pitch arc 3 menit, runbook determinism, killer Q and A, fallback video, know your judges (mentor sebagai juri) | 9 |

### Risiko dan Posisi

| File | Isi inti | Sesi terkait |
|:--|:--|:--:|
| `16 Risiko dan Kill-shots.md` | 6 kill shot plus fix, path to 90, probabilitas jujur | 8, 9 |
| `17 SWOT dan Kompetitor.md` | SWOT opsi 5 dan 6, peta kompetitor (WeatherXM, Arkreen, Powerledger, PiggyCell), verdict | 8 |
| `18 Roadmap Pasca-Hackathon.md` | WattBond, device NFT financing, VeriFaktur, white label, batas scope freeze | 8 |

### Lampiran

| File | Isi inti | Sesi terkait |
|:--|:--|:--:|
| `19 Referensi.md` | PiggyCell, zkPull, OwnaFarm, ERC-8004 dan BEP-620, x402, source ledger | semua |
| `20 Glosarium.md` | Istilah teknis dan singkatan | semua |
| `21 Checklist Submission.md` | Tick list hidup hard gate (deploy, verify, minimal 2 tx, README, video, tweet tag) | 9 |
| `22 Decision Log.md` | Keputusan kunci plus alasan (kenapa suriota, track Finance, nama WattSettle, posisi vs PiggyCell) | semua |

Total: `README` plus 23 bab bernomor sama dengan **24 file**.

Sumber konten: bab strategi mengambil dan memperdalam dari `docs/02 Opsi 5 WattSettle.md`, `docs/03 Opsi 6 Enovatek.md`, `docs/04 SWOT Opsi 5 6.md`, dan `docs/01 Master Strategi.md` (yang akan diarsip). Bab build (`04`, `05`, `07`, `10`, `11`, `12`) sebagian besar konten baru. Referensi PiggyCell mengambil dari memory `ref-piggycell-depin`.

---

## 4. Rencana Arsip

1. Pindahkan seluruh file dan folder dalam `docs/` ke `docs/Archive/`:
   - `01 Master Strategi.md`, `02 Opsi 5 WattSettle.md`, `03 Opsi 6 Enovatek.md`, `04 SWOT Opsi 5 6.md`, folder `Codex Opsi 7 8/`.
   - File yang sudah di `docs/Archive/` tetap di tempat.
2. `docs/README.md` diubah menjadi penunjuk singkat: "dokumentasi aktif pindah ke `/WattSettle/`, folder ini kini arsip".
3. `README.md` root diperbarui: tabel Fokus Aktif dan Peta Direktori menunjuk ke `/WattSettle/`, bukan lagi ke `docs/`.
4. Tiap file yang dipindah tidak perlu diberi banner arsip ulang (folder Archive sudah menandakan statusnya), cukup pastikan link internal tidak putus atau diarahkan.

---

## 5. Konvensi Gaya dan Kualitas Visual (standar GitHub)

Target: markdown berkelas, terstruktur, enak dibaca, dan render sempurna di GitHub.

### 5.1 Struktur tiap file
- **Banner header**: baris badge shields.io (judul, kategori, status) di dalam `<div align="center">`.
- **Judul dan subjudul** dengan hierarki heading yang jelas.
- **Navigasi**: baris link ke hub, bab sebelumnya, bab berikutnya di bawah banner.
- **Daftar isi** (TOC) untuk file panjang.
- **Footer**: copyright plus link hub plus tanggal update, dalam `<div align="center">` dengan `<sub>`.

### 5.2 Elemen visual yang dipakai (semua GitHub safe)
- **Badge**: shields.io `for-the-badge`, palet brand konsisten: watt hijau `22c55e`, flow cyan `06b6d4`, BNB gold `f0b90b`, riset ungu `a855f7`, bahaya merah untuk peringatan.
- **Ikon dan label**: emoji semantik yang konsisten per tema (peta emoji ditetapkan di `README` folder), plus ikon SVG lokal bila perlu penanda khusus.
- **Tabel**: untuk perbandingan, matrix skor, pemetaan sesi, spec field.
- **Workflow dan diagram**: Mermaid (flowchart, sequenceDiagram, stateDiagram, gantt) yang render native di GitHub.
- **Kartu dan widget**: pakai `<table>`, `<div align>`, `<details>` collapsible, dan blockquote callout (`> 💡 catatan`, `> ⚠️ peringatan`) sebagai pengganti card berwarna.
- **Penekanan teks**: **bold** untuk istilah kunci, *italic* untuk nuansa, `code` untuk identifier, `<kbd>` untuk tombol atau perintah singkat.
- **Warna**: disampaikan lewat badge, tema Mermaid, dan aset SVG. GitHub membersihkan CSS pada markdown, jadi warna teks arbitrer tidak dipakai.

### 5.3 Motion dan animasi
- **Flow statis**: Mermaid untuk menggambarkan alur (paling andal di GitHub).
- **Gerak**: animated SVG (SMIL) direferensikan lewat `<img src="assets/....svg">` untuk diagram alur yang bergerak. Karena dukungan animasi SVG di GitHub tidak selalu konsisten, sediakan **fallback animated GIF** untuk setiap animasi penting.
- Semua aset gerak disimpan di `/WattSettle/assets/` dan dirujuk dengan path relatif.
- Prinsip: animasi hanya untuk memperjelas flow (input, proses, output), bukan dekorasi berlebih.

### 5.4 Aturan karakter anti-alien
- Di **prosa dan kalimat**: dilarang memakai em-dash, en-dash, serta hyphen atau underscore sebagai pemisah antar kalimat atau antar klausa. Gunakan koma, titik, atau kata sambung seperti "sampai", "hingga".
- Di **kode, path, URL, dan identifier**: karakter `-` dan `_` tetap dipakai apa adanya karena itu sintaks yang benar (contoh `attestAndSettle`, `ERC-8004`, `SafeERC20`, `forge verify-contract`, `chainId 97`, tautan shields.io). Ini bukan pelanggaran.
- Konsisten dengan pola `declean.py` yang sudah dipakai di docs lama. QA akhir memeriksa prosa bersih dari em-dash dan en-dash.

### 5.5 Copyright dan aset
- Footer copyright standar tiap file: `© 2026 PT Surya Inovasi Prioritas (SURIOTA)` plus link hub plus tanggal update.
- Aset self contained di `/WattSettle/assets/`, tidak hotlink eksternal kecuali badge shields.io yang memang layanan badge standar.
- Bila butuh ikon atau ilustrasi, buat atau unduh dulu, simpan lokal, baru dirujuk.

---

## 6. Kendala GitHub (jujur)

GitHub markdown membersihkan `<script>`, `<style>`, dan event handler. Konsekuensi:
- Tidak ada animasi berbasis JavaScript atau CSS di markdown, tidak ada hover, tidak ada font kustom, tidak ada warna teks arbitrer.
- Yang render: badge, Mermaid, tabel, subset HTML (`<div align>`, `<table>`, `<details>`, `<img>`, `<sub>`, `<sup>`, `<kbd>`), emoji, gambar lokal (png, gif, svg via `<img>`), animated GIF, dan sebagian animated SVG (SMIL).
- Strategi motion mengikuti kendala ini: Mermaid untuk flow statis, animated SVG atau GIF untuk gerak.

---

## 7. Pemetaan ke 9 Sesi Workshop

| Sesi | Topik workshop | Bab rujukan | Deliverable WattSettle |
|:--:|:--|:--|:--|
| 1 | Environment plus First Deploy | `04 Setup Lingkungan`, `10 Deployment` | Env siap, repo public, deploy pertama |
| 2 | Solidity via Guestbook | `02 Konsep`, `06 Kontrak` | Struct Attestation plus event (TDD red) |
| 3 | Foundry plus Token plus Bounty Board | `06 Kontrak`, `08 Tokenomics`, `11 Testing` | `attestAndSettle`, 6 test lama hijau |
| 4 | Full Bounty plus Security | `06 Kontrak`, `09 Keamanan`, `11 Testing` | SafeERC20, ReentrancyGuard, fee, test security |
| 5 | Reading the Chain plus Indexing | `05 Device`, `07 AI Verifier` (Indexing) | Agent listen event, recompute delta |
| 6 | API plus AI Auto-verify | `07 AI Verifier` (API), `10 Deployment` | Agent panggil `attestAndSettle` cron, deploy testnet |
| 7 | Frontend dApp UI | `12 Frontend dan dApp UI` | Viewer tipis plus BscScan, minimal 2 tx |
| 8 | AI Integration plus Scope Ideas | `07 AI Verifier`, `16 Kill-shots`, `18 Roadmap` | Integrasi ERC-8004 live, scope freeze |
| 9 | Pitch plus Demo Day | `15 Demo dan Pitch`, `21 Checklist` | Pitch deck, video fallback, gate ditutup |

---

## 8. Catatan Implementasi (skill dan tools saat eksekusi)

Saat penulisan visual berjalan (fase implementasi, bukan sekarang), muat dan ikuti:
- `frontend-design` plus `huashu-design` plus satu taste skill (`high-end-visual-design` atau `design-taste-frontend`) untuk arah desain banner dan aset.
- Bila perlu aset gambar: pertimbangkan `brandkit` atau imagegen skill, atau buat SVG tangan.
- Ponytail tetap berlaku: styling kaya tetapi tidak over-engineer, aset seperlunya, konten lebih penting dari dekorasi.
- QA render: cek sintaks Mermaid, validasi SVG, cek prosa bebas em-dash dan en-dash (script), cek semua link antar file valid, preview render.

---

## 9. Urutan Eksekusi (nanti dirinci di writing-plans)

1. **Fase 0**: arsipkan `docs/` ke `docs/Archive/`, scaffold folder `/WattSettle/` plus `/WattSettle/assets/`, tetapkan peta emoji dan palet di `README`.
2. **Fase 1**: tulis Orientasi dan Fondasi (`README`, `00`, `01`, `02`).
3. **Fase 2**: tulis Teknis (`03` sampai `12`).
4. **Fase 3**: tulis Eksekusi dan Bisnis (`13`, `14`, `15`).
5. **Fase 4**: tulis Risiko, Posisi, dan Lampiran (`16` sampai `22`).
6. **Fase 5**: buat aset dan motion (Mermaid sudah inline, tambah animated SVG atau GIF di flow kunci), jalankan QA, perbarui `README` root dan `docs/README`.

---

## 10. Definition of Done

- 24 file ada di `/WattSettle/`, saling terhubung lewat nav dan link yang valid.
- Prosa bebas em-dash dan en-dash, kode dan path tetap utuh.
- Mermaid render di semua bab yang memakainya, minimal flow kunci punya animated SVG atau GIF.
- Aset tersimpan lokal di `/WattSettle/assets/`.
- Tiap file punya banner, nav, dan footer copyright SURIOTA.
- `README` root dan `docs/README` diperbarui, seluruh `docs/` lama (termasuk Codex) sudah di `docs/Archive/`.
- Selaras dengan 9 sesi workshop sesuai tabel pemetaan.

---

<div align="center">
<sub>© 2026 PT Surya Inovasi Prioritas (SURIOTA) · Spec desain dokumentasi WattSettle · 7 Juli 2026</sub>
</div>
