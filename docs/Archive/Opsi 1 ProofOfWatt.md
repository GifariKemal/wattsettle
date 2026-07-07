> 🗄️ **ARSIP.** Opsi ini sudah divalidasi dan bukan fokus submission. Disimpan sebagai referensi dan roadmap. Fokus aktif: [Opsi 5 WattSettle](<../02 Opsi 5 WattSettle.md>) · [Opsi 6 Enovatek](<../03 Opsi 6 Enovatek.md>) · [Codex 7 dan 8](<../Codex Opsi 7 8/>). Index arsip: [README](README.md).

---

# ProofOfWatt, Strategi Definitif MENANG 1ST PLACE
### Indonesia Web3 Hackathon 2026 (Binance Academy x BNB Chain x Coinvestasi x Dev Web3 Jogja)
**Builder:** Gifari Kemal Suryo, PT Surya Inovasi Prioritas (SURIOTA) · **Demo Day:** 30 Agustus 2026 · **Deploy target:** BNB Smart Chain Testnet (chainId 97)

---

## 0. Executive Decision (baca ini saja kalau buru-buru)

| Keputusan | Pilihan Final | Alasan |
|---|---|---|
| **Track** | **AI Agents** (headline: *Autonomous On-Chain Verification Agent*) | Best-fit + kompetisi paling dangkal (mayoritas student ship chatbot) + reference-implement kurikulum Session 6 |
| **Framing** | AI agent yang MEMUTUSKAN & bertransaksi sendiri. DePIN/energy/carbon = **satu slide bisnis**, bukan judul | Di event "AI x Web3" poin tertinggi ada di AGENT reasoning, bukan hardware logistics |
| **Concept** | ProofOfWatt core dipertahankan; scope dipotong keras ke **ONE golden path** | #1 penyebab proyek kuat kalah = demo setengah jadi |
| **Metric kemenangan** | Satu loop live sub-3-menit: **spoof di-REJECT → reading asli di-APPROVE → token auto-pay, tx confirm di BscScan** | Maks 2 pilar terlemah (Usability + real AI) sekaligus, mustahil dipalsukan |
| **Win probability (dengan fixes)** | **HIGH ~65 sampai 75%** 1st-in-track | Moat near-uncopyable; risiko hanya self-inflicted |

**Satu kalimat yang juri ulang di deliberasi:** *"Setiap tim DePIN menjanjikan data dunia-nyata, kami satu-satunya yang hardware-nya sudah di lapangan, dan AI-nya barusan menolak sebuah kebohongan lalu membayar sebuah kebenaran, live, di BNB Chain."*

---

## 1. Track Final & Positioning

**Masuk track AI Agents. Titik.** Jangan re-angle ke Finance/DePIN/Consumer.

- **Definisi track (verbatim):** "AI agents that act, decide, and interact autonomously on-chain, executing complex tasks without continuous human intervention." Core loop ProofOfWatt (agent verifikasi kWh → approve/reject → contract auto-pay) adalah fit tekstual **terbaik di seluruh kompetisi**.
- **Kompetisi per-track:** Consumer Apps = paling ramai & susah menonjol. Finance & Commerce = banyak DeFi clone + builder berpengalaman. **AI Agents = konsep terkuat + student competition terdangkal** (kebanyakan ship chatbot dangkal) → ruang untuk hardware-backed autonomous agent mendominasi.
- **Reference-implement kurikulum panitia:** S3 (Foundry+Token+Bounty Board), S4 (Full Bounty+Security), S5 (Indexing), **S6 (API + AI Auto-verify)**: panitia LITERAL mengajarkan pola "AI-verifies-then-contract-pays". Juri melihat reference pattern mereka sendiri dieksekusi berkualitas produksi = "tim ini paham."

