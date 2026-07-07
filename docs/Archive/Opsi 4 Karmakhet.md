> 🗄️ **ARSIP.** Opsi ini sudah divalidasi dan bukan fokus submission. Disimpan sebagai referensi dan roadmap. Fokus aktif: [Opsi 5 WattSettle](<../02 Opsi 5 WattSettle.md>) · [Opsi 6 Enovatek](<../03 Opsi 6 Enovatek.md>) · [Codex 7 dan 8](<../Codex Opsi 7 8/>). Index arsip: [README](README.md).

---

# Karmakhet, Strategi Juara 1 (Option 4, Track: AI Agents)
## Indonesia Web3 Hackathon 2026 · Binance Academy × BNB Chain × Coinvestasi × Dev Web3 Jogja

> **Nama final:** **Karmakhet**: "Karma" (reputasi yang diperoleh, bukan dibeli) + "khet" (ledger/kanon). Tagline: **"Reputation you can't buy, only earn."**
> **One-liner:** Oracle re-eksekusi BNB-native yang mencetak reputasi AI-agent HANYA dari job berbayar (x402/ERC-8183) yang output deterministiknya lolos verifikasi *byte-equality* oleh agent kedua yang otonom, mengisi lane ERC-8004 Validation Registry yang di-skip semua incumbent, dan merupakan remedy persis yang diminta paper peer-reviewed arXiv 2606.26028.

---

## 0. Ringkasan Eksekutif (baca ini dulu)

Karmakhet menang bukan karena canggih, tapi karena **tepat sasaran, deterministik, dan sudah setengah jadi di infra live SURIOTA.** Tiga fakta load-bearing sudah **diverifikasi langsung dari sumber primer** sesi ini:

1. **Novelty valid.** AgentKarma (prior art terdekat) di situsnya sendiri menulis verbatim: *"AgentKarma does not currently index the Validation Registry."* Lane Validation memang kosong dari produk shipping.
2. **Problem valid & chain-matched.** arXiv 2606.26028 (Imperial College/Knottenbelt, data s/d 13 Mei 2026) mengukur di BSC: hanya **4%** agent punya endpoint live, **95 sampai 100%** feedback tanpa bukti interaksi terverifikasi, Sybil >90% feedback (Base). Rekomendasi paper #4 **verbatim**: *"Require (or prioritize) feedback tied to verifiable events like settled x402 payments or attestations from the Validation Registry."* → **Itu definisi produk ini.**
3. **On-chain build KECIL & permissionless-untuk-diri-sendiri.** Dari `bnb-chain/apex-contracts/docs/custom-policy.md` (dibaca langsung): interface `IPolicy` cuma 2 fungsi. Saya **tidak menulis registry baru**. Saya menulis **satu** policy custom (`RexecPolicy`) di atas **copy stack APEX/ERC-8183 resmi BNB yang saya deploy sendiri** di testnet (repo punya `deploy:testnet`), sehingga **saya owner Router-nya** dan bisa `setPolicyWhitelist(myPolicy, true)` tanpa izin siapa pun. Binary risk "boleh nggak whitelist di Router BNB" → **dihilangkan total** dengan deploy stack sendiri.

**Win probability: ~55 sampai 60% untuk Juara 1** *jika* tiga non-negotiable dieksekusi (hash bukan dari LLM; deploy stack sendiri di S2; demo di-rehearse 10×). Ini higher-ceiling dari JanjiChain, on-theme sempurna untuk track AI Agents, dan unfair-edge-nya (dua agent otonom live) tak bisa ditandingi peserta student.

---

## 1. Framing Final & Konsep yang Dipertajam

### Positioning satu kalimat (untuk juri)
> **"Credit bureau untuk AI agent, skor yang tak bisa dibeli, hanya bisa diperoleh, di chain tempat trust paling rusak."**

### Pergeseran framing WAJIB (hasil red-team, dikoreksi dengan bukti)
| Klaim lama (rapuh) | Klaim final (airtight, terverifikasi) |
|---|---|
| "Validation Registry kosong / tak ada yang sentuh" | **"AgentKarma sendiri menyatakan tidak meng-index Validation Registry"** (kutip situs mereka), lalu pindah bobot ke **METODE**, bukan lane. |
| "Kami satu-satunya di Validation lane" | **"Kami satu-satunya yang skornya di-mint dari kerja BERBAYAR yang di-RE-EKSEKUSI & di-match byte-for-byte. Yang lain menilai perilaku/heuristik atau self-attest."** |
| "44,051 agent BSC = demand" | **"44,051 terdaftar di BSC tapi hanya 4% live dan setelah Sybil dibersihkan mayoritas agent tak punya feedback valid, supply terbesar di chain dengan trust rot terparah. Gap itulah produknya."** |
| Hash output LLM | **Hash artifact retrieval-deterministik (sorted ChromaDB doc-IDs + template tetap), BUKAN token LLM.** LLM keluar dari jalur hash. |

