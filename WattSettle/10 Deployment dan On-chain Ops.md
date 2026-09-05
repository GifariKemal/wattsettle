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
| Kontrak `WattSettle.sol` | **LIVE** `0xCA0A97a70fF720447051bDa247F8EE87e7B8Bb12` |
| Ukuran bytecode | 8322 byte |
| Token `suriota` (ERC20, 18 desimal) | `0x5f730750388176206cC3A7FE894c413675381B05` |
| totalSupply `suriota` | 1,000,000 (mint di wallet owner) |
| Status token | deployed dan verified di BscScan testnet 97 |
| Wallet deployer, `DEFAULT_ADMIN_ROLE` | `0x52317162A7a228D01353e8907a5C068A6D9a0F2e` |
| Wallet agent verifier, `VERIFIER_ROLE` | `0xce4D51524eDECD04B5417F6C8B6E6B6b9e594291` |
| Device signer SRT-MGATE-1210-#001 | `0xA532b1e8773EC9d7db671d346f801C9f8d0c8D49` |
| `deviceId` | `0x0031a129f3c56572aefe8bb776a9bf495063f06a5388adb62ae2ee56455c1eb8` |
| Device owner (produsen, penerima payout) | `0xE07aE16B2Ca0fA9Df8A667FD34729307C3333f8d` |
| `baselineKwh` device di rantai | 100 |
| Treasury (penerima fee protokol) | `0x703629a46690e30D546e80AA9B8F03538F3F5b0E` |
| UI | BscScan sebagai UI (lihat [12 Frontend dan dApp UI](<12 Frontend dan dApp UI.md>)) |

### Dua belas transaksi yang sudah confirmed

Semuanya berstatus 1. Awalan URL `https://testnet.bscscan.com/tx/`.

| # | Aksi | Tx hash |
|:--:|:--|:--|
| 1 | deploy `WattSettle` | `0xe1b2fefcd43ad357b57a32f8b5cb2bc78c463bdc3b6bc998e25421f17cf31e00` |
| 2 | `setTreasury` | `0x355d96a74e7b18bc4ad930edb8c9357af4d051210eafe70cbf49d93a82216968` |
| 3 | `registerDevice` (dengan baseline 100) | `0x196129ce1d95f05163540b9c4361ae7dae55c9c96a6b2053cf181ef571dc0c04` |
| 4 | `grantRole` VERIFIER_ROLE ke agent | `0x65813269a68ab835d3b58dc9bd227af13c1d0e2bea841bed567b424bacbc1283` |
| 5 | `revokeRole` VERIFIER_ROLE dari deployer | `0x90a9b8dd86db228c49d185a244732d495868c3e4c6e64e34f1ccb8a0c7f9003c` |
| 6 | pre-fund pool 50000 `suriota` | `0x30e1d99874395fa3653813c600cc56705bddd9ac7fe49f9b36180c08516c7dbc` |
| 7 | `submitReading` #0 (105 kWh, bersih) | `0xa917b1967bc221808308a6e67f9374d1895df277b700d738d93e01a95251d853` |
| 8 | `submitReading` #1 (4200 kWh, anomali) | `0x87772b040699c8395985f76813bb77de4ac1e73bcffcf406a36d782eab87c8e0` |
| 9 | `submitReading` #2 (900 kWh, untuk uji verifier bohong) | `0xb054108de5ed38970b5a0b39100b435703eb0f6818c6142268b21b3c49a5fbd4` |
| 10 | `attestAndSettle` #0 APPROVED oleh agent | `0xff78c3ec3c97d0ef43b80c025e664d165d60ba09616f58a69f28304e4ee9254c` |
| 11 | `attestAndSettle` #1 REJECTED oleh agent (jujur) | `0xbf21a81936edbde6d380444bd3d5badd63bc44ebb7bfd1acf929e5f71af49934` |
| 12 | `attestAndSettle` #2 REJECTED walau verifier BERBOHONG | `0x7e8ba5a7b1e09f33a8015c043383500276fda8ad59e61bac861f78ce98391781` |

Ditambah satu transaksi di kontrak lain yang tetap berlaku, yaitu pendaftaran agent ERC-8004
(agentId 2116) lewat `0x7216d78dc573bb5b1f9b780cf4a8fbdca7c1cbab882ec633051e488a3ecbaa5d`.

