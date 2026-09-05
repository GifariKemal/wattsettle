<div align="center">

![Paket](https://img.shields.io/badge/paket-jawaban%20submission-22c55e?style=for-the-badge)
&nbsp;
![Portal](https://img.shields.io/badge/portal-indonesiaweb3hack.xyz-06b6d4?style=for-the-badge)
&nbsp;
![Status](https://img.shields.io/badge/isi-siap%20salin%20tempel-f0b90b?style=for-the-badge)

# Paket Jawaban Submission

### Semua teks siap tempel, tinggal cocokkan dengan nama field di portal

</div>

> [!NOTE]
> Form submission di `https://indonesiaweb3hack.xyz/en/submit` baru muncul setelah wallet
> tersambung dan pesan ditandatangani, jadi daftar field pastinya belum bisa dibaca dari luar.
> Berkas ini menyiapkan semua jawaban yang hampir pasti diminta portal mana pun. Begitu
> formnya terbuka, cocokkan judul di bawah dengan label field yang sebenarnya.

> [!IMPORTANT]
> Halaman `/en/my` menyebut **ketua tim yang melakukan submit**. Kalau ikut sebagai solo
> builder, tetap perlu membentuk tim berisi satu orang lebih dulu.

---

## 1. Identitas Proyek

| Field | Isi |
|:--|:--|
| Nama proyek | `WattSettle` |
| Tagline (ID) | Bukti dulu, baru dibayar. |
| Tagline (EN) | Proof first, payment second. |
| Track | Finance & Commerce |
| Chain | BNB Smart Chain Testnet, chainId 97 |
| Kategori tema | DePIN, RWA, AI Agent, Agentic Finance |

---

## 2. Deskripsi

### Versi pendek (sekitar 100 karakter)

```
Rel settlement on-chain yang membayar produsen energi hanya atas kWh yang terbukti sah.
```

### Versi sedang (sekitar 280 karakter, aman untuk kolom singkat dan untuk tweet)

```
WattSettle mengubah angka meter jadi bukti yang bisa dibayar. Perangkat menandatangani
bacaan kWh secara kriptografis, agent AI otonom menghitung ulang kewajarannya, lalu smart
contract di BNB Chain yang memutus dan membayar. Bukan transfer biasa, ini rel settlement
dengan take-rate on-chain.
```

### Versi panjang (untuk kolom deskripsi utama)

```
Masalahnya sederhana dan mahal: angka energi mudah dipalsukan. Setiap skema pembayaran
berbasis energi, mulai dari carbon credit sampai Cooling as a Service, akhirnya bersandar
pada satu angka kWh yang dilaporkan sendiri oleh pihak yang justru diuntungkan kalau
angka itu besar. Di situ ada celah oracle antara bukti fisik dan uang.

WattSettle menutup celah itu dengan tiga lapis. Pertama, gateway SRT-MGATE-1210 milik
SURIOTA menandatangani bacaan kWh dengan EIP-712 di titik sumber, sehingga angkanya tidak
bisa diubah sepanjang jalur tanpa merusak tanda tangan. Kedua, sebuah agent AI otonom
membaca event on-chain, menghitung ulang selisih terhadap baseline perangkat dan skor
anomalinya secara deterministik, lalu menuliskan alasan numerik itu ke rantai sebagai
struct Attestation. Ketiga, dan ini intinya, agent tidak mengirim boolean "setuju". Agent
hanya memasok angka, dan KONTRAK yang memutus lewat gate ruleset on-chain. Verifier yang
berbohong pun tidak bisa memaksa pembayaran.

Yang membuat keputusan AI ini bisa diaudit adalah rulesetHash. Nilai yang tertulis
on-chain adalah keccak256 dari byte file ruleset yang dipublish di repo, jadi siapa pun
bisa menghitungnya sendiri dan mencocokkannya. Ini mengubah "percaya AI kami" menjadi
"hitung sendiri dan buktikan". LLM sengaja tidak diletakkan di jalur keputusan, sebab
keputusan uang harus reproducible.

Pertanyaan paling tajam untuk arsitektur mana pun yang memakai AI untuk memutus pembayaran
adalah: apa yang terjadi kalau AI-nya berbohong? Jawabannya ada di kode. Kontrak menyimpan
baseline tiap perangkat on-chain dan menghitung penyimpangannya sendiri, lalu keputusan
verifier hanya bisa memperketat hasil itu, tidak pernah melonggarkannya. Verifier memegang
hak veto, bukan hak meloloskan. Kami membuktikannya dengan sengaja mengirim attestation
yang berbohong, dan kontrak tetap menolak membayar.

Semuanya sudah berjalan nyata di BNB testnet, bukan simulasi. Satu bacaan bersih disetujui
dan dibayar, satu bacaan anomali ditolak on-chain, dan satu lagi ditolak walau verifier
berbohong. Fee protokol satu persen dipungut di kontrak yang sama, sehingga revenue
model-nya terbukti on-chain dan bukan klaim slide.
```

---

## 3. Tautan

| Label | URL |
|:--|:--|
| Repository | https://github.com/GifariKemal/wattsettle |
| Website produk | https://web3.gifariksuryo.xyz |
| Kontrak di BscScan | https://testnet.bscscan.com/address/0xCA0A97a70fF720447051bDa247F8EE87e7B8Bb12 |
| Source terverifikasi | https://repo.sourcify.dev/97/0xCA0A97a70fF720447051bDa247F8EE87e7B8Bb12 |
| Settlement disetujui | https://testnet.bscscan.com/tx/0xff78c3ec3c97d0ef43b80c025e664d165d60ba09616f58a69f28304e4ee9254c |
| Settlement ditolak | https://testnet.bscscan.com/tx/0xbf21a81936edbde6d380444bd3d5badd63bc44ebb7bfd1acf929e5f71af49934 |
| **Verifier berbohong, tetap ditolak** | https://testnet.bscscan.com/tx/0x7e8ba5a7b1e09f33a8015c043383500276fda8ad59e61bac861f78ce98391781 |
| Agent di registry ERC-8004 | https://testnet.bscscan.com/tx/0x7216d78dc573bb5b1f9b780cf4a8fbdca7c1cbab882ec633051e488a3ecbaa5d |
| Dokumentasi teknis | https://github.com/GifariKemal/wattsettle/blob/main/proofofwatt/README.md |
| Video demo | **belum ada, wajib diisi sebelum submit** |

---

## 4. Alamat On-chain

```
Kontrak WattSettle : 0xCA0A97a70fF720447051bDa247F8EE87e7B8Bb12
Settlement token   : 0x5f730750388176206cC3A7FE894c413675381B05  (suriota, ERC20, verified)
Agent AI verifier  : 0xce4D51524eDECD04B5417F6C8B6E6B6b9e594291  (ERC-8004 agentId 2116)
Deployer / admin   : 0x52317162A7a228D01353e8907a5C068A6D9a0F2e
Chain              : BNB Smart Chain Testnet, chainId 97
```

---

## 5. Tech Stack

```
Smart contract : Solidity 0.8.30, Foundry, OpenZeppelin 5.1
                 (AccessControl, EIP712, ECDSA, SafeERC20, ReentrancyGuard)
Testing        : Foundry, 28 test deterministik termasuk malicious-token reentrancy
                 dan uji verifier berbohong
AI agent       : Python 3.13, web3.py 7.16, keputusan aritmetika deterministik
Hardware       : SRT-MGATE-1210, gateway IoT SURIOTA (Modbus RTU/TCP over MQTT, ESP32)
Frontend       : Astro, 7 halaman statis
Standar        : EIP-712, ERC-20, ERC-8004 Identity Registry (live di chain 97)
CI             : GitHub Actions, fmt, build, lint, test, plus penjaga rulesetHash
```

---

## 6. Yang Sudah Jalan vs Rencana

**Sudah berjalan dan bisa dicek publik:**

- [x] Kontrak `WattSettle` live di chain 97, source terverifikasi exact match di Sourcify
- [x] Loop penuh device sampai pembayaran berjalan nyata, 12 transaksi on-chain
- [x] Satu bacaan disetujui dan dibayar, satu ditolak, satu lagi ditolak walau verifier berbohong
- [x] Gate dua lapis: kontrak menghitung sendiri dari baseline on-chain, verifier hanya bisa memveto
- [x] Rehearsal end to end melawan RPC nyata, **20 dari 20 putaran lolos**, nol gagal
- [x] Fee protokol 1 persen dipungut on-chain ke treasury terpisah
- [x] Counter reputasi per perangkat terakumulasi on-chain
- [x] Agent AI otonom, deployer sudah melepas `VERIFIER_ROLE` sehingga hanya agent yang bisa settle
- [x] Agent terdaftar di Identity Registry ERC-8004 yang live di chain 97, agentId 2116
- [x] 28 test hijau, `forge lint` nol warning

**Rencana pasca-hackathon:**

- [ ] Menulis rationale ke Validation Registry ERC-8004 begitu registry itu di-deploy di testnet 97
- [ ] Menangkap tanda tangan EIP-712 nyata dari unit SRT-MGATE-1210 di lapangan sebagai fixture
- [ ] Rotasi dan pencabutan kunci perangkat saat RMA
- [ ] Multi-operator lewat ERC-8004, bukan satu operator tunggal
- [ ] Settlement rupiah lewat kanal pembayaran lokal, wallet custodial disembunyikan dari pengguna akhir

---

## 7. Draf Tweet

> [!CAUTION]
> Keempat handle harus persis. Satu salah eja sama dengan gate gagal.

```
Angka energi mudah dipalsukan. WattSettle mengubahnya jadi bukti yang dibayar.

Meter menandatangani kWh (EIP-712), agent AI menghitung ulang, kontrak yang memutus
dan membayar. Live di BNB testnet: satu bacaan disetujui dan dibayar, satu ditolak
on-chain.

@BNBChain @BinanceAcademy @coinvestasi @devweb3jogja
#IndonesiaWeb3Hackathon

github.com/GifariKemal/wattsettle
```

---

## 8. Kerangka Video Demo, sekitar 3 menit

| Menit | Isi | Yang terlihat di layar |
|:--|:--|:--|
| 0:00 - 0:20 | Masalah. Angka energi dilaporkan sendiri oleh pihak yang diuntungkan kalau angkanya besar | Slide satu kalimat |
| 0:20 - 0:45 | Solusi tiga lapis. Perangkat menandatangani, AI menghitung ulang, kontrak memutus | Diagram alur |
| 0:45 - 1:20 | Kirim bacaan bersih 105 kWh. Tunjukkan tanda tangan device, lalu tx `submitReading` | Terminal plus BscScan |
| 1:20 - 2:00 | Jalankan agent. Tunjukkan agent menghitung delta dan anomali sendiri, lalu tx `attestAndSettle`. Buka event `ReadingAttested` yang ter-decode | Terminal plus BscScan |
| 2:00 - 2:25 | **Momen kunci.** Buat verifier BERBOHONG, mengaku bacaan 900 kWh tidak menyimpang sama sekali. Kontrak menghitung sendiri dan tetap MENOLAK. Tunjukkan kedua angka bersebelahan di event | BscScan, status Rejected |
| 2:25 - 2:45 | Buktikan auditabilitas. Hitung `keccak256` file ruleset di terminal, cocokkan dengan nilai on-chain | Terminal berdampingan dengan BscScan |
| 2:45 - 3:00 | Otonomi. `hasRole(VERIFIER_ROLE, deployer)` mengembalikan `false`. Hanya agent yang bisa membayar | BscScan Read Contract |

> [!TIP]
> Penolakan sepuluh kali lebih meyakinkan daripada persetujuan, dan penolakan terhadap AI
> sendiri seratus kali lebih meyakinkan lagi. Kalau waktu mepet, potong bagian lain, jangan
> pernah potong beat 2:00.

---

## 9. Yang Masih Butuh Tangan Gifari

| Hal | Kenapa hanya bisa Anda |
|:--|:--|
| Connect wallet dan tanda tangan di portal | Butuh kunci privat di browser |
| Bentuk tim (ketua tim yang submit) | Terikat wallet Anda |
| Kunci Etherscan V2 di https://etherscan.io/myapikey | Butuh login akun. Setelah itu lencana Verified di BscScan tinggal satu perintah |
| Rotasi sandi akun BscScan/Etherscan | Sandi lama pernah bocor di riwayat repo publik. Lakukan di kunjungan yang sama saat mengambil API key |
| Rekam video demo | Suara dan wajah Anda |
| Kirim tweet | Akun Anda |

---

<div align="center">
<sub>Copyright 2026 PT Surya Inovasi Prioritas (SURIOTA) - disusun 5 September 2026</sub>
</div>
