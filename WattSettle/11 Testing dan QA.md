<div align="center">

![Bab](https://img.shields.io/badge/BAB-11%20Testing-06b6d4?style=for-the-badge)
&nbsp;
![WattSettle](https://img.shields.io/badge/WattSettle-Build%20Bible-22c55e?style=for-the-badge)
&nbsp;
![Tests](https://img.shields.io/badge/20%20test-hijau-22c55e?style=for-the-badge)

# 🧪 Testing dan QA

### TDD pada delta, test matrix, dan rehearsal loop

</div>

**Navigasi:** [Hub](README.md) · [Sebelumnya: 10 Deployment dan On-chain Ops](<10 Deployment dan On-chain Ops.md>) · [Berikutnya: 12 Frontend dan dApp UI](<12 Frontend dan dApp UI.md>)

---

## 💡 Prinsip Satu Kalimat

WattSettle adalah evolusi, bukan rewrite, jadi disiplin testing berjalan **pada delta**, yaitu pertahankan test base tetap hijau setelah rename `verifyReading` menjadi `attestAndSettle`, lalu tambahkan test baru untuk tiap fitur delta. Hasil akhirnya **20 test deterministik dan semuanya lolos**, berada di `proofofwatt/test/WattSettle.t.sol`.

> 💡 TDD memakai superpowers test-driven-development. Tulis test yang gagal dulu (red), lalu implementasi minimal (green), lalu refactor. Delta yang di-cover adalah struct Attestation, event, ruleset gate, SafeERC20, ReentrancyGuard, solvency, reputation, dan fee split.

---

## 🔴 Struktur Suite yang Di-ship

Base `ProofOfWatt.sol` punya 6 test PASS di Foundry v1.7.1. Setelah rename
`verifyReading(id, bool)` menjadi `attestAndSettle(id, Attestation)`, test lama disesuaikan
agar melewatkan struct `Attestation` yang lolos gate, bukan boolean. Suite akhirnya tumbuh
menjadi dua kontrak test di atas satu harness bersama.

| Kontrak | Isi | Jumlah |
|:--|:--|:--:|
| `abstract contract WattSettleHarness is Test` | setup bersama (deploy, register device, fixture tanda tangan) | - |
| `WattSettleBaseTest` | jalur masuk, tanda tangan, guard, setter | 8 |
| `WattSettleDeltaTest` | attest, settle, fee, reputation, reentrancy, batas parameter | 12 |
| **Total** | | **20** |

> [!WARNING]
> Nama `ProofOfWattBaseTest` yang tercetak di versi lama bab ini **tidak pernah ada**.
> Perintah yang benar memakai nama kontrak yang di-ship.

```bash
# jalankan hanya test base, pastikan tetap hijau
forge test --match-contract WattSettleBaseTest -vv

# jalankan hanya test delta
forge test --match-contract WattSettleDeltaTest -vv
```

---

## 🧮 Test Matrix

Dua puluh test deterministik, semuanya unit test Foundry, dengan malicious mock token khusus
untuk kasus reentrancy. Tidak ada satu pun yang bergantung pada waktu nyata atau RPC.

### `WattSettleBaseTest` (8)

| # | Nama test | Yang diverifikasi |
|:--:|:--|:--|
| 1 | `testRegisterDevice` | Device terdaftar dengan signer benar |
| 2 | `testSubmitReadingValidSig` | Reading dengan signature EIP-712 sah diterima |
| 3 | `testSubmitReadingRejectsBadSig` | Signature salah direvert |
| 4 | `testReplayGuardReverts` | `usedDigest` menolak digest yang sudah dipakai |
| 5 | `testMonotonicTimestampGuard` | Timestamp mundur direvert |
| 6 | `testSubmitReadingUnknownDevice` | Device yang belum terdaftar direvert |
| 7 | `testSetRewardPerKwh` | Admin menyetel reward per kWh |
| 8 | `testRegisterDeviceRejectsZeroOwner` | `owner` nol direvert `ZeroAddress`, payout tidak bisa terbakar |

### `WattSettleDeltaTest` (12)

| # | Nama test | Yang diverifikasi |
|:--:|:--|:--|
| 1 | `testAttestApprovePaysViaSafeERC20` | Approve membayar produsen via SafeERC20 |
| 2 | `testRejectWhenAnomalyAboveThreshold` | Anomaly bps di atas ambang, reject, no payout |
| 3 | `testRejectWhenDeltaOutOfBound` | Delta di luar bound, reject, no payout |
| 4 | `testReputationIncrement` | Counter approved atau rejected per device naik |
| 5 | `testReentrancyAttemptReverts` | Malicious token yang re-enter direvert |
| 6 | `testInsufficientPoolReverts` | Pool kurang revert `InsufficientRewardPool` |
| 7 | `testOnlyVerifierCanAttest` | Non-`VERIFIER_ROLE` direvert |
| 8 | `testFeeSplitCorrect` | Fee bps benar, produsen terima sisa, treasury terima fee |
| 9 | `testEventEmitsDecodedAttestation` | Event `ReadingAttested` memuat Attestation decoded |
| 10 | `testNotPendingOnDoubleAttest` | Attest kedua atas id yang sama direvert `NotPending` |
| 11 | `testFeeBpsCapEnforced` | `setFeeBps` di atas `MAX_FEE_BPS` direvert `FeeTooHigh` |
| 12 | `testSetGateParamsRejectsImpossibleBound` | Bound anomali di atas 10000 direvert `InvalidAnomalyBound` |

> 💡 Nomor 9 di tabel delta adalah bukti "rationale on-chain" yang menjadi peak pitch, sebab event decodable itulah yang dibaca juri di BscScan. Nomor 11 dan 12 menjaga setter admin tidak berubah menjadi pintu belakang.

---

## 🔎 Temuan: `ReplayedReading` Tidak Terjangkau oleh Kirim Ulang Biasa

Ini temuan yang muncul justru karena test-nya ditulis serius, dan layak dicatat sebab versi
lama bab ini melewatkannya.

`timestamp` ikut masuk ke digest EIP-712. Akibatnya, mengirim ulang bacaan yang sama persis
selalu membawa timestamp yang sama pula, sementara `lastTs` device sudah maju ke nilai itu.
Yang muncul lebih dulu adalah `StaleTimestamp`, bukan `ReplayedReading`. Dengan kata lain,
**kirim ulang mentah-mentah tidak pernah menyentuh `usedDigest`**.

Satu-satunya jalur yang benar-benar sampai ke `usedDigest` adalah mendaftarkan ulang device,
yang mengembalikan `lastTs` ke nol, lalu mengirim ulang bacaan lama yang sudah ditandatangani.
`testReplayGuardReverts` melakukan persis itu.

> [!IMPORTANT]
> Kenapa ini penting. Test base yang lama hanya memberi komentar bahwa revert lewat
> `StaleTimestamp` "juga bisa diterima sebagai anti-replay". Itu lambaian tangan, bukan bukti,
> dan efeknya `usedDigest` tidak pernah benar-benar teruji, jadi tidak ada yang bisa memastikan
> ia bukan kode mati. Test yang sekarang membuktikan guard itu hidup dan benar-benar menolak.

---

## 🧨 Reentrancy Mock Token

Test `testReentrancyAttemptReverts` butuh sebuah malicious ERC20 yang mencoba memanggil balik `attestAndSettle` saat transfer. Ini membuktikan `nonReentrant` plus checks-effects-interactions benar-benar menahan re-entry, bukan sekadar diklaim.

```bash
# jalankan hanya test delta, verbose agar terlihat revert reason
forge test --match-test "testReentrancyAttemptReverts|testInsufficientPoolReverts|testFeeSplitCorrect" -vvv
```

---

## 🏃 Perintah Forge Test

```bash
# seluruh suite, 20 test hijau
forge test -vv

# dengan gas report
forge test --gas-report

# coverage untuk memastikan delta ter-cover
forge coverage

# fokus test delta attest dan settle
forge test --match-test "testAttest|testReject|testFee|testReputation" -vv
```

---

## 🧹 Lint Kontrak

```bash
forge lint src/ script/
```

Hasilnya **bersih, nol peringatan**. Dua cast integer yang tersisa, di `_abs` dan `_rollAvg`,
masing-masing membawa justifikasi keselamatan yang ditulis eksplisit di komentar, jadi
kebersihannya bukan hasil mematikan aturan.

---

## 🔁 Rehearsal Loop e2e 20x Melawan RPC Nyata

Unit test membuktikan logika, tapi demo dimenangkan oleh determinism. Rehearse rantai penuh melawan BSC testnet 97 nyata sebanyak **20 kali**, yaitu cron agent bangun sendiri, recompute delta dan anomaly, panggil `attestAndSettle`, sampai transaksi confirmed di BscScan.

```bash
# loop rehearsal e2e 20x melawan RPC nyata (pola)
for i in $(seq 1 20); do
  echo "== Rehearsal run $i/20 =="
  # gunakan fixture dengan timestamp dan nonce fresh tiap run
  node scripts/rehearse-loop.mjs --run "$i"
done
```

> ⚠️ Guard monotonic dan replay akan revert bila reading id diulang, jadi tiap run rehearsal harus memakai fixture dengan timestamp dan nonce distinct. Siapkan antrean fixture agar 20 run tidak saling bentrok. Ini mem-validasi runbook determinism di [10 Deployment dan On-chain Ops](<10 Deployment dan On-chain Ops.md>).

---

## 🔗 Relasi ke Gate Hygiene

Testing bukan hanya soal benar secara logika, tapi juga menutup hard gate. Suite yang hijau plus commit history genuine adalah bagian dari axis Technical Implementation and Code Quality yang berbobot paling tinggi di rubrik.

- Commit harian genuine sejak Sesi 1, jangan squash, sebab single squash adalah red flag (Kill-shot #6).
- Jalankan `/ponytail-review` pada diff test dan implementasi, tapi jangan pangkas assertion keamanan.
- Suite hijau ditambah kontrak verified ditambah dua tx nyata adalah tiga bukti gate yang saling menguatkan.
- Simpan bukti suite hijau ke [21 Checklist Submission](<21 Checklist Submission.md>).

---

## ✅ Ringkas

- TDD berjalan pada delta, dan test base tetap hijau setelah rename ke `attestAndSettle`.
- Yang di-ship adalah **20 test deterministik** di `proofofwatt/test/WattSettle.t.sol`, terbagi `WattSettleBaseTest` (8) dan `WattSettleDeltaTest` (12) di atas `WattSettleHarness`, plus malicious mock token untuk reentrancy.
- Pakai `--match-contract WattSettleBaseTest`, bukan `ProofOfWattBaseTest` yang tidak pernah ada.
- `ReplayedReading` hanya terjangkau lewat jalur register ulang device, dan test-nya sengaja menempuh jalur itu supaya guard-nya terbukti hidup.
- `forge lint src/ script/` bersih, nol peringatan.
- Semua unit test Foundry, tanpa dependency waktu nyata di level unit.
- Rehearse loop e2e 20 kali melawan RPC nyata dengan fixture timestamp fresh.
- Suite hijau adalah bukti gate hygiene di axis teknis yang paling berbobot.

---

<div align="center">
<sub>© 2026 PT Surya Inovasi Prioritas (SURIOTA) · <a href="README.md">Hub WattSettle</a> · Update 5 September 2026</sub>
</div>
