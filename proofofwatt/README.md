<div align="center">

![Foundry](https://img.shields.io/badge/built%20with-Foundry-orange?style=for-the-badge)
&nbsp;
![Tests](https://img.shields.io/badge/tests-6%20passing-brightgreen?style=for-the-badge)
&nbsp;
![Solidity](https://img.shields.io/badge/Solidity-0.8.24-363636?style=for-the-badge)

# 📄 ProofOfWatt.sol

### Kontrak DePIN energy oracle (base untuk WattSettle)

`Foundry` · `Solidity ^0.8.24` · `OpenZeppelin` · `EIP-712` · `6 test PASS`

</div>

> 🧭 Kontrak base Opsi 1 (ProofOfWatt). Opsi 5 dan 6 (WattSettle) adalah evolusinya: tambah struct attestation on-chain dan fee split. Strategi: [`../docs/02 Opsi 5 WattSettle.md`](<../docs/02 Opsi 5 WattSettle.md>).

---

## ⚙️ Cara Kerja

```mermaid
flowchart LR
  DEV["🔌 Device"] -->|sign Reading EIP-712| REL["relayer"]
  REL -->|submitReading| C["📄 ProofOfWatt"]
  C -->|Pending| V["🤖 VERIFIER_ROLE"]
  V -->|approve| PAY["💸 transfer suriota ke owner"]
  V -->|reject| Z["🚫 0 token"]
```

| Fungsi | Akses | Peran |
|:--|:--|:--|
| `registerDevice` | `DEFAULT_ADMIN_ROLE` | daftarkan device (signer, owner) |
| `submitReading` | publik | relay reading ter-sign, cek EIP-712, ts monotonic, anti-replay |
| `verifyReading` | `VERIFIER_ROLE` | approve (bayar) atau reject (0), keputusan AI |
| `setRewardPerKwh` | `DEFAULT_ADMIN_ROLE` | atur reward per kWh |

---

## 🔒 Catatan Audit

| Aspek | Status |
|:--|:--:|
| Verifikasi tanda tangan EIP-712 (ECDSA recover ke signer terdaftar) | ✅ |
| Anti replay (`usedDigest`) plus timestamp monotonic (`lastTs`) | ✅ |
| Access control terpisah (admin vs verifier) | ✅ |
| Checks effects interactions (status di-set sebelum transfer) | ✅ |
| Return value transfer dicek dengan `require` | ✅ |
| Overflow (Solidity 0.8 built in checks) | ✅ |
| Reward pool perlu **pre-fund** (payout dari saldo kontrak, bukan mint) | ⚠️ wajib |

> ⚠️ **Sebelum demo:** transfer kira kira 500.000 `suriota` ke alamat kontrak. Jika reward pool kosong, `verifyReading(approve)` akan revert saat transfer.

---

## 🧪 Menjalankan Test (Git Bash, bukan PowerShell)

```shell
cd proofofwatt
forge test -vvv
```

Cakupan 6 test: happy path (sign, submit, approve, pay), reject tanpa payout, revert bad signature, revert replay, revert stale timestamp, revert non verifier.

---

## ⛓️ Deploy Target

| Item | Nilai |
|:--|:--|
| Network | BNB Smart Chain Testnet |
| chainId | 97 |
| RPC | `https://bsc-testnet-rpc.publicnode.com` |
| Token reward | `suriota` `0x5f730750388176206cC3A7FE894c413675381B05` |
| Status | belum deploy, rencana Sesi 3 |

> 🔐 Private key ada di [`../.secrets/Wallet Testnet.txt`](<../.secrets/Wallet Testnet.txt>) (testnet only, gitignored). Jangan hardcode di script deploy, pakai variabel lingkungan.