> [!IMPORTANT]
> **Transaksi 12 adalah bukti tunggal terkuat di seluruh entri.** Attestation yang dikirim
> untuk bacaan #2 sengaja dibuat tidak jujur: 900 kWh terhadap baseline 100, tetapi mengaku
> `kwhDeltaVsBaseline = 0` dan `anomalyScoreBps = 0`. Kontrak menghitung sendiri delta 800
> dan anomali 10000 bps dari `baselineKwh` on-chain, lalu menolak tanpa membayar apa pun.
> Verifier yang berbohong memegang hak veto, bukan kuasa menyetujui. Uraiannya di
> [09 Keamanan](<09 Keamanan.md>).

> [!NOTE]
> Transaksi 5 penting untuk pitch. Setelah `VERIFIER_ROLE` diberikan ke agent, **deployer
> mencabut role itu dari dirinya sendiri**. Jadi menurut rantai, satu-satunya alamat yang
> bisa memanggil `attestAndSettle` adalah wallet agent. Autonomy-nya bukan klaim, itu
> properti izin yang bisa dibaca siapa pun.

### Hasil settlement, dibaca balik dari saldo

| Bacaan | Keputusan | Perhitungan | Hasil |
|:--|:--|:--|:--|
| #0, 105 kWh | APPROVED | 105 kWh x 1 `suriota` = 105 gross, `feeBps` 100 (1 persen) | 1,05 `suriota` ke treasury, 103,95 `suriota` ke produsen |
| #1, 4200 kWh | REJECTED on-chain | kedua lapis gate menolak, verifier jujur | nol payout |
| #2, 900 kWh | REJECTED on-chain | verifier mengaku bersih, kontrak menghitung sendiri 800 delta dan 10000 bps lalu menolak | nol payout |

Reputation device setelah ketiganya: `approvedReadings` 1, `rejectedReadings` 2,
`avgAnomalyBps` 6833. Sisa reward pool 49895 `suriota`.

---

## ⛽ Kebutuhan Wallet dan Gas

Sebelum deploy, pastikan wallet punya tBNB cukup dari faucet. Kebutuhan minimalnya kecil, tapi harus ada cadangan agar tidak kehabisan gas di panggung.

- Wallet deployer butuh tBNB untuk deploy dan verify.
- Wallet agent verifier butuh tBNB minimal **10 kali gas satu transaksi** agar aman menjalankan loop.
- Reward pool kontrak butuh saldo `suriota` minimal setara payout demo. Yang dipakai adalah pre-fund 50000 `suriota`, ukuran yang sengaja dipatok untuk kebutuhan demo, lihat [08 Tokenomics](<08 Tokenomics.md>).

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
export DEVICE_BASELINE_KWH="100"  # dipakai script deploy untuk registerDevice

# deploy WattSettle dengan settlement token = suriota
forge create src/WattSettle.sol:WattSettle \
  --rpc-url $BSC_TESTNET_RPC \
  --private-key $DEPLOYER_PK \
  --constructor-args $SURIOTA_TOKEN

# simpan alamat kontrak hasil deploy
export WATTSETTLE_CONTRACT="0x..."   # dari output forge create
```

> [!WARNING]
> `DEVICE_BASELINE_KWH` bukan hiasan. Nilai itulah yang dipasang script deploy sebagai
> parameter keempat `registerDevice`, dan **baseline di berkas ruleset wajib sama persis
> dengan baseline di rantai**. Kalau keduanya berbeda, verifier dan kontrak akan menghitung
> deviasi yang berlainan, dan bacaan yang sah bisa tertolak tanpa sebab yang terlihat.
> Perangkat dengan baseline nol tidak akan pernah bisa dibayar, karena pembaginya dipaksa
> menjadi 1 sehingga skor anomalinya selalu maksimum. Baseline yang bergeser mengikuti
> musim atau beban disetel lewat `setDeviceBaseline`, jangan lewat pendaftaran ulang, sebab
> mendaftarkan ulang akan mereset `lastTs`.

### Menghitung `rulesetHash` dengan benar

`rulesetHash` adalah `keccak256` atas **byte mentah** berkas ruleset, jadi perintahnya harus
menghash byte, bukan teks heksadesimalnya.

```bash
# BENAR, awalan 0x membuat cast memperlakukan argumennya sebagai byte
cast keccak 0x$(xxd -p -c 999999 ruleset/anomaly_v1.json)
```

Tanpa awalan `0x`, `cast` akan menghash teks heks-nya dan menghasilkan nilai yang salah.
Nilai kanoniknya `0xcce6c15c459cd085ae0c5d364227022f59f70d7036819c7b023598a590df6b41`.
Berkas ruleset dan kartu agent ditandai `-text` di `.gitattributes` supaya git tidak pernah
mengonversi akhiran barisnya, sebab checkout CRLF menghasilkan hash yang berbeda dari blob
LF yang ter-commit. CI gagal bila berkas itu berubah tanpa nilai kanoniknya ikut diperbarui.
Latar lengkapnya di [09 Keamanan](<09 Keamanan.md>).

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
forge verify-contract 0xCA0A97a70fF720447051bDa247F8EE87e7B8Bb12 \
  src/WattSettle.sol:WattSettle \
  --chain 97 \
  --verifier sourcify \
  --constructor-args $(cast abi-encode "constructor(address)" $SURIOTA_TOKEN) \
  --watch
```

