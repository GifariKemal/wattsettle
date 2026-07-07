<div align="center">

<svg width="100%" height="12" viewBox="0 0 1200 12" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="accent">
  <defs><linearGradient id="wsbar" x1="0" y1="0" x2="1" y2="0">
    <stop offset="0" stop-color="#22c55e"/><stop offset="0.5" stop-color="#06b6d4"/><stop offset="1" stop-color="#f59e0b"/>
    <animate attributeName="x1" values="0;0.5;0" dur="6s" repeatCount="indefinite"/>
  </linearGradient></defs>
  <rect width="1200" height="12" rx="6" fill="url(#wsbar)"/>
</svg>

# ⚡ WattSettle, Master Document

### The Machine to Machine Energy Settlement Rail (evolved ProofOfWatt)

**Indonesia Web3 Hackathon 2026 · Binance Academy × BNB Chain × Coinvestasi × Dev Web3 Jogja**
**Builder:** Gifari Kemal Suryo, CEO PT Surya Inovasi Prioritas (SURIOTA)
**Versi:** Master v1.0 · fakta load bearing sudah diverifikasi via research (Feb dan Jul 2026)

`Skor 90` · `Track Finance & Commerce` · `Nominasi 84% s.d 90%` · `Juara 1 45% s.d 58%`

</div>

> 🧭 Bahasa Indonesia untuk narasi, istilah teknis dan kode dalam English. Dokumen ini rujukan strategi plus eksekusi sampai Demo Day. **Baca bagian 9 (kill-shots) sebelum apapun**, di situ ada koreksi fatal terhadap asumsi awal.

**Navigasi cepat:** [hub](../README.md) · [master strategi](<01 Master Strategi.md>) · [Opsi 6 Enovatek](<03 Opsi 6 Enovatek.md>) · [SWOT](<04 SWOT Opsi 5 6.md>)

---

## 0. Executive Decision

**Keputusan:** Bangun **WattSettle**: evolusi (BUKAN rewrite) dari kontrak `ProofOfWatt.sol` yang sudah ada (6 test PASS, Foundry v1.7.1, sudah diverifikasi ulang hari ini). Submit ke track **Finance & Commerce** sebagai "M2M energy-settlement rail", dengan AI Agents sebagai fallback sah. Reuse ERC20 `suriota` yang sudah verified sebagai settlement token.

**Blackbox lever (satu kalimat):** Menangkan lewat tiga lever yang 100% dalam kendali solo-builder dan yang TIDAK BISA ditiru field pemula, (1) **track arbitrage** ke track yang paling tipis, (2) **moat hardware + revenue nyata di 15 detik pertama**, (3) **AI autonomy yang legible on-chain** dengan MENULIS ke **ERC-8004/BEP-620 Validation Registry yang SUDAH LIVE di BSC** (integrate, bukan mirror), semua dibungkus **satu loop demo deterministik**.

### Target Probability (jujur, tidak di-inflate)

| Metrik | Angka jujur | Kondisi |
|---|---|---|
| **Finalist / Nomination** | **84 sampai 90%** | Flawless execution + SEMUA fix §9 diterapkan + SEMUA hard gate ditutup |
| Finalist (jika dibiarkan seperti spec awal) | 78 sampai 83% | Mirror-framing, demo approval-only, field clip "melayang", gate belum ditutup |
| **1st place in-track** | **45 sampai 58%** | Flawless + fix + track arbitrage tervalidasi data. **BUKAN >90%.** |
| 1st place (jika Finance ternyata ramai clone) | 38 sampai 45% | Maka pindah ke AI Agents |

