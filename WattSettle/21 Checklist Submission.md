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
<sub>© 2026 PT Surya Inovasi Prioritas (SURIOTA) · <a href="README.md">Hub WattSettle</a> · Update 7 Juli 2026</sub>
</div>
