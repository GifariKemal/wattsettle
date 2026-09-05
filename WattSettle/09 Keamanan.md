<div align="center">

![Bab](https://img.shields.io/badge/BAB-09%20Keamanan-06b6d4?style=for-the-badge)
&nbsp;
![WattSettle](https://img.shields.io/badge/WattSettle-Build%20Bible-22c55e?style=for-the-badge)
&nbsp;
![Security](https://img.shields.io/badge/security-100%25%20carve--out-ef4444?style=for-the-badge)

# 🔐 Keamanan

### Threat model, gate dua lapis, replay guard, reentrancy, dan role gating

</div>

**Navigasi:** [Hub](README.md) · [Sebelumnya: 08 Tokenomics](<08 Tokenomics.md>) · [Berikutnya: 10 Deployment dan On-chain Ops](<10 Deployment dan On-chain Ops.md>)

---

## 💡 Prinsip Satu Kalimat

Keamanan adalah axis bernilai tertinggi di rubrik teknis dan satu-satunya bagian yang **tidak boleh dipangkas oleh ponytail**. Semua defense di bawah ini sudah ada atau memakai ulang pustaka OpenZeppelin yang teruji, jadi kita tidak menciptakan kripto sendiri, dan kita tidak menukar keamanan demi kesederhanaan.

> ⚠️ Ini adalah settlement rail yang membayar uang atas bacaan meter, jadi insentif memalsukan reading tinggi. AI verifier bukan dekorasi, ia perlu ada. Namun kontrak tetap harus tahan sendiri terhadap replay, reentrancy, dan aktor tak berwenang, tanpa mengandalkan verifier untuk bersikap benar.

---

## 🎯 Ringkasan Threat Model

Kontrak menghadapi lima kelas ancaman utama, yaitu memalsukan bacaan, mengulang bacaan lama, menguras dana lewat reentrancy, bertindak sebagai verifier tanpa izin, dan **verifier sah yang berbohong**. Tiap kelas punya mitigasi eksplisit yang sudah ada di kode.

| Ancaman | Vektor | Mitigasi | Status |
|:--|:--|:--|:--|
| Bacaan palsu | Attacker submit `Reading` yang tidak ditandatangani device sah | EIP-712 recover terhadap signer device terdaftar | 🟢 ada, jangan sentuh |
| Replay attack | Kirim ulang reading yang sama untuk dibayar dua kali | `usedDigest` menolak digest yang sudah dipakai | 🟢 ada, jangan sentuh |
| Reading basi atau out-of-order | Sisipkan reading dengan timestamp lama | `lastTs` monotonic guard menolak timestamp mundur | 🟢 ada, jangan sentuh |
| Reentrancy | Malicious token panggil balik saat payout | Checks-effects-interactions plus `nonReentrant` plus SafeERC20 | 🟢 diperkuat di delta |
| Aktor tak berwenang attest | Wallet acak panggil `attestAndSettle` | `onlyRole(VERIFIER_ROLE)` | 🟢 ada, jangan sentuh |
| Pool kering saat payout | Reward pool kontrak habis | Solvency check `balanceOf(this) < reward` revert `InsufficientRewardPool` | 🟢 ada di delta |
| Anomali energi | Reading absurd lolos ke payout | Gate on-chain memeriksa anomaly score dan delta bound, lalu reject on-chain | 🟢 ada di delta |
| **Verifier berbohong** | Wallet ber-`VERIFIER_ROLE` memasok attestation palsu (`delta = 0`, `anomaly = 0`) untuk meloloskan bacaan curang dan menguras pool | **Gate dua lapis.** Kontrak menyimpan `baselineKwh` per device dan menghitung penilaiannya sendiri lewat `_assess`, lalu meng-AND-kan dengan penilaian verifier | 🟢 ditutup 5 Sep 2026, **terbukti on-chain** |
| Perangkat tidak terkalibrasi | Device terdaftar tanpa baseline lalu dibayar terhadap acuan yang tidak pernah disetel | `baselineKwh` nol memaksa pembagi menjadi 1, sehingga skor anomali maksimum dan perangkat itu tidak pernah bisa dibayar | 🟢 ada di delta |
| Overflow aritmetika penilaian | Bacaan raksasa dipakai untuk melimpahkan perhitungan `_assess` | `MAX_KWH_PER_READING = 1e12` ditegakkan di `submitReading`, revert `ImplausibleReading` | 🟢 ada di delta |

---

## 🔁 Replay Guard EIP-712 dan Monotonic Timestamp

Dua guard ini melindungi jalur masuk `submitReading` dan **sudah teruji di 6 test base**, jadi jangan diubah.

- **`usedDigest` (anti-replay):** tiap `Reading` menghasilkan digest EIP-712 unik dari tuple `Reading{deviceId, kWh, timestamp, nonce}` di domain `ProofOfWatt/1`. Digest yang sudah dipakai dicatat, dan submit ulang direvert. Ini mencegah satu bacaan dibayar lebih dari sekali.
- **`lastTs` (monotonic guard):** kontrak menyimpan timestamp terakhir per device dan menolak reading dengan timestamp lebih lama atau sama. Ini mencegah penyisipan bacaan basi atau out-of-order.

> ⚠️ Kedua guard ini punya efek samping di demo. Menjalankan ulang reading yang sama akan **revert** di panggung. Karena itu siapkan tiga fixture dengan timestamp distinct berantre, dan script morning-of yang menolak start bila reading akan revert. Detail ada di [10 Deployment dan On-chain Ops](<10 Deployment dan On-chain Ops.md>).

**Urutan kedua guard, temuan dari penulisan test.** Kirim ulang mentah-mentah tidak pernah
sampai ke `ReplayedReading`. Karena `timestamp` ikut masuk ke digest EIP-712, bacaan yang
identik selalu membawa timestamp yang identik pula, dan `lastTs` sudah lebih dulu maju ke
nilai itu, jadi yang muncul adalah `StaleTimestamp`. Satu-satunya jalan yang benar-benar
menyentuh `usedDigest` adalah mendaftarkan ulang device (yang mengembalikan `lastTs` ke
nol) lalu mengirim ulang bacaan lama yang sudah ditandatangani. Test
`testReplayGuardReverts` melakukan persis itu, dan itulah yang membuktikan guard-nya kode
hidup, bukan kode mati. Uraiannya ada di [11 Testing dan QA](<11 Testing dan QA.md>).

---

## 🎭 Ancaman Terpenting: Bagaimana Kalau Verifier-nya yang Berbohong?

Versi lama bab ini tidak bisa menjawab pertanyaan ini, dan itu adalah lubang terbesarnya.
Sekarang jawabannya ada, dan bukan berupa argumen melainkan berupa transaksi.

### Kenapa dulu ini lubang

Gerbang on-chain yang lama hanya menilai **angka yang dipasok verifier**. Kontrak tidak
menyimpan baseline perangkat, jadi ia tidak punya cara menghitung ulang deviasinya sendiri.
Konsekuensinya keras: verifier yang berbohong bisa menyetujui bacaan curang dan menguras
reward pool, dan kontraknya tidak akan pernah tahu. Role gating menjaga siapa yang boleh
memutus, tetapi tidak menjaga apa yang boleh diputuskan.

### Perbaikannya, gerbang dua lapis

Kontrak kini menyimpan `uint96 baselineKwh` per perangkat dan menghitung penilaiannya
sendiri. Kedua lapis wajib lolos.

```solidity
// Lapis satu, hitungan kontrak sendiri dari baseline on-chain. Verifier tidak bisa mempengaruhinya.
(int256 chainDelta, uint16 chainAnomalyBps) = _assess(devices[s.deviceId].baselineKwh, s.kWh);
bool contractApproves = (chainAnomalyBps <= maxAnomalyBps) && (_abs(chainDelta) <= maxDeltaBound);

// Lapis dua, penilaian verifier. Hanya bisa memperketat, tidak pernah melonggarkan.
bool verifierApproves = (a.anomalyScoreBps <= maxAnomalyBps) && (_abs(a.kwhDeltaVsBaseline) <= maxDeltaBound);

bool approved = contractApproves && verifierApproves;
```

> [!IMPORTANT]
> **Verifier yang berbohong tidak bisa lagi memaksa pembayaran. Ia memegang hak veto,
> bukan kuasa menyetujui.** Ia tetap bisa menolak bacaan yang secara aritmetika terlihat
> wajar, karena ia melihat cuaca, kesehatan perangkat, atau sinyal kecurangan yang tidak
> terlihat di rantai, dan justru itulah yang membuat AI-nya tetap berguna. Yang tidak
> pernah bisa ia lakukan adalah menyetujui apa yang kontraknya sendiri tolak.

### Buktinya di rantai, bukan di paragraf

Sebuah attestation yang **sengaja dibuat tidak jujur** dikirim untuk bacaan #2, yaitu
900 kWh terhadap baseline 100, dengan klaim `kwhDeltaVsBaseline = 0` dan
`anomalyScoreBps = 0`. Kontrak menghitung sendiri delta 800 dan anomali 10000 bps, lalu
**menolak tanpa membayar apa pun**.

| Hal | Nilai |
|:--|:--|
| Yang verifier KATAKAN | delta 0, anomali 0 bps, artinya "setujui" |
| Yang kontrak HITUNG | delta 800, anomali 10000 bps, artinya "tolak" |
| Putusan | REJECTED, nol token berpindah |
| Transaksi | `0x7e8ba5a7b1e09f33a8015c043383500276fda8ad59e61bac861f78ce98391781` |

Ini bukti tunggal terkuat di seluruh entri, dan pemakaiannya di panggung dijelaskan di
[15 Demo dan Pitch](<15 Demo dan Pitch.md>) serta [16 Risiko dan Kill-shots](<16 Risiko dan Kill-shots.md>).

### Pertahanan pendamping

- **Event yang membuka kedua penilaian.** `ReadingAttested` kini membawa `chainDelta` dan
  `chainAnomalyBps` berdampingan dengan `Attestation` dari verifier. Siapa pun bisa membaca
  apa yang verifier katakan di sebelah apa yang kontrak hitung, dan **perbedaan di antara
  keduanya itu sendiri adalah sinyal**.
- **Reputasi memakai yang terburuk.** Reputasi perangkat mencatat skor anomali yang lebih
  buruk di antara kedua penilaian, jadi verifier yang longgar tidak bisa memoles rekam
  jejak sebuah unit.
- **Simulasi sebelum kirim.** View publik `assess(bytes32 deviceId, uint256 kWh)` membuat
  siapa pun bisa menghitung putusan kontrak dari tab Read Contract sebelum satu transaksi
  pun dikirim.
- **Tidak ada withdraw admin.** Reward pool tidak punya fungsi tarik dana. Begitu token
  masuk ke kontrak, admin tidak bisa mengambilnya kembali.

---

## 🧾 Temuan Auditabilitas: Akhiran Baris Merusak `rulesetHash`

Klaim "hitung sendiri dan buktikan" bertumpu pada satu hal: `rulesetHash` on-chain adalah
`keccak256` atas **byte mentah** berkas `proofofwatt/ruleset/anomaly_v1.json`. Kalau byte
itu berbeda antar mesin, klaimnya runtuh diam-diam.

Dan itulah yang terjadi. Git disetel `core.autocrlf=true`, sehingga checkout di Windows
menghasilkan CRLF (1501 byte) sementara blob yang ter-commit adalah LF (1470 byte). Kedua
berkas itu menghasilkan hash yang **berbeda**. Dua orang jujur di sistem operasi berbeda
akan saling membantah, dan tidak satu pun dari mereka salah.

Perbaikannya adalah `.gitattributes` yang menandai berkas ruleset dan kartu agent sebagai
`-text`, sehingga git tidak pernah mengonversinya dan byte-nya identik di mana pun. Hash
kanoniknya `0xcce6c15c459cd085ae0c5d364227022f59f70d7036819c7b023598a590df6b41`, dan CI
sekarang gagal bila berkas itu berubah tanpa nilai tersebut ikut diperbarui.

> [!WARNING]
> Jebakan kedua yang berkerabat. Perintah `cast keccak $(xxd -p -c 999999 berkas)`
> **salah**: tanpa awalan `0x`, `cast` menghash teks heksadesimalnya, bukan byte-nya.
> Yang benar:
>
> ```bash
> cast keccak 0x$(xxd -p -c 999999 ruleset/anomaly_v1.json)
> ```

---

## 🛡️ Pertahanan Reentrancy

Payout adalah satu-satunya titik di mana kontrak memanggil kontrak eksternal (transfer token), jadi di situlah reentrancy dipertahankan berlapis.

```solidity
function attestAndSettle(uint256 id, Attestation calldata a)
    external onlyRole(VERIFIER_ROLE) nonReentrant       // 1. reentrancy guard
{
    Submission storage s = submissions[id];
    if (s.status != Status.Pending) revert NotPending();
    // ... gate dua lapis: contractApproves && verifierApproves ...
    s.status = approved ? Status.Approved : Status.Rejected;   // 2. effects SEBELUM interaction
    // ... reputation update ...
    if (approved) {
        if (rewardToken.balanceOf(address(this)) < reward) revert InsufficientRewardPool();
        rewardToken.safeTransfer(devices[s.deviceId].owner, reward - fee);   // 3. SafeERC20
        if (fee > 0) rewardToken.safeTransfer(treasury, fee);
    }
}
```

Empat lapis pertahanan bekerja bersama:

1. **`nonReentrant`** dari OZ ReentrancyGuard memblokir re-entry ke fungsi payout.
2. **Checks-effects-interactions**, status di-set ke `Approved` atau `Rejected` **sebelum** transfer apapun, jadi re-entry manapun akan gagal cek `s.status != Status.Pending`.
3. **SafeERC20** `safeTransfer` menggantikan raw `transfer` (fix line 103), menangani token yang tidak mengembalikan bool dengan benar.
4. **Solvency check** memastikan pool cukup sebelum transfer, mencegah state korup akibat transfer gagal.

> 💡 Semua ini memakai ulang OZ SafeERC20 dan ReentrancyGuard yang sudah ada di lib, nol dependency baru. Ada test khusus `testReentrancyAttemptReverts` dengan malicious token untuk membuktikannya, lihat [11 Testing dan QA](<11 Testing dan QA.md>).

---

## 🔑 Role Gating dan Manajemen Kunci

**Role gating.** Hanya wallet dengan `VERIFIER_ROLE` yang boleh memanggil `attestAndSettle`. Role ini dipegang oleh wallet AI verifier (Hermes agent). Wallet lain yang mencoba attest akan direvert, jadi settlement tidak bisa dipicu aktor sembarang. Sejak gate dua lapis terpasang, kompromi atas kunci ini pun tidak berujung pada pembayaran curang, melainkan paling jauh pada penolakan yang tidak semestinya.

**Manajemen kunci device dan agent.** Ada dua kelas kunci yang harus dijaga terpisah.

| Kunci | Pemegang | Fungsi | Disiplin |
|:--|:--|:--|:--|
| Device signing key | SRT-MGATE-1210 di lapangan | Menandatangani `Reading` EIP-712 | Provisioning saat manufaktur, `registerDevice` on-chain beserta `baselineKwh`, rotasi atau revoke saat RMA |
| Agent verifier key | Hermes agent di VPS SURIOTA | Memegang `VERIFIER_ROLE`, memanggil `attestAndSettle` | Simpan di server, jangan pernah commit |
| Deployer key | Wallet owner | Deploy, pre-fund pool, admin role | Testnet-only, jangan pernah reuse pola ke mainnet |

Reputation counter on-chain per device (`deviceReputation`) berfungsi ganda sebagai health atau trust score, sehingga device yang sering menghasilkan anomali dapat terlihat publik.

---

## 🔒 Disiplin Secret Testnet-only

Semua kredensial di proyek ini adalah **testnet-only** dan tidak boleh dipakai kembali polanya di mainnet.

- Private key wallet dan password disimpan di `.secrets/wallet-testnet.txt`, dan `.secrets/` **gitignored** (tidak ter-track), diverifikasi aman.
- Repo bersifat public, jadi tidak ada satupun private key, `.env`, atau build artifact yang boleh masuk commit.
- Password lemah atau yang pernah bocor **dilarang** dipakai ulang di manapun, dan credential yang teridentifikasi bocor harus segera dirotasi.

> ⚠️ Karena wallet ini testnet-only, kompromi apapun tidak berdampak dana nyata. Namun pola disiplin ini harus tetap dijaga sebagai latihan, sebab pola yang sama TIDAK boleh dibawa ke mainnet tempat dana nyata dipertaruhkan.

---

## ✂️ Carve-out Ponytail

Ponytail minimal-code adalah aturan global proyek ini, tapi ada **carve-out keras** untuk keamanan. Kode boleh dipangkas seminimal mungkin, kecuali bagian keamanan, validasi, dan trust boundary. Yang wajib utuh dan tidak boleh dihapus atas nama kesederhanaan:

- Checks-effects-interactions, status di-set sebelum transfer.
- `nonReentrant` di payout.
- SafeERC20 untuk semua transfer token.
- Solvency check sebelum payout.
- `VERIFIER_ROLE` gating pada `attestAndSettle`.
- EIP-712 replay guard (`usedDigest`) dan monotonic guard (`lastTs`) utuh.
- Gate dua lapis di `attestAndSettle`, termasuk `_assess` terhadap `baselineKwh` on-chain. Melipatnya kembali menjadi satu lapis akan mengembalikan kuasa menyetujui ke tangan verifier.
- Batas `MAX_KWH_PER_READING` di `submitReading`, yang menjaga aritmetika penilaian jauh dari batas tipe.

Jalankan `/ponytail-review` pada diff untuk memangkas over-engineering, tapi keamanan tetap 100%.

---

<div align="center">
<sub>© 2026 PT Surya Inovasi Prioritas (SURIOTA) · <a href="README.md">Hub WattSettle</a> · Update 5 September 2026</sub>
</div>
