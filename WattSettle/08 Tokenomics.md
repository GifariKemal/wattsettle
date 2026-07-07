<div align="center">

![Bab](https://img.shields.io/badge/BAB-08%20Tokenomics-06b6d4?style=for-the-badge)
&nbsp;
![WattSettle](https://img.shields.io/badge/WattSettle-Build%20Bible-22c55e?style=for-the-badge)
&nbsp;
![Token](https://img.shields.io/badge/token-suriota%20verified-f0b90b?style=for-the-badge&logo=binance&logoColor=white)

# 🏦 Tokenomics

### Settlement token, fee split, dan pre-fund reward pool

</div>

**Navigasi:** [Hub](README.md) · [Sebelumnya: 07 AI Verifier](<07 AI Verifier.md>) · [Berikutnya: 09 Keamanan](<09 Keamanan.md>)

---

## 💡 Prinsip Satu Kalimat

WattSettle tidak menciptakan token baru untuk hackathon. Ia memakai ulang ERC20 `suriota` yang sudah **deployed dan verified** di BscScan testnet 97 sebagai settlement token default, dan menyiapkan `MockUSD` (mock stablecoin 6 desimal) sebagai cadangan yang bisa ditukar lewat satu baris di constructor. Keputusan ini menghilangkan seluruh risiko token baru dan menjaga permukaan demo tetap sekecil mungkin.

> 💡 Pelajaran dari PiggyCell (lihat [19 Referensi](<19 Referensi.md>)): tokenomics yang sehat adalah aliran token yang **didukung aktivitas nyata**, bukan inflasi emisi. WattSettle mewujudkannya dengan cara yang lebih tajam lagi, yaitu produsen dibayar atas energi yang sudah diverifikasi, bukan diberi reward karena sekadar memakai jaringan.

---

## 🪙 Token Default vs Cadangan

Ada dua kandidat settlement token. Yang default adalah `suriota`, yang cadangan adalah `MockUSD`. Keduanya cocok ke interface `IERC20` yang sama, jadi kontrak tidak peduli mana yang dipasang.

| Aspek | `suriota` (default) | `MockUSD` (cadangan) |
|:--|:--|:--|
| Jenis | ERC20 utility token milik SURIOTA | Mock stablecoin 6 desimal, in-repo |
| Status on-chain | Deployed dan verified di BscScan testnet 97 | Dibuat saat butuh, tidak di-wire default |
| Alamat | `0x5f730750388176206cC3A7FE894c413675381B05` | belum di-deploy |
| Desimal | 18 | 6 |
| Standar | OZ ERC20 plus Ownable, ada `mint onlyOwner` | ERC20 sederhana untuk demo |
| Risiko token baru | nol, sudah ada dan teruji | ada satu artefak baru untuk dijaga |
| Kapan dipakai | selalu, kecuali panel condong regulator | saat sensitivitas keyword "stablecoin" tinggi di hari-H |
| Cara ganti | default | one-line constructor swap |

<details>
<summary>Kenapa memakai ulang <code>suriota</code>, bukan mint token baru</summary>

Token `suriota` sudah verified di BscScan (solc 0.8.34, OZ ERC20 plus Ownable), sudah punya totalSupply 1,000,000 di wallet owner, dan sudah lolos hard gate wallet token-verify. Membuat token baru berarti menambah artefak yang harus dibuat, di-verify ulang, dan dijaga saldonya, tepat di titik di mana demo solo builder paling rapuh. Disiplin evolve-not-rewrite dan ponytail minimal-code proyek ini menuntut nol dependency baru bila yang lama sudah cukup.

</details>

---

## 💸 Aliran Fee On-chain

Saat `attestAndSettle` menyetujui sebuah reading, kontrak menghitung reward, memungut fee protokol dalam basis poin (`feeBps`), lalu membayar sisanya ke produsen. Fee ini adalah substansi Finance yang mengubah WattSettle dari sekadar transfer menjadi payment rail dengan revenue model (fix Kill-shot #4, lihat [16 Risiko dan Kill-shots](<16 Risiko dan Kill-shots.md>)).

```solidity
uint256 reward = s.kWh * rewardPerKwh;
uint256 fee = (reward * feeBps) / 10_000;               // 1% pada feeBps = 100
if (rewardToken.balanceOf(address(this)) < reward) revert InsufficientRewardPool();
rewardToken.safeTransfer(devices[s.deviceId].owner, reward - fee);   // produsen
if (fee > 0) rewardToken.safeTransfer(treasury, fee);               // protokol
```

Contoh angka dengan `feeBps = 100` (1%):

| Komponen | Rumus | Nilai contoh (reward 1000 suriota) |
|:--|:--|:--:|
| Reward kotor | `kWh * rewardPerKwh` | 1000 suriota |
| Fee protokol | `reward * feeBps / 10_000` | 10 suriota |
| Diterima produsen | `reward - fee` | 990 suriota |
| Masuk treasury | `fee` | 10 suriota |

> 💡 Range take-rate produksi adalah 0.5% sampai 2%. Untuk demo dipakai 1% (`feeBps = 100`) agar mudah dibaca juri. Karena fee dihitung dan ditransfer di kontrak yang sama, revenue model-nya provable on-chain, bukan klaim slide.

---

## ⚡ Pre-fund Reward Pool (wajib sebelum demo)

Ini bug demo paling penting dan harus dieksekusi jauh sebelum hari-H. Payout memakai `safeTransfer` **dari saldo kontrak itu sendiri**, bukan mint. Fungsi `mint` di token `suriota` adalah `onlyOwner`, dan owner adalah wallet deployer, bukan kontrak WattSettle. Artinya jika reward pool kontrak kosong, `attestAndSettle` akan revert `InsufficientRewardPool` di panggung.

**Aksi wajib:** transfer sekitar **500000 suriota** ke alamat kontrak WattSettle setelah deploy, sebelum menjalankan loop demo.

```bash
# pre-fund reward pool: kirim 500000 suriota ke kontrak WattSettle
cast send $SURIOTA_TOKEN \
  "transfer(address,uint256)" $WATTSETTLE_CONTRACT 500000000000000000000000 \
  --rpc-url $BSC_TESTNET_RPC --private-key $DEPLOYER_PK

# verifikasi saldo pool kontrak
cast call $SURIOTA_TOKEN "balanceOf(address)(uint256)" $WATTSETTLE_CONTRACT \
  --rpc-url $BSC_TESTNET_RPC
```

> ⚠️ Angka `500000000000000000000000` adalah 500000 dikali 10^18 karena `suriota` memakai 18 desimal. Bila nanti ditukar ke `MockUSD` yang 6 desimal, jumlah unit ini harus disesuaikan. Solvency check `balanceOf(address(this)) < reward` di kontrak adalah jaring pengaman terakhir bila pool kurang, tapi jangan mengandalkannya di panggung. Assert saldo cukup pada night-before checklist di [10 Deployment dan On-chain Ops](<10 Deployment dan On-chain Ops.md>).

---

## 🧭 Framing: Utility Token, Bukan Security

Positioning `suriota` harus tegas sebagai **utility token, bukan security**. Ia adalah medium settlement untuk membayar produsen atas kWh terverifikasi, bukan instrumen yang menjanjikan imbal hasil dari usaha pihak lain. Nilainya melekat pada aktivitas nyata, yaitu tiap payout mewakili energi fisik yang sudah diukur, ditandatangani perangkat, dan diverifikasi ulang oleh AI verifier.

Ini selaras dengan pelajaran PiggyCell bahwa token flow harus di-back aktivitas nyata dan bukan inflasi. Bedanya, arah nilai WattSettle adalah settlement kewajiban (produsen dibayar atas energi) sementara PiggyCell adalah reward emission (user dapat token karena memakai). Untuk regulasi Indonesia, framing "settlement atau escrow instrument" lebih aman daripada "alat bayar", dan escape hatch `MockUSD` disiapkan tepat untuk saat panel condong ke sudut regulator.

---

## ✅ Ringkas

- Default settlement token adalah `suriota`, sudah verified di testnet 97, nol risiko token baru.
- `MockUSD` 6 desimal adalah cadangan one-line constructor swap, dipakai bila keyword stablecoin penting di hari-H.
- Fee protokol dipungut on-chain dalam bps, demo pakai 1%, sisanya ke produsen.
- Pre-fund sekitar 500000 suriota ke kontrak sebelum demo karena payout memakai transfer dari saldo kontrak, bukan mint.
- Framing tegas utility token bukan security, nilai di-back aktivitas nyata seperti pelajaran PiggyCell.

---

<div align="center">
<sub>© 2026 PT Surya Inovasi Prioritas (SURIOTA) · <a href="README.md">Hub WattSettle</a> · Update 7 Juli 2026</sub>
</div>
