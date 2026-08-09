# Materi Online Workshop - Indonesia Web3 Hackathon 2026

Arsip lokal materi 6 sesi Online Workshop (DevWeb3 Jogja). Mentor sesi 1-4: Axel
Urwawuska Atarubby (@lexilexy) dan Yeheskiel Yunus Tame (@yeheskieltame). Mentor
sesi 5-8: Fajar Jati Nugroho (@Beatless16) dan Fajar Ramadhan (@xfajarrr).

> [!NOTE]
> Halaman Notion dikonversi ke Markdown lewat record-map Notion (proxy splitbee
> untuk sesi 2-4 pada 26 Juli 2026, lalu internal API loadPageChunk plus
> syncRecordValues untuk sesi 5 pada 3 Agustus 2026 dan sesi 6 pada 9 Agustus
> 2026, karena splitbee sudah 500).
> Isi mengikuti versi saat konversi, jadi kalau mentor mengedit Notion setelah
> tanggal tersebut, file di sini tidak ikut berubah.

## Isi direktori

> [!NOTE]
> Dua slide PDF mentor (Sesi 1 sebesar 37,6 MB dan Sesi 2 sebesar 15 MB) hanya
> ada sebagai arsip lokal, tidak di-commit. Keduanya materi pihak ketiga dan
> repo ini publik, jadi ukurannya dijaga tetap ringan. Pola `docs/Workshop/*.pdf`
> ada di `.gitignore`. Unduh ulang dari folder Drive sesi terkait bila perlu.

| File | Sesi | Sumber |
|---|---|---|
| Sesi 1 Materi Presentasi.pdf (lokal saja) | 1 | Drive, 22 halaman |
| [Sesi 1 Catatan Gemini.md](Sesi%201%20Catatan%20Gemini.md) | 1 | Drive, notes plus transkrip penuh |
| Sesi 2 Setup Foundry.pdf (lokal saja) | 2 | Drive, 12 halaman |
| [Sesi 2 Catatan Gemini.md](Sesi%202%20Catatan%20Gemini.md) | 2 | Drive, notes plus transkrip penuh |
| [Sesi 2 Foundry dan Dasar Solidity.md](Sesi%202%20Foundry%20dan%20Dasar%20Solidity.md) | 2 | Notion, 3 tab |
| [Sesi 3 Papan Sayembara Bounty.md](Sesi%203%20Papan%20Sayembara%20Bounty.md) | 3 | Notion, 3 tab |
| [Sesi 4 Factory dan AI Oracle.md](Sesi%204%20Factory%20dan%20AI%20Oracle.md) | 4 | Notion, 2 tab |
| [Sesi 5 Backend Reading Chain dan Indexing.md](Sesi%205%20Backend%20Reading%20Chain%20dan%20Indexing.md) | 5 | Notion, 1 halaman (custom backend plus Ponder) |
| [Sesi 6 API dan AI Auto-verify.md](Sesi%206%20API%20dan%20AI%20Auto-verify.md) | 6 | Notion, 1 halaman (API relayer plus juri AI) |

## Jadwal dan tautan asli

### Sesi 1 - Foundations 1: Environment dan First Deploy

- Tanggal: Minggu, 5 Juli 2026, 19.30-21.30 WIB
- Presentasi (Canva): https://canva.link/hjw99edkhrx50d1
- Rekaman (Drive): https://drive.google.com/file/d/1zRO0s62oNpI8vJS9l8H2YjLIjIpaJwRq/view
- YouTube: https://www.youtube.com/live/QJ96FXrhbn4
- Folder Drive: https://drive.google.com/drive/folders/1cZBou9cVGc15lLQ4i27iR0YV1zD7QM54
- Notion: tidak ada (sesi ini hanya pakai Canva)

### Sesi 2 - Foundations 2: Solidity via a Guestbook

- Tanggal: Minggu, 12 Juli 2026, 19.30-21.30 WIB
- Judul Notion: Pertemuan 2: Foundry dan Dasar Solidity
- Notion: https://app.notion.com/p/Pertemuan-2-Foundry-Dasar-Solidity-39683efb869d817e9ecddda0753b856b
- Rekaman (Drive): https://drive.google.com/file/d/1VperwltYMFiyn5K89Ljn2qNVZSKIzztX/view
- YouTube: https://youtube.com/live/VyxD-Sq-VP4
- Folder Drive: https://drive.google.com/drive/folders/1poQIt3KQ3zxIJ1JCMXrJqu0odu41lxfA

### Sesi 3 - Smart Contract 1: Foundry, Token, Bounty Board

- Tanggal: Minggu, 19 Juli 2026, 19.30-21.30 WIB
- Judul Notion: Pertemuan 3: Papan Sayembara (Bounty)
- Notion: https://app.notion.com/p/Pertemuan-3-Papan-Sayembara-Bounty-39683efb869d813e894fdc9769577e6d
- Presentasi (Canva): https://canva.link/d7znygtsbkf3uo3
- YouTube: https://youtube.com/live/8y3fVy4xesc
- Rekaman dan folder Drive: belum dibagikan panitia

