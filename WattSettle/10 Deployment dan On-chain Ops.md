<div align="center">

![Bab](https://img.shields.io/badge/BAB-10%20Deployment-06b6d4?style=for-the-badge)
&nbsp;
![WattSettle](https://img.shields.io/badge/WattSettle-Build%20Bible-22c55e?style=for-the-badge)
&nbsp;
![Chain](https://img.shields.io/badge/BSC%20Testnet-chainId%2097-f0b90b?style=for-the-badge&logo=binance&logoColor=white)

# 🚀 Deployment dan On-chain Ops

### Deploy, verify, pre-fund, fire tx, dan checklist malam sebelumnya

</div>

**Navigasi:** [Hub](README.md) · [Sebelumnya: 09 Keamanan](<09 Keamanan.md>) · [Berikutnya: 11 Testing dan QA](<11 Testing dan QA.md>)

---

## 💡 Prinsip Satu Kalimat

Deploy WattSettle ke BSC testnet 97 dengan Foundry, verify kontraknya di BscScan dengan bukti screenshot, pre-fund reward pool, lalu fire minimal dua transaksi on-chain nyata dan simpan URL-nya. Tiap langkah ini adalah hard gate submission, dan miss satu saja menihilkan entry yang secara teknis menang.

> ⚠️ Foundry wajib dijalankan lewat **Git Bash**, bukan PowerShell. Kontrak `attestAndSettle` yang baru harus di-verify ulang, sebab base yang verified tidak sama dengan kontrak baru yang verified (Kill-shot #6, lihat [16 Risiko dan Kill-shots](<16 Risiko dan Kill-shots.md>)).

---

## 🌐 State On-chain Aktual

Ini state nyata yang sudah ada di BSC testnet 97 per catatan proyek. Jangan mengarang angka lain.

| Item | Nilai |
|:--|:--|
| Chain | BSC Testnet, chainId 97 |
| Wallet deployer (Rabby) | `0x52317162A7a228D01353e8907a5C068A6D9a0F2e` |
| Token `suriota` (ERC20, 18 desimal) | `0x5f730750388176206cC3A7FE894c413675381B05` |
| totalSupply `suriota` | 1,000,000 (mint di wallet owner) |
| Status token | deployed dan verified di BscScan testnet 97 |
| Kontrak `WattSettle.sol` | deploy direncanakan Sesi 6 |
| UI | BscScan sebagai UI (lihat [12 Frontend dan dApp UI](<12 Frontend dan dApp UI.md>)) |

---

## ⛽ Kebutuhan Wallet dan Gas

Sebelum deploy, pastikan wallet punya tBNB cukup dari faucet. Kebutuhan minimalnya kecil, tapi harus ada cadangan agar tidak kehabisan gas di panggung.

- Wallet deployer butuh tBNB untuk deploy dan verify.
- Wallet agent verifier butuh tBNB minimal **10 kali gas satu transaksi** agar aman menjalankan loop.
- Reward pool kontrak butuh saldo `suriota` minimal setara payout demo (pre-fund sekitar 500000 suriota, lihat [08 Tokenomics](<08 Tokenomics.md>)).

---

## 📦 Deploy dengan Foundry

Deploy `WattSettle.sol` ke testnet 97 memakai `forge create` atau `forge script`. Contoh dengan `forge create`.

```bash
# set env dulu (dari .secrets, jangan commit)
export BSC_TESTNET_RPC="https://data-seed-prebsc-1-s1.bnbchain.org:8545"
export DEPLOYER_PK="0x..."        # private key testnet-only
export BSCSCAN_API_KEY="..."
export SURIOTA_TOKEN="0x5f730750388176206cC3A7FE894c413675381B05"

# deploy WattSettle dengan settlement token = suriota
forge create src/WattSettle.sol:WattSettle \
  --rpc-url $BSC_TESTNET_RPC \
  --private-key $DEPLOYER_PK \
  --constructor-args $SURIOTA_TOKEN

# simpan alamat kontrak hasil deploy
export WATTSETTLE_CONTRACT="0x..."   # dari output forge create
```

---

## ✅ Verify Kontrak plus Bukti Screenshot

Kontrak baru wajib di-verify di BscScan agar juri bisa membaca sumbernya. Ambil screenshot halaman verified sebagai bukti gate.

```bash
forge verify-contract $WATTSETTLE_CONTRACT src/WattSettle.sol:WattSettle \
  --chain 97 \
  --etherscan-api-key $BSCSCAN_API_KEY \
  --constructor-args $(cast abi-encode "constructor(address)" $SURIOTA_TOKEN) \
  --watch
```

> 💡 Setelah status "Verified" muncul di BscScan, ambil screenshot dan simpan sebagai bukti di [21 Checklist Submission](<21 Checklist Submission.md>). Base yang verified tidak menghitung, yang dinilai adalah kontrak baru dengan `attestAndSettle`.

---

## 🪙 Pre-fund Reward Pool

Payout memakai `safeTransfer` dari saldo kontrak, bukan mint, jadi kontrak harus diisi dulu.

```bash
# kirim 500000 suriota (18 desimal) ke kontrak WattSettle
cast send $SURIOTA_TOKEN \
  "transfer(address,uint256)" $WATTSETTLE_CONTRACT 500000000000000000000000 \
  --rpc-url $BSC_TESTNET_RPC --private-key $DEPLOYER_PK

# verifikasi saldo pool
cast call $SURIOTA_TOKEN "balanceOf(address)(uint256)" $WATTSETTLE_CONTRACT \
  --rpc-url $BSC_TESTNET_RPC
```

---

## 🔥 Fire Minimal Dua Transaksi On-chain

Hard gate menuntut minimal dua transaksi nyata dari kontrak baru. Pakai dua fungsi inti loop, yaitu `submitReading` dan `attestAndSettle`, lalu simpan URL BscScan-nya.

```bash
# tx 1: submit reading yang sudah ditandatangani device (EIP-712)
cast send $WATTSETTLE_CONTRACT \
  "submitReading(bytes32,uint256,uint64,uint256,bytes)" \
  $DEVICE_ID $KWH $TIMESTAMP $NONCE $SIGNATURE \
  --rpc-url $BSC_TESTNET_RPC --private-key $DEVICE_PK

# tx 2: verifier attest dan settle reading tersebut
cast send $WATTSETTLE_CONTRACT \
  "attestAndSettle(uint256,(int256,uint16,bytes32,bytes32,uint64))" \
  $READING_ID "($DELTA,$ANOMALY_BPS,$MODEL_HASH,$RULESET_HASH,$EVAL_AT)" \
  --rpc-url $BSC_TESTNET_RPC --private-key $VERIFIER_PK
```

> 💡 Simpan kedua URL transaksi (`https://testnet.bscscan.com/tx/0x...`) ke [21 Checklist Submission](<21 Checklist Submission.md>). Untuk demo, pin satu transaksi confirmed dari run sukses sebelumnya di tab BscScan, jangan pernah menunggu indexer live di panggung.

---

## 📋 Checklist Malam Sebelumnya (as code)

Kunci state malam sebelum demo. Script ini menolak start bila ada assert yang gagal, sehingga tidak ada kejutan di panggung.

```bash
#!/usr/bin/env bash
set -euo pipefail

echo "== Night-before checklist WattSettle =="

# 1. kontrak masih verified (cek manual di BscScan, catat OK)
echo "[ ] Kontrak $WATTSETTLE_CONTRACT masih Verified di BscScan"

# 2. saldo suriota kontrak >= payout demo
POOL=$(cast call $SURIOTA_TOKEN "balanceOf(address)(uint256)" $WATTSETTLE_CONTRACT --rpc-url $BSC_TESTNET_RPC)
echo "Reward pool: $POOL (assert >= payout demo)"

# 3. wallet agent verifier punya tBNB >= 10x gas satu tx
GAS=$(cast balance $VERIFIER_ADDR --rpc-url $BSC_TESTNET_RPC)
echo "Saldo tBNB verifier: $GAS (assert >= 10x gas satu tx)"

# 4. reading id demo BELUM terpakai (monotonic+replay guard akan revert re-run)
echo "[ ] 3 fixture distinct-timestamp berantre, digest belum dipakai"

# 5. video fallback siap, satu keystroke full-screen
echo "[ ] Video fallback flawless siap"

# 6. tab-2 BscScan tx confirmed sebelumnya, event decoded expanded
echo "[ ] Tab-2 pre-loaded tx confirmed"

echo "== Selesai. Jangan start demo bila ada assert gagal. =="
```

> ⚠️ Guard monotonic dan replay akan revert bila reading id demo sudah terpakai. Pastikan fixture yang dipakai punya timestamp dan nonce fresh. Rehearse rantai penuh cron ke attest ke settle ke confirm sebanyak 20 kali melawan RPC nyata (lihat [11 Testing dan QA](<11 Testing dan QA.md>)).

---

## ✅ Ringkas

- Deploy `WattSettle.sol` ke testnet 97 dengan Foundry via Git Bash, constructor pakai `suriota`.
- Verify kontrak baru di BscScan, simpan screenshot sebagai bukti gate.
- Pre-fund sekitar 500000 suriota ke kontrak sebelum menjalankan loop.
- Fire minimal dua tx nyata (`submitReading` plus `attestAndSettle`), simpan URL BscScan.
- Jalankan night-before checklist as code, tidak start demo bila ada assert gagal.

---

<div align="center">
<sub>© 2026 PT Surya Inovasi Prioritas (SURIOTA) · <a href="README.md">Hub WattSettle</a> · Update 7 Juli 2026</sub>
</div>
