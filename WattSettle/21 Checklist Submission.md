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

Ini dokumen **hidup**, di-update tiap gate ditutup, dan terakhir diperiksa 5 September 2026. Tiap hard gate di bawah adalah **disqualifier**, artinya entry yang secara teknis menang tetap di-nol-kan kalau satu saja terlewat. Solo builder gagal karena lupa checkbox, bukan lupa fitur. Karena itu tutup gate ini lebih awal dan buktikan dengan link, jangan tunda ke minggu deadline.

> ⚠️ Nomination di atas 90% mustahil dengan satu gate terbuka. Baca kill-shot gate hygiene di [16 Risiko dan Kill-shots](<16 Risiko dan Kill-shots.md>) sebelum submit.

---

## ❓ Yang Belum Diumumkan Panitia

Diperiksa ulang pada 5 September 2026. Satu dari tiga hal di tabel lama sekarang **sudah
diketahui**, dua sisanya masih gelap, jadi jangan diasumsikan.

| Hal | Keadaan | Sikap yang diambil |
|:--|:--|:--|
| Platform submission | ✅ **Sudah diketahui.** Portalnya `https://indonesiaweb3hack.xyz`, portal khusus buatan panitia, **bukan** DoraHacks, Devfolio, maupun Devpost. Halaman peserta ada di `/en/my` (pembentukan tim, ketua tim yang mengirim) dan formulirnya di `/en/submit` | Kedua halaman itu dikunci di balik connect wallet plus tanda tangan pesan, jadi **daftar isian formulirnya belum bisa diketahui sebelum wallet tersambung**. Siapkan tetap repo, README, video, dan tautan transaksi, karena semua portal meminta itu |
| Rubrik penilaian juri | Tidak dipublikasikan | Pakai gate di halaman ini sebagai pengganti sementara, karena semuanya berada dalam kendali sendiri |
| Deliverable wajib, termasuk durasi video | Tidak dipublikasikan | Siapkan **satu** video sekitar tiga menit mengikuti pitch arc di [15 Demo dan Pitch](<15 Demo dan Pitch.md>), dipakai untuk lampiran submission sekaligus cadangan panggung. Durasi itu aman untuk hampir semua portal dan bisa dipotong kalau ternyata dibatasi lebih pendek |

> [!TIP]
> Karena formulirnya di balik dinding wallet, langkah termurah berikutnya adalah menyambungkan
> wallet ke `indonesiaweb3hack.xyz/en/my`, membaca daftar isiannya, lalu memperbarui halaman ini
> dengan isian yang benar-benar diminta. Itu sekaligus kemungkinan besar menjadi langkah
> verifikasi wallet di gate 2.

---

## 📅 Status Terperiksa per 5 September 2026

Diperiksa langsung ke rantai dan ke berkas pada 5 September 2026, bukan dari ingatan. Situasinya
berbalik dari pemeriksaan 30 Agustus: entri hackathon **sudah di-deploy**, dan rangkaian gate 3,
5, serta 9 tertutup sekaligus dalam satu sesi kerja. Kontraknya kemudian di-deploy ulang pada
hari yang sama untuk membawa peningkatan keamanan gate dua lapis, dan seluruh alamat serta
tautan transaksi di halaman ini sudah menunjuk ke deployment final itu.

| Gate | Keadaan sebenarnya |
|:--|:--|
| 1 Repo publik dengan riwayat commit asli | ✅ Terpenuhi. Repo publik sejak 7 Juli 2026 dengan commit bertanggal sepanjang kurikulum |
| 2 Langkah verifikasi wallet | ⏳ Masih menunggu instruksi panitia. Portalnya sudah diketahui (`indonesiaweb3hack.xyz`), tetapi isian dan langkahnya baru terlihat setelah wallet tersambung |
| 3 Deploy chain 97 | ✅ **Terpenuhi.** `WattSettle` live di `0xCA0A97a70fF720447051bDa247F8EE87e7B8Bb12`, tx deploy `0xe1b2fefc...7cf31e00` |
| 4 Kontrak verified | ⚠️ **Sebagian.** Sumber sudah terverifikasi publik di Sourcify dengan hasil `exact_match`, tetapi lencana verified di BscScan belum menyala |
| 5 Minimal dua transaksi | ✅ **Terpenuhi dan terlampaui.** Dua belas transaksi confirmed pada kontrak ini, termasuk `submitReading` dan `attestAndSettle`, satu approve yang membayar, satu reject yang jujur, dan satu reject yang menolak walaupun verifier berbohong |
| 6 README plus roadmap | ⏳ Sedang dikerjakan terpisah |
| 7 Video demo | ❌ Belum direkam |
| 8 Tweet | ❌ Belum dikirim |
| 9 Pre-fund pool hadiah | ✅ **Terpenuhi.** 50000 `suriota` sudah ditransfer, ukurannya dipatok untuk kebutuhan demo, sisa 49895 setelah payout |

