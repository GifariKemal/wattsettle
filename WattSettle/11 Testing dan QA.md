<div align="center">

![Bab](https://img.shields.io/badge/BAB-11%20Testing-06b6d4?style=for-the-badge)
&nbsp;
![WattSettle](https://img.shields.io/badge/WattSettle-Build%20Bible-22c55e?style=for-the-badge)
&nbsp;
![Tests](https://img.shields.io/badge/37%20test-hijau-22c55e?style=for-the-badge)
&nbsp;
![Coverage](https://img.shields.io/badge/coverage-100%25-22c55e?style=for-the-badge)

# 🧪 Testing dan QA

### TDD pada delta, test matrix, suite invariant, dan rehearsal loop

</div>

**Navigasi:** [Hub](README.md) · [Sebelumnya: 10 Deployment dan On-chain Ops](<10 Deployment dan On-chain Ops.md>) · [Berikutnya: 12 Frontend dan dApp UI](<12 Frontend dan dApp UI.md>)

---

## 💡 Prinsip Satu Kalimat

WattSettle adalah evolusi, bukan rewrite, jadi disiplin testing berjalan **pada delta**, yaitu pertahankan test base tetap hijau setelah rename `verifyReading` menjadi `attestAndSettle`, lalu tambahkan test baru untuk tiap fitur delta. Hasil akhirnya **37 test deterministik dan semuanya lolos**, dengan **coverage 100 persen di keempat sumbu** untuk `src/WattSettle.sol`, tersebar di `proofofwatt/test/WattSettle.t.sol` dan `proofofwatt/test/WattSettle.invariants.t.sol`.

> 💡 TDD memakai superpowers test-driven-development. Tulis test yang gagal dulu (red), lalu implementasi minimal (green), lalu refactor. Delta yang di-cover adalah struct Attestation, event, gate dua lapis, baseline on-chain, SafeERC20, ReentrancyGuard, solvency, reputation, dan fee split. Lapis terakhir yang ditambahkan adalah suite invariant, yang menguji properti pada urutan aksi acak, bukan pada contoh yang dipilih sendiri oleh penulis test.

---

## 🔴 Struktur Suite yang Di-ship

Base `ProofOfWatt.sol` punya 6 test PASS di Foundry v1.7.1. Setelah rename
`verifyReading(id, bool)` menjadi `attestAndSettle(id, Attestation)`, test lama disesuaikan
agar melewatkan struct `Attestation` yang lolos gate, bukan boolean. Suite akhirnya tumbuh
menjadi tiga kontrak test, dua di atas satu harness bersama dan satu berdiri sendiri di
berkas invariant.

| Kontrak | Berkas | Isi | Jumlah |
|:--|:--|:--|:--:|
| `abstract contract WattSettleHarness is Test` | `test/WattSettle.t.sol` | setup bersama (deploy, register device, fixture tanda tangan) | - |
| `WattSettleBaseTest` | `test/WattSettle.t.sol` | jalur masuk, tanda tangan, guard, setter | 9 |
| `WattSettleDeltaTest` | `test/WattSettle.t.sol` | attest, settle, gate dua lapis, baseline, fee, reputation, reentrancy, batas parameter, guard constructor dan setter | 22 |
| `WattSettleInvariantTest` | `test/WattSettle.invariants.t.sol` | 6 properti yang harus bertahan pada ribuan urutan aksi acak | 6 |
| **Total** | | | **37** |

> [!WARNING]
> Nama `ProofOfWattBaseTest` yang tercetak di versi lama bab ini **tidak pernah ada**.
> Perintah yang benar memakai nama kontrak yang di-ship.

```bash
# jalankan hanya test base, pastikan tetap hijau
forge test --match-contract WattSettleBaseTest -vv

# jalankan hanya test delta
forge test --match-contract WattSettleDeltaTest -vv

# jalankan hanya suite invariant
forge test --match-contract WattSettleInvariantTest -vv
```

---

## 📊 Coverage 100 Persen di Empat Sumbu

`src/WattSettle.sol` sekarang tertutup penuh.

| Sumbu | Hasil |
|:--|:--:|
| Lines | 88/88 (100 persen) |
| Statements | 102/102 (100 persen) |
| Branches | 18/18 (100 persen) |
| Functions | 14/14 (100 persen) |

Sebelumnya branches berhenti di 88,89 persen dengan dua celah tersisa. Tiga test menutupnya.

| Test penutup celah | Yang ditutup |
|:--|:--|
| `testConstructorRejectsZeroToken` | Kontrak tanpa settlement token tidak akan pernah bisa membayar, jadi ia ditolak di constructor, bukan dibiarkan lahir dalam keadaan mati |
| `testSetTreasuryRejectsZeroAddress` | `setTreasury(address(0))` direvert `ZeroAddress`, jadi potongan fee tidak bisa dibuang ke alamat nol |
| `testSetGateParamsTightensTheGate` | Jalur sukses `setGateParams`, yang sebelumnya hanya diuji jalur revert-nya. Gate diketatkan ke 400 bps dan 20 kWh, lalu dibuktikan bacaan 105 kWh yang dulu lolos sekarang ditolak |

> [!IMPORTANT]
> `testSetGateParamsTightensTheGate` memeriksa **keputusan gate berubah**, bukan sekadar
> memastikan sebuah variabel berubah nilainya. Test setter yang cuma membandingkan getter
> dengan angka yang baru saja di-set membuktikan penyimpanan, bukan efek. Yang dikunci di
> sini adalah efeknya pada hasil penilaian.

---

## 🧮 Test Matrix

Tiga puluh satu unit test deterministik di `test/WattSettle.t.sol`, dengan malicious mock token
khusus untuk kasus reentrancy, ditambah 6 invariant di berkas terpisah. Tidak ada satu pun yang
bergantung pada waktu nyata atau RPC.

### `WattSettleBaseTest` (9)

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
| 9 | `testSubmitRejectsImplausibleKwh` | kWh di atas `MAX_KWH_PER_READING` direvert `ImplausibleReading`, aritmetika `_assess` tetap jauh dari batas tipe |

### `WattSettleDeltaTest` (22)

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
| 13 | `testSetGateParamsTightensTheGate` | **Baru.** Gate diketatkan ke 400 bps dan 20 kWh, lalu bacaan 105 kWh yang dulu lolos terbukti ditolak, jadi yang diuji adalah keputusan gate, bukan isi variabel |
| 14 | `testSetTreasuryRejectsZeroAddress` | **Baru.** `setTreasury(address(0))` direvert `ZeroAddress` |
| 15 | `testConstructorRejectsZeroToken` | **Baru.** Deploy tanpa settlement token direvert `ZeroAddress`, kontrak tidak dibiarkan lahir dalam keadaan tak bisa membayar |
| 16 | `testLyingVerifierCannotForcePayout` | **Test terpenting di berkas ini.** Attestation palsu (`delta = 0`, `anomaly = 0`) atas bacaan curang tetap DITOLAK, sebab kontrak menghitung sendiri dari `baselineKwh` on-chain |
| 17 | `testVerifierCanVetoAReadingTheContractWouldAccept` | Verifier tetap bisa menolak bacaan yang lolos hitungan kontrak, jadi AI-nya tetap berguna, bukan sekadar dilewati |
| 18 | `testContractComputesOwnAssessment` | `_assess` menghasilkan delta dan anomali yang benar tanpa masukan apa pun dari verifier |
| 19 | `testDeviceWithoutBaselineIsNeverPaid` | Baseline nol berarti belum terkalibrasi, dan perangkat itu tidak pernah bisa dibayar |
| 20 | `testSetDeviceBaseline` | Admin bisa menggeser baseline tanpa mereset `lastTs` |
| 21 | `testSetDeviceBaselineRejectsUnknownDevice` | Baseline untuk `deviceId` tak dikenal direvert `UnknownDevice` |
| 22 | `testReputationUsesWorstOfBothAssessments` | Reputasi mencatat skor anomali yang lebih buruk, jadi verifier longgar tidak bisa memoles rekam jejak |

> 💡 Nomor 9 di tabel delta adalah bukti "rationale on-chain" yang menjadi peak pitch, sebab event decodable itulah yang dibaca juri di BscScan. Nomor 11 sampai 15 menjaga constructor dan setter admin tidak berubah menjadi pintu belakang. Nomor 16 adalah yang paling penting di seluruh berkas: ia mengunci sifat bahwa **verifier memegang hak veto, bukan kuasa menyetujui**, dan nomor 17 memastikan hak veto itu benar-benar masih ada.

---

## 🎲 Suite Invariant: Properti, Bukan Contoh

Ini tambahan terbesar di ronde testing kali ini. Unit test membuktikan perilaku pada contoh
yang **dipilih sendiri oleh penulis test**. Invariant membuktikan properti pada ribuan urutan
aksi acak yang **tidak dipilih penulisnya**. Dua-duanya perlu, dan yang kedua inilah yang
menangkap kombinasi yang tidak terpikir saat menulis unit test.

Berkas: `proofofwatt/test/WattSettle.invariants.t.sol`.

Strukturnya, sebuah kontrak `Handler` mengemudikan panggilan `submitReading` dan
`attestAndSettle` secara acak. Yang membuat suite ini bermakna adalah satu keputusan desain,
**handler bebas berbohong tanpa batas**: ia boleh mengirim `kwhDeltaVsBaseline` dan
`anomalyScoreBps` yang tidak punya hubungan apa pun dengan bacaan sebenarnya. Verifier di
dalamnya punya tiga watak, dipilih dari seed lewat `anomalySeed % 3`.

| Watak verifier | Perilaku |
|:--|:--|
| Jujur | Memakai hasil `ws.assess` sendiri, jadi keputusannya murni soal bacaannya |
| Berkhianat | Mengaku `delta = 0` dan anomali `0` apa pun kenyataannya, persis verifier yang sudah membelot. Watak inilah yang membuat invariant utama bermakna |
| Ngawur | Angka acak dalam rentang sempit, dijaga jauh dari `type(int256).min` supaya negasi di `_abs` aman |

Hasil terukur: **6 lolos, 256 runs, depth 32, 8192 panggilan per invariant, 0 revert**, terdiri
dari 4027 panggilan `attestAndSettle` dan 4165 `submitReading`. Seluruh suite 37 test selesai
dalam sekitar 5 detik, jadi tidak ada risiko timeout di CI.

| Invariant | Yang dijamin |
|:--|:--|
| `invariant_ApprovedReadingsAlwaysPassContractAssessment` | Setiap bacaan berstatus Approved selalu lolos penilaian kontrak sendiri terhadap baseline on-chain. INI YANG UTAMA, ia membuktikan verifier tidak punya kuasa meloloskan apa pun yang ditolak kontrak |
| `invariant_PoolDrainEqualsApprovedGross` | Token yang keluar dari pool persis sama dengan total reward kotor bacaan yang disetujui, tanpa kebocoran |
| `invariant_ProducerPlusTreasuryEqualsGross` | Reward kotor terbagi habis antara produsen dan treasury, tidak ada yang hilang |
| `invariant_ReputationMatchesSettledCount` | Counter reputasi on-chain tidak pernah menyimpang dari jumlah settle sebenarnya |
| `invariant_TreasuryNeverExceedsFeeCap` | Treasury tidak pernah menerima lebih dari batas keras fee 1000 bps |
| `invariant_PoolNeverOverdrawn` | Kontrak tidak pernah membayar melebihi yang pernah dimilikinya |

> [!IMPORTANT]
> Invariant pertama adalah versi properti dari `testLyingVerifierCannotForcePayout`. Unit test
> membuktikan satu verifier pembohong gagal pada satu bacaan pilihan penulisnya. Invariant
> membuktikan verifier pembohong gagal pada **8192 panggilan acak** yang tidak dipilih siapa pun.

### Temuan: Versi Pertama Suite Ini Nyaris Sia-sia

Ini temuan terpenting dari ronde invariant, dan ia layak ditulis eksplisit, bukan disembunyikan.

Handler versi pertama mengacak kWh secara seragam 0 sampai 5000 terhadap baseline 100, dan
attestation-nya sepenuhnya acak (delta -10000 sampai 10000, anomali 0 sampai 12000). Diukur
dengan test sementara, hasilnya **1505 settlement dengan NOL approval**.

Artinya empat dari enam invariant hampa. Mereka cuma membandingkan nol dengan nol, dan tetap
hijau. Hanya invariant utama yang benar-benar bermakna. Tanpa pengukuran itu, bab ini akan
mengklaim enam invariant terbukti padahal empat di antaranya tidak pernah menyentuh jalur
pembayaran sama sekali.

Perbaikannya dua sisi.

| Sisi | Sebelum | Sesudah |
|:--|:--|:--|
| Sebaran kWh | seragam `bound(seed, 0, 5_000)` terhadap baseline 100 | tiga dari empat bacaan di sekitar baseline `bound(seed, 70, 140)`, sisanya tetap liar `bound(seed, 0, 5_000)` untuk melatih jalur penolakan |
| Watak verifier | acak seluruhnya | tiga watak dipilih dari seed: jujur, berkhianat, ngawur |

Hasil sesudah diperbaiki: **511 approval dari 1505 settlement**. Jalur pembayaran benar-benar
terlatih, dan keenam invariant baru punya bahan untuk diuji.

> [!IMPORTANT]
> Pelajarannya berlaku umum, bukan cuma untuk berkas ini. **Invariant yang hijau belum tentu
> menguji apa pun.** Ukur dulu apakah jalur yang ingin dibuktikan benar-benar pernah dilewati,
> baru percaya pada warna hijaunya.

### Suite Ini Diuji dengan Merusak Kontraknya Lebih Dulu, Dua Kali

Invariant yang lolos tapi tidak pernah bisa gagal tidak membuktikan apa pun. Ia hanya
menghasilkan rasa aman palsu, dan itu lebih buruk daripada tidak punya test sama sekali.

Karena itu kontrak sengaja dirusak dua kali, menyasar dua kelas cacat yang berbeda.

**Mutasi A, gate sisi kontrak dilucuti.** Disisakan `bool approved = verifierApproves;` saja,
dengan `contractApproves &&` dibuang. `invariant_ApprovedReadingsAlwaysPassContractAssessment`
langsung gagal.

```text
approved padahal anomali kontrak di atas ambang: 10000 > 2000
```

Lima invariant lain tetap hijau, jadi kegagalannya tepat sasaran, bukan kepanikan menyeluruh
yang tidak menunjuk apa-apa.

**Mutasi B, akuntansi fee dirusak.** Produsen dibayar `reward` penuh, bukan `reward - fee`.
`invariant_PoolDrainEqualsApprovedGross` dan `invariant_ProducerPlusTreasuryEqualsGross` gagal
berbarengan.

```text
assertion failed: 90900000000000 != 90000000000000
```

Selisihnya persis satu persen, yaitu fee yang terbayar dua kali.

Sesudah tiap mutasi kontrak dipulihkan lewat `git checkout --`, dan bytecode hasil build dicek
ulang terhadap kontrak yang sudah ter-deploy: hanya nilai immutable yang berbeda, 382 karakter,
sama seperti sebelumnya.

Disiplinnya layak dicatat sebagai disiplin, bukan sebagai anekdot. **Buktikan dulu bahwa test
bisa gagal, baru percaya kalau ia lolos.**

### `fail_on_revert = true` itu disengaja

Konfigurasi di `foundry.toml` memakai seksi `[invariant]` baru.

```toml
[invariant]
runs = 256
depth = 32
fail_on_revert = true
```

Handler ditulis supaya tidak pernah revert. Ia selalu memajukan timestamp, jadi monotonic guard
tidak pernah menyala. Ia melewati bacaan yang statusnya bukan Pending, jadi `NotPending` tidak
pernah menyala. Ia membatasi delta jauh dari `type(int256).min`, jadi negasi di `_abs` aman.

Alasannya sederhana. Dengan `fail_on_revert = false`, sebagian besar panggilan bisa gagal
diam-diam, dan invariant akan lolos hanya karena **tidak ada apa pun yang benar-benar terjadi**.
Angka 0 revert pada 8192 panggilan itulah yang memastikan tiap panggilan mengerjakan pekerjaan
nyata.

> 💡 Alasan serupa juga ada di balik dua angka di `setUp` invariant: reward per kWh diturunkan
> ke `1e12` dan pool didanai 900000 token, khusus supaya `InsufficientRewardPool` tidak pernah
> menyala. Revert solvency yang menyala di tengah fuzzing akan menutupi properti yang sedang
> diuji, dan suite jadi hijau karena alasan yang salah.

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
# seluruh suite, 37 test hijau di tiga kontrak test
forge test -vv

# per kontrak test
forge test --match-contract WattSettleBaseTest -vv
forge test --match-contract WattSettleDeltaTest -vv
forge test --match-contract WattSettleInvariantTest -vv

# dengan gas report
forge test --gas-report

# coverage, sekarang 100 persen di keempat sumbu untuk src/WattSettle.sol
forge coverage

# fokus test delta attest dan settle
forge test --match-test "testAttest|testReject|testFee|testReputation" -vv

# fokus pada sifat keamanan gate dua lapis
forge test --match-test "testLyingVerifier|testVerifierCanVeto|testContractComputesOwnAssessment|testDeviceWithoutBaseline" -vvv

# fokus pada tiga test penutup celah branch
forge test --match-test "testConstructorRejectsZeroToken|testSetTreasuryRejectsZeroAddress|testSetGateParamsTightensTheGate" -vvv
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

## 🔁 Rehearsal Loop e2e Melawan RPC Nyata (sudah ada, bukan lagi rencana)

Unit test membuktikan logika, tapi demo dimenangkan oleh determinism. Skrip
`proofofwatt/scripts/rehearse-loop.sh` menjalankan rantai penuh melawan RPC BSC testnet
yang sebenarnya: perangkat menandatangani, relayer mengirim, agent bangun dan menghitung
ulang, kontrak memutus, transaksi terkonfirmasi.

```bash
bash scripts/rehearse-loop.sh 20
```

Empat sifat yang membuat skrip ini layak dipercaya.

| Sifat | Isi |
|:--|:--|
| Fixture selalu segar | Tiap putaran memakai timestamp dan nonce baru, sebab monotonic guard dan replay guard menolak pengulangan |
| Jalur tolak ikut dilatih | Tiap putaran kelima sengaja mengirim bacaan anomali, jadi jalur penolakan terlatih sesering jalur persetujuan |
| Status dibaca dari rantai | Status akhir diverifikasi dengan membaca balik **dari rantai**, bukan dari keluaran skrip |
| Gagal berarti gagal | Skrip keluar dengan kode bukan nol bila ada satu putaran pun yang gagal, jadi tidak ada kegagalan yang lolos diam-diam |

> ⚠️ Ini yang mem-validasi runbook determinism di [10 Deployment dan On-chain Ops](<10 Deployment dan On-chain Ops.md>). Jangan menjalankan demo panggung tanpa satu kali `bash scripts/rehearse-loop.sh 20` yang keluar dengan kode nol.

---

## 🧾 Temuan: Akhiran Baris Sempat Merusak Auditabilitas `rulesetHash`

Temuan ini tidak muncul dari test kontrak, melainkan dari mencoba membuktikan sendiri klaim
"hitung sendiri dan buktikan", dan justru karena itu ia layak dicatat.

`rulesetHash` adalah `keccak256` atas byte mentah `proofofwatt/ruleset/anomaly_v1.json`. Git
disetel `core.autocrlf=true`, sehingga checkout di Windows menghasilkan CRLF (1501 byte)
sementara blob yang ter-commit adalah LF (1470 byte). Keduanya menghasilkan hash yang
**berbeda**, dan itu mematahkan seluruh klaim auditabilitas secara diam-diam: dua orang
jujur di sistem operasi berbeda akan saling membantah tanpa ada yang salah.

Perbaikannya `.gitattributes` yang menandai berkas ruleset dan kartu agent sebagai `-text`,
jadi git tidak pernah mengonversinya dan byte-nya identik di mana pun. Hash kanoniknya
`0xcce6c15c459cd085ae0c5d364227022f59f70d7036819c7b023598a590df6b41`, dan CI sekarang gagal
bila berkas itu berubah tanpa nilai tersebut ikut diperbarui.

> [!WARNING]
> Jebakan kedua yang berkerabat. `cast keccak $(xxd -p -c 999999 berkas)` **salah**, sebab
> tanpa awalan `0x` cast menghash teks heksadesimalnya, bukan byte-nya. Yang benar:
>
> ```bash
> cast keccak 0x$(xxd -p -c 999999 ruleset/anomaly_v1.json)
> ```

---

## 🔗 Relasi ke Gate Hygiene

Testing bukan hanya soal benar secara logika, tapi juga menutup hard gate. Suite yang hijau plus commit history genuine adalah bagian dari axis Technical Implementation and Code Quality yang berbobot paling tinggi di rubrik.

- Commit harian genuine sejak Sesi 1, jangan squash, sebab single squash adalah red flag (Kill-shot #6).
- Jalankan `/ponytail-review` pada diff test dan implementasi, tapi jangan pangkas assertion keamanan.
- Coverage 100 persen plus suite invariant yang sudah dibuktikan bisa gagal adalah dua bukti kualitas yang jarang dibawa peserta lain ke meja juri.
- Suite hijau ditambah kontrak verified ditambah dua tx nyata adalah tiga bukti gate yang saling menguatkan.
- Simpan bukti suite hijau ke [21 Checklist Submission](<21 Checklist Submission.md>).

---

## ✅ Ringkas

- TDD berjalan pada delta, dan test base tetap hijau setelah rename ke `attestAndSettle`.
- Yang di-ship adalah **37 test deterministik**, terbagi `WattSettleBaseTest` (9) dan `WattSettleDeltaTest` (22) di atas `WattSettleHarness` pada `proofofwatt/test/WattSettle.t.sol`, plus `WattSettleInvariantTest` (6) di `proofofwatt/test/WattSettle.invariants.t.sol`, plus malicious mock token untuk reentrancy.
- **Coverage 100 persen di empat sumbu** untuk `src/WattSettle.sol`: lines 88/88, statements 102/102, branches 18/18, functions 14/14. Dua celah branch terakhir ditutup oleh `testConstructorRejectsZeroToken`, `testSetTreasuryRejectsZeroAddress`, dan `testSetGateParamsTightensTheGate`.
- `testLyingVerifierCannotForcePayout` adalah test terpenting di berkas unit, sebab ia mengunci sifat "verifier memegang hak veto, bukan kuasa menyetujui".
- Suite invariant menaikkan sifat itu dari contoh menjadi properti: handler bebas berbohong tanpa batas lewat tiga watak verifier (jujur, berkhianat, ngawur), dan hasilnya 6 lolos, 256 runs, depth 32, 8192 panggilan per invariant (4027 `attestAndSettle` dan 4165 `submitReading`), 0 revert, selesai sekitar 5 detik.
- **Versi pertama suite invariant nyaris sia-sia.** Sebaran seragam menghasilkan 1505 settlement dengan nol approval, jadi empat invariant hijau tanpa menguji apa pun. Sesudah sebaran kWh dipusatkan di sekitar baseline dan watak verifier dicampur, angkanya menjadi 511 approval dari 1505 settlement. Invariant yang hijau belum tentu menguji apa pun, ukur dulu.
- Suite invariant diuji dengan **merusak kontraknya lebih dulu, dua kali**: gate sisi kontrak dilucuti (invariant utama gagal, lima lainnya tetap hijau) dan akuntansi fee dirusak (dua invariant akuntansi gagal, selisih persis satu persen). Kontrak dipulihkan lewat `git checkout --` dan bytecode-nya dicek ulang. Buktikan test bisa gagal, baru percaya kalau ia lolos.
- `fail_on_revert = true` disengaja, sebab dengan `false` invariant bisa lolos hanya karena panggilannya gagal diam-diam dan tidak ada yang benar-benar terjadi.
- Pakai `--match-contract WattSettleBaseTest`, bukan `ProofOfWattBaseTest` yang tidak pernah ada.
- `ReplayedReading` hanya terjangkau lewat jalur register ulang device, dan test-nya sengaja menempuh jalur itu supaya guard-nya terbukti hidup.
- `forge lint src/ script/` bersih, nol peringatan.
- Semua unit test Foundry, tanpa dependency waktu nyata di level unit.
- `scripts/rehearse-loop.sh` sudah ada dan menjalankan rantai penuh melawan RPC nyata, tiap putaran kelima sengaja anomali, status dibaca balik dari rantai, dan keluar bukan nol bila ada putaran yang gagal.
- Akhiran baris sempat merusak `rulesetHash`, sudah ditutup dengan `.gitattributes` bertanda `-text` plus penjagaan di CI.
- Suite hijau adalah bukti gate hygiene di axis teknis yang paling berbobot.

---

<div align="center">
<sub>© 2026 PT Surya Inovasi Prioritas (SURIOTA) · <a href="README.md">Hub WattSettle</a> · Update 5 September 2026</sub>
</div>
