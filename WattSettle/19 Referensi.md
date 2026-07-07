<div align="center">

![Bab](https://img.shields.io/badge/BAB-19%20Referensi-a855f7?style=for-the-badge)
&nbsp;
![WattSettle](https://img.shields.io/badge/WattSettle-Build%20Bible-22c55e?style=for-the-badge)

# 📚 Referensi

### Kartu rujukan proyek, standar, dan preseden yang menopang WattSettle

</div>

**Navigasi:** [Hub](README.md) · [Sebelumnya: 18 Roadmap Pasca-Hackathon](<18 Roadmap Pasca-Hackathon.md>) · [Berikutnya: 20 Glosarium](<20 Glosarium.md>)

---

## 💡 Cara Membaca Bab Ini

Bab ini bukan bibliografi akademik. Ia kumpulan **kartu rujukan** yang setiap satunya menjawab pertanyaan operasional, apa preseden yang memvalidasi WattSettle, standar apa yang harus diintegrasi, dan pemenang lama mana yang memetakan selera juri. Semua fakta load bearing sudah diverifikasi via research (Februari sampai Juli 2026). Ledger sumber ada di bagian akhir.

> 💡 Aturan besar: yang sudah **live** kita **integrasi**, bukan kita tiru. Yang sudah **menang** kita pelajari polanya, bukan kita jiplak idenya.

---

## 🪙 PiggyCell

Cermin strategis terdekat WattSettle di BNB Chain.

| Atribut | Detail |
|:--|:--|
| Kategori | DePIN energi consumer, transformasi Web2 ke DePIN plus RWA |
| Endorsement | Binance Alpha project, di-endorse Binance sendiri |
| Bisnis inti | Jaringan sewa power bank nomor satu Korea Selatan, market share 95 sampai 98% |
| Skala fisik | 14.000 lebih stasiun, 100.000 lebih device, 4 juta lebih user berbayar |
| Revenue Web2 | Sekitar 7,5 juta USD (2023), nyata sebelum tokenisasi |
| Backer | Animoca Brands (lead seed 10 juta USD), DWF Labs, bank Korea (Shinhan, Hana), ICP |
| Token | PIGGY, suplai tetap 100 juta |
| Bukti skala on-chain | 9,4 juta transaksi di beta, stress test 1 juta USD |
| Model | Charge-to-Earn plus Dominate-to-Earn (Region NFT digital-twin, 70% revenue ke NFT holder, berbasis revenue nyata bukan inflasi token) |

**Kenapa ini validasi, bukan ancaman.** Tesis persis WattSettle, yaitu perusahaan infrastruktur fisik dengan hardware, user, dan revenue nyata yang naik ke on-chain lewat DePIN plus RWA, sudah dipertaruhkan Binance sendiri lewat PiggyCell. Argumen moat "sudah punya hardware lebih baik daripada bangun dari nol" kini punya preseden yang di-endorse BNB. Primitive on-chain mereka (event logging kWh plus durasi) sejajar dengan Reading dan Attestation kita, dan aliran revenue kedua mereka (jual data energi ke arah ESG) identik dengan rencana WattSettle.

**Di mana WattSettle beda (anti-clone, wajib tajam).**

| Sumbu | PiggyCell | WattSettle |
|:--|:--|:--|
| Segmen | Consumer, power bank, loyalty | Industrial B2B, energi, settlement rail |
| Verifikasi | Event logging plus rule deterministik | AI verifier otonom (rationale, anomaly, model hash on-chain) |
| Arah nilai | User dapat token (reward emission) | Produsen dibayar atas energi terverifikasi (settlement plus fee) |
| Insentif curang | Rendah (loyalty) | Tinggi (uang settle atas reading), maka AI verifier necessary bukan dekorasi |

**Pitch line.** "BNB sudah bertaruh pada model ini lewat PiggyCell untuk energi consumer. WattSettle play yang sama untuk energi industrial." Siapkan Q&A wajib "bedanya vs PiggyCell", jawab dengan sumbu segmen dan verifikasi di atas.

> ⚠️ Jangan tiru arsitektur multi-chain plus 5-layer PiggyCell. Itu konsekuensi 4 juta user. WattSettle di hackathon tetap satu kontrak di BSC testnet 97. Ambil ide PiggyCell untuk roadmap, bukan untuk scope demo.

---

## 🏆 zkPull

Kerangka pemenang yang identik dengan WattSettle.

| Atribut | Detail |
|:--|:--|
| Ajang | Mantle Global Hackathon 2025, juara ZK and Privacy |
| Konsep | Bounty trustless, real-world off-chain event diverifikasi secara kriptografis lalu contract auto-release reward tanpa middleman |
| Alur konkret | PR GitHub merged, verifikasi zkTLS, EigenLayer AVS enforce on-chain, auto-payout tanpa approval manual |
| Fee | Success-based 5% |
| Relevansi juri | Oktavianus Bima Jadiva (mentor dan kemungkinan besar juri) pribadi menang dengan pola ini |

**Kenapa penting.** zkPull membuktikan pola "verifikasi dulu, bayar kemudian" sudah menang di depan ekosistem juri yang sama. WattSettle memakai kerangka identik pada domain fisik. Karena itu tagline kerja resmi kita adalah **"zkPull for physical energy"**, wajib disebut di pitch.

---

## 🌾 OwnaFarm

Bukti selera juri, RWA plus real-world settlement.

| Atribut | Detail |
|:--|:--|
| Ajang | Juara GameFi Mantle, dan juara 1 Synthesis Agentic AI |
| Konsep | RWA invoice financing petani, invoice tani nyata ditokenisasi jadi "benih" ala game Hay Day, gabungan RWA dan GameFi |
| Founder | Yeheskiel Yunus Tame, UKDW Blockchain Club Yogyakarta |
| Relasi | Satu ekosistem Dev Web3 Jogja, mentor Sesi 1 sampai 4, kemungkinan besar juri |

**Kenapa penting.** OwnaFarm menang dengan satu kasus konkret plus visi besar, bukan platform abstrak. Ia dead-center selera juri, RWA dan real-world settlement untuk non-crypto users. WattSettle meniru pola pemenangan ini satu level di atas, karena kita punya hardware dan revenue nyata sedangkan mereka software. Positioning panggung kita mengikuti pola yang sama, satu keran sempurna (Enovatek, PM20H20Q) di panggung dan pipa ke semua pasar (WattSettle) di slide.

---

## 🔗 ERC-8004 / BEP-620

Trust primitive yang wajib diintegrasi, bukan di-mirror.

| Atribut | Detail |
|:--|:--|
| Status | Validation Registry LIVE di BSC mainnet dan testnet 97 sejak 4 Februari 2026 |
| Sifat | Singleton live, satu registry kanonik di rantai yang sama tempat kita deploy |
| Reference impl | CC0 (BRC8004), IdentityRegistry `0xfA09B3397fAC75424422C4D28b1729E3D4f659D7`, ReputationRegistry `0x17860530385Bdde7992c4Da71B9ec7791E474C08` |
| Ekosistem | BNBAgent SDK live testnet, explorer BASCAN.io dan 8004scan |
| Fungsi kunci | `validationResponse(bytes32 requestHash, uint8 response, string responseUri, bytes32 responseHash, bytes32 tag)`, response skala 0 sampai 100 |

**Kenapa integrasi, bukan mirror.** Karena registry sudah live di rantai yang sama, framing "self-contained mirror of ERC-8004" adalah bunuh diri di depan juri BNB (lihat kill-shot di [16 Risiko dan Kill-shots](<16 Risiko dan Kill-shots.md>)). Setelah `attestAndSettle` menuliskan settlement, Hermes verifier JUGA memanggil `validationResponse` di Validation Registry testnet 97 untuk reading yang sama. Pitch, "device physical-DePIN saya adalah agent pertama yang menulis ke registry live BNB, dan settlement rail saya adalah lapisan pembayaran di atasnya." Detail integrasi di [07 AI Verifier](<07 AI Verifier.md>).

---

## 💳 x402

Standar pembayaran HTTP 402 yang sudah live di BNB.

| Atribut | Detail |
|:--|:--|
| Status | LIVE di BNB sejak 19 Mei 2026 |
| Konsep | Pola HTTP 402, "402, pay, prove", pembayaran stablecoin machine-to-machine |
| Aset settle | USDC, USDT, U, USD1 |
| Facilitator perdana | Unibase, facilitator x402 pertama di BNB (sekitar 31 Desember 2025), aset EIP-3009, repo `unibaseio/unibase-x402-bsc` |
| Cara pakai di WattSettle | On-chain ruleset gate di `attestAndSettle` diperlakukan sebagai handshake self-contained "402, pay, prove", facilitator adalah in-contract verifier |

**Kenapa penting.** BNB sendiri mempublikasikan skenario M2M-energy x402. WattSettle secara harfiah adalah case study itu yang di-ship perusahaan Indonesia nyata. Lifecycle kanonik BNB, identity (ERC-8004), lalu pays (x402), lalu reputation over time (8004scan), ditelusuri demo WattSettle di panggung.

> ⚠️ Jangan hard-wire facilitator x402 eksternal di critical path demo. Handshake diperlakukan self-contained agar loop tetap deterministik. Lihat [16 Risiko dan Kill-shots](<16 Risiko dan Kill-shots.md>).

---

## 📒 Source Ledger

Sumber terverifikasi yang menopang klaim load bearing di seluruh Build Bible.

| Klaim | Sumber | Waktu verifikasi |
|:--|:--|:--|
| ERC-8004 / BEP-620 spec dan `validationResponse` | forum.bnbchain.org (BEP-620) | Feb dan Jul 2026 |
| Reference impl CC0 plus alamat kontrak | github.com/BRC8004 | Feb dan Jul 2026 |
| x402 live di BNB, aset settle, facilitator | bnbchain.org blog, github.com/unibaseio/unibase-x402-bsc | Jul 2026 |
| Lifecycle agent (identity, pays, reputation) | knowyouragent.network, 8004scan | Jul 2026 |
| Timeline resmi hackathon (Submission 1 sampai 30 Sep, Finalist 14 Okt, Demo Day 31 Okt) | luma.com/pcc699dv, x.com/coinvestasi, x.com/nkskrdwyn | Jul 2026 |
| PiggyCell profil, backer, model, skala | Research argus (Binance Alpha, materi PiggyCell) | 7 Jul 2026 |
| zkPull profil dan struktur | hackquest.io (Mantle Global Hackathon 2025 zkPull) | 6 Jul 2026 |
| OwnaFarm profil dan founder | Research argus, materi Dev Web3 Jogja | 6 Jul 2026 |
| Rubrik de-facto BNB 5-pillar | Framework penjurian BNB co-organizer | Jul 2026 |
| Kontrak base 6 test PASS, Foundry v1.7.1 | Verifikasi lokal `forge test` | 7 Jul 2026 |

> 💡 Peringatan sumber. Beberapa fakta awalnya keliru di brief (misal tanggal Demo Day). Angka dan tanggal di tabel ini sudah dikoreksi terhadap sumber resmi. Jangan pakai angka dari draft awal, pakai ledger ini.

---

<div align="center">
<sub>© 2026 PT Surya Inovasi Prioritas (SURIOTA) · <a href="README.md">Hub WattSettle</a> · Update 7 Juli 2026</sub>
</div>