### Sesi 4 - Smart Contract 2: Full Bounty dan Security

- Tanggal: Minggu, 26 Juli 2026, 19.30-21.30 WIB
- Judul Notion: Pertemuan 4: Factory dan AI Oracle
- Notion: https://app.notion.com/p/Pertemuan-4-Factory-AI-Oracle-3a583efb869d81f18a34eceeb08d6b57
- Presentasi (Canva): https://canva.link/n2j5cx6u43zd0lm
- YouTube: https://youtube.com/live/XiJD3ggNdNQ
- Rekaman dan folder Drive: belum dibagikan panitia

### Sesi 5 - Backend 1: Reading the Chain dan Indexing

- Tanggal: Minggu, 2 Agustus 2026, 19.30-21.30 WIB
- Judul Notion: Sesi 5: Reading the Chain + Indexing (page id b5195160-5d98-83d4-af92-015b11a35fa0)
- Notion: https://butternut-pawpaw-7ed.notion.site/Welcome-Builders-052951605d9883c5ba6801d77707f7ed (halaman induk, page id 052951605d9883c5ba6801d77707f7ed; halaman sesi ada di dalam database "Rundown" di halaman itu)
- YouTube: https://youtube.com/live/YnNGFCMSRIw
- Materi: dua pendekatan indexing kontrak Sesi 4 (BountyFactory + BountyEscrow di chain 97). (1) Custom backend Bun plus Hono plus viem plus SQLite (REST API). (2) Ponder framework (GraphQL). Catatan Windows: WSL/Linux tidak didemokan, pasang sendiri dulu.
- Rekaman dan folder Drive: belum dibagikan panitia

### Sesi 6 - Backend 2: API dan AI Auto-verify

- Tanggal: Minggu, 9 Agustus 2026, 19.30-21.30 WIB
- Judul Notion: Sesi 6: API + AI Auto-verify (page id 22295160-5d98-8274-a712-81cde7dcc2f2)
- Notion: https://app.notion.com/p/Sesi-6-API-AI-Auto-verify-222951605d988274a71281cde7dcc2f2
- Presentasi (Canva): https://canva.link/w6xtc81jlxb0qud
- YouTube: https://youtube.com/live/MQjqcPCOZgQ
- Google Meet: https://meet.google.com/axr-bijz-wyi
- Materi: Part 1 endpoint baca baru (`/pending`, `/leaderboard`, `/verdicts`) plus endpoint tulis pola relayer. Part 2 juri AI (LLM menilai bukti terhadap aturan, putusan dikirim on-chain lewat `fulfillVerification`). Catatan Windows: WSL/Linux tidak didemokan, pasang sendiri dulu.
- Berkas pendukung mentor: [DEMO-RULES.md](https://raw.githubusercontent.com/DevWeb3Jogja/boootcamp-indonesia-web3-hacathon/da87a895de207bb6cea797a4e52d6903216fa15a/DEMO-RULES.md) (aturan bounty contoh) dan [PROOF.md](https://gist.githubusercontent.com/FjrREPO/3f704cf309365d851eb6f2efbd9ec190/raw/03fe854b1547265f6d9a6d21e136fed5dec86442/PROOF.md) (bukti contoh yang lolos)
- Rekaman dan folder Drive: belum dibagikan panitia

> [!CAUTION]
> Materi asli Sesi 6 memuat API key OpenAI milik mentor secara terbuka di blok
> `.env`. Key itu sudah disensor di arsip lokal ini dan tidak pernah dipakai.
> Isi `LLM_API_KEY` dengan key sendiri.

## Repo kode mentor

https://github.com/devweb3jogja/boootcamp-indonesia-web3-hacathon (clone lokal di
WSL: `~/ref-bootcamp-web3`). Commit terakhir `sesi 4: BountyFactory + AI oracle`
(2 Agustus 2026), jadi kode Sesi 5 (backend/indexing) belum di-push mentor. Perlu
`git fetch` ulang beberapa hari setelah workshop.

Implementasi milik SURIOTA ada di `~/reward-token` (WSL):

- `11dec4c` Sesi 3: RewardToken plus BountyEscrow, 38 test
- `2c2860a` Sesi 4: BountyFactory plus oracle refactor, 48 test, coverage 100 persen
- `a838236` Sesi 5: backend indexer (Bun + Hono + viem + SQLite) plus Ponder, dua
  pendekatan sudah diverifikasi live terhadap chain 97

## Yang belum tersimpan lokal

- [ ] File Canva sesi 1, 3, 4 (`canva.link` butuh login browser, export manual ke PDF)
- [ ] Rekaman video sesi 1 dan 2 (ukuran besar, sengaja tidak dimasukkan ke repo git)
- [ ] Rekaman dan catatan Gemini sesi 3 dan 4 (belum dibagikan panitia)

## Absensi

https://bit.ly/AbsensiIndonesiaWeb3Hackathon (minimal 5 sesi hadir plus isi absensi
tiap sesi untuk berkesempatan dapat 1 tiket festival Coinfest Asia).
