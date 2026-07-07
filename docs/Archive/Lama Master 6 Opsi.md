> 🗄️ **ARSIP.** Opsi ini sudah divalidasi dan bukan fokus submission. Disimpan sebagai referensi dan roadmap. Fokus aktif: [Opsi 5 WattSettle](<../02 Opsi 5 WattSettle.md>) · [Opsi 6 Enovatek](<../03 Opsi 6 Enovatek.md>) · [Codex 7 dan 8](<../Codex Opsi 7 8/>). Index arsip: [README](README.md).

---

# STRATEGI MASTER, 6 OPSI PROJECT
### Indonesia Web3 Hackathon 2026 · Binance Academy × BNB Chain × Coinvestasi × Dev Web3 Jogja
**Builder:** Gifari Kemal Suryo, PT Surya Inovasi Prioritas (SURIOTA) · **Demo Day:** 30 Agustus 2026 · **Deploy:** BNB Smart Chain Testnet (chainId 97)
**Dokumen ini = index master.** Detail per-opsi ada di file `STRATEGI-*.md` masing-masing. Update terakhir: 6 Juli 2026.

---

## 0. Ringkasan Eksekutif (baca ini kalau buru-buru)

| # | Nama | Track | Skor | Nominasi | Juara-1 | Status |
|---|---|---|---|---|---|---|
| **5** | **WattSettle** (rel M2M energy settlement) | Finance & Commerce | **90** | 78 sampai 90% | 42 sampai 62% | ⭐ **Visi platform** |
| **6** | **WattSettle × Enovatek/PM20H20Q** (produk) | Finance & Commerce |, |, |, | ⭐ **Mesin demo** |
| 1 | ProofOfWatt (DePIN energy oracle) | AI Agents | 74.5 | 80 sampai 86% | 38 sampai 48% | base contract siap (6 tests) |
| 4 | Karmakhet (ERC-8004 validation reputation) | AI Agents | 58 | 40 sampai 50% | 15 sampai 24% | arsip |
| 3 | ProofOfAlpha (proof-of-alpha oracle) | Finance & Commerce | 54 | 35 sampai 45% | 12 sampai 20% | arsip |
| 2 | JanjiChain (AI arbiter escrow janji) | Consumer/AI | 48 | 25 sampai 35% | 8 sampai 15% | arsip |

**Keputusan final:** Bangun **Opsi 6 (Enovatek/PM20H20Q) sebagai mesin DEMO** (1 kasus konkret, deterministik, live) + pitch **Opsi 5 (WattSettle) sebagai VISI platform** (bisa ke solar/EV/CBAM/P2P). Track = **Finance & Commerce**. Tagline = **"zkPull untuk energi fisik."**
> *"Di panggung: 1 keran jalan sempurna (Enovatek). Di slide: pipa ke semua pasar (WattSettle)."*

**Opsi 9 sampai 13 (deep-research 17-agen, 7 Jul 2026):** kandidat Finance & Commerce baru di luar 1 sampai 6 → `STRATEGI-JUARA1-Opsi9-13-Finance-Commerce.md`. Skor red-team (WattSettle=90): **VeriFaktur 79→~84-85 dgn fixes** (invoice financing device-attested + Artha underwriter, pandora box "machine-verified receivable") · **TuntasCOD 79.5** (settlement oracle retur COD, demo teatrikal, tapi reskin WattSettle) · **Talangan 71.5** (zkTLS payout-factoring seller) · **Faktur402 64.5** (tax-split e-Faktur di atas x402 BSC) · **Mandat 63** (AP2 terbuka + AI CFO). **Kesimpulan: tak ada yang mengalahkan WattSettle apa adanya** (meter=settlement semantik rapat, kandidat commerce punya oracle-gap). Rekomendasi: WattSettle tetap entri utama; **VeriFaktur = cadangan terkuat + arah produk komersial pasca-hackathon**; Opsi 10 sampai 13 = amunisi/roadmap. Nomor 7 sampai 8 sengaja dikosongkan (buffer).

---

## 1. Konteks Hackathon (hasil riset mendalam)

- **Format:** kelanjutan "Web3 University Tour 2026". Tema AI × Web3. Hadiah USD 5.000, **3 track**, kemungkinan **1 pemenang/track**. Online, field pemula (mayoritas student, fork chatbot/template).
- **Track:** (1) AI Agents · (2) Finance & Commerce · (3) Consumer Apps.
- **Kurikulum 9 sesi** membangun: token → Solidity → Foundry+Bounty Board → Security → indexing → **API+AI Auto-verify** → dApp UI → AI integration → Demo Day (30 Agu).
- **Juri:** mentor Dev Web3 Jogja (SWE elit) + kemungkinan rep BNB/Binance/Coinvestasi.
- **Edisi sebelumnya BUKAN build-hackathon**: "Cumlaude Web3" = kuis + pitch ide 1 menit tanpa kode (pemenang: DuelPic, PharmaTrace, Raka, AgriChain, VeriEdu). → **field tahap-ide; produk jadi = jauh di atas.**
- **Selera juri (bukti):** binaan mereka direkrut perusahaan RWA/stablecoin/payments. **OwnaFarm** (invoice financing, RWA) = juara. **zkPull** (real-world event → verifikasi → auto-release, tanpa perantara) = juara 2 Mantle. → **condong ke Finance/RWA/settlement.**

