<div align="center">

![Bab](https://img.shields.io/badge/BAB-09%20Keamanan-06b6d4?style=for-the-badge)
&nbsp;
![WattSettle](https://img.shields.io/badge/WattSettle-Build%20Bible-22c55e?style=for-the-badge)
&nbsp;
![Security](https://img.shields.io/badge/security-100%25%20carve--out-ef4444?style=for-the-badge)

# 🔐 Keamanan

### Threat model, replay guard, reentrancy, dan role gating

</div>

**Navigasi:** [Hub](README.md) · [Sebelumnya: 08 Tokenomics](<08 Tokenomics.md>) · [Berikutnya: 10 Deployment dan On-chain Ops](<10 Deployment dan On-chain Ops.md>)

---

## 💡 Prinsip Satu Kalimat

Keamanan adalah axis bernilai tertinggi di rubrik teknis dan satu-satunya bagian yang **tidak boleh dipangkas oleh ponytail**. Semua defense di bawah ini sudah ada atau memakai ulang pustaka OpenZeppelin yang teruji, jadi kita tidak menciptakan kripto sendiri, dan kita tidak menukar keamanan demi kesederhanaan.

> ⚠️ Ini adalah settlement rail yang membayar uang atas bacaan meter, jadi insentif memalsukan reading tinggi. AI verifier bukan dekorasi, ia perlu ada. Namun kontrak tetap harus tahan sendiri terhadap replay, reentrancy, dan aktor tak berwenang, tanpa mengandalkan verifier untuk bersikap benar.

---

## 🎯 Ringkasan Threat Model

Kontrak menghadapi empat kelas ancaman utama, yaitu memalsukan bacaan, mengulang bacaan lama, menguras dana lewat reentrancy, dan bertindak sebagai verifier tanpa izin. Tiap kelas punya mitigasi eksplisit yang sudah ada di kode.

| Ancaman | Vektor | Mitigasi | Status |
|:--|:--|:--|:--|
| Bacaan palsu | Attacker submit `Reading` yang tidak ditandatangani device sah | EIP-712 recover terhadap signer device terdaftar | 🟢 ada, jangan sentuh |
| Replay attack | Kirim ulang reading yang sama untuk dibayar dua kali | `usedDigest` menolak digest yang sudah dipakai | 🟢 ada, jangan sentuh |
| Reading basi atau out-of-order | Sisipkan reading dengan timestamp lama | `lastTs` monotonic guard menolak timestamp mundur | 🟢 ada, jangan sentuh |
| Reentrancy | Malicious token panggil balik saat payout | Checks-effects-interactions plus `nonReentrant` plus SafeERC20 | 🟢 diperkuat di delta |
| Aktor tak berwenang attest | Wallet acak panggil `attestAndSettle` | `onlyRole(VERIFIER_ROLE)` | 🟢 ada, jangan sentuh |
| Pool kering saat payout | Reward pool kontrak habis | Solvency check `balanceOf(this) < reward` revert `InsufficientRewardPool` | 🟢 ada di delta |
| Anomali energi | Reading absurd lolos ke payout | On-chain ruleset gate anomaly dan delta bound, lalu reject on-chain | 🟢 ada di delta |

---

## 🔁 Replay Guard EIP-712 dan Monotonic Timestamp

Dua guard ini melindungi jalur masuk `submitReading` dan **sudah teruji di 6 test base**, jadi jangan diubah.

- **`usedDigest` (anti-replay):** tiap `Reading` menghasilkan digest EIP-712 unik dari tuple `Reading{deviceId, kWh, timestamp, nonce}` di domain `ProofOfWatt/1`. Digest yang sudah dipakai dicatat, dan submit ulang direvert. Ini mencegah satu bacaan dibayar lebih dari sekali.
- **`lastTs` (monotonic guard):** kontrak menyimpan timestamp terakhir per device dan menolak reading dengan timestamp lebih lama atau sama. Ini mencegah penyisipan bacaan basi atau out-of-order.

> ⚠️ Kedua guard ini punya efek samping di demo. Menjalankan ulang reading yang sama akan **revert** `ReplayedReading` atau `StaleTimestamp` di panggung. Karena itu siapkan tiga fixture dengan timestamp distinct berantre, dan script morning-of yang menolak start bila reading akan revert. Detail ada di [10 Deployment dan On-chain Ops](<10 Deployment dan On-chain Ops.md>).

---

## 🛡️ Pertahanan Reentrancy

Payout adalah satu-satunya titik di mana kontrak memanggil kontrak eksternal (transfer token), jadi di situlah reentrancy dipertahankan berlapis.

```solidity
function attestAndSettle(uint256 id, Attestation calldata a)
    external onlyRole(VERIFIER_ROLE) nonReentrant       // 1. reentrancy guard
{
    Submission storage s = submissions[id];
    if (s.status != Status.Pending) revert NotPending();
    // ... ruleset gate ...
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

**Role gating.** Hanya wallet dengan `VERIFIER_ROLE` yang boleh memanggil `attestAndSettle`. Role ini dipegang oleh wallet AI verifier (Hermes agent). Wallet lain yang mencoba attest akan direvert, jadi settlement tidak bisa dipicu aktor sembarang.

**Manajemen kunci device dan agent.** Ada dua kelas kunci yang harus dijaga terpisah.

| Kunci | Pemegang | Fungsi | Disiplin |
|:--|:--|:--|:--|
| Device signing key | SRT-MGATE-1210 di lapangan | Menandatangani `Reading` EIP-712 | Provisioning saat manufaktur, `registerDevice` on-chain, rotasi atau revoke saat RMA |
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

Jalankan `/ponytail-review` pada diff untuk memangkas over-engineering, tapi keamanan tetap 100%.

---

<div align="center">
<sub>© 2026 PT Surya Inovasi Prioritas (SURIOTA) · <a href="README.md">Hub WattSettle</a> · Update 7 Juli 2026</sub>
</div>