> [!CAUTION]
> **Satu-satunya penghalang teknis yang tersisa adalah gate 4.** Verifikasi Sourcify tidak
> memunculkan status "Verified" di testnet.bscscan.com, karena kedua sistem itu berdiri
> sendiri. Lencana BscScan menuntut kunci **Etherscan V2 terpadu** dari
> `https://etherscan.io/myapikey`, dan kunci khusus BscScan ditolak sejak V1 dimatikan pada
> 15 Agustus 2025. Hanya pemilik akun yang bisa membuat kunci itu. Perintah yang sudah siap
> jalan ada di [10 Deployment](<10 Deployment dan On-chain Ops.md>).

Dua pekerjaan rumah non-teknis di luar tabel gate:

- ✅ **Repo `GifariKemal/reward-token` sudah dibalik publik.** Seluruh riwayatnya
  dipindai lebih dulu, 317 objek, dan hasilnya bersih: tidak ada berkas `.env` yang
  pernah masuk riwayat, tidak ada kunci OpenAI, Anthropic, GLM, AWS, maupun token
  GitHub, dan dua nilai yang sempat tertangkap pemindai ternyata alamat kontrak publik
  serta kunci tiruan di berkas uji.
- ❌ **Rotasi kredensial akun BscScan/Etherscan masih terbuka**, menggantung sejak
  4 Agustus 2026. Kata sandi lemah pernah tertulis harfiah di `docs/Archive/Analisa
  Awal.md`. Berkasnya sudah disensor di HEAD, tetapi blob lamanya **masih dilayani
  publik dengan status HTTP 200** lewat SHA commit yang terlihat di riwayat. Sejak
  Etherscan V2 satu akun berlaku multichain termasuk chain 97, jadi cakupan rotasinya
  dua hal: kata sandi akun **dan** regenerasi API key.

> [!WARNING]
> Rotasi itu sekarang **dua kali lebih mendesak**, sebab gate 4 justru menuntut masuk ke
> keluarga akun Etherscan yang sama untuk membuat kunci API V2. Sekali kunjungan, kerjakan
> keduanya: rotasi kata sandi lebih dulu, baru terbitkan kunci baru. Hanya pemilik akun yang
> bisa melakukannya.

> [!WARNING]
> Menulis ulang riwayat dengan `git filter-repo` tetap bukan jalan keluarnya. Force-push
> menulis ulang seluruh SHA tepat sebelum jendela submission, padahal gate 1 justru
> menuntut riwayat commit yang asli, dan itu pun tidak menyentuh cache GitHub maupun
> fork yang sudah menyalin. Setelah kredensialnya dirotasi, string yang bocor tidak
> bernilai lagi.

---

## 📋 Tabel Gate dengan Bukti

| # | Hard gate | Status | Bukti / link |
|:--:|:--|:--:|:--|
| 1 | Repo public dengan commit history genuine (bukan single squash) | ✅ | https://github.com/GifariKemal/wattsettle publik sejak 7 Juli 2026, commit bertanggal sepanjang kurikulum Juli sampai Agustus |
| 2 | Wallet token-verify step tuntas | ⬜ | Portal `https://indonesiaweb3hack.xyz/en/my`, langkahnya baru terlihat setelah wallet tersambung |
| 3 | Deploy ke BSC testnet 97 | ✅ | `0xCA0A97a70fF720447051bDa247F8EE87e7B8Bb12`, tx `0xe1b2fefcd43ad357b57a32f8b5cb2bc78c463bdc3b6bc998e25421f17cf31e00` |
| 4 | Kontrak VERIFIED di BscScan | ⚠️ | Sourcify `exact_match` sudah terbit di `https://repo.sourcify.dev/97/0xCA0A97a70fF720447051bDa247F8EE87e7B8Bb12`. Lencana BscScan **belum**, butuh kunci Etherscan V2 |
| 5 | Minimal 2 real on-chain tx (`submitReading` plus `attestAndSettle`) | ✅ | `submitReading` `0xa917b196...5251d853`, `attestAndSettle` APPROVED `0xff78c3ec...4ee9254c`, `attestAndSettle` REJECTED `0xbf21a819...1af49934`, dan `attestAndSettle` yang **menolak walaupun verifier berbohong** `0x7e8ba5a7...98391781`. Dua belas tx confirmed seluruhnya, daftar lengkap di [10 Deployment](<10 Deployment dan On-chain Ops.md>) |
| 6 | README plus roadmap | ⏳ | Sedang dikerjakan terpisah |
| 7 | Demo video | ⬜ | Link video, loop identik flawless |
| 8 | Tweet dengan handle dan hashtag tepat | ⬜ | Link tweet, screenshot |
| 9 | Pre-fund reward pool sebelum demo | ✅ | 50000 `suriota` masuk lewat tx `0x30e1d99874395fa3653813c600cc56705bddd9ac7fe49f9b36180c08516c7dbc`, sisa 49895 setelah payout demo |