### Novelty inti (yang tahan serangan juri BNB)
Bukan "registry mana", tapi **cara verifikasi**: reputasi hanya bergerak sebagai efek samping dari **job yang (a) sudah settled berbayar DAN (b) sudah di-re-eksekusi independen dan hash-nya byte-equal.** Tidak ada fungsi "submit review" untuk diserang → **Sybil-proof by construction, bukan by detection** (incumbent pakai deteksi statistik ~68%).

---

## 2. Kriteria Kemenangan yang Ditargetkan (dipetakan ke reward juri)

1. **Autonomous AI-agent depth**: dua agent PRODUKSI (SUVA worker, Hermes challenger), satu menghakimi kerja berbayar yang lain, on-chain, tanpa manusia. Event-driven (bukan timer scripted): challenger memindai job SUBMITTED apa pun yang terikat `RexecPolicy`.
2. **Flawless deterministic live demo**: verdict = byte-equality atas artifact yang 100% dikontrol builder → identik tiap run, tak bisa flake pada sumbu LLM.
3. **BNB-native maksimal**: BSC testnet (97), dibangun sebagai policy di atas stack APEX/ERC-8183 **resmi BNB** + ERC-8004 Identity Registry + MegaFuel gasless. **Upgrade module untuk stack BNB, bukan pesaing.**
4. **Innovation ber-evidence**: problem peer-reviewed, chain-matched; produk = rekomendasi #4 paper itu sendiri.
5. **Sybil-proof by construction**: arsitektur, bukan classifier rapuh.
6. **Impact + pitch**: trust layer yang hilang dari agent economy; token-less; pitch sub-3-menit dengan money shot 74 vs 0.0.

---

## 3. MVP Scope → Peta 9 Sesi (Jul, Aug 2026, Demo Day 30 Agu)

**Prinsip Ponytail:** tulis kode sesedikit mungkin. Reuse kernel/escrow/settle APEX. Satu policy custom. Indexer = poller ~50 baris. Skor = weighted counter, BUKAN model kalibrasi.

| Sesi | Deliverable (Definition of Done) | Gate / Risiko |
|---|---|---|
| **S1** | **Kunci determinisme.** Pin ChromaDB snapshot (file DB + versi embedding model). WORKER artifact = `keccak256(sorted(retrieved_doc_ids) ‖ template)`. **Buktikan 20/20 hash identik** worker-vs-challenger untuk 1 job jujur. Register identitas SUVA + Hermes via `bnbagent` SDK (MegaFuel gasless). | **NON-NEGOTIABLE #1.** Kalau <20/20 identik → stop & fix atau pivot ke ProofOfWatt. **Hash TIDAK BOLEH dari token LLM.** |
| **S2** | **Deploy copy stack APEX sendiri** di BSC testnet (`deploy:testnet` dari repo) → saya Router owner. Tulis + unit-test `RexecPolicy` (IPolicy) di Foundry pakai `docs/custom-policy.md` skeleton `ZkProofPolicy` sbg basis (ganti ZK-verify → byte-equality). | **NON-NEGOTIABLE #2.** Deploy sendiri = tak perlu izin whitelist di Router BNB. Verifikasi `setPolicyWhitelist` jalan di Router milikku. |
| **S3** | End-to-end 1 job REAL di testnet: `createJob → registerJob(jobId, RexecPolicy) → fund → submit(deliverable) → onSubmitted → challenger submitRexec → settle → APPROVE`. Escrow rilis. | Timing block testnet; pakai RPC privat. |
| **S4** | Wire SUVA worker: saat delivery, submit `deliverable = keccak256(artifact)` on-chain via commerce.submit. | Serialisasi artifact deterministik & bounded. |
| **S5** | Wire Hermes challenger cron **event-driven**: watch event job SUBMITTED terikat RexecPolicy (pola `funded_job_watcher` SDK), re-eksekusi query SAMA atas snapshot SAMA, `submitRexec(jobId, hash)` lalu `settle(jobId)`, otonom. | Autonomy asli: challenger discover job yang belum pernah dilihat. |
| **S6** | `ReputationOracle` mini: `score[agent] += f(paymentValue)` on APPROVE, penalti on REJECT, `getScore()`. Indexer = poller event ~50 baris → sqlite/JSON. | **YAGNI:** bukan model kredit; bukan subgraph. |
| **S7** | Dashboard UI (frontend-design + huashu + taste skill): identitas agent, skor 0 sampai 100, feed "verified jobs" dgn link tx, panel Sybil (50 review off-chain, skor 0.0). | Wide-content scroll; deterministik render. |
| **S8** | **Jalur demo Sybil + fraud-slash + full rehearsal.** Pre-fund semua wallet. Rehearse 90 detik. | **NON-NEGOTIABLE #3.** Rehearse ≥10×. |
| **S9** | Polish pitch + **rekam video backup pixel-perfect** + siapkan fallback anvil-fork stack live. | Demo Day congestion. |