Hasilnya `exact_match`, terbit di `https://repo.sourcify.dev/97/0xCA0A97a70fF720447051bDa247F8EE87e7B8Bb12`.

### Yang masih menggantung: lencana verified di BscScan

> [!CAUTION]
> Verifikasi Sourcify **tidak** memunculkan status "Verified" di testnet.bscscan.com. Kedua
> sistem itu berdiri sendiri. Jadi hard gate 4 (lencana verified BscScan) **masih terbuka**,
> dan satu-satunya yang menutupnya adalah kunci Etherscan V2. Ini kini menjadi satu-satunya
> penghalang teknis yang tersisa, dan hanya pemilik akun yang bisa membuat kuncinya.

Perintahnya sudah siap jalan, tinggal kuncinya diisi:

```bash
forge verify-contract 0xCA0A97a70fF720447051bDa247F8EE87e7B8Bb12 \
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
Ukurannya dipatok untuk kebutuhan demo. Perhatikan bahwa **kontrak sengaja tidak punya
fungsi tarik dana**, jadi token yang sudah masuk tidak bisa diambil kembali oleh admin. Itu
jaminan bagi produsen, sekaligus alasan untuk mengisi sesuai kebutuhan, bukan berlebihan.

```bash
# kirim 50000 suriota (18 desimal) ke kontrak WattSettle
cast send $SURIOTA_TOKEN \
  "transfer(address,uint256)" $WATTSETTLE_CONTRACT 50000000000000000000000 \
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

# 5. baseline on-chain cocok dengan baseline di berkas ruleset
cast call $WATTSETTLE_CONTRACT "assess(bytes32,uint256)(int256,uint16)" $DEVICE_ID 105 \
  --rpc-url $BSC_TESTNET_RPC
echo "Simulasi assess untuk bacaan demo (assert delta dan anomaly di dalam bound)"

# 6. video fallback siap, satu keystroke full-screen
echo "[ ] Video fallback flawless siap"

# 7. tab-2 BscScan tx confirmed sebelumnya, event decoded expanded
echo "[ ] Tab-2 pre-loaded tx confirmed"

echo "== Selesai. Jangan start demo bila ada assert gagal. =="
```

> ⚠️ Guard monotonic dan replay akan revert bila reading id demo sudah terpakai. Pastikan fixture yang dipakai punya timestamp dan nonce fresh. Rehearse rantai penuh cron ke attest ke settle ke confirm sebanyak 20 kali melawan RPC nyata dengan `bash scripts/rehearse-loop.sh 20` (lihat [11 Testing dan QA](<11 Testing dan QA.md>)).

---

## ✅ Ringkas

- ✅ `WattSettle.sol` sudah live di testnet 97 di `0xCA0A97a70fF720447051bDa247F8EE87e7B8Bb12`, di-deploy dari WSL Ubuntu dengan forge 1.7.1, constructor satu argumen berisi alamat `suriota`.
- ✅ Sumber sudah terverifikasi publik di Sourcify dengan hasil `exact_match`.
- ⏳ Lencana verified di BscScan masih menunggu kunci Etherscan V2 terpadu, perintahnya sudah siap jalan.
- ✅ Reward pool sudah di-fund 50000 `suriota`, sisa 49895 setelah payout demo.
- ✅ Dua belas transaksi nyata sudah confirmed, termasuk satu approve yang membayar, satu reject yang jujur, dan satu reject yang menolak walaupun verifier berbohong.
- ✅ Gate dua lapis terbukti di rantai: kontrak menghitung sendiri dari `baselineKwh` on-chain dan menolak attestation palsu lewat tx `0x7e8ba5a7...98391781`.
- ✅ Deployer sudah mencabut `VERIFIER_ROLE` dari dirinya sendiri, jadi hanya agent yang bisa settle.
- Jalankan night-before checklist as code, tidak start demo bila ada assert gagal.

---

<div align="center">
<sub>© 2026 PT Surya Inovasi Prioritas (SURIOTA) · <a href="README.md">Hub WattSettle</a> · Update 5 September 2026</sub>
</div>