> 💡 Update kolom Status jadi ✅ hanya setelah link bukti tertempel. Kolom bukti kosong berarti gate belum benar-benar tutup.

---

## ☑️ Tick List Detail

Salin blok ini ke README repo dan centang saat tuntas.

- [x] **Repo public, commit history genuine.** Commit harian mulai Sesi 1, jangan pernah squash jadi satu commit. Burst commit terbaca sebagai pola "backdated" dan jadi red flag.
- [ ] **Wallet token-verify step.** Sambungkan wallet ke `indonesiaweb3hack.xyz/en/my`, baca langkah yang diminta panitia, lalu selesaikan.
- [x] **Deploy BSC testnet 97.** `WattSettle` live di `0xCA0A97a70fF720447051bDa247F8EE87e7B8Bb12`.
- [ ] **Contract VERIFIED di BscScan.** Sourcify sudah `exact_match`, tetapi itu sistem terpisah dan tidak menyalakan lencana BscScan. Terbitkan kunci Etherscan V2 terpadu lalu jalankan `forge verify-contract ... --verifier etherscan`. Ingat, base yang verified bukan berarti kontrak baru `attestAndSettle` ikut verified.
- [x] **Minimal 2 real on-chain tx.** `submitReading` dan `attestAndSettle` sudah menyala, termasuk satu approve yang membayar, satu reject yang jujur, dan satu reject yang menolak walaupun verifier berbohong, dari total dua belas transaksi confirmed.
- [ ] **README plus roadmap.** README lengkap dengan link, plus bab roadmap pasca-hackathon.
- [ ] **Demo video.** Rekam loop deterministik flawless sebagai fallback panggung.
- [ ] **Tweet handle dan hashtag EXACT.** Handle harus persis: `@BNBChain` `@BinanceAcademy` `@coinvestasi` `@devweb3jogja`, dan hashtag `#IndonesiaWeb3Hackathon`. Salah satu handle salah eja sama dengan gate gagal.
- [x] **Pre-fund reward pool.** 50000 `suriota` sudah masuk ke kontrak, sisa 49895 setelah payout demo, jadi payout tidak akan revert di panggung.

---

## 📸 Pengingat Screenshot Proof

Untuk tiap gate, simpan screenshot sebagai bukti tahan-audit, bukan hanya link yang bisa berubah.

| Gate | Yang di-screenshot |
|:--|:--|
| Commit history | Grafik contribution dan daftar commit bertanggal |
| Contract verified | Tab Contract BscScan dengan lencana verified |
| 2 tx on-chain | Ketiga halaman `attestAndSettle` dengan event ter-expand dan ter-decode, termasuk yang menolak verifier berbohong |
| Tweet | Tweet penuh dengan keempat handle dan hashtag terlihat |
| Reward pool | Halaman token kontrak yang menunjukkan saldo cukup |

> 💡 Simpan semua screenshot di [`assets/`](assets/) dan rujuk dari README. Bukti visual selamat walaupun link berubah, indexer lambat, atau tab tertutup.

---

## 🚦 Ringkasan Jujur

Empat gate sudah tertutup dengan bukti on-chain: repo publik, deploy chain 97, dua transaksi nyata (dua belas, tepatnya), dan pre-fund reward pool. Yang tersisa terbagi tiga jenis. Gate 7 dan 8 murni pekerjaan sendiri, tinggal dikerjakan. Gate 6 sedang berjalan terpisah. Gate 2 menunggu portal panitia dibuka dengan wallet tersambung.

Satu gate berdiri sendiri dan pantas disebut terakhir: **gate 4 adalah satu-satunya penghalang teknis yang tersisa, dan hanya pemilik akun yang bisa membukanya**, sebab yang dibutuhkan adalah kunci Etherscan V2 dari akun yang kata sandinya juga belum dirotasi. Satu kunjungan ke akun itu menutup dua pekerjaan sekaligus. Jangan sampai engineering yang sudah benar dan sudah terbukti di rantai dijatuhkan oleh satu kunci API yang belum diambil.

---

<div align="center">
<sub>© 2026 PT Surya Inovasi Prioritas (SURIOTA) · <a href="README.md">Hub WattSettle</a> · Update 5 September 2026</sub>
</div>