**Buffer:** karena deploy stack sendiri sudah di S2 (bukan tambahan darurat S8), tak ada +1 sesi kejutan. Foundry v1.7.1 sudah terpasang; builder sudah pernah verify ERC20 di BSC testnet.

---

## 4. Kontrak: Surface Minimal (seluruh on-chain build)

**Satu** kontrak `RexecPolicy is IPolicy` + opsional `ReputationOracle` mini.

```solidity
// IPolicy dari APEX (persis):
//   onSubmitted(uint256 jobId, bytes32 deliverable, bytes optParams)
//   check(uint256 jobId, bytes evidence) view returns (uint8 verdict, bytes32 reason)
// verdict: 0=Pending(settle revert NotDecided) 1=Approve(bayar) 2=Reject(refund)

contract RexecPolicy is IPolicy {
  address public immutable router;                 // di-set di constructor, gate msg.sender==router
  mapping(uint256 => bytes32) public deliverable;  // di-pin di onSubmitted
  mapping(uint256 => bytes32) public rexec;        // hash re-eksekusi challenger
  address public challenger;                        // role: hanya challenger boleh submitRexec

  function onSubmitted(uint256 jobId, bytes32 d, bytes calldata) external {
    require(msg.sender == router);                  // one-shot, gated
    deliverable[jobId] = d;
  }
  function submitRexec(uint256 jobId, bytes32 h) external {
    require(msg.sender == challenger);              // Sybil kill-switch by construction
    rexec[jobId] = h;
  }
  function check(uint256 jobId, bytes calldata) external view returns (uint8, bytes32) {
    if (rexec[jobId] == 0) return (0, 0);           // SILENCE = PENDING (kebalikan OptimisticPolicy)
    if (rexec[jobId] == deliverable[jobId]) return (1, "REXEC_MATCH");   // APPROVE
    return (2, "REXEC_MISMATCH");                    // REJECT → slash/refund
  }
}
```

**Kenapa ini novelty yang sah (terverifikasi dari doc):**
- OptimisticPolicy resmi BNB: *silence = implicit approval* + quorum voter manusia whitelisted saat dispute. **RexecPolicy: silence = Pending selamanya (TIDAK pernah auto-approve); verdict = mesin (byte-equality), bukan panel manusia.** Refund hatch (`claimRefund` setelah `expiredAt`) tetap jadi escape universal, doc menyatakan ini "never pausable, never hookable", jadi desain saya aman.
- Skeleton `ZkProofPolicy` di doc = template hampir identik; saya ganti `verifier.verify(proof)` → perbandingan `bytes32 == bytes32`. Lebih sederhana, tetap 100% jujur pada insight EigenAI (arXiv 2602.00182: *"verification reduces to a byte-equality check, and a single honest replica suffices to detect fraud"*), **tanpa TEE/zkML** (yang benar-benar dihindari konsep).

**YAGNI (dipotong):** registry baru; fungsi "reject review" (tak ada surface review); model kalibrasi kredit; subgraph The Graph; 50 tx review on-chain real (jadi UI state); MegaFuel di luar registrasi (pre-fund tBNB saja); generalitas multi-worker (hardcode 2 identitas).

---

## 5. Loop Agent (deterministik, otonom)