**Aturan bahasa panggung:** ucapkan **"autonomous on-chain agent"** berulang; referensikan agent-identity infra (BNB Chain = #1 dunia untuk on-chain AI agents, 150k+ deployment per Apr 2026, ERC-8004 + BAP-578). Energy/carbon disebut HANYA di slide bisnis.

---

## 2. Concept yang Dipertajam

**ProofOfWatt = autonomous on-chain agent yang mengaudit data energi dunia-nyata dan menyelesaikan pembayaran on-chain tanpa campur tangan manusia.**

Loop:
1. Device (SRT-MGATE-1210 / ESP32) menandatangani pembacaan kWh via **EIP-712**.
2. Reading di-relay on-chain ke contract (`submitReading`), signature, monotonic timestamp, & replay diverifikasi.
3. **AI agent otonom** berlangganan event `ReadingSubmitted`, menjalankan **verification chain** (physical bounds → z-score anomaly → cross-source reconciliation), lalu LLM (Hermes) menghasilkan **audit verdict natural-language + confidence score**.
4. Agent menandatangani & mengirim `verifyReading(id, approved)` sendiri dari VERIFIER_ROLE wallet.
5. Approval → contract auto-transfer token suriota ke device owner. Tx confirm di BscScan.

**JANGAN klaim menciptakan mekanismenya.** Prior art nyata: Chainscore Labs menjual oracle ini off-the-shelf; WeatherXM ship reward-by-plausibility di produksi. Sebut WeatherXM sebagai precedent terbukti ("WeatherXM for industrial energy"), lalu klaim pocket yang BENAR-BENAR belum diambil:

> **Satu-satunya entry yang menggabungkan (a) hardware INDUSTRIAL nyata yang builder miliki & ship, (b) AI agent otonom yang emit AUDIT VERDICT bahasa-natural yang rule tak bisa, (c) energi spesifik, (d) pain PLN-REC / CBAM double-counting Indonesia yang tak dibahas kompetitor global ke juri INI.**

Diferensiasi = **vertical + owned hardware + local market + reasoning agent**, BUKAN diagram arsitektur.

---

## 3. MVP Scope, Golden Path & YAGNI Cut-List

### 3.1 MUST-EXIST (non-negotiable core, semua yang juri LIHAT harus live on-chain)

| # | Deliverable | Status |
|---|---|---|
| 1 | 4-function contract deployed + **verified** di BSC testnet | Sudah compile + 6 tests PASS (`scratchpad/pow2`) |
| 2 | Token suriota `0x5f73…1B05` sebagai reward pool (transfer ~500k ke contract) | Token sudah deployed + verified + 1M minted |
| 3 | ≥1 registered device dengan signature ASLI | Off-device signing shim |
| 4 | AI verifier process yang bertransaksi **otonom** (subscribe→decide→sign+send) | ~80 sampai 150 baris Python, reuse Hermes |
| 5 | Single-page dashboard (event-poller) tampil pending/approved/rejected + payout | Plain ethers, no subgraph |

### 3.2 YAGNI CUT-LIST (semua ini = PITCH NARRATIVE, JANGAN pernah jadi code)

`NO` ESP32-native signing (pakai off-device shim 30-baris Python yang baca Modbus & pegang device key, juri tak bisa tahu, tetap reading asli bertanda-tangan) · `NO` staking/slashing · `NO` on-chain ML/ZK · `NO` carbon marketplace contract · `NO` subgraph · `NO` NFT device identity · `NO` DAO · `NO` upgradeable proxy · `NO` multi-oracle consensus · `NO` mainnet · `NO` integrasi carbon-buyer nyata.

### 3.3 Contract surface (sudah terbukti, JANGAN tambah)

`registerDevice(deviceId,signer,owner)` [admin] · `submitReading(deviceId,kWh,timestamp,nonce,sig)` [anyone relays, ECDSA.recover vs registered signer] · `verifyReading(id,approved)` [VERIFIER_ROLE = AI agent hot wallet] · `setRewardPerKwh(v)` [admin, tuning angka payout].

**Anti-replay yang bekerja & murah:** monotonic `lastTs` per-device + `usedDigest[bytes32]` keyed pada full EIP-712 digest. Domain EIP-712 (name+version+chainId+verifyingContract) mencegah cross-chain/cross-contract replay gratis.

---

## 4. Peta 9 Session (Jul, Aug 2026), Timeline Terkontrol

| Session | Tanggal (est.) | Milestone ProofOfWatt | Gate |
|---|---|---|---|
| **S1, Token** | ✅ BANKED | suriota ERC20 deployed, 1M minted, verified BscScan | DONE |
| **S2, Solidity Guestbook** |, | Warm-up; pahami storage/events |, |
| **S3, Foundry+Token+Bounty Board** |, | Deploy ProofOfWatt (dari `scratchpad/pow2`), register 1 device, transfer reward pool | Contract di testnet |
| **S4, Full Bounty + Security** |, | Roles (VERIFIER_ROLE), anti-replay, monotonic ts, 6 tests hijau di CI | Security audit self |
| **S5, Reading Chain + Indexing** |, | Event-poller ethers → JSON feed untuk dashboard | Feed jalan |
| **S6, API + AI Auto-verify** ⭐ | **9 Aug, SCOPE FREEZE** | AI agent: subscribe→bounds+z-score+cross-source→Hermes verdict→sign+send `verifyReading` OTONOM | **Golden path end-to-end jalan** |
| **S7, dApp UI** |, | Single-page dashboard: pending/approved/rejected + payout + verdict text. **Rekam FALLBACK VIDEO full loop** | Recorded fallback siap |
| **S8, AI Integration polish** |, | Confidence score visible, reasoning log per-decision, staged spoof scenario | Demo dress-rehearsal #1 sampai 3 |
| **S9 → Demo Day (30 Aug)** | 30 Aug | Rehearse sub-3-min loop **≥5x di real testnet**; runbook; repo hygiene | 1st place |

**Aturan besi:** apa pun yang belum di golden path per **S6 (9 Aug)** = otomatis masuk cut-list. Trajectory diceritakan, bukan dibangun.

---

## 5. Tokenomics (Slide, Bukan Code), Two-Currency, Anti Death-Spiral

Jangan pitch "kami jual RECs" (TAM kecil $9 sampai 15M). Presentasikan two-currency model yang tak bisa dibolongi juri:

| Sisi | Mekanik | Efek |
|---|---|---|
| **BUYERS** (REC/CBAM/ESG client) | Bayar harga **USD-stable**; protocol **BURN** suriota untuk settle | Demand-backed buy pressure (Burn-and-Mint Equilibrium) |
| **OPERATORS** (pemilik gateway SURIOTA) | Earn suriota via **DECAYING emission tail** = `verified_kWh × rate`, **capped di nameplate capacity** | Bootstrap subsidy, bukan income permanen |
| **Sybil defense** | Device identity = keypair whitelisted on-chain + (roadmap) staked bond di-slash saat AI flag fraud | Fake node tak bisa mint; slash > 1 epoch reward |

**Pernyataan panggung wajib:** "Emisi = subsidi bootstrap yang konvergen ke burn-funded equilibrium dalam **18 sampai 24 bulan**; reward = verified kWh × rate yang TURUN saat revenue buyer NAIK." **Tunjukkan math emisi, jangan asserted.** Ini persis kegagalan DePIN (mercenary-dump) yang dihindari.

**Fix operasional demo (KRITIS):** payout via `rewardToken.transfer` dari saldo contract sendiri. **Pre-fund contract ~500k suriota SEBELUM demo** (mint `onlyOwner` = deployer, bukan contract → kalau tak pre-fund, SETIAP approval revert `reward xfer failed` dan klimaks pitch mati). Tune `rewardPerKwh` agar payout jadi angka bulat menonjol di layar, bukan 10^20 wei.

---

## 6. Market / Business Case (Number-Anchored, Bukan Hand-Waving)

Reframe dari "DePIN yang bayar token" → **"AI-verified, CBAM-grade MRV oracle untuk data energi C&I Indonesia."**

| Klaim | Angka keras (citable) |
|---|---|
| **Demand driver #1** | **EU CBAM LIVE sejak 1 Jan 2026**: exporter tanpa data emisi terverifikasi kena "default value" penalti bermarkup. ~20% ekspor aluminium Indonesia ke EU. ProofOfWatt = artefak yang menghindari penalti itu |
| **Demand terbukti** | PLN REC **6.43 TWh (2025, +19.65% YoY)**; buyer: Nike, Ajinomoto, Frisian Flag, Sampoerna, PT Smelting |
| **Regulasi favorable** | **Perpres 110/2025** (10 Okt 2025) buka voluntary carbon trading internasional, akui Verra/Gold Standard, buat registry SRUK anti-double-count |
| **Comparable terbukti** | Arkreen: 300k+ node, 140 GWh RECs on-chain, **membuktikan model monetize**; edge SURIOTA: sudah PUNYA hardware + customer industrial |
| **TAM** | Indonesia carbon-market potential Rp3,000T + CBAM-exposed export MRV (bukan REC-only $9 sampai 15M) |
| **SAM** | C&I distributed solar Indonesia: 1.49 GW cumulative 2025 (+546 MW/yr), profil customer SURIOTA persis |
| **SOM (beachhead)** | Install-base SRT-MGATE-1210 existing + client smelter/manufaktur CBAM-exposed yang butuh Scope-2 verification SEKARANG |

**GTM (leverage moat):** (1) firmware upgrade gateway existing → oracle node (CAC ~nol vs Arkreen jual miner cold); (2) upsell "CBAM/ESG-ready verified Scope-2 data" ke client manufaktur existing; (3) route output ke PLN GEAS/I-REC + IDXCarbon; (4) partner verifier I-REC/Verra terakreditasi → AI-audit jadi pre-check murah. **Carbon = upside; CBAM/ESG = revenue line.**

---

## 7. Oracle-Trust Paradox, Jawaban Q&A yang Menentukan 1st vs 3rd

**Pertanyaan mematikan:** *"Apa yang mencegah gateway KAMU menandatangani kebohongan?"* Signature membuktikan ORIGIN, bukan kebenaran meter. AI check jalan SETELAH device sign → reading plausible-tapi-palsu (dalam bounds) bisa lolos = garbage-in-signed-garbage.

**One-liner ter-rehearse (hafalkan):**
> "Signature membuktikan asal-usul; AI verifier membuktikan plausibilitas dengan **CROSS-REFERENCE sumber independen yang tidak dikontrol device**: cap nameplate-capacity + sinyal kedua (PLN import/export, atau surge-energy-map irradiance/weather). Jadi reading palsu harus konsisten dengan sumber yang attacker tak bisa palsukan. Tamper-resistance penuh = secure-element attestation + staked slashing, ada di roadmap kami."

**DEMONSTRASIKAN, jangan hanya jawab:** spoof yang di-stage HARUS yang ditangkap AI via **kontradiksi cross-source** (mis. generasi di malam hari dengan nol irradiance, ATAU kWh interval melebihi nameplate secara fisik), BUKAN sekadar angka out-of-range. **Jangan pernah** klaim signature saja membuktikan kebenaran.

---

## 8. AI-Agent Anti-Theater, Buat AI Melakukan Yang Rule Tak Bisa

Risiko: "AI cek physical bounds" = if-statement (persis yang WeatherXM lakukan TANPA LLM). Juri canggih akan bilang "itu range check, mana AI-nya?" di Q&A.

**Susunan wajib (VISIBLE di layar):**
1. **Deterministic verification chain DULU:** physical bounds → z-score anomaly → cross-source reconciliation.
2. **LLM (Hermes) SETELAHNYA:** hasilkan **audit justification bahasa-natural + confidence score** yang menjelaskan approve/reject, di-log per decision, tampil di layar.
3. **Autonomy load-bearing:** agent subscribe event, DECIDE, dan **sign+send tx sendiri unattended**: ITU definisi tekstual AI agent.

**Aturan:** LLM datang SETELAH checks; **LLM tak pernah generate raw verdict sendirian** (kalau LLM yang memutuskan angka, itu theater & tak deterministik).

---

## 9. Demo Day Pitch, Struktur Sub-3-Menit (di-rehearse ke muscle memory)

| Waktu | Segmen | Isi |
|---|---|---|
| **0 sampai 20s HOOK** | Problem visceral | "Pasar karbon dunia jalan di atas sistem kejujuran, triliunan klaim iklim diverifikasi oleh spreadsheet dan kepercayaan." |
| **20 sampai 45s PROBLEM+STAKES** | Trust crisis | Data energi/karbon self-reported, unauditable, penuh fraud (double-counting, greenwashing) |
| **45s, 2:00 LIVE DEMO** ⭐ | **SELURUH pitch** | (1) Submit spoof kWh mustahil-fisik → **agent REJECT live, reasoning tampil, nol token**. (2) Submit reading asli bertanda-tangan gateway → **agent APPROVE → contract auto-pay suriota, block confirm live di BscScan** |
| **2:00 sampai 2:30 UNFAIR ADVANTAGE** | Moat | "Setiap tim lain simulasi ini. Kami tidak. Reading ini dari gateway kami sendiri di lapangan, ditandatangani hardware yang SURIOTA sudah ship, membayar token kami yang sudah live di BNB testnet. Kami taruh perusahaan nyata on-chain dalam satu weekend." |
| **2:30 sampai 2:50 WHY BNB / TRAJECTORY** | Roadmap | "BNB Chain bilang 2026 tentang melayani non-human, agent otonom settle real-world value. ProofOfWatt itu, berjalan. Next: setiap gateway SURIOTA di lapangan jadi income node, ekspor data energi AI-audited ke carbon buyer global, volume RWA baru, dibangun di Indonesia, di BNB." |
| **2:50 sampai 3:00 CLOSING** | Line yang diulang juri | "Kami satu-satunya yang hardware-nya sudah di lapangan, dan AI-nya barusan menolak sebuah kebohongan lalu membayar sebuah kebenaran, live, di BNB Chain." |

**National-pride button:** perusahaan industrial Indonesia mengekspor data energi AI-audited ke pasar karbon global, hardware dibangun & ditandatangani di Indonesia. `#WhereBuildersBuild` mendarat paling keras saat builder ada di ruangan dengan produk yang sudah ship.

---

## 10. Runbook Demo Day, Netralisir Live-Failure (many single points of failure)

Rehearse ke muscle memory:
1. **Pre-fund reward pool** ~500k suriota ke contract SEBELUM demo (fix transfer-vs-mint). Tune `rewardPerKwh` → angka bulat menonjol.
2. **Top-up tBNB ke 0.1+** dari beberapa faucet malam sebelumnya (wallet hanya ~0.0099 tBNB, satu gas spike = stuck). **Pin fallback RPC.**
3. **Pre-register device**, pre-warm pool, VERIFIER_ROLE pakai **dedicated testnet burner** (jangan expose key deployer di panggung).
4. **Recorded fallback video** full reject-then-pay loop siap dipotong instan kalau stall.
5. Rehearse seluruh loop sub-3-min **≥5x di real testnet**.

---

## 11. Repo Hygiene, Free Technical-Pillar Points (kebanyakan tim lewatkan)

- [ ] **PUBLIC repo** + **open-source LICENSE** (MIT)
- [ ] README dengan **Mermaid architecture diagram** (device→sign→submit→agent→verify→pay)
- [ ] **One-command Foundry deploy** script + **no hardcoded secrets** (private key `0xfb1a…188e` HARUS di `.env`, JANGAN commit)
- [ ] 6 tests hijau di CI, badge di README
- [ ] **Redeploy token symbol 'SRT'** (name==symbol=='suriota' = cosmetic wart di BscScan; opsional tapi lebih polished)
- [ ] Link verified contract BscScan di README

---

## 12. Metric yang Membuktikan Kemenangan

**Satu metric utama (day-of):** loop live end-to-end sub-3-menit berhasil, spoof REJECTED (0 token) + reading asli APPROVED dengan **suriota balance device owner berubah on-screen** dan **tx hash confirmed di testnet.bscscan.com**, tanpa intervensi manual di langkah verify.

**Leading indicators sebelum Demo Day:**
- S6: golden path end-to-end jalan otonom (agent sign+send sendiri) ✅
- S7: recorded fallback video full loop ✅
- S9: ≥5 rehearsal sukses di real testnet, 0 revert ✅
- Repo hygiene checklist 100% ✅
- Oracle-trust one-liner + spoof cross-source scenario ter-rehearse ✅

**Target:** **1st place track AI Agents (~65 sampai 75% dengan semua fixes diterapkan).**

---

## 13. Kill-Shot Checklist (dari red-team, tempel di dinding)

| # | Kill-shot | Status mitigasi |
|---|---|---|
| 1 | Over-scoping 9 session part-time → demo setengah jadi | HARD scope-cut ke ONE golden path, freeze S6, off-device signing shim, YAGNI cut-list |
| 2 | Oracle-trust paradox di Q&A | One-liner cross-source + demo spoof via kontradiksi sumber + roadmap honesty |
| 3 | Live-demo failure (RPC/tBNB/nonce/pool) | Pre-fund pool + 0.1 tBNB + fallback RPC + burner + recorded video + ≥5x rehearsal |
| 4 | "Just another DePIN energy token" (prior art) | Sebut WeatherXM sebagai precedent; klaim pocket vertical+hardware+local+reasoning-agent |
| 5 | AI-agent theater (if-statement) | Deterministic chain DULU, LLM verdict+confidence SETELAHNYA, autonomy load-bearing |
| 6 | Market hand-waving + tokenomics death-spiral | CBAM/ESG MRV reframe + two-currency BME + decaying emission math ditampilkan |

**Prinsip penutup:** moat nyata & near-uncopyable dalam satu weekend. Satu-satunya cara kalah adalah self-inflicted. Lindungi golden path di atas segalanya.