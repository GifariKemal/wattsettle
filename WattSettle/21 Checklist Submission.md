<div align="center">

![Bab](https://img.shields.io/badge/BAB-21%20Checklist-22c55e?style=for-the-badge)
&nbsp;
![WattSettle](https://img.shields.io/badge/WattSettle-Build%20Bible-22c55e?style=for-the-badge)
&nbsp;
![Gate](https://img.shields.io/badge/tiap%20miss-disqualifier-ef4444?style=for-the-badge)

# ✅ Checklist Submission

### Tick list hidup untuk hard gate, tiap satu wajib dibuktikan dengan link

</div>

**Navigasi:** [Hub](README.md) · [Sebelumnya: 20 Glosarium](<20 Glosarium.md>) · [Berikutnya: 22 Decision Log](<22 Decision Log.md>)

---

## ⚠️ Kenapa Bab Ini Kritis

Ini dokumen **hidup**, di-update tiap gate ditutup. Tiap hard gate di bawah adalah **disqualifier**, artinya entry yang secara teknis menang tetap di-nol-kan kalau satu saja terlewat. Solo builder gagal karena lupa checkbox, bukan lupa fitur. Karena itu tutup gate ini lebih awal dan buktikan dengan link, jangan tunda ke minggu deadline.

> ⚠️ Nomination di atas 90% mustahil dengan satu gate terbuka. Baca kill-shot gate hygiene di [16 Risiko dan Kill-shots](<16 Risiko dan Kill-shots.md>) sebelum submit.

---

## ❓ Yang Belum Diumumkan Panitia

Dicari ulang pada 30 Agustus 2026 lewat halaman Luma resmi, hub Notion, dan repo materi
mentor. Tiga hal berikut **belum dipublikasikan di kanal mana pun yang bisa diakses**,
jadi jangan diasumsikan.

| Hal | Keadaan | Sikap yang diambil |
|:--|:--|:--|
| Platform submission | Luma hanya menyebut "the hackathon portal" tanpa nama. Halaman Indonesia Web3 Hackathon **tidak ditemukan** di DoraHacks, Devfolio, maupun Devpost | Jangan menyiapkan berkas dengan format khusus satu platform sebelum namanya diumumkan. Bagian yang aman disiapkan lebih dulu adalah repo, README, video, dan tautan transaksi, karena semua portal meminta itu |
| Rubrik penilaian juri | Tidak dipublikasikan | Pakai gate di halaman ini sebagai pengganti sementara, karena semuanya berada dalam kendali sendiri |
| Deliverable wajib, termasuk durasi video | Tidak dipublikasikan | Siapkan video sekitar tiga menit mengikuti pitch arc di [15 Demo dan Pitch](<15 Demo dan Pitch.md>). Durasi itu aman untuk hampir semua portal dan bisa dipotong kalau ternyata dibatasi lebih pendek |

> [!TIP]
> Ketiganya kemungkinan besar diumumkan di grup peserta menjelang 1 September, dan Sesi 9
> adalah kesempatan bertanya langsung. Tanyakan tiga hal itu persis seperti tertulis di
> tabel, lalu perbarui halaman ini begitu jawabannya masuk.

---

## 📅 Status Terperiksa per 30 Agustus 2026

Diperiksa langsung ke berkas pada 30 Agustus 2026, bukan dari ingatan. Semua gate di
tabel berikut masih kosong, dan penyebabnya satu: entri hackathon belum pernah
di-deploy. `proofofwatt/src/` masih `ProofOfWatt.sol` versi satu, `proofofwatt/script/`
kosong, dan tidak ada `proofofwatt/broadcast/`.

| Gate | Keadaan sebenarnya |
|:--|:--|
| 1 Repo publik dengan riwayat commit asli | ✅ Sudah terpenuhi. Repo publik sejak 7 Juli 2026 dengan commit bertanggal sepanjang kurikulum |
| 3 Deploy chain 97 | ❌ Belum pernah deploy |
| 4 Kontrak verified | ❌ Belum ada kontrak yang di-deploy untuk di-verify |
| 5 Minimal dua transaksi | ❌ Nol transaksi |
| 7 Video demo | ❌ Belum direkam |
| 8 Tweet | ❌ Belum dikirim |
| 9 Pre-fund pool hadiah | ❌ Belum, dan ini yang membuat pembayaran revert di panggung kalau terlewat |

> [!CAUTION]
> Jendela submission dibuka 1 September 2026. Gate 3, 4, dan 5 adalah satu rangkaian
> pekerjaan yang sama dan bisa ditutup dalam satu sesi begitu delta kontrak di
> [06 Kontrak WattSettle](<06 Kontrak WattSettle.md>) selesai. Alur deploy dan verify di
> chain 97 sudah terbukti jalan di repo latihan, jadi risikonya rendah dan yang mahal
> hanya menulis kontraknya.

Dua pekerjaan rumah non-teknis yang juga masih menggantung dan tidak terlihat di tabel
gate: rotasi kata sandi akun BscScan (menggantung sejak 4 Agustus 2026, menghapus berkas
bukan remediasi karena riwayat git masih menyimpannya), dan repo `GifariKemal/reward-token`
yang masih privat sehingga harus dibalik publik saat submission.

---

## 📋 Tabel Gate dengan Bukti

| # | Hard gate | Status | Bukti / link |
|:--:|:--|:--:|:--|
| 1 | Repo public dengan commit history genuine (bukan single squash) | ⬜ | `github.com/GifariKemal/wattsettle`, tampilkan grafik commit harian |
| 2 | Wallet token-verify step tuntas | ⬜ | Screenshot langkah verify wallet |
| 3 | Deploy ke BSC testnet 97 | ⬜ | Alamat kontrak WattSettle di BscScan testnet |
| 4 | Kontrak VERIFIED di BscScan | ⬜ | Tab Contract hijau, source ter-verify (bukan hanya base) |
| 5 | Minimal 2 real on-chain tx (`submitReading` plus `attestAndSettle`) | ⬜ | Dua URL tx BscScan, event ter-decode |
| 6 | README plus roadmap | ⬜ | Link README repo dan bab roadmap |
| 7 | Demo video | ⬜ | Link video, loop identik flawless |
| 8 | Tweet dengan handle dan hashtag tepat | ⬜ | Link tweet, screenshot |
| 9 | Pre-fund reward pool sebelum demo | ⬜ | Saldo `suriota` kontrak lebih besar dari payout, tx mint |

> 💡 Update kolom Status jadi ✅ hanya setelah link bukti tertempel. Kolom bukti kosong berarti gate belum benar-benar tutup.

---

## ☑️ Tick List Detail

Salin blok ini ke README repo dan centang saat tuntas.

- [ ] **Repo public, commit history genuine.** Commit harian mulai Sesi 1, jangan pernah squash jadi satu commit. Burst commit terbaca sebagai pola "backdated" dan jadi red flag.
- [ ] **Wallet token-verify step.** Selesaikan langkah verifikasi token yang diminta panitia.
- [ ] **Deploy BSC testnet 97.** Kontrak WattSettle live di chainId 97, catat alamatnya.
- [ ] **Contract VERIFIED di BscScan.** Jalankan `forge verify-contract`. Ingat, base yang verified bukan berarti kontrak baru `attestAndSettle` ikut verified, re-verify kontrak baru.
- [ ] **Minimal 2 real on-chain tx.** Fire `submitReading` lalu `attestAndSettle`, simpan kedua URL, pastikan event ter-decode di BscScan.
- [ ] **README plus roadmap.** README lengkap dengan link, plus bab roadmap pasca-hackathon.
- [ ] **Demo video.** Rekam loop deterministik flawless sebagai fallback panggung.
- [ ] **Tweet handle dan hashtag EXACT.** Handle harus persis: `@BNBChain` `@BinanceAcademy` `@coinvestasi` `@devweb3jogja`, dan hashtag `#IndonesiaWeb3Hackathon`. Salah satu handle salah eja sama dengan gate gagal.
- [ ] **Pre-fund reward pool.** Payout `safeTransfer` diambil dari saldo kontrak. Pre-fund pool `suriota` (rencana sekitar 500k, mint `onlyOwner` ke deployer lalu isi ke kontrak) sebelum demo, kalau tidak payout revert di panggung.

---

## 📸 Pengingat Screenshot Proof

Untuk tiap gate, simpan screenshot sebagai bukti tahan-audit, bukan hanya link yang bisa berubah.

| Gate | Yang di-screenshot |
|:--|:--|
| Commit history | Grafik contribution dan daftar commit bertanggal |
| Contract verified | Tab Contract BscScan dengan lencana verified |
| 2 tx on-chain | Kedua halaman tx dengan event ter-expand dan ter-decode |
| Tweet | Tweet penuh dengan keempat handle dan hashtag terlihat |
| Reward pool | Halaman token kontrak yang menunjukkan saldo cukup |

> 💡 Simpan semua screenshot di [`assets/`](assets/) dan rujuk dari README. Bukti visual selamat walaupun link berubah, indexer lambat, atau tab tertutup.

---

## 🚦 Ringkasan Jujur

Semua gate di atas 100% dalam kendali solo builder, tidak ada yang bergantung faktor eksternal. Menutup semuanya lebih awal adalah cara termurah menaikkan probabilitas nomination. Jangan sampai engineering yang sudah benar dijatuhkan oleh satu checkbox yang terlewat.

---

<div align="center">
<sub>© 2026 PT Surya Inovasi Prioritas (SURIOTA) · <a href="README.md">Hub WattSettle</a> · Update 30 Agustus 2026</sub>
</div>