1. **WORKER (SUVA v2, live di VPS)**: RAG ChromaDB, REST API, **temperature 0, snapshot corpus di-pin**. Deliverable = `keccak256(sorted(retrieved_doc_ids) ‖ template)`, **bukan prosa LLM**. Submit hash + kumpulkan escrow.
2. **CHALLENGER (Hermes cron, live di VPS)**: event-driven: deteksi job SUBMITTED terikat RexecPolicy, re-eksekusi query SAMA atas snapshot SAMA → `keccak256`, panggil `submitRexec` lalu `settle` (permissionless).
3. **SETTLEMENT**: contract bandingkan hash. Match → APPROVE, escrow rilis, skor naik. Mismatch → REJECT, refund/slash, skor turun. Silence → Pending, **tak pernah menghitung** ke reputasi.
4. **GATING (gratis by construction)**: skor hanya berubah sebagai efek job settled; review tanpa job settled = 0 kontribusi. Tak ada fungsi review untuk diserang.

---

## 6. Value / Token Model

**TOKEN-LESS by design** (ini bragging point, ucapkan lantang): *"Tidak ada token, sebab token reputasi hanyalah barang baru untuk dibeli, yaitu serangan yang kami bunuh. Value = fee stablecoin yang hanya dipungut atas job yang sudah settled, jadi tak bisa di-game jadi ada."*

Tiga primitif revenue (semua stablecoin, semua opsional, tak ada yang dibutuhkan untuk demo):
1. **Validation fee**: flat USDC per `settle`, atau bps skim (mis. 25 sampai 50 bps) dari escrow ERC-8183 saat finalisasi. Hanya ada saat uang riil sudah bergerak.
2. **Score-query / oracle read**: read on-chain gratis; API off-chain berbayar (rate limit, analytics, webhook), mirror monetisasi AgentKarma.
3. **Policy-as-a-Service (moat)**: Karmakhet = drop-in policy di EvaluatorRouter. Agent BNB mana pun tukar OptimisticPolicy → RexecPolicy dgn satu config. Take fee per job yang settle lewat policy.

**Kenapa kalahkan token untuk juri:** tak ada isu sekuritas; fee konsisten dgn thesis anti-Sybil; memetakan 1:1 ke cara AgentKarma sudah earn (membuktikan willingness-to-pay); monetisasi BNB-native (bps atas escrow ERC-8183, flow MegaFuel-gasless).

---

## 7. Market Case (angka terverifikasi, ucapkan sebelum juri sempat mengoreksi)

- **Demand:** ERC-8004 dari ~337 agent (awal 2026) → **183K+** terdaftar, 194K feedback, 161K active users (8004scan/AgentLux, Mei 2026). Live di 19 chain EVM.
- **BNB = #1 & korban utama:** **44,051 agent BSC** vs Ethereum 36,512 (~40% share, The Defiant Mar 2026). **Tapi hanya 4% live** (arXiv 2606.26028). *"Supply terbesar di chain dengan trust rot terparah, gap itu produknya."*
- **Problem peer-reviewed (sumber primer, angka verbatim):** arXiv 2606.26028: 3%/4%/15% agent live (ETH/BSC/Base); **95 sampai 100% feedback tanpa bukti interaksi**; Sybil >90% feedback (Base); mean punya *breakdown point nol* (satu review geser skor arbitrer); biaya manipulasi median **$0.0027, $0.055**. Rekomendasi #4 = produk ini.
- **Gap dikonfirmasi independen:** AgentKarma verbatim *"does not currently index the Validation Registry."*
- **Payment rails ada tapi commercially early (caveat jujur):** x402 ~167M tx kumulatif (~85% Base), tapi real-commerce hanya ~$28K/hari & ~50% gamified (Presenc.ai/CoinDesk). *"Kerja berbayar terverifikasi langka JUSTRU karena tak ada yang memaksanya verifiable. Kami buat kerja berbayar terverifikasi jadi satu-satunya yang dihitung."* Didukung Linux Foundation x402 (Coinbase/Cloudflare/Stripe/Visa/AWS/Google/Circle).
- **TAM framing:** Agentic AI $6.7 sampai 7.8B (2025) → $33 sampai 53B (2030) @30 sampai 46% CAGR; McKinsey ≤$1T US B2C retail 2030. Trust/reputasi agent = pajak infrastruktur wajib, picks-and-shovels.

---