---

## 2. Opsi Unggulan

### ⭐ OPSI 5, WattSettle (rel M2M Energy Settlement) · Finance & Commerce
**Konsep:** rel pembayaran + wasit-AI untuk **energi terverifikasi**. Device tanda-tangani kWh → AI verifier otonom cek keabsahan + tulis **alasan keputusannya on-chain** (attestation) → contract auto-settle token → fee protokol.
**Cara kerja (konkret, tiap langkah ada tx):**
1. `Reading{deviceId, kWh, timestamp, nonce, signature(EIP-712)}` → `submitReading`.
2. AI verifier (cron, pola Hermes): bounds fisik → z-score anomaly → cross-source (cuaca/kapasitas) → putusan.
3. Tulis `Attestation{approved, expectedRange, anomalyScore, crossCheck, modelHash, rulesetHash}` on-chain.
4. Approve → `transfer suriota` ke produsen + fee 1% ke treasury. Reject → 0, alasan tercatat.
5. Semua di BscScan.
**Moat (5 hal langka sekaligus):** hardware nyata · domain energi/OT · penyelesaian last-mile trust · customer/distribusi · timing regulasi (CBAM+OJK Jan 2026).
**8 skenario:** solar→pabrik REC · eksportir CBAM · P2P/microgrid · EV charging · HVAC (=Opsi 6) · ESCO performance · MRV karbon · diesel displacement.
**Detail:** `STRATEGI-MASTER-Opsi5-JUARA.md`.

### ⭐ OPSI 6, WattSettle × Enovatek / PM20H20Q (produk nyata) · Finance & Commerce
**Konsep:** Opsi 5 dipasang di produk nyata. **PM20H20Q** = DC meter untuk Hybrid HVAC. **PT Enovatek Energy** (green energy: solar/wind/LED/HVAC) menyewakan AC (Cooling-as-a-Service), dimonitor via PM20H20Q.
**Cara kerja:** penyewa pakai AC → PM20H20Q ukur pemakaian → tanda tangani → on-chain → AI verify (anti-tamper) → **penyewa auto-bayar Enovatek per-pakai** → protokol/Enovatek ambil fee (take-rate).
**2 aliran nilai:** (A) billing pemakaian = revenue utama; (B) carbon/REC/ESG/CBAM = upside.
**Kenapa lebih kuat dari Opsi 5 untuk demo:** pembayar jelas (penyewa), produk + perusahaan + revenue **nyata** → runtuhkan skeptisisme juri; after-sales sudah ada (model rental Enovatek).
**Catatan produksi:** billing nyata pakai **stablecoin** (bukan token volatil); demo pakai `suriota`.

---

## 3. Opsi Arsip (sudah divalidasi, kalah skor, disimpan untuk referensi)

### OPSI 1, ProofOfWatt · AI Agents (skor 74.5)
DePIN energy oracle asli: gateway SURIOTA tanda-tangani kWh → AI verifier approve → auto-pay suriota. **Contract base sudah jadi & lulus 6 tests** (`proofofwatt/`). Opsi 5/6 = evolusinya (tambah attestation on-chain, framing settlement, track Finance). Risiko utama: over-scoping.

### OPSI 4, Karmakhet · AI Agents (skor 58)
ERC-8004 Validation-Registry oracle: reputasi agent hanya dari job berbayar x402 yang lolos re-execution challenge (anti-Sybil). Risiko: klaim "registry kosong" FALSE (AgentKarma sudah cover), platform-permission binary gate, AI-theater. Detail: `STRATEGI-JUARA1-Karmakhet-Option4.md`.

### OPSI 3, ProofOfAlpha · Finance & Commerce (skor 54)
Oracle "proof-of-alpha": commit-reveal sinyal trading → replay vs price oracle → track-record risk-adjusted ke ERC-8004. Jual PROOF bukan PnL (lolos "trading bot trap"). Risiko: ERC-8004 = singleton resmi (tak bisa deploy sendiri), clonable, near-clone Veil Signal Arena ada. Detail: `STRATEGI-JUARA1-ProofOfAlpha-Option3.md`.

### OPSI 2, JanjiChain · Consumer/AI (skor 48)
AI arbiter otonom untuk escrow "janji" P2P: kunci tBNB → submit bukti → AI nilai (semantik) → release/refund on-chain. Risiko: mekanisme tidak novel (GenLayer/UMA/Kleros), demo mudah nge-stall, AI-theater. Detail: `STRATEGI-JUARA1-JanjiChain-Opsi2.md`.

---

## 4. Benchmark Scoring (rubrik berbobot)

