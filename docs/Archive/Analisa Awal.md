> 🗄️ **ARSIP.** Opsi ini sudah divalidasi dan bukan fokus submission. Disimpan sebagai referensi dan roadmap. Fokus aktif: [Opsi 5 WattSettle](<../02 Opsi 5 WattSettle.md>) · [Opsi 6 Enovatek](<../03 Opsi 6 Enovatek.md>) · [Codex 7 dan 8](<../Codex Opsi 7 8/>). Index arsip: [README](README.md).

---

# Indonesia Web3 Hackathon 2026, Analisa & Progress

> PT Surya Inovasi Prioritas (SURIOTA) · Peserta: Gifari Kemal Suryo
> Program: https://luma.com/pcc699dv · Update terakhir: 2026-07-05

## Program
Hackathon nasional **AI × Web3**, kolaborasi **Binance Academy × BNB Chain × Coinvestasi × Dev Web3 Jogja**. Gratis, online. Prize pool **USD 5,000**.

**Tracks:** AI Agents · Finance & Commerce · Consumer Apps
**Track pilihan:** 🤖 **AI Agents**: framing "Autonomous On-Chain Verification Agent" (DePIN/energy/carbon = slide bisnis saja)
**Ide project:** **ProofOfWatt ⚡** _(Opsi A, flagship)_
**Strategi juara 1:** lihat `STRATEGI-JUARA1-ProofOfWatt.md` (validasi 8-agent + red-team; win prob ~65 sampai 75% 1st-in-track)
**Contract base:** `proofofwatt/` (Foundry), `ProofOfWatt.sol`, **6 tests PASS**, belum deploy (S3)

---

## 💡 OPSI A, ProofOfWatt ⚡  (DePIN Energy Oracle, verified by AI)

**One-liner:** Gateway IoT SURIOTA menandatangani & mengirim data energi ke on-chain; sebuah **AI agent** memverifikasi keabsahannya secara otonom, lalu smart contract otomatis membayar reward token `suriota`. Hasilnya: data energi yang **kriptografis + teraudit-AI**: bisa dipercaya pihak ketiga (pembeli karbon, operator grid, sertifikat EBT).

**Masalah:** Data energi/IoT (meteran, solar, mesin industri) tidak bisa dipercaya pihak luar. Verifikasi manual lambat & rawan manipulasi.

**Kenapa SURIOTA menang (moat):** sudah punya **hardware nyata** (SRT-MGATE-1210 Modbus→MQTT), energy map, dan infra AI (Hermes/SUVA). Peserta lain hanya punya simulasi.

**Kenapa mudah dibangun (align kurikulum):**
| Sesi | Yang diajarkan | Jadi komponen ProofOfWatt |
|---|---|---|
| 1 | Token | `suriota` = reward token ✅ (sudah deploy & mint) |
| 3 | Bounty Board | Registry submission bacaan energi |
| 4 | Security | Signature verify, anti-replay, access control (role verifier) |
| 5 | Indexing | Index submission & payout untuk dashboard |
| 6 | **AI Auto-verify** | **Inti: AI agent cek plausibilitas → approve/reject → payout** |
| 7 | dApp UI | Dashboard energi terverifikasi + reward (gaya surge-energy-map) |
| 8 | AI Integration | Pola agent otonom |

**MVP (scope ketat, Ponytail):**
1. Contract `EnergyProof`: `submitReading(deviceId, kWh, ts, sig)` → simpan; `verify(id, approved)` (hanya role verifier/AI) → kalau approved, transfer/mint `suriota` ke device owner.
2. AI verifier (Python off-chain): dengar event submission → cek plausibilitas (batas fisik kWh/interval, deteksi anomali, cross-check) → panggil `verify()`.
3. Demo Day: simulasikan/gunakan feed SRT-MGATE → tunjukkan AI **auto-approve data valid** & **tolak data spoof** → token terbayar otomatis. Live, pakai hardware = wow factor.

**Tema hackathon:** AI × Web3 + DePIN + energy → tepat sasaran juri BNB Chain.

## Roadmap Workshop (Minggu, 19.30 sampai 21.30 WIB)
| Sesi | Tanggal | Topik | Status |
|---|---|---|---|
| 1 | 5 Jul  | Foundations 1, Environment + First Deploy | ✅ Selesai |
| 2 | 12 Jul | Foundations 2, Solidity via Guestbook | ⬜ |
| 3 | 19 Jul | Smart Contract 1, Foundry + Token + Bounty Board | ⬜ |
| 4 | 26 Jul | Smart Contract 2, Full Bounty + Security | ⬜ |
| 5 | 2 Ags  | Backend 1, Reading Chain + Indexing | ⬜ |
| 6 | 9 Ags  | Backend 2, API + AI Auto-verify | ⬜ |
| 7 | 16 Ags | Frontend, dApp UI | ⬜ |
| 8 | 25 Ags | AI Integration + Scope Ideas | ⬜ |
| 9 | 30 Ags | Pitch di Demo Day | ⬜ |

## State On-Chain (BSC Testnet, chainId 97)
- **Network:** BNB Smart Chain Testnet · RPC `https://bsc-testnet-rpc.publicnode.com` · Explorer `https://testnet.bscscan.com`
- **Wallet (Rabby):** `0x52317162A7a228D01353e8907a5C068A6D9a0F2e`, ~0.00985 tBNB (faucet)
- **Token ERC20 `suriota`:** `0x5f730750388176206cC3A7FE894c413675381B05`
  - decimals 18 · totalSupply **1,000,000** (mint 5 Jul via `cast`, semua di wallet owner) · bytecode standar ✅
  - **Verified di BscScan** ✅ (solc `v0.8.34+commit.80d5c536`, optimization off, constructor arg `initialOwner`=wallet)
  - Source: `contract Suriota is ERC20, Ownable` (OZ ^5.6.0), punya `mint(to, amount) onlyOwner`
  - **solc `0.8.34`** (diambil dari metadata on-chain) · metadata IPFS
  - Catatan: `name` == `symbol` == `"suriota"` → symbol sebaiknya diringkas (mis. `SRT`) di deploy berikutnya.

## Verify Contract di BscScan, Cheatsheet
Form "Verify & Publish Contract Source Code":
1. **Contract Address:** `0x5f73...1B05`
2. **Compiler Type:**
   - Sumber 1 file tanpa `import` → **Solidity (Single file)**
   - Pakai import (mis. `@openzeppelin`) → **Flatten dulu** di Remix lalu Single file, ATAU **Solidity (Standard-Json-Input)** (upload JSON build-info dari Remix)
3. **Compiler Version:** `v0.8.34+commit...` (wajib sama persis)
4. **Optimization:** samakan dgn saat deploy (Remix default: **Disabled**; kalau Enabled → runs 200)
5. **Constructor Arguments:** kosongkan; kalau constructor ambil argumen (mis. name/symbol) → isi ABI-encoded (BscScan sering auto-detect).
6. Centang terms → Verify.

**Cara termudah (rekomendasi):** pakai plugin Remix **"Contract Verification"** (butuh BscScan API key), auto-submit setting yang benar, tanpa nebak compiler type/optimization.

## Keamanan ⚠️
- Private key & password wallet ada plaintext di `My Data.txt`, **testnet-only**. Jangan pernah pakai keypair/pola ini untuk mainnet.
- Password `Tampan12` (bscscan) = password lemah yg pernah bocor → ganti & jangan reuse.
- Gunakan burner wallet khusus hackathon, terpisah dari wallet asli.