## 8. Pitch Demo Day (sub-3-menit)

| Waktu | Beat | Aksi / Kalimat kunci |
|---|---|---|
| 0:00 sampai 0:25 | **Hook** | Layar: skor agent melesat ke 90+. *"Semua di dashboard ini bohong. Di BNB Chain hari ini saya bisa beli reputasi sempurna untuk AI agent seharga tiga per sepuluh sen. Saya tunjukkan, lalu saya tunjukkan cara membuatnya mustahil."* |
| 0:25 sampai 0:55 | **Problem** | *"Ini bukan opini. arXiv 2606.26028 mengaudit ERC-8004 di ETH/Base/BNB: 95 sampai 100% review dari orang yang tak pernah bayar; satu review palsu membalik skor; biaya manipulasi setengah sen. Resep paper itu sendiri: ikat reputasi ke pembayaran & Validation Registry. AgentKarma? Situsnya mengaku tak meng-index Validation Registry. Gap itu saya isi."* |
| 0:55 sampai 1:30 | **Produk + unfair edge** | *"Karmakhet. Skor di-mint HANYA dari job dgn (1) tx bayar x402 di BSC dan (2) re-eksekusi yang lolos. EigenAI: verifikasi deterministik = cek byte-equality; satu replika jujur menangkap fraud. Worker saya SUVA, RAG produksi, temperature nol, snapshot di-pin. Challenger saya Hermes, agent cron otonom yang re-eksekusi & panggil settle on-chain. Keduanya SUDAH live di server saya. Ini bukan prototipe, ini dua agent produksi saya, kini saling menghakimi kerja berbayar di BNB."* |
| 1:30 sampai 2:35 | **Live demo (2 beat)** | Split: kiri explorer BSC testnet, kanan dashboard skor=71. **Beat 1 (jujur):** trigger job berbayar → tx x402 confirm → hash anchor → Hermes re-eksekusi → validation byte-equal → APPROVE → skor 71→74, receipt hijau + 2 tx hash. **Beat 2 (money shot):** dari wallet kedua, tembak 50 review 5-bintang ke agent nol-kerja. *"Di AgentKarma skornya jadi 100. Di sini: 0.0, 50 review tanpa payment, tanpa validation, ditolak."* Lalu submit 1 deliverable palsu: Hermes re-eksekusi, hash mismatch, **slash live di explorer**, skor negatif. *(Determinisme: temp-0 + input tetap = byte-equal tiap run → tak bisa flake.)* |
| 2:35 sampai 2:50 | **BNB fit + pride** | *"Maksimal BNB-native: BSC testnet, dibangun sebagai policy di atas stack APEX/ERC-8183 resmi BNB, x402, MegaFuel gasless. Dibangun solo, dari Jogja, oleh perusahaan Indonesia yang sudah shipping AI agent produksi."* |
| 2:50 sampai 3:00 | **Close** | Split beku: 74 vs 0. *"Dua agent. Satu kerja berbayar nyata → 74. Satu beli 50 review → tetap nol. Di BNB Chain: reputasi yang tak bisa dibeli, hanya diperoleh."* Diam. |

**Memorable line:** *"Reputation you can't buy, only earn."*

---

## 9. Demo Runbook (90 detik, deterministik)

1. **Pra-demo (H-1):** deploy stack APEX-copy + RexecPolicy + ReputationOracle di testnet; register 2 identitas; pin snapshot corpus; pre-fund SEMUA wallet dgn tBNB (jangan MegaFuel untuk job/settle); RPC **privat/berbayar** (bukan publik); warm ChromaDB; seed skor awal 71; seed 50 review off-chain di feed UI untuk agent-Sybil.
2. **Beat 1 (jujur, ~35s):** klik trigger → job created+funded+submitted → challenger event-driven fire → submitRexec+settle → APPROVE → UI 71→74 + 2 link tx.
3. **Beat 2a (Sybil, ~15s, INSTANT UI, tanpa tx):** tampilkan agent-Sybil: "0 settled jobs, 50 unbacked reviews → score 0.0". Nol latensi chain.
4. **Beat 2b (fraud, ~25s, 1 tx real):** submit deliverable palsu → Hermes re-eksekusi → mismatch → REJECT/slash live di explorer → skor negatif.
5. **Fallback:** video backup pixel-perfect + anvil fork stack live siap jika testnet congest 30 Agu.
6. **Rehearse ≥10×.** Determinisme divalidasi 20/20 di S1 sebelum Solidity ditulis.

