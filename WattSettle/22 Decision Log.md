<div align="center">

![Bab](https://img.shields.io/badge/BAB-22%20Decision%20Log-06b6d4?style=for-the-badge)
&nbsp;
![WattSettle](https://img.shields.io/badge/WattSettle-Build%20Bible-22c55e?style=for-the-badge)

# 🧭 Decision Log

### Keputusan kunci, alasan, dan status, terurut tanggal

</div>

**Navigasi:** [Hub](README.md) · [Sebelumnya: 21 Checklist Submission](<21 Checklist Submission.md>) · [Berikutnya: 23 Naskah Panggung](<23 Naskah Panggung.md>)

---

## 💡 Cara Membaca

Ini catatan keputusan resmi WattSettle. Tiap baris adalah satu keputusan yang sudah diambil sadar, dengan alasannya, agar tidak dibahas ulang tanpa alasan baru. Kolom Status menandai apakah keputusan masih berlaku (Aktif), sudah dieksekusi (Selesai), bisa dibalik dengan pemicu tertentu (Reversible), atau sudah digantikan keputusan yang lebih baru karena premisnya terbukti keliru (Dikoreksi).

---

## 📒 Log Keputusan

| Tanggal | Keputusan | Alasan | Status |
|:--|:--|:--|:--:|
| 5 Jul 2026 | Bangun Opsi 5 dan Opsi 6 secara gabungan | Opsi 5 (rel generik) dan Opsi 6 (deployment demo di Enovatek) saling melengkapi, satu jadi visi platform dan satu jadi mesin demo konkret. Tiru pola OwnaFarm, satu keran sempurna di panggung, pipa ke semua pasar di slide. | Aktif |
| 5 Jul 2026 | Evolve `ProofOfWatt.sol`, bukan rewrite | Kontrak base sudah 6 test PASS di Foundry v1.7.1. Delta kontrak terkecil (sekitar 1 hari) di atas base teruji, disiplin evolve-not-rewrite plus TDD plus ponytail. | Aktif |
| 5 Jul 2026 | Chain BSC testnet 97, UI via BscScan | Target deploy hackathon adalah chainId 97. UI custom tidak dipakai di critical path (ponytail), BscScan jadi UI resmi agar loop tetap deterministik. | Aktif |
| 5 Jul 2026 | Pre-fund reward pool sebelum demo | Payout diambil dari saldo kontrak. Tanpa pre-fund yang cukup (mint `onlyOwner` ke deployer lalu isi kontrak), payout revert di panggung. Besarannya dipatok sesuai kebutuhan demo, dan sejak 5 Sep 2026 diisi 50000 `suriota`. | Aktif |
| 6 Jul 2026 | Submit ke Finance and Commerce, AI Agents sebagai fallback | Track arbitrage adalah lever tunggal terbesar. Finance and Commerce dead-center selera Dev Web3 Jogja (OwnaFarm) dan hampir nol pemula bisa ship kontrak settlement kerja. | Reversible |
| 6 Jul 2026 | Integrasi ERC-8004 Validation Registry live, bukan mirror | Framing "self-contained mirror" adalah bunuh diri di depan juri BNB, dan itu masih berlaku. Tetapi premisnya keliru: Validation Registry ternyata **tidak** ter-deploy di chain 97. **Digantikan oleh keputusan 5 Sep 2026.** | Dikoreksi |
| 6 Jul 2026 | Positioning vs PiggyCell, industrial B2B plus AI verifier | PiggyCell (consumer, loyalty, event logging) memvalidasi tesis tapi beda segmen. WattSettle industrial B2B settlement rail dengan AI verifier otonom sebagai novelty asli. | Aktif |
| 6 Jul 2026 | Tooling Foundry plus OpenZeppelin Contracts (import, bukan Wizard) | Toolchain ini sudah dipakai dan teruji (base 6 test PASS, token `suriota` verified pakai OZ ERC20 plus Ownable). Import langsung konsisten dengan evolve-not-rewrite. Wizard hanya referensi pattern. | Aktif |
| 7 Jul 2026 | Nama produk tetap WattSettle, Enovatek adalah use case | Opsi 5 nama produk (rel generik), Opsi 6 deployment demo di Enovatek dan PM20H20Q. Rename akan buang ekuitas (repo, website live, docs) dan kaburkan pesan "rel generik". Enovatek nama partner, bukan bagian nama produk. | Aktif |
| 7 Jul 2026 | Token settlement default `suriota`, MockUSD sebagai fallback | `suriota` sudah verified di BscScan testnet 97, zero new-token risk, delta terkecil. MockUSD (6 desimal) di-repo sebagai swap satu baris kalau keyword "stablecoin" penting di hari-H. | Reversible |
| 7 Jul 2026 | Repo dibuat public apa adanya | Gifari sadar `docs/` berisi strategi kompetitif (win-prob, kill-shots, SWOT) dan tetap memilih publik (opsi B, keputusan sadar). `.secrets/` tidak ter-track. | Aktif |
| 7 Jul 2026 | Restrukturisasi docs ke `/WattSettle/`, docs lama diarsipkan | Dokumen strategi lama dipindah ke `docs/Archive/`, Build Bible aktif berada di `/WattSettle/` sebagai satu keluarga bergaya konsisten. | Selesai |
| 5 Sep 2026 | Constructor `WattSettle` cukup satu argumen | `constructor(IERC20 _rewardToken)` saja. `rewardPerKwh`, `treasury`, `feeBps`, `maxAnomalyBps`, dan `maxDeltaBound` diberi nilai awal di dalam constructor lalu diubah lewat setter admin. Argumen deploy pendek berarti `--constructor-args` verifikasi hanya satu `address`, jadi peluang salah encode mendekati nol. Setter tetap dibutuhkan untuk kalibrasi lapangan, jadi constructor panjang berarti membayar dua kali untuk satu hal. Setter dibatasi keras: `MAX_FEE_BPS` 1000 bps dan bound anomali maksimum 10000. | Selesai |
| 5 Sep 2026 | Deployer mencabut `VERIFIER_ROLE` dari dirinya sendiri | Setelah `VERIFIER_ROLE` diberikan ke wallet agent, deployer memanggil `revokeRole` atas dirinya sendiri (tx `0x90a9b8dd...0c7f9003c`). Sejak itu satu-satunya alamat yang bisa memanggil `attestAndSettle` adalah wallet agent. Autonomy berhenti menjadi klaim dan menjadi properti izin yang bisa dibaca siapa pun di rantai, dan ini jawaban terkuat untuk Kill-shot #2 (autonomy theater). | Selesai |
| 5 Sep 2026 | Verifikasi Sourcify sekarang, BscScan menyusul saat kunci tersedia | Sumber di-verify ke Sourcify lebih dulu dengan hasil `exact_match`, sebab jalur itu tidak butuh kunci API sama sekali dan langsung membuat sumber dapat diperiksa publik. Lencana verified di BscScan tetap dikejar, tetapi menuntut kunci Etherscan V2 terpadu (kunci khusus BscScan ditolak sejak V1 mati 15 Agu 2025) dan hanya pemilik akun yang bisa menerbitkannya. Menunggu kunci sambil membiarkan sumber tak terverifikasi adalah risiko yang tidak perlu. | Aktif |
| 5 Sep 2026 | Simpan `baselineKwh` on-chain dan jadikan gerbangnya dua lapis | Gerbang lama hanya menilai angka yang dipasok verifier, sehingga verifier yang berbohong bisa meloloskan bacaan curang dan menguras reward pool. Kontrak sekarang menyimpan `uint96 baselineKwh` per perangkat, menghitung sendiri delta dan skor anomali lewat `_assess`, lalu meng-AND-kan hasilnya dengan penilaian verifier. Sifat yang dibeli: **verifier memegang hak veto, bukan kuasa menyetujui**. Ia tetap bisa menolak bacaan yang secara aritmetika wajar karena melihat sinyal yang tak terlihat di rantai, dan itulah yang membuatnya berguna. Ongkosnya deploy ulang, `registerDevice` jadi empat parameter, dan bytecode naik dari 7409 ke 8322 byte. Terbukti di rantai lewat attestation palsu yang ditolak, tx `0x7e8ba5a7...98391781`. | Selesai |
| 5 Sep 2026 | Tidak ada fungsi tarik dana untuk admin, disengaja | Reward pool sengaja tidak diberi fungsi withdraw. Begitu token dikomitkan ke kontrak, admin tidak bisa menariknya kembali, sehingga produsen tahu uang yang disisihkan untuk mereka tidak bisa diambil lagi. Konsekuensinya diterima sadar: pool diisi sesuai kebutuhan demo, bukan berlebihan, sebab kelebihannya tidak bisa dipulihkan. | Aktif |
| 5 Sep 2026 | `.gitattributes` menandai ruleset dan kartu agent sebagai `-text` | `rulesetHash` adalah `keccak256` atas byte mentah `ruleset/anomaly_v1.json`. Dengan `core.autocrlf=true`, checkout Windows menghasilkan CRLF (1501 byte) sementara blob yang ter-commit LF (1470 byte), dan keduanya menghasilkan hash berbeda. Itu mematahkan klaim "hitung sendiri dan buktikan" secara diam-diam, sebab dua orang jujur di sistem operasi berbeda akan saling membantah. Menandai berkasnya `-text` membuat git tidak pernah mengonversinya. Hash kanonik `0xcce6c15c...90df6b41`, dan CI gagal bila berkasnya berubah tanpa nilai itu ikut diperbarui. | Selesai |
| 5 Sep 2026 | ERC-8004: daftar ke Identity Registry, bukan tulis ke Validation Registry | Koreksi atas keputusan 6 Jul 2026. Riset verifikasi menemukan **tidak ada Validation Registry yang ter-deploy di chain 97**, dan dua alamat registry yang tercatat sebelumnya ternyata ada di mainnet 56. Rencana lama karena itu tidak bisa dieksekusi. Gantinya, agent verifier didaftarkan sungguhan ke Identity Registry live chain 97, memperoleh agentId 2116. Rationale attestation sementara hidup di event `ReadingAttested` sendiri yang nama fieldnya mencerminkan semantik `validationResponse`, sehingga migrasi tinggal pemetaan field saat registry-nya rilis. | Aktif |

---

## 🔁 Catatan Reversibilitas

Dua keputusan sengaja ditandai **Reversible** karena bergantung data yang belum lengkap.

> ⚠️ **Track.** Asumsi "Finance paling tipis" belum tervalidasi data. Scout densitas registrasi via kontak Dev Web3 Jogja atau Coinvestasi menjelang akhir September, siapkan kedua framing, pilih by data. Kalau Finance ramai clone, pindah ke AI Agents.

> ⚠️ **Token.** Putuskan `suriota` versus MockUSD di pagi hari-H berdasarkan komposisi panel. Panel skew regulator condong ke stablecoin (MockUSD), panel skew crypto-builder condong ke `suriota` (zero new-token risk). Swap adalah satu baris di constructor.

---

<div align="center">
<sub>© 2026 PT Surya Inovasi Prioritas (SURIOTA) · <a href="README.md">Hub WattSettle</a> · Update 5 September 2026</sub>
</div>
