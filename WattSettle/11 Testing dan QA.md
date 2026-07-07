<div align="center">

![Bab](https://img.shields.io/badge/BAB-11%20Testing-06b6d4?style=for-the-badge)
&nbsp;
![WattSettle](https://img.shields.io/badge/WattSettle-Build%20Bible-22c55e?style=for-the-badge)
&nbsp;
![Tests](https://img.shields.io/badge/target-14%20test%20hijau-22c55e?style=for-the-badge)

# 🧪 Testing dan QA

### TDD pada delta, test matrix, dan rehearsal loop

</div>

**Navigasi:** [Hub](README.md) · [Sebelumnya: 10 Deployment dan On-chain Ops](<10 Deployment dan On-chain Ops.md>) · [Berikutnya: 12 Frontend dan dApp UI](<12 Frontend dan dApp UI.md>)

---

## 💡 Prinsip Satu Kalimat

WattSettle adalah evolusi, bukan rewrite, jadi disiplin testing berjalan **pada delta**, yaitu pertahankan 6 test base tetap hijau setelah rename `verifyReading` menjadi `attestAndSettle`, lalu tambahkan test baru untuk tiap fitur delta hingga total sekitar 14 test deterministik.

> 💡 TDD memakai superpowers test-driven-development. Tulis test yang gagal dulu (red), lalu implementasi minimal (green), lalu refactor. Delta yang di-cover adalah struct Attestation, event, ruleset gate, SafeERC20, ReentrancyGuard, solvency, reputation, dan fee split.

---

## 🔴 Pertahankan 6 Test Base Hijau

Base `ProofOfWatt.sol` sudah punya **6 test PASS** di Foundry v1.7.1. Satu-satunya perubahan fungsi adalah `verifyReading(id, bool)` menjadi `attestAndSettle(id, Attestation)`. Setelah rename, 6 test lama harus hijau lagi dengan menyesuaikan pemanggilan agar melewatkan struct `Attestation` yang lolos gate, bukan boolean.

```bash
# jalankan hanya test base setelah rename, pastikan tetap hijau
forge test --match-contract ProofOfWattBaseTest -vv
```

---

## 🧮 Test Matrix

Target sekitar 14 test deterministik, yaitu 6 base ditambah sekitar 8 test delta. Semua berbasis Foundry unit test, dengan malicious mock token khusus untuk kasus reentrancy.

| # | Nama test | Yang diverifikasi | Kelas |
|:--:|:--|:--|:--|
| 1 | `testRegisterDevice` | Device terdaftar dengan signer benar | base |
| 2 | `testSubmitReadingValidSig` | Reading dengan signature EIP-712 sah diterima | base |
| 3 | `testSubmitReadingRejectsBadSig` | Signature salah direvert | base |
| 4 | `testReplayGuardReverts` | Digest yang sudah dipakai direvert | base |
| 5 | `testMonotonicTimestampGuard` | Timestamp mundur direvert | base |
| 6 | `testSetRewardPerKwh` | Owner set reward per kWh | base |
| 7 | `testAttestApprovePaysViaSafeERC20` | Approve membayar produsen via SafeERC20 | delta |
| 8 | `testRejectWhenAnomalyAboveThreshold` | Anomaly bps di atas ambang, reject, no payout | delta |
| 9 | `testRejectWhenDeltaOutOfBound` | Delta di luar bound, reject, no payout | delta |
| 10 | `testReputationIncrement` | Counter approved atau rejected per device naik | delta |
| 11 | `testReentrancyAttemptReverts` | Malicious token yang re-enter direvert | delta |
| 12 | `testInsufficientPoolReverts` | Pool kurang revert `InsufficientRewardPool` | delta |
| 13 | `testOnlyVerifierCanAttest` | Non-VERIFIER_ROLE direvert | delta |
| 14 | `testFeeSplitCorrect` | Fee bps benar, produsen terima sisa, treasury terima fee | delta |
| 15 | `testEventEmitsDecodedAttestation` | Event `ReadingAttested` memuat Attestation decoded | delta |

> 💡 Nomor 15 melebihi target 14 dan boleh dijadikan bonus, sebab event decodable adalah bukti "rationale on-chain" yang jadi peak pitch. Jaga semua tetap deterministik, tanpa dependency waktu nyata atau RPC di unit test.

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
# seluruh suite, target ~14 test hijau
forge test -vv

# dengan gas report
forge test --gas-report

# coverage untuk memastikan delta ter-cover
forge coverage

# fokus test delta attest dan settle
forge test --match-test "testAttest|testReject|testFee|testReputation" -vv
```

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

- TDD berjalan pada delta, 6 test base wajib tetap hijau setelah rename ke `attestAndSettle`.
- Target sekitar 14 test deterministik, base ditambah delta, plus malicious mock token untuk reentrancy.
- Semua unit test Foundry, tanpa dependency waktu nyata di level unit.
- Rehearse loop e2e 20 kali melawan RPC nyata dengan fixture timestamp fresh.
- Suite hijau adalah bukti gate hygiene di axis teknis yang paling berbobot.

---

<div align="center">
<sub>© 2026 PT Surya Inovasi Prioritas (SURIOTA) · <a href="README.md">Hub WattSettle</a> · Update 7 Juli 2026</sub>
</div>
