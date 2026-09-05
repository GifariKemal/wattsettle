<div align="center">

![Bab](https://img.shields.io/badge/BAB-00%20Ikhtisar-06b6d4?style=for-the-badge)
&nbsp;
![WattSettle](https://img.shields.io/badge/WattSettle-Build%20Bible-22c55e?style=for-the-badge)
&nbsp;
![Skor](https://img.shields.io/badge/skor-90%2F100-a855f7?style=for-the-badge)

# ⚡ Ikhtisar WattSettle

### Rel pembayaran mesin ke mesin untuk energi terverifikasi

</div>

**Navigasi:** [Hub](README.md) · [Berikutnya: 01 Latar Belakang](<01 Latar Belakang.md>)

---

## 💡 Satu Paragraf

WattSettle adalah **rel settlement on-chain untuk energi fisik**. Perangkat SURIOTA yang terpasang di lapangan menandatangani angka kWh secara kriptografis, sebuah verifier AI otonom memeriksa ulang bacaan itu terhadap baseline perangkat, menuliskan alasannya sebagai attestation on-chain, lalu kontrak membayar produsen energi secara otomatis dan memungut fee protokol. Setiap langkah menjadi transaksi yang bisa dicek publik di BscScan. Tagline kerja: **zkPull untuk energi fisik**.

---

## 🔁 Satu Loop

<div align="center">
<img src="assets/loop-settlement.svg" alt="Alur satu loop WattSettle" width="100%">
</div>

> 💡 Diagram di atas beranimasi. Versi diagram statis yang presisi ada di bawah.

<div align="center">
<img src="assets/mmd-00-1.png" alt="Diagram alur satu loop WattSettle (statis)">
</div>

Karena yang di-settle adalah bacaan meter itu sendiri, tidak ada celah oracle antara bukti fisik dan pembayaran. Meter **adalah** transaksi.

---

## 🧭 Keputusan Kunci

| Topik | Keputusan | Detail |
|:--|:--|:--|
| Ide | Opsi 5 dan 6 digabung | [22 Decision Log](<22 Decision Log.md>) |
| Nama | **WattSettle** (Enovatek adalah use case demo) | [22 Decision Log](<22 Decision Log.md>) |
| Token | `suriota` default, MockUSD cadangan | [08 Tokenomics](<08 Tokenomics.md>) |
| Tooling | Foundry dan OpenZeppelin Contracts | [04 Setup Lingkungan](<04 Setup Lingkungan.md>) |
| Track | Finance & Commerce, AI Agents fallback | [01 Latar Belakang](<01 Latar Belakang.md>) |
| Chain | BSC testnet, chainId 97, UI via BscScan | [10 Deployment](<10 Deployment dan On-chain Ops.md>) |

---

## 📊 Posisi dan Peluang

```
WattSettle  ██████████████████░░  90.0   entri utama, moat nyata
```

| Metrik | Angka jujur | Syarat |
|:--|:--:|:--|
| Nominasi atau finalis | 🟢 84% sampai 90% | eksekusi flawless dan semua fix kill-shot |
| Juara 1 in-track | 🟡 45% sampai 58% | tidak dijanjikan, bergantung faktor tak terkontrol |

Detail kalibrasi ada di [16 Risiko dan Kill-shots](<16 Risiko dan Kill-shots.md>).

---

## 🚦 Status Terkini (5 September 2026)

Kontrak sudah **live di BSC testnet chainId 97**. Baris di bawah bukan rencana, semuanya
punya transaksi yang bisa dibuka di BscScan.

| Komponen | Status |
|:--|:--|
| 📄 Kontrak `WattSettle.sol` | **LIVE** di `0xdA149c0939c0C3450EDE5c8a0A0e8cF3AF36481a`, 20 test PASS, ukuran 7409 byte |
| 🪙 Token `suriota` (ERC20) | deployed dan verified di BscScan testnet 97, reward pool sudah di-fund 500000 `suriota` |
| 🤖 AI Verifier (Hermes) | wallet `0xce4D51524eDECD04B5417F6C8B6E6B6b9e594291` memegang `VERIFIER_ROLE`, sudah menyelesaikan satu approve dan satu reject on-chain |
| 🔗 ERC-8004 | agent terdaftar di Identity Registry live chain 97, **agentId 2116** |
| 🔍 Verifikasi sumber | Sourcify `exact_match` sudah terbit, lencana verified BscScan masih menunggu kunci Etherscan V2 |
| 🌐 Website pemaparan | live di web3.gifariksuryo.xyz |

> [!NOTE]
> Loop lengkapnya sudah pernah berjalan sungguhan: bacaan 105 kWh disetujui dan membayar
> 103,95 `suriota` ke produsen plus 1,05 `suriota` fee ke treasury, sedangkan bacaan
> 4200 kWh ditolak on-chain tanpa satu token pun berpindah. Rincian alamat, transaksi,
> dan sisa saldo pool ada di [10 Deployment](<10 Deployment dan On-chain Ops.md>).

> 💡 Mulai membangun dari [04 Setup Lingkungan](<04 Setup Lingkungan.md>), lalu ikuti peta per sesi di [13 Workflow Build](<13 Workflow Build.md>).

---

<div align="center">
<sub>© 2026 PT Surya Inovasi Prioritas (SURIOTA) · <a href="README.md">Hub WattSettle</a> · Update 5 September 2026</sub>
</div>