Rubrik: Innovation (12) · Technical feasibility solo-9-sesi (15) · Live-demo determinism & wow (16) · Real-world impact/trajectory · BNB fit · Moat/defensibility · Business+after-sales · Judge-appeal · Distinctness.

| Opsi | Skor | Catatan kunci |
|---|---|---|
| **5 WattSettle** | **90** | Moat + Finance fit + demo deterministik + selera juri (zkPull/OwnaFarm) |
| **6 Enovatek** | ~90 (produk-spesifik) | Sama, + produk & revenue nyata = demo paling meyakinkan |
| 1 ProofOfWatt | 74.5 | Kuat, tapi track AI Agents ramai + tanpa attestation on-chain |
| 4 Karmakhet | 58 | Dependency ERC-8004/platform eksternal berisiko |
| 3 ProofOfAlpha | 54 | Clonable + ERC-8004 singleton + near-clone ada |
| 2 JanjiChain | 48 | Tak novel + demo rapuh |

---

## 5. Blackbox / Pandora, 3 lever ke >90% nominasi (fully controllable)

1. **TRACK ARBITRAGE**: submit ke track paling sepi (**Finance & Commerce**, bukan AI Agents yang ramai). Cek densitas registrasi akhir Sept via kontak Dev Web3 Jogja; pre-build agar bisa masuk track terkosong.
2. **MOAT NYATA di 15 detik pertama**: kamu satu-satunya PT dengan hardware + revenue nyata. Tampilkan klip lapangan (SRT-MGATE/PM20H20Q) + invoice/PO redacted → runtuhkan skeptisisme sebelum terbentuk.
3. **AI AUTONOMY LEGIBLE ON-CHAIN**: tulis rationale AI ke chain, dan **INTEGRATE** (bukan mirror) registry ERC-8004/BEP-620 BNB yang LIVE di BSC testnet sejak 4 Feb 2026.

**Koreksi fatal:** JANGAN pitch "self-contained mirror of ERC-8004", juri BNB tahu registry-nya live → harus INTEGRATE yang asli (jadikan babak kedua demo).

---

## 6. Probabilitas Jujur & Path-to-90

- **Nominasi/finalist:** 78 sampai 90% (>90% hanya di ujung atas: eksekusi flawless + semua fix).
- **Juara 1 in-track:** 42 sampai 62%, TIDAK bisa dijamin >90% (bergantung standout track lain, delivery pitch, komposisi juri).

**Path-to-90 (checklist menang):**
1. Integrate live ERC-8004 registry (jangan mirror).
2. Demo pakai **1 signature hardware asli** (SRT-MGATE/PM20H20Q lapangan) sebagai seed.
3. Tunjukkan **REJECT + approve** (AI tolak anomali live), bukan approve saja.
4. Tutup **semua hard-gate SEKARANG**: commit harian ke repo public (jangan single squash), verify contract di BscScan, ≥2 tx on-chain, README+roadmap+video+tweet tag @BNBChain @BinanceAcademy @coinvestasi @devweb3jogja.
5. Validasi track pakai data registrasi nyata.
6. Taruh **fee-split on-chain** (substansi Finance).
7. Demo deterministik: pre-seed state, pre-fund reward pool, fallback RPC + recorded video; rehearse ≥5x di real testnet.

---

## 7. Referensi Pemenang (amunisi pitch)

- **zkPull** (juara Mantle 2025): PR GitHub merged → zkTLS verify → EigenLayer AVS enforce → auto-payout, fee success-based 5%. **Struktur PERSIS WattSettle** → *"WattSettle = zkPull untuk energi fisik."*
- **OwnaFarm** (juara, RWA invoice financing): invoice tani → tokenisasi jadi "benih" (game Hay Day). Founder Yeheskiel Yunus Tame, **UKDW Blockchain Club Yogyakarta** (satu ekosistem Dev Web3 Jogja). Menang dengan **1 kasus konkret + visi besar**: pola yang kita tiru, tapi 1 level di atas (kita punya hardware+revenue nyata, mereka software).

---

## 8. Prediksi Arah (kenapa ini future-proof)

BNB 2026 mendorong **Stablecoins + RWA + Agentic Finance** + native ERC-8004 (BEP-620) & x402. WattSettle memukul ketiganya: **RWA** (kWh nyata di-tokenisasi), **Agentic Finance** (AI verifier otonom), **settlement** (auto-pay). Regulasi Indonesia (OJK ambil alih crypto Jan 2026, CBAM live Jan 2026) menjadikan "energi nyata terverifikasi on-chain oleh perusahaan berizin" persis Web3 matang yang regulator & BNB mau. Arah pasca-hackathon: tiap gateway SURIOTA/Enovatek di lapangan = income node → RWA volume baru dari Indonesia.

---

## 9. Langkah Berikut
1. ✅ Website pemaparan Opsi 5 & 6 (interaktif, motion), `Presentasi Opsi 5 6/`.
2. Riset lebih dalam spec PM20H20Q + model rental Enovatek (akurasi angka).
3. Implementation plan Sesi-per-Sesi + evolusi contract 6-tests → `attestAndSettle.sol`.