**Kenapa angka ini di bawah klaim naif 90 sampai 94%:** dua hal yang spec awal anggap kekuatan sebenarnya kondisional/reversible menjadi liability, (a) framing "self-contained mirror of ERC-8004" adalah **bunuh diri di depan juri BNB** karena registry-nya sudah live di rantai yang sama (lihat §9 Kill-shot #1), dan (b) >90% sepenuhnya bergantung pada gate yang **saat ini belum satupun tuntas**. Struktural tailwind-nya nyata dan mengerjakan sebagian besar beban: field pemula tahap-ide, pool ~$5k/3 track (≈1 pemenang/track), konsep = jawaban kanonik kurikulum, semua hard gate solo-controllable, dan moat real-company/hardware yang tidak bisa dipalsukan siapapun.

**Jangan janjikan juara 1.** Engineering memberi kursi terbaik, bukan piala.

---

## 1. Analisis Hackathon: Edisi Ini vs Pendahulunya & Pola Pemenang

### 1.1 Timeline, KOREKSI FATAL dari brief

Brief menyebut "Demo Day 30 Aug 2026". **SALAH.** Terverifikasi dari tweet resmi Coinvestasi/NIKI dan Luma:

| Tanggal | Event |
|---|---|
| 1 Jul 2026 | Registration open |
| 5 Jul, 30 Aug 2026 | Online workshop & mentoring (9 sesi Minggu malam 19.30 WIB) |
| **30 Aug 2026** | **Sesi 9 = "Learn How to Pitch at Demo Day"** (pitch training, BUKAN Demo Day) |
| **1 Sep 2026** | **Submission OPENS** |
| **30 Sep 2026** | **Submission DEADLINE** |
| **14 Okt 2026** | **Finalist Announcement** |
| **31 Okt 2026** | **DEMO DAY** (final, live, online via Google Meet) |

**Implikasi besar:** ada **satu bulan penuh (September)** untuk build setelah workshop selesai, lalu 2 minggu penjurian sebelum finalis diumumkan. Jadwal jauh lebih longgar dari yang diasumsikan. Tidak ada alasan gate hygiene tidak tuntas.

### 1.2 Rubrik (de-facto BNB Chain 5-pillar)

Tidak ada rubrik resmi di Luma, tapi BNB co-organizer dan mempublikasi framework penjurian. Perlakukan sebagai rubrik:

| Pillar | Bobot | Cara WattSettle memaksimalkan |
|---|---|---|
| **Technical Implementation & Code Quality** | **30%** | Kontrak verified + SafeERC20 + ReentrancyGuard + NatSpec + ~14 test + commit history bersih |
| **Innovation & Creativity** | **25%** | Attestation legible on-chain + integrasi Validation Registry live = novel di field chatbot |
| Functionality & UX | 20% | Satu loop deterministik yang jalan flawless; BscScan sebagai UI (Ponytail: no custom FE di critical path) |
| Business Impact & Sustainability | 15% | PT nyata + hardware shipping + customer B2B + revenue model on-chain (fee) |
| Teamwork & Presentation | 10% | Pitch 3 menit, peak-end engineered, founder-CEO framing |

Technical (30%) + Innovation (25%) = **55% skor** ada di dua axis yang paling bisa di-over-invest oleh senior engineer. Itu strateginya.

### 1.3 Hard submission gates (tiap satu = disqualifier)

Wallet token-verify step · deploy BSC testnet 97 · **open-source dengan commit history terlihat** (single squash = red flag) · **contract VERIFIED di BscScan** · **≥2 real on-chain tx** · README + roadmap · demo video · tweet tag `@BNBChain @BinanceAcademy @coinvestasi @devweb3jogja #IndonesiaWeb3Hackathon`.

### 1.4 Siapa yang menilai & apa yang mereka menangkan (lineage)

Predecessor (Web3 University Tour 2026) BUKAN build-hackathon, hanya "Cumlaude Web3": kuis + pitch ide 1 menit tanpa kode (pemenang: DuelPic, PharmaTrace, Raka, AgriChain, VeriEdu). **Artinya field pemula tahap-ide.** Solo builder yang deploy produk on-chain teruji sudah top-decile sebelum demo dimulai.

Mentor = kemungkinan besar juri, dan mereka elite:
- **Yeheskiel Yunus Tame**: Co-Founder **OwnaFarm** (juara 1 GameFi Mantle, invoice-financing petani), juara 1 Synthesis Agentic AI.
- **Oktavianus Bima Jadiva**: juara 2 ZK&Privacy Mantle dengan **zkPull** (real-world off-chain event → cryptographically verified → contract auto-releases reward, no middleman).
- **Aditya Wisnu Wardana** (ScaleX, Base Indo track), **Dimas Riatmodjo** (ex-Factor Finance).

**zkPull = kerangka identik ProofOfWatt.** Juri sudah PRIBADI menang dengan pola ini. Pitch line "**zkPull for physical energy**" wajib.

**Taste terdokumentasi Dev Web3 Jogja:** (a) anti-clone keras ("80% proyek hackathon ide yang sama"); (b) RWA/DePIN/payments (pemenang mereka direkrut ke perusahaan RWA-tokenization/stablecoin/payments); (c) "market = non-crypto users". OwnaFarm (petani, invoice financing) = dead-center taste mereka. **Perusahaan energi Indonesia nyata yang settle kWh nyata = bullseye di axis yang paling tinggi bobotnya.**

### 1.5 Kurikulum = kunci jawaban

Sesi 3 sampai 4 "Foundry + Token + Bounty Board + Security"; **Sesi 6 "Backend: API + AI Auto-verify"**; Sesi 8 "AI Integration". Kurikulum mengajari pola **on-chain bounty + off-chain AI auto-verify + contract payout oracle**. WattSettle **ADALAH** jawaban kanonik kurikulum → juri menilainya sebagai "benar" dengan risiko demo rendah.

---

## 2. Kategori & Konsep Terpilih

### 2.1 Track: Finance & Commerce (default), AI Agents (fallback)

**Track arbitrage** adalah lever tunggal terbesar. 3 track, ~$5k → ≈1 pemenang/track. **Jangan** masuk AI Agents yang akan penuh chatbot fork. Finance & Commerce = tempat hampir nol pemula bisa ship kontrak settlement kerja, DAN dead-center taste Dutch Web3 Jogja (OwnaFarm).

> **PERINGATAN (Kill-shot #4, §9):** asumsi "Finance paling tipis" BELUM tervalidasi data. RWA/payments juga jawaban kanonik kurikulum → bisa jadi track TERPADAT dengan clone oracle/settlement. **Aksi wajib:** scout registration density lewat kontak Dev Web3 Jogja/Coinvestasi di akhir September, siapkan kedua framing, pilih by data. Jika Finance ramai → AI Agents (di situ autonomous-verifier jadi standout).

### 2.2 Konsep (one-liner)

> SRT-MGATE-1210 milik SURIOTA yang ter-deploy di lapangan menandatangani kWh nyata secara kriptografis; verifier AI otonom mem-verifikasi ulang bacaan terhadap baseline on-chain perangkat, menerbitkan **rationale-nya sebagai attestation on-chain** (kWh-vs-baseline delta, anomaly score, model+ruleset hash) dalam bentuk **ERC-8004 `validationResponse`**, lalu kontrak **auto-settle** pembayaran ke produsen energi, **zkPull for physical energy**, sebuah RWA payments rail untuk energi industri Indonesia.

### 2.3 Kenapa varian settlement-rail mengalahkan varian yang lebih kaya

Setiap varian lebih kaya (WattCredit mint+buy, WattBond yield-note, UptimeUnderwriter reserve-pool, CarbonProof CO2e, Karya-8004 full stack) membeli inovasi marginal dengan MENAMBAH surface yang: (a) memaksa aktor/tx kedua yang harus dijaga deterministik, atau (b) menambah accounting edge-case (solvency pool, coupon pro-rata) tepat di titik di mana demo solo flawless PATAH. Settlement-rail = delta kontrak terkecil (~1 hari) di atas base yang sudah 6-test PASS, dan memaksimalkan dua lever 1st-place yang fully controllable: **demo determinism** + **hardware/revenue moat**. WattBond & Karya-8004 = "stretch pivot" tertinggi ceiling-nya JIKA eksekusi lari lebih cepat dari jadwal, didokumentasikan sebagai roadmap, bukan scope hackathon.

---

## 3. Engineering / Arsitektur / Metode

### 3.1 State kontrak aktual (terverifikasi hari ini)

`src/ProofOfWatt.sol` (Solidity ^0.8.24, OZ AccessControl+EIP712+ECDSA+IERC20). Sudah benar & teruji:
- `submitReading()`, EIP-712 recover + `usedDigest` replay guard + `lastTs` monotonic guard. **JANGAN SENTUH.**
- **Dua gap terdokumentasi (persis):** **line 95** `verifyReading(uint256 id, bool approved)` = boolean role-gated → autonomy invisible; **line 103** `require(rewardToken.transfer(...))` = raw transfer, butuh SafeERC20.
- 6 test PASS (`forge test`), Foundry v1.7.1, MockToken bernama "suriota".

### 3.2 Arsitektur tiga layer (BSC testnet 97, zero external runtime dependency di critical path)

**LAYER 1, PHYSICAL/EDGE (reuse hardware, mocked-for-demo).** SRT-MGATE-1210 (ESP32, Modbus→MQTT) = device signer. Firmware/simulator memegang ECDSA key, EIP-712-sign `Reading{deviceId,kWh,timestamp,nonce}` di domain `ProofOfWatt/1`. Untuk live run, reading **pre-seeded** (fixture bertanda tangan), tidak ada device/MQTT/RPC live di critical path.
> **Fix Kill-shot #3:** tangkap **satu** signature nyata dari unit SRT-MGATE-1210 lapangan dan pakai fixture ITU sebagai demo reading → device di field-clip = device di on-chain tx, secara jujur bisa dibilang sama. Ini task firmware/one-signature, bukan rebuild.

**LAYER 2, SETTLEMENT CONTRACT (`WattSettle.sol`, delta ~1 hari).** `submitReading()` verbatim. Satu-satunya fungsi berubah: `verifyReading` → `attestAndSettle(id, Attestation calldata a)`.

**LAYER 3, AUTONOMOUS VERIFIER AGENT (reuse Hermes infra, moat operasional tak tertiru).** Python agent cron/tool-calling di VPS SURIOTA. Subscribe `ReadingSubmitted` via BSC testnet RPC (web3.py), recompute `kwhDeltaVsBaseline` vs baseline + anomaly ruleset, build `Attestation`, panggil `attestAndSettle()` dengan VERIFIER_ROLE, **tanpa klik manusia**. Di panggung: pre-seeded deterministic state.

**Data flow (satu loop):** device-signed Reading → `submitReading()` emit `ReadingSubmitted` → Hermes agent bangun, recompute, build Attestation → `attestAndSettle()` cek ruleset, emit `ReadingAttested` (rationale decoded), `safeTransfer` suriota ke owner, bump reputation, **ALSO** panggil ERC-8004 `validationResponse()` ke registry live → tx confirmed + attestation decoded LIVE di BscScan.

### 3.3 Contract surface (delta yang tepat)

```solidity
// ── KEEP UNCHANGED (sudah teruji, jangan sentuh) ──
//   submitReading(bytes32,uint256,uint64,uint256,bytes) : EIP-712 + replay + monotonic guards
//   registerDevice, READING_TYPEHASH, Device/Submission/Status, events, AccessControl roles

// ── NEW: attestation struct, field-names MIRROR ERC-8004 validationResponse semantics ──
struct Attestation {
    int256  kwhDeltaVsBaseline;  // "response" rationale numeric
    uint16  anomalyScoreBps;     // 0..10000
    bytes32 modelVersionHash;    // keccak256(pinned model/logic version)  → auditable, not asserted
    bytes32 rulesetHash;         // keccak256(published ruleset file)       → matches repo file
    uint64  evaluatedAt;
}

// ── REPLACE verifyReading(id,bool) → attestAndSettle(id, Attestation) ──
function attestAndSettle(uint256 id, Attestation calldata a)
    external onlyRole(VERIFIER_ROLE) nonReentrant
{
    Submission storage s = submissions[id];
    if (s.status != Status.Pending) revert NotPending();

    // ON-CHAIN RULESET GATE = self-contained x402 "402→pay→prove" handshake (facilitator = verifier)
    bool approved = (a.anomalyScoreBps <= maxAnomalyBps)
                 && (_abs(a.kwhDeltaVsBaseline) <= maxDeltaBound);
    s.status = approved ? Status.Approved : Status.Rejected;   // effects BEFORE interaction (sudah benar)

    Reputation storage rep = deviceReputation[s.deviceId];
    if (approved) { rep.approvedReadings++; } else { rep.rejectedReadings++; }
    rep.avgAnomalyBps = _rollAvg(rep.avgAnomalyBps, a.anomalyScoreBps, ...);

    uint256 reward = 0;
    if (approved) {
        reward = s.kWh * rewardPerKwh;
        uint256 fee = (reward * feeBps) / 10_000;             // FINANCE SUBSTANCE (Kill-shot #4 fix)
        if (rewardToken.balanceOf(address(this)) < reward) revert InsufficientRewardPool();
        rewardToken.safeTransfer(devices[s.deviceId].owner, reward - fee);   // SafeERC20 (line 103 fix)
        if (fee > 0) rewardToken.safeTransfer(treasury, fee);
    }
    emit ReadingAttested(id, s.deviceId, approved, a);        // BscScan-decodable rationale
    emit SettlementFeeTaken(id, /*fee*/ ...);
}
```

Tambahan lain: `import SafeERC20 + ReentrancyGuard` (keduanya sudah ada di lib OZ, **zero new deps**), `error InsufficientRewardPool`, mapping `deviceReputation`, NatSpec penuh, `MockUSD` (6-dp) in-repo sebagai one-line constructor swap (tidak di-wire default).

### 3.4 Metode

- **EVOLVE NOT REWRITE.** Branch dari repo saat ini. Delta = struct+event, `attestAndSettle`, SafeERC20+ReentrancyGuard+solvency, reputation, fee, NatSpec. Sisanya byte-for-byte.
- **TDD pada delta** (superpowers:test-driven-development). Pertahankan 6 test hijau (rename `verifyReading` → `attestAndSettle` dgn Attestation lolos). TAMBAH: attest-approve-pays-via-SafeERC20; reject-when-anomalyBps>threshold; reject-when-delta-out-of-bound; reputation increment; **reentrancy attempt reverts** (malicious token); insufficient-pool reverts; only-VERIFIER; **fee split correct**; event emits decoded Attestation. Target ~14 test deterministik.
- **PONYTAIL minimal-code (rule global wajib).** Reuse OZ SafeERC20/ReentrancyGuard (no hand-roll); no custom FE di demo (BscScan + cast). Satu contract, satu struct, satu event, satu mapping. **Security 100%, jangan dipangkas.** `/ponytail-review` pada diff.
- **SECURITY carve-out.** Checks-effects-interactions dipertahankan (status set sebelum transfer, sudah benar), nonReentrant di payout, SafeERC20, solvency check, VERIFIER_ROLE gating, EIP-712 replay+monotonic guards utuh.
- **Framing terkalibrasi fakta terverifikasi.** ERC-8004 `validationResponse(bytes32 requestHash, uint8 response, string responseUri, bytes32 responseHash, bytes32 tag)` (verified dari BEP-620 forum). x402 402→pay→prove sebagai handshake self-contained (facilitator = in-contract verifier). Pitch = "zkPull for physical energy".

---

## 4. Business Model + Revenue + After-Sales + GTM

### 4.1 Model bisnis, razor-and-blades, vertically integrated

SURIOTA sudah menjual & deploy hardware (SRT-MGATE-1210) dan mengoperasikan produk energy-monitoring (surge-energy-map) ke customer B2B industri nyata, **itu razor**. WattSettle adalah **blade**: layer settlement + attestation on-chain yang mengubah tiap kWh terverifikasi jadi payment event yang provable di BNB Chain. Revenue = potongan tipis atas settlement flow + subscription per-device. Karena SURIOTA menguasai full stack (silicon→firmware→gateway→Hermes verifier→smart contract→settlement token), tidak ada oracle/facilitator/vendor eksternal untuk berbagi margin atau memblokir.

### 4.2 Revenue streams

| Stream | Mekanisme | Sifat |
|---|---|---|
| **Settlement take-rate** (primary) | fee bps on-chain tiap payout AI-verified (0.5 sampai 2%) | Scale dgn volume kWh; micropayment-viable (median fee BNB ~$0.0038) |
| **Per-device attestation SaaS** | subscription bulanan/tahunan per gateway | ARR spine; upsell di atas kontrak hardware existing |
| **RWA/green-attestation premium** | jual proof source-class + CO2e ke ESG buyer (ekstensi CarbonProof) | Tie ke OJK sandbox + PR 110/2025 |
| **Infrastructure licensing / white-label** | lisensi kontrak+verifier ke operator energy-DePIN lain | B2B2X software, CAC rendah |
| **Hardware pull-through** (indirect) | meter yang bisa auto-bill + prove output → naikkan penjualan gateway | DePIN flywheel |
| Financing/yield spread (roadmap) | WattBond machine-yield note (di-gate kWh) | Ceiling tertinggi; off critical path |

### 4.3 After-sales (keunggulan struktural, SURIOTA sudah perusahaan hardware)

- **Device lifecycle & key management**: provisioning signing key saat manufaktur, `registerDevice` on-chain, rotasi/revoke pada RMA; reputation counter on-chain = health/trust score per unit.
- **SLA-backed monitoring**: Hermes verifier sudah cron + watchdog; anomaly score di attestation stream = sinyal predictive-maintenance/tamper (tier managed-service berbayar).
- **OTA firmware**: GatewaySuriotaOTA sudah ada; upgrade ruleset/model tanpa truck-roll; `rulesetHash`/`modelVersionHash` on-chain bikin tiap upgrade auditable & version-pinned.
- **Settlement support & reconciliation**: tiap payout on-chain dgn attestation human-readable → dispute "kenapa dibayar/ditolak X" diselesaikan dgn menunjuk record BscScan immutable → biaya support kolaps.
- **Tiered support**: standard (email+dashboard+self-serve BscScan audit) bundled hardware; premium managed-verifier + SLA + predictive-maintenance = recurring upsell.

### 4.4 GTM

1. **Beachhead = installed base SURIOTA sendiri.** Land WattSettle sebagai upgrade berbayar "verifiable auto-settled billing + audit trail" di gateway yang SUDAH ter-deploy. Zero cold-start, hardware, relasi, kontrak support, data metered sudah ada. Unfair advantage terbesar vs field manapun.
2. **Design-partner motion**: konversi 1 sampai 3 customer jadi pilot berbayar (puluhan gateway) → case study + PO/invoice ter-redaksi = collateral pitch DAN sales enterprise.
3. **Land-and-expand** per site: satu meter → full-site sub-metering → multi-site (ride 18.11% CAGR energy/utilities IoT + trajektori 60 sampai 80M smart-meter PLN).
4. **Regulatory-credibility wedge**: OJK sandbox RWA eligibility + PR 110/2025 + settlement BI-safe (non-IDR). Trigger beli CFO/ESG industri = "compliant, auditable, machine-verified".
5. **Ecosystem channel via BNB**: hackathon = GTM; relasi BNB/Binance Academy/Coinvestasi/Dev Web3 Jogja = warm intro ke ekosistem RWA+agentic-finance BNB (RWA BNB ~$3.6 sampai 3.9B). Positioning: "BNB's own published M2M-energy x402 case study, shipped".
6. **White-label phase 2**: lisensi rail ke operator energy-DePIN SEA lain.

### 4.5 Market anchor (frame ceiling, bukan klaim)

M2M payments TAM ~$11.29B (2026)→$54.95B (2034) @21.9% CAGR. Agentic commerce ~$8B (2026)→$1.5T (2030, Juniper); McKinsey $3 sampai 5T retail by 2030. DePIN ~$9 sampai 11B cap, energi = ~38% deployment, ~$150M/bln on-chain revenue. Indonesia meter market ~$180 sampai 220M (2026); IoT $14.98B (2026), energy/utilities sub-sector 18.11% CAGR. **SOM jujur (bottom-up):** fleet SRT-MGATE-1210 sendiri × fee per gateway = beachhead $10k, 100k ARR, BUKAN kejar TAM miliaran. TAM = ceiling; moat = beachhead nyata & tak tertiru.

---

## 5. MVP Scope Dipetakan ke 9 Sesi (+ September build month)

Prinsip: **gate hygiene dari Sesi 1**, delta kontrak dibentang natural, September = polish + rehearse. Commit harian genuine (jangan squash).

| Sesi / Fase | Tanggal | Output |
|---|---|---|
| **Sesi 1**: Foundations 1 | 5 Jul | Repo public LIVE + steady commits mulai. README skeleton + checklist gate. Tweet peserta. |
| **Sesi 2**: Solidity/Guestbook | 12 Jul | Branch `wattsettle`. Tulis `Attestation` struct + `ReadingAttested` event (TDD red). |
| **Sesi 3**: Foundry+Token+Bounty | 19 Jul | `attestAndSettle` gantikan `verifyReading`; on-chain ruleset gate; 6 test lama hijau lagi. |
| **Sesi 4**: Full Bounty+Security | 26 Jul | SafeERC20 + ReentrancyGuard + solvency + fee split; test reentrancy/solvency/fee. `/ponytail-review`. |
| **Sesi 5**: Reading Chain+Indexing | 2 Ags | Hermes agent: listen `ReadingSubmitted`, recompute delta+anomaly, build Attestation (off-chain). |
| **Sesi 6**: API + AI Auto-verify | 9 Ags | Agent panggil `attestAndSettle` cron, ZERO click. Deploy `WattSettle` ke testnet 97. **forge verify-contract + screenshot.** |
| **Sesi 7**: dApp UI | 16 Ags | (Ponytail) BscScan sbagai UI + halaman statis tipis "field clip + attestation decoded". Fire ≥2 tx, simpan URL. |
| **Sesi 8**: AI Integration + Scope | 25 Ags | **Integrasi ERC-8004 Validation Registry LIVE** (`validationResponse`) sebagai act-2 (Kill-shot #1 fix). Tangkap 1 signature hardware nyata (Kill-shot #3). |
| **Sesi 9**: Pitch training | 30 Ags | Pitch deck + skrip 3 menit. Rekam demo video fallback (loop identik, flawless). |
| **September build month** | 1 sampai 30 Sep | Rehearse loop 20×, harden determinism (§6 runbook), scout track density, submit sebelum 30 Sep. |
| **Finalist window** | 14 Okt | Jika finalis: final rehearsal untuk Demo Day 31 Okt. |

**Scope FROZEN:** satu signer, satu verifier, satu attestation contract, satu settlement loop, satu reputation counter. No cross-chain. No self-deploy ERC-8004 singleton baru (pakai yang live). No hard-wire external x402 di critical path.

---

## 6. Demo Day, Pitch Table + Runbook

### 6.1 Pitch arc (3:00, peak-end engineered)

| Waktu | Beat | Isi |
|---|---|---|
| 0:00 sampai 0:15 | **MOAT FIRST** | Cold open: klip 12 dtk SRT-MGATE-1210 di dinding pabrik customer + PO ter-redaksi. "This is not a demo device. This machine bills a real Indonesian customer today. In the next 90 seconds it gets paid by an AI, no human touches the button." |
| 0:15 sampai 0:40 | **PROBLEM (vocab mereka)** | "A smart contract can't trust a sensor. The oracle problem for PHYSICAL work is unsolved." Tanam frasa **proof of physical work**. |
| 0:40 sampai 1:30 | **DETERMINISTIC PEAK LOOP** | Trigger reading (pre-seeded) → Hermes agent bangun sendiri (cron, zero click), recompute, post attestation → `attestAndSettle` → auto-pay → **ALSO** tulis `validationResponse` ke registry ERC-8004 LIVE → tx confirmed LIVE di BscScan, event decoded. |
| 1:30 sampai 1:50 | **SHOW A REJECTION** (Kill-shot #2) | Reading kedua yang sengaja anomalous → agent **TOLAK** on-chain, no payout. "It evaluates, it doesn't rubber-stamp." |
| 1:50 sampai 2:10 | **PEAK + SILENCE** | 2 sampai 3 detik diam di tx confirmed + attestation decoded. Jangan narasi di atasnya. |
| 2:10 sampai 2:35 | **BNB FIT + ANCHOR** | "Real kWh is RWA. An autonomous verifier settling machine-to-machine is Agentic Finance. My device is the first physical-DePIN agent writing to BNB's LIVE ERC-8004 registry. It's zkPull for physical energy." |
| 2:35 sampai 3:00 | **CLOSE ON MOAT** | "A student can fork a chatbot in a weekend. Nobody can fork a licensed Indonesian energy company's field meters. Contract verified, commits public, txs live, check them yourself." STOP. |

**Memorable line:** *"zkPull for physical energy, a real Indonesian company, settling real kilowatt-hours, machine-to-machine, no human in the loop."* Backup (technical-judge): *"That's not a boolean approve, that's the AI's rationale, on-chain, forever."*

### 6.2 Runbook (determinism = win condition)

1. **PRE-SEED EVERYTHING.** No live device/sensor/RPC-read di critical path. Autonomy nyata (cron zero-click) tapi INPUT dipatok. Rehearse wall-clock cron→attest→settle→confirm 20×.
2. **VIDEO FALLBACK** flawless direkam sebelum hari-H, full-screen satu keystroke. Kalau live tersendat, potong ke video di tengah kalimat tanpa minta maaf.
3. **PIN CONFIRMED TX.** Tab-2 = BscScan tx dari run sukses sebelumnya, event decoded expanded. Jangan pernah tunggu indexer live di panggung.
4. **LOCK STATE MALAM SEBELUMNYA (as code):** contract masih verified; agent wallet cukup testnet BNB (≥10× gas satu tx); saldo suriota kontrak ≥ payout; **reading id demo BELUM terpakai** (monotonic+replay guard akan REVERT re-run, pakai tuple (deviceId,nonce,timestamp) fresh; siapkan 3 fixture distinct-timestamp berantre).
5. **TWO-TAB DISCIPLINE.** Tab-1 agent log/trigger. Tab-2 BscScan pre-loaded. No tab-hunting.
6. **TIME-BOX 3:00.** Loop ~40s. Satu-satunya cut = paragraf keyword BNB (2:10 sampai 2:35). Jangan pernah cut field clip atau silence.
7. **MOCKUSD ESCAPE HATCH.** Swap ke MockUSD (6-dp) = one-line. Putuskan pagi hari-H: panel skew regulator → stablecoin build; skew crypto-builder → suriota (zero new-token risk).
8. **3 KILLER Q&A (<20s each):** (a) "AI benar otonom?" → cron + attestation event, tawarkan tunjuk config + jalankan reading unseeded live. (b) "Apa cegah device palsukan reading?" → EIP-712 sig + monotonic/replay guard + reputation + verifier re-execution independen. (c) "Kenapa BNB?" → RWA+Agentic Finance pillars + literally published M2M-energy x402 scenario + registry ERC-8004 live.

---

## 7. Benchmark Scoring, Semua Opsi

Skala /100. Nomination & Win = angka jujur (bukan inflasi).

| # | Opsi | Total | Nomination | Win (1st in-track) | Catatan kunci |
|---|---|---|---|---|---|
| OPT1 | ProofOfWatt (original, AI Agents) | 74.5 | 80 sampai 86% | 38 sampai 48% | Boolean verify = autonomy invisible; base kuat tapi tinggalkan poin di rubrik; track ramai |
| OPT2 | JanjiChain (AI arbiter escrow) | 48 | 25 sampai 35% | 8 sampai 15% | No mechanism novelty (GenLayer/UMA/Kleros); verdict subjektif = anti-deterministik; no moat |
| OPT3 | ProofOfAlpha (signal oracle) | 54 | 35 sampai 45% | 12 sampai 20% | Butuh price-oracle eksternal di critical path; ERC-8004 singleton tak bisa self-deploy; near-clone Veil |
| OPT4 | Karmakhet (validation reputation) | 58 | 40 sampai 50% | 15 sampai 24% | Registry+re-exec ambisius solo; "empty registry" salah (AgentKarma); binary gate |
| **O5-A** | **WattSettle (attestation + MockUSD + x402)** | **90** | 90 sampai 94%* | 52 sampai 62%* | Ekspresi terbersih tiap lever; risiko: mock-stablecoin = satu token baru |
| **O5-C** | **WattSettle (reuse suriota, DEFAULT)** | **89.5** | 90 sampai 94%* | 52 sampai 60%* | Delta terkecil, zero new-token risk; kalah tipis di keyword "stablecoin" literal |
| O5-E | WattSettle x402 3-role + MockUSD | 88 | 88 sampai 93%* | 50 sampai 60%* | Keyword density tertinggi; surface terbesar dari varian settlement |
| O5-B | WattCredit (mint + buy flow) | 83 | 82 sampai 88% | 38 sampai 48% | Two-actor surface; tambah surface untuk narasi marginal |
| O5-G | UptimeUnderwriter (parametric insurance) | 82 | 80 sampai 87% | 40 sampai 50% | Konsep tersegar; solvency/pool edge-case = risiko solo |
| O5-H | WattBond (yield note, coupon di-gate kWh) | 80 | 80 sampai 86% | 40 sampai 50% | Narasi RWA terbaik; share-accounting = lift terberat |
| O5-F | Karya-8004 (self-deploy BEP-620 stack) | 81 | 80 sampai 87% | 44 sampai 54% | BNB-fit maksimal; integrasi 3-registry = risk terbesar + default ke track ramai |
| O5-D | CarbonProof (CO2e attestation) | 79.5 | 78 sampai 85% | 34 sampai 44% | Carbon = surface defensibility yang bisa diprobe juri |

\* **Koreksi jujur red-team:** angka O5 90 sampai 94% terlalu tinggi. Range jujur setelah fix = **84 sampai 90% nomination / 45 sampai 58% win** (lihat §0). Yang menaikkan kembali ke ~88 sampai 90%: integrasi registry live + demo rejection + semua gate ditutup.

**Pemenang: O5-C WattSettle (reuse suriota)**: feasibility-safe default. **O5-A/MockUSD = one-line swap** kalau sensitivitas keyword "stablecoin" tinggi di hari-H.

---

## 8. Arah AI × Web3 & Kenapa Ini Future-Proof

### 8.1 Ke mana puck bergerak (terverifikasi)

- **Pilar 2026 BNB = Stablecoins + RWA + Agentic Finance.** ~179k AI agent sudah transact di BNB (~60% semua on-chain agent).
- **ERC-8004/BEP-620 LIVE di BSC mainnet+testnet (4 Feb 2026).** Reference impl CC0 (BRC8004): IdentityRegistry `0xfA09B3397fAC75424422C4D28b1729E3D4f659D7`, ReputationRegistry `0x17860530385Bdde7992c4Da71B9ec7791E474C08`. BNBAgent SDK live testnet. BASCAN.io explorer. `validationResponse(requestHash, response 0-100, responseUri, responseHash, tag)`.
- **x402 LIVE di BNB (19 Mei 2026).** Settle USDC/USDT/U/USD1. Unibase = inaugural x402 facilitator di BNB (~31 Des 2025), EIP-3009 assets, repo `unibaseio/unibase-x402-bsc`.
- **Lifecycle kanonik BNB:** identity (ERC-8004) → paid/pays (x402) → hires/delegates (ERC-8183) → reputation over time (8004scan). **Demo WattSettle menelusuri arc ini di panggung.**
- **DePIN > oracle** (~$9 sampai 11B cap, ~$150M/bln revenue); energi vertikal terbesar; pasar menuntut "verifiable real-world work", bukan narasi. AI-driven anti-fraud (deteksi spoofed hardware signature) = infra inti → validasi tesis verifier WattSettle.
- **Indonesia:** supervisi kripto → OJK (financial-asset regime, Jan 2026); sandbox RWA (POJK 3/2024); tokenizable assets ~$88B by 2030. PT berlisensi yang taruh energi metered on-chain = "mature/compliant Web3" yang diinginkan regulator DAN BNB.

### 8.2 Kenapa future-proof

WattSettle duduk di SEMUA-nya sekaligus: real kWh = **RWA**, verifier otonom = **Agentic Finance**, x402 = **settlement**, ERC-8004 Validation Registry = **trust primitive**, hardware nyata = **DePIN proof-of-physical-work** yang tak bisa dipalsukan student manapun. Ia future-proof karena **literally case study M2M-energy x402 yang BNB publikasikan sendiri, di-ship perusahaan Indonesia nyata**: dan karena mengINTEGRASI (bukan mirror) registry live menjadikannya **agent physical-DePIN pertama di primitive terbaru BNB**.

---

## 9. Kill-Shot Checklist (BACA SEBELUM APAPUN)

### KS#1, FATAL-FRAMING: "self-contained mirror" = bunuh diri di depan juri BNB
**Risiko:** BEP-620/ERC-8004 LIVE di BSC testnet 97 (4 Feb 2026), BNBAgent SDK live 18 Mar 2026. Pitch "attestation mirror ERC-8004 vocabulary, self-contained, no external singleton dependency" TERBALIK di depan rep BNB yang tahu registry mereka ada di rantai yang kamu deploy. Pertanyaan mematikan: *"Kenapa hand-roll event bespoke yang meniru standar kami, alih-alih register device di Validation Registry ERC-8004 yang live di testnet 97?"* → membalik lever inovasi #1 jadi dismissal #1.
**FIX (WAJIB):** **INTEGRASI registry live sebagai act-2 demo**, kontrak self-contained tetap jadi settlement core. Setelah `attestAndSettle` emit event, Hermes verifier JUGA panggil `validationResponse(requestHash, score 0-100, responseUri)` di Validation Registry testnet 97 untuk reading yang sama. Pitch: "I don't reimplement BEP-620, my physical DePIN device is the FIRST real-world agent writing to BNB's live registry, and my settlement rail is the payment layer on top." Fallback: pre-record leg itu. **Framing "self-contained mirror" HARUS MATI.**

### KS#2, AUTONOMY THEATER: gate = if-statement, demo approval-only
**Risiko:** juri baca Solidity → lihat gate `attestAndSettle` cuma threshold trivial pada nilai yang di-supply agent → "rubber stamp". "Run unseeded live" → tolak = staged; terima + hiccup = demo mati.
**FIX:** (1) live run submit DUA reading, satu clean (settle), satu anomalous (**REJECT on-chain, no payout**). Rejection 10× lebih meyakinkan dari approval. (2) Tunjuk cron log + `rulesetHash` on-chain match file ruleset di repo → "computed not hardcoded" verifiable. (3) Rehearse jawaban "run one live now", siapkan reading ketiga unseeded-but-known-good, tawarkan.

### KS#3, MOAT MELAYANG: field clip ≠ on-chain reading
**Risiko:** klip = video kotak di dinding; reading = signature dari script Python. Dua artefak TAK TERHUBUNG. "Apakah device di klip yang tanda tangan tx ini?" → jujur: tidak.
**FIX:** tangkap SATU signature EIP-712 nyata dari SRT-MGATE-1210 lapangan, pakai sebagai pre-seeded demo reading → klip & tx = device sama, bisa dibilang jujur. Task firmware/one-signature. Minimal: `registerDevice` dgn signer key device nyata, tunjuk signer address di BscScan match unit fisik.

### KS#4, TRACK ARBITRAGE bisa jadi LIABILITY
**Risiko:** nol data per-track count. RWA/payments = jawaban kanonik kurikulum → Finance bisa TERPADAT dengan clone. Rail dua-fungsi (attest+transfer) tampak TIPIS vs builder DeFi dengan liquidity/pricing/counterparty.
**FIX:** (1) scout submission count nyata via kontak Dev Web3 Jogja/Coinvestasi sebelum deadline; siapkan kedua framing; pilih by data + judge mix. (2) **Tambah finance substance:** fee split take-rate ON-CHAIN di `attestAndSettle` (sudah di §3.3) → "payment RAIL dengan revenue model", bukan sekadar transfer.

### KS#5, DEMO-NETWORK / REPLAY-GUARD SELF-BRICK
**Risiko:** (1) `submitReading` monotonic+replay guard → re-run konsumsi slot → REVERT `StaleTimestamp`/`ReplayedReading` di panggung. (2) `attestAndSettle` safeTransfer dari balance kontrak + solvency check → gas rendah / pool ke-drain rehearsal → revert. (3) BSC testnet 97 flaky.
**FIX:** (1) live reading pakai tuple fresh, script cek `usedDigest`+`lastTs` yang refuse start kalau bakal revert; 3 fixture distinct-timestamp berantre. (2) Night-before checklist as code: assert saldo suriota ≥ payout, wallet BNB ≥ 10× gas, contract verified. (3) Video fallback satu keystroke. (4) Pin prior REAL confirmed tx di tab-2. Rehearse rantai penuh 20× lawan RPC nyata.

### KS#6, GATE-HYGIENE FICTION (disqualifier tersembunyi)
**Risiko:** commit history (burst = "backdated" pattern), contract BARU `attestAndSettle` butuh re-verify (base verified ≠ contract baru verified), ≥2 tx contract BARU, README+roadmap, tweet 4 handle + hashtag tepat. Miss SATU = entry technically-winning di-nol-kan. Solo builder = lupa checkbox, bukan lupa fitur.
**FIX (P0, done EARLY + screenshot proof):** (1) commit harian genuine mulai Sesi 1. (2) `forge verify-contract` + screenshot saat deploy. (3) fire ≥2 tx (submitReading + attestAndSettle), simpan URL. (4) README + roadmap + checklist tick-with-proof-link. (5) tweet exact `@BNBChain @BinanceAcademy @coinvestasi @devweb3jogja #IndonesiaWeb3Hackathon`, screenshot. **>90% mustahil dgn satu gate terbuka.**

---

## 10. Victory Metric + Path-to-90

### 10.1 Victory metric

**Primary (fully controllable):** finalis + track-win + SEMUA hard gate proven-with-screenshot + satu demo loop deterministik yang dieksekusi flawless (live atau video fallback tak terbedakan). **Secondary (reputational, sesungguhnya hadiahnya):** Binance Academy Student Ambassador pipeline, jaringan Dev Web3 Jogja, jalur Easy Labs/MVB incubation BNB, warm intro ekosistem RWA+agentic-finance BNB. Cash ($5k/3 track ≈ $1.5 sampai 2.5k) sekunder, optimalkan visibilitas finalis+track-win.

### 10.2 Path-to-90 (urut leverage)

1. **FLIP framing ERC-8004**: stop "self-contained mirror". Integrasi Validation Registry LIVE sebagai act-2 (Hermes tulis `validationResponse`). "First physical-DePIN agent writing to BNB's live registry, settlement rail on top." **Perubahan single highest-leverage untuk nomination di mata juri BNB.**
2. **TIE MOAT KE CHAIN**: tangkap 1 signature EIP-712 nyata dari SRT-MGATE-1210, pakai sebagai demo reading → klip = tx. Ubah moat dari klaim atas video jadi properti sistem yang terdemonstrasi.
3. **SHOW A REJECTION**: agent tolak reading anomalous on-chain di live loop. Refutasi terkuat "is the AI real".
4. **TUTUP SEMUA GATE MINGGU INI, DENGAN PROOF LINK**: commit harian, re-verify contract baru, ≥2 tx, README+roadmap+checklist, tweet exact handle. Screenshot semua.
5. **VALIDASI TRACK DGN DATA**: count per-track nyata via kontak; siapkan dua framing; pilih by data. Kalau Finance ramai → AI Agents.
6. **TAMBAH FINANCE SUBSTANCE**: fee split take-rate ON-CHAIN → "payment rail with revenue model".
7. **HARD-ENGINEER DETERMINISM**: script morning-of cek revert-guard; 3 fixture berantre; assert saldo+gas night-before; video fallback satu keystroke; pin prior confirmed tx; rehearse 20×.

### 10.3 Ringkasan jujur

Nomination >90% **credible tapi kondisional**: didorong faktor struktural (field pemula, pool tipis, konsep = kurikulum, gate solo-controllable, moat tak tertiru) dan HANYA jika (a) semua gate ditutup, (b) demo flawless deterministik, (c) autonomy legible on-chain via registry live. Setelah semua fix: **84 sampai 90% nomination / 45 sampai 58% win**. Juara 1 TIDAK dijanjikan, engineering memberi kursi terbaik. Dua hal yang tak bisa ditandingi entrant lain, **demo determinism + moat hardware/revenue di 15 detik pertama**: adalah tepat yang harus di-over-invest.

---

*Dokumen ini dibangun di atas fakta terverifikasi (Jul 2026): kontrak 6-test PASS (Foundry v1.7.1), ERC-8004/BEP-620 live BSC mainnet+testnet dgn alamat CC0, x402 live BNB (USDC/USDT/U/USD1), timeline resmi (Submission 1 sampai 30 Sep, Finalist 14 Okt, Demo Day 31 Okt). Sumber: forum.bnbchain.org/BEP-620, github.com/BRC8004, bnbchain.org blog, knowyouragent.network, luma.com/pcc699dv, x.com/coinvestasi, x.com/nkskrdwyn, competehub.dev.*