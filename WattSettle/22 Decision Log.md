<div align="center">

![Bab](https://img.shields.io/badge/BAB-22%20Decision%20Log-06b6d4?style=for-the-badge)
&nbsp;
![WattSettle](https://img.shields.io/badge/WattSettle-Build%20Bible-22c55e?style=for-the-badge)

# 🧭 Decision Log

### Keputusan kunci, alasan, dan status, terurut tanggal

</div>

**Navigasi:** [Hub](README.md) · [Sebelumnya: 21 Checklist Submission](<21 Checklist Submission.md>) · [Berikutnya: Hub WattSettle](README.md)

---

## 💡 Cara Membaca

Ini catatan keputusan resmi WattSettle. Tiap baris adalah satu keputusan yang sudah diambil sadar, dengan alasannya, agar tidak dibahas ulang tanpa alasan baru. Kolom Status menandai apakah keputusan masih berlaku (Aktif), sudah dieksekusi (Selesai), atau bisa dibalik dengan pemicu tertentu (Reversible).

---

## 📒 Log Keputusan

| Tanggal | Keputusan | Alasan | Status |
|:--|:--|:--|:--:|
| 5 Jul 2026 | Bangun Opsi 5 dan Opsi 6 secara gabungan | Opsi 5 (rel generik) dan Opsi 6 (deployment demo di Enovatek) saling melengkapi, satu jadi visi platform dan satu jadi mesin demo konkret. Tiru pola OwnaFarm, satu keran sempurna di panggung, pipa ke semua pasar di slide. | Aktif |
| 5 Jul 2026 | Evolve `ProofOfWatt.sol`, bukan rewrite | Kontrak base sudah 6 test PASS di Foundry v1.7.1. Delta kontrak terkecil (sekitar 1 hari) di atas base teruji, disiplin evolve-not-rewrite plus TDD plus ponytail. | Aktif |
| 5 Jul 2026 | Chain BSC testnet 97, UI via BscScan | Target deploy hackathon adalah chainId 97. UI custom tidak dipakai di critical path (ponytail), BscScan jadi UI resmi agar loop tetap deterministik. | Aktif |
| 5 Jul 2026 | Pre-fund reward pool sebelum demo | Payout diambil dari saldo kontrak. Tanpa pre-fund sekitar 500k `suriota` (mint `onlyOwner` ke deployer lalu isi kontrak), payout revert di panggung. | Aktif |
| 6 Jul 2026 | Submit ke Finance and Commerce, AI Agents sebagai fallback | Track arbitrage adalah lever tunggal terbesar. Finance and Commerce dead-center selera Dev Web3 Jogja (OwnaFarm) dan hampir nol pemula bisa ship kontrak settlement kerja. | Reversible |
| 6 Jul 2026 | Integrasi ERC-8004 Validation Registry live, bukan mirror | Registry sudah live singleton di BSC testnet 97 sejak 4 Feb 2026. Framing "self-contained mirror" adalah bunuh diri di depan juri BNB. Hermes JUGA memanggil `validationResponse` untuk reading yang sama. | Aktif |
| 6 Jul 2026 | Positioning vs PiggyCell, industrial B2B plus AI verifier | PiggyCell (consumer, loyalty, event logging) memvalidasi tesis tapi beda segmen. WattSettle industrial B2B settlement rail dengan AI verifier otonom sebagai novelty asli. | Aktif |
| 6 Jul 2026 | Tooling Foundry plus OpenZeppelin Contracts (import, bukan Wizard) | Toolchain ini sudah dipakai dan teruji (base 6 test PASS, token `suriota` verified pakai OZ ERC20 plus Ownable). Import langsung konsisten dengan evolve-not-rewrite. Wizard hanya referensi pattern. | Aktif |
| 7 Jul 2026 | Nama produk tetap WattSettle, Enovatek adalah use case | Opsi 5 nama produk (rel generik), Opsi 6 deployment demo di Enovatek dan PM20H20Q. Rename akan buang ekuitas (repo, website live, docs) dan kaburkan pesan "rel generik". Enovatek nama partner, bukan bagian nama produk. | Aktif |
| 7 Jul 2026 | Token settlement default `suriota`, MockUSD sebagai fallback | `suriota` sudah verified di BscScan testnet 97, zero new-token risk, delta terkecil. MockUSD (6 desimal) di-repo sebagai swap satu baris kalau keyword "stablecoin" penting di hari-H. | Reversible |
| 7 Jul 2026 | Repo dibuat public apa adanya | Gifari sadar `docs/` berisi strategi kompetitif (win-prob, kill-shots, SWOT) dan tetap memilih publik (opsi B, keputusan sadar). `.secrets/` tidak ter-track. | Aktif |
| 7 Jul 2026 | Restrukturisasi docs ke `/WattSettle/`, docs lama diarsipkan | Dokumen strategi lama dipindah ke `docs/Archive/`, Build Bible aktif berada di `/WattSettle/` sebagai satu keluarga bergaya konsisten. | Selesai |

---

## 🔁 Catatan Reversibilitas

Dua keputusan sengaja ditandai **Reversible** karena bergantung data yang belum lengkap.

> ⚠️ **Track.** Asumsi "Finance paling tipis" belum tervalidasi data. Scout densitas registrasi via kontak Dev Web3 Jogja atau Coinvestasi menjelang akhir September, siapkan kedua framing, pilih by data. Kalau Finance ramai clone, pindah ke AI Agents.

> ⚠️ **Token.** Putuskan `suriota` versus MockUSD di pagi hari-H berdasarkan komposisi panel. Panel skew regulator condong ke stablecoin (MockUSD), panel skew crypto-builder condong ke `suriota` (zero new-token risk). Swap adalah satu baris di constructor.

---

<div align="center">
<sub>© 2026 PT Surya Inovasi Prioritas (SURIOTA) · <a href="README.md">Hub WattSettle</a> · Update 7 Juli 2026</sub>
</div>