---

## 10. Repo Hygiene

- **Struktur:** `contracts/` (RexecPolicy, ReputationOracle, tests Foundry) · `agents/worker/` (SUVA adapter) · `agents/challenger/` (Hermes daemon) · `indexer/` (poller ~50 baris) · `dashboard/` · `deploy/` (script deploy stack + whitelist) · `docs/` (arsitektur, ADR determinisme, sumber tersitasi).
- **Determinisme sbg ADR:** dokumentasikan keputusan "hash retrieval artifact, bukan LLM" + hasil 20/20.
- **Secrets:** `.env` TIDAK di-commit; kelola VPS lewat SSH/scp langsung (jangan lewat tool Hermes yang mask `***`). Kunci ERC20 suriota lama & kredensial pribadi jangan pernah masuk repo.
- **Sitasi:** README taruh link arXiv 2606.26028, arXiv 2602.00182, `apex-contracts/docs/custom-policy.md`, kutipan AgentKarma. Jangan tulis angka yang tak bisa dipertahankan; pakai figur paper yang sudah dicek.
- **Tests:** wajib 7 test dari doc (`onSubmittedOnlyRouter`, `verdictMonotonic...`, `refundHatchStillWorks`, `routerSettleAppliesVerdict`, dst) + property test determinisme.
- **Commit/PR:** branch dari default; jangan skip hooks; co-author trailer sesuai konvensi.

---

## 11. Kill-Shot Checklist (WAJIB dilewati sebelum Demo Day)

| # | Kill-shot | Status / Mitigasi |
|---|---|---|
| 1 | **Determinisme = bohong jika hash LLM** (Groq tak bit-reproducible) | **RESOLVED.** Hash = artifact retrieval (sorted doc-IDs + template), bukan token LLM. Buktikan 20/20 di **S1**. |
| 2 | **Izin whitelist policy di Router BNB** (binary killer) | **RESOLVED.** Deploy **stack APEX copy sendiri** (`deploy:testnet`) → saya Router owner → `setPolicyWhitelist` bebas. Verifikasi di **S2**. |
| 3 | **"Empty Validation Registry" bisa dibantah juri** | **RESOLVED.** Pindah bobot ke METODE (payment-bound + re-exec byte-match); kutip pengakuan AgentKarma verbatim. |
| 4 | **44K agent / x402 volume di-hand-wave** | **RESOLVED.** Weaponize caveat: "44K tapi 4% live"; "$28K/hari 50% gamified, justru sebab itu produk ini perlu". |
| 5 | **Over-scope (skor kredit kalibrasi, subgraph)** | **CUT.** Weighted counter + poller 50 baris. Kalibrasi = 1 bullet "future work". |
| 6 | **Autonomy theater (cron timer scripted)** | **RESOLVED.** Challenger event-driven, generik; di demo submit job yang belum pernah dilihat, biar discover+settle otonom. |
| 7 | **Token temptation** | **RESOLVED.** Token-less by design, diucapkan sebagai keunggulan. |
| 8 | **Demo flake di testnet 30 Agu** | RPC privat, pre-fund, warm, video backup, anvil-fork fallback, rehearse ≥10×. |

---

## 12. Victory Metric

**Definisi menang (bukan revenue):** menjadi **penulis + indexer pertama yang LIVE di ERC-8004 Validation Registry pada chain #1 (BSC)** dengan skor reputasi yang **payment-bound + re-execution-verified**: dibuktikan di panggung oleh demo split-screen deterministik: **satu agent earner di 74, satu Sybil terkunci di 0.0, satu fraud ter-slash negatif, byte-equal identik tiap run.**

**Leading indicators menuju Demo Day:**
- S1: 20/20 hash identik (gate go/no-go).
- S3: 1 job real end-to-end APPROVE di testnet.
- S5: challenger settle job baru otonom tanpa intervensi.
- S8: 10× rehearsal 90-detik tanpa flake.
- S9: video backup pixel-perfect tersimpan.

> **Bottom line:** Konsep tidak dibangun di atas fabrikasi, tiga fakta paling load-bearing terverifikasi dari sumber primer sesi ini. Tiga non-negotiable jelas dan achievable. Unfair edge (dua agent produksi live) tak tertandingi. Eksekusi tiga hal itu → Juara 1 sangat mungkin.