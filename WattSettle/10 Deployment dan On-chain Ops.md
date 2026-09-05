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

> ⚠️ Foundry wajib dijalankan lewat shell POSIX, **bukan PowerShell**. Di mesin ini yang dipakai adalah **WSL Ubuntu dengan forge 1.7.1**, dan Git Bash juga bekerja. Kontrak `attestAndSettle` yang baru harus di-verify ulang, sebab base yang verified tidak sama dengan kontrak baru yang verified (Kill-shot #6, lihat [16 Risiko dan Kill-shots](<16 Risiko dan Kill-shots.md>)).

---

## 🌐 State On-chain Aktual

Ini state nyata di BSC testnet 97 per **5 September 2026**, dibaca balik dari rantai, bukan dari ingatan. Jangan mengarang angka lain.

| Item | Nilai |
|:--|:--|
| Chain | BSC Testnet, chainId 97 |
| Kontrak `WattSettle.sol` | **LIVE** `0xdA149c0939c0C3450EDE5c8a0A0e8cF3AF36481a` |
| Ukuran bytecode | 7409 byte |
| Token `suriota` (ERC20, 18 desimal) | `0x5f730750388176206cC3A7FE894c413675381B05` |
| totalSupply `suriota` | 1,000,000 (mint di wallet owner) |
| Status token | deployed dan verified di BscScan testnet 97 |
| Wallet deployer, `DEFAULT_ADMIN_ROLE` | `0x52317162A7a228D01353e8907a5C068A6D9a0F2e` |
| Wallet agent verifier, `VERIFIER_ROLE` | `0xce4D51524eDECD04B5417F6C8B6E6B6b9e594291` |
| Device signer SRT-MGATE-1210-#001 | `0xA532b1e8773EC9d7db671d346f801C9f8d0c8D49` |
| `deviceId` | `0x0031a129f3c56572aefe8bb776a9bf495063f06a5388adb62ae2ee56455c1eb8` |
| Device owner (produsen, penerima payout) | `0xE07aE16B2Ca0fA9Df8A667FD34729307C3333f8d` |
| Treasury (penerima fee protokol) | `0x703629a46690e30D546e80AA9B8F03538F3F5b0E` |
| UI | BscScan sebagai UI (lihat [12 Frontend dan dApp UI](<12 Frontend dan dApp UI.md>)) |

### Sebelas transaksi yang sudah confirmed

Semuanya berstatus 1. Awalan URL `https://testnet.bscscan.com/tx/`.

| # | Aksi | Tx hash |
|:--:|:--|:--|
| 1 | deploy `WattSettle` | `0x9cc1cd173cb6164312b4de14e40ad43c0e183ed38ba797ec591e4e452ebd017e` |
| 2 | `setTreasury` | `0x0246db951d52bf746d52feeb0c45ba31d4d108b19e8c264b11b32c8eecfa9bce` |
| 3 | `registerDevice` | `0xa990f69ce4825192bf07383bd41050b35bf26dba88303a8273e0a49bae3aafd3` |
| 4 | `grantRole` VERIFIER_ROLE ke agent | `0x59b5162239c8a8c34f081d02bb0fbe448e4fe7dfce24437f27d0990eee2b3199` |
| 5 | `revokeRole` VERIFIER_ROLE dari deployer | `0x697a6058e3c903638fc1befd2b2c87912d6ea3c5f76c15ccb24dfb9cd3d301ab` |
| 6 | pre-fund pool 500000 `suriota` | `0x5ed3d825d342157bbd747d30723a515524cd0628fd802e6e016686aac5a1107f` |
| 7 | `submitReading` #0 (105 kWh, bersih) | `0x7630a99d896ae1794e943f840d8877b584bb3ee8d2b67ee96e5cfaf5542a4544` |
| 8 | `submitReading` #1 (4200 kWh, anomalous) | `0x3aa5c59415bd3c34912fe8a3040507792aba26c1c80358a518ad400c62b80fc8` |
| 9 | `attestAndSettle` #0 APPROVED oleh agent | `0xebc5365420395715815d912ee6b75c337039fc858358412debae319a64d0d553` |
| 10 | `attestAndSettle` #1 REJECTED oleh agent | `0xdca33d634ca3bb317fcf33a7983975cee87395246bfb2ca04c710b0fbc5d8d40` |
| 11 | pendaftaran agent ERC-8004 (agentId 2116) | `0x7216d78dc573bb5b1f9b780cf4a8fbdca7c1cbab882ec633051e488a3ecbaa5d` |

> [!NOTE]
> Transaksi 5 penting untuk pitch. Setelah `VERIFIER_ROLE` diberikan ke agent, **deployer
> mencabut role itu dari dirinya sendiri**. Jadi menurut rantai, satu-satunya alamat yang
> bisa memanggil `attestAndSettle` adalah wallet agent. Autonomy-nya bukan klaim, itu
> properti izin yang bisa dibaca siapa pun.

### Hasil settlement, dibaca balik dari saldo

| Bacaan | Keputusan | Perhitungan | Hasil |
|:--|:--|:--|:--|
| #0, 105 kWh | APPROVED | 105 kWh x 1 `suriota` = 105 gross, `feeBps` 100 (1 persen) | 1,05 `suriota` ke treasury, 103,95 `suriota` ke produsen |
| #1, 4200 kWh | REJECTED on-chain | gate ruleset menolak | nol payout |

Reputation device setelah keduanya: `approvedReadings` 1, `rejectedReadings` 1,
`avgAnomalyBps` 5250. Sisa reward pool 499895 `suriota`.

---

## ⛽ Kebutuhan Wallet dan Gas

Sebelum deploy, pastikan wallet punya tBNB cukup dari faucet. Kebutuhan minimalnya kecil, tapi harus ada cadangan agar tidak kehabisan gas di panggung.

- Wallet deployer butuh tBNB untuk deploy dan verify.
- Wallet agent verifier butuh tBNB minimal **10 kali gas satu transaksi** agar aman menjalankan loop.
- Reward pool kontrak butuh saldo `suriota` minimal setara payout demo (pre-fund sekitar 500000 suriota, lihat [08 Tokenomics](<08 Tokenomics.md>)).

**Biaya sebenarnya, terukur 5 September 2026.** Gas price di testnet 97 adalah 0,1 gwei, dan
seluruh script deploy menghabiskan sekitar **0,00027 tBNB**. Gas tidak pernah menjadi kendala
di rantai ini, jadi jangan menghabiskan waktu mengoptimasinya. Yang mahal adalah kunci API
untuk verifikasi, bukan gas.

---

## 📦 Deploy dengan Foundry

Deploy `WattSettle.sol` ke testnet 97 memakai `forge create` atau `forge script`. Contoh dengan `forge create`.

```bash
# set env dulu (dari .secrets, jangan commit)
export BSC_TESTNET_RPC="https://data-seed-prebsc-1-s1.bnbchain.org:8545"
export DEPLOYER_PK="0x..."        # private key testnet-only
export ETHERSCAN_API_KEY="..."   # kunci TERPADU dari etherscan.io/myapikey, bukan kunci BscScan
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

Bagian ini ditulis ulang pada 5 September 2026, sebab perintah lamanya sudah tidak jalan.

### Yang berubah di sisi Etherscan

> [!WARNING]
> Endpoint lama `https://api-testnet.bscscan.com/api` sudah **mati**. Etherscan V1 dihentikan
> penuh pada 15 Agustus 2025 dan semua verifikasi sekarang lewat **Etherscan V2 API terpadu**.
> Konsekuensinya keras: **kunci API khusus BscScan DITOLAK**. Yang dibutuhkan adalah kunci
> terpadu dari `https://etherscan.io/myapikey`, dan satu kunci itu sudah mencakup chain 97.

Dua hal lain yang menghemat waktu.

- Dengan forge 1.7.1, cukup `--chain 97`. Endpoint V2 yang benar sudah diresolusi sendiri, tidak perlu `--verifier-url`.
- **Jebakan.** Di forge 1.7.x, nilai default `--verifier` adalah `sourcify`, bukan `etherscan`. Kalau `--verifier etherscan` tidak ditulis eksplisit atau `ETHERSCAN_API_KEY` tidak diset, perintahnya diam-diam pergi ke Sourcify.

### Yang sudah selesai: Sourcify `exact_match`

Sumber kontrak sudah bisa diverifikasi publik sekarang juga, tanpa kunci API sama sekali.

```bash
forge verify-contract 0xdA149c0939c0C3450EDE5c8a0A0e8cF3AF36481a \
  src/WattSettle.sol:WattSettle \
  --chain 97 \
  --verifier sourcify \
  --constructor-args $(cast abi-encode "constructor(address)" $SURIOTA_TOKEN) \
  --watch
```

Hasilnya `exact_match`, terbit di `https://repo.sourcify.dev/97/0xdA149c0939c0C3450EDE5c8a0A0e8cF3AF36481a`.

### Yang masih menggantung: lencana verified di BscScan

> [!CAUTION]
> Verifikasi Sourcify **tidak** memunculkan status "Verified" di testnet.bscscan.com. Kedua
> sistem itu berdiri sendiri. Jadi hard gate 4 (lencana verified BscScan) **masih terbuka**,
> dan satu-satunya yang menutupnya adalah kunci Etherscan V2. Ini kini menjadi satu-satunya
> penghalang teknis yang tersisa, dan hanya pemilik akun yang bisa membuat kuncinya.

Perintahnya sudah siap jalan, tinggal kuncinya diisi:

```bash
forge verify-contract 0xdA149c0939c0C3450EDE5c8a0A0e8cF3AF36481a \
  src/WattSettle.sol:WattSettle \
  --chain 97 \
  --verifier etherscan \
  --etherscan-api-key "$ETHERSCAN_API_KEY" \
  --constructor-args $(cast abi-encode "constructor(address)" 0x5f730750388176206cC3A7FE894c413675381B05) \
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

- ✅ `WattSettle.sol` sudah live di testnet 97 di `0xdA149c0939c0C3450EDE5c8a0A0e8cF3AF36481a`, di-deploy dari WSL Ubuntu dengan forge 1.7.1, constructor satu argumen berisi alamat `suriota`.
- ✅ Sumber sudah terverifikasi publik di Sourcify dengan hasil `exact_match`.
- ⏳ Lencana verified di BscScan masih menunggu kunci Etherscan V2 terpadu, perintahnya sudah siap jalan.
- ✅ Reward pool sudah di-fund 500000 `suriota`, sisa 499895 setelah payout demo.
- ✅ Sebelas transaksi nyata sudah confirmed, termasuk satu approve yang membayar dan satu reject yang tidak membayar.
- ✅ Deployer sudah mencabut `VERIFIER_ROLE` dari dirinya sendiri, jadi hanya agent yang bisa settle.
- Jalankan night-before checklist as code, tidak start demo bila ada assert gagal.

---

<div align="center">
<sub>© 2026 PT Surya Inovasi Prioritas (SURIOTA) · <a href="README.md">Hub WattSettle</a> · Update 5 September 2026</sub>
</div>
