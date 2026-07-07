> 🗄️ **ARSIP.** Opsi ini sudah divalidasi dan bukan fokus submission. Disimpan sebagai referensi dan roadmap. Fokus aktif: [Opsi 5 WattSettle](<../02 Opsi 5 WattSettle.md>) · [Opsi 6 Enovatek](<../03 Opsi 6 Enovatek.md>) · [Codex 7 dan 8](<../Codex Opsi 7 8/>). Index arsip: [README](README.md).

---

# JanjiChain, Strategi Juara 1

**Indonesia Web3 Hackathon 2026 (Binance Academy x BNB Chain x Coinvestasi x Dev Web3 Jogja), Demo Day 30 Agustus 2026**
Builder: Gifari Kemal Suryo (SURIOTA), solo. Deploy: BNB Smart Chain Testnet (chainId 97). Prize: USD 5,000.

> **Thesis satu kalimat (diucapkan verbatim 2x, tesis di 0:50, penutup di 2:59):**
> **"Janji yang menepati dirinya sendiri." / "A promise that keeps itself."**

---

## 0. Keputusan Eksekutif (baca ini saja kalau buru-buru)

1. **BUILD JanjiChain.** Track: **Consumer Apps** (permukaan) + **AI Agents** (mesin), cross-track by design.
2. **Koreksi klaim feasibility yang salah:** kontrak **BUKAN "90% jadi".** `ProofOfWatt.sol` yang ada di repo memakai **shared ERC20 pool** (`rewardToken.transfer`), payout tetap `rewardPerKwh*kWh` ke device terdaftar, **tanpa** refund, **tanpa** deadline, **tanpa** `payable`/`msg.value`, **tanpa** `claimExpired`. Yang reusable cuma **enum `Status` + pola callback `onlyRole` (~15 baris)**. JanjiChain butuh **state machine kustodi uang baru**: per-deal native tBNB, struct dua-pihak, cabang refund, deadline math, safety-withdraw. **Perlakukan kontrak sebagai RISIKO, bukan risiko yang sudah pensiun.**
3. **Non-negotiable #1, AI harus kerja yang REGEX TAK BISA.** Buang demo format/count/deadline (`endswith('.png') && count==2 && ts<deadline` = nol AI). Ganti dengan kriteria **semantik**: verdict LLM adalah satu-satunya hal yang bisa membedakan dua bukti.
4. **Non-negotiable #2, live run TAK BOLEH nge-stall.** RPC berbayar/dedicated + promise di-precreate (live cuma `submitProof`) + cron pre-warm + **rekaman cadangan 40s** dengan verbal bridge. Gate: 10x flawless berturut.
5. **Non-negotiable #3, scope beku + framing defensif.** Satu kontrak, satu cron judge, dua layar, dua promise. **TANPA token, TANPA IPFS, TANPA multi-party/streaming, TANPA appeal DAO.** Sebut GenLayer/UMA/Kleros sendiri di pitch.
6. **Victory metric:** juri mengulang **"a promise that keeps itself"** ke koleganya, DAN mereka menyebut momen **"AI-nya MENOLAK dan mengembalikan dana sendiri."** Kalau dua kalimat itu keluar dari mulut juri, kita menang.

---

## 1. Konsep yang Dipertajam

**JanjiChain** ("janji" = promise) mengubah kesepakatan informal P2P menjadi escrow yang diselesaikan **AI arbiter otonom**.

- **Pihak A** mengunci tBNB terhadap janji bahasa-manusia + kriteria yang di-**hash on-chain saat pembuatan** (rubrik tak bisa digeser belakangan).
- **Pihak B** kirim bukti (teks/link/gambar → hash on-chain, artefak mentah off-chain).
- **Inti = AUTONOMOUS AGENT LOOP** (pola Hermes yang sudah jalan 24/7): cron poll event `ProofSubmitted` → tarik bukti → **deterministic judge (temp=0, refusal schema JSON strict, fail-closed)** menilai **secara semantik** terhadap kriteria → keccak256 reasoning → tanda-tangan `resolve(id, verdict, verdictHash)` dari wallet ARBITER gas-only → escrow **release ke B** atau **refund ke A**. **Nol manusia** antara submit dan settle.

**Moat sebenarnya (harus disebut eksplisit):** bukan "pakai AI". Moat = **(a) HAKIM TERKALIBRASI yang menilai hal semantik yang regex tak bisa, (b) jejak reasoning on-chain yang auditable, (c) produktisasi consumer Bahasa untuk 99% non-DeFi.** JanjiChain **bukan invensi**: ini pengemasan.

---

## 2. Positioning Defensif (mengubah kelemahan jadi sinyal kedewasaan)

Novelty mekanisme = **NOL**. AI-arbitrated escrow sudah ada di skala protokol (GenLayer "Intelligent Contracts", UMA Optimistic Oracle dengan bond, Kleros juror-stake) dan lusinan klon hackathon 2026 (agent-court, AgentLedger, PayCrow). **Jangan pernah klaim "kami menemukan AI arbitration."**

**Kalimat pembuka moat (verbatim, di beat 2:15):**
> "AI-arbitrated escrow itu sudah ada, GenLayer bikin sebagai infrastruktur chain, UMA dan Kleros menyelesaikan sengketa subjektif lewat bond dan voting juror, dan selusin tim hackathon menyambung AI arbiter ke escrow USDC. **JanjiChain bukan itu.** Ini yang pertama dikemas sebagai **produk consumer** yang bisa dipakai orang Indonesia non-crypto untuk menyelesaikan **janji personal, dalam Bahasa, dalam 40 detik**, dengan uang settle dua arah otonom dan alasannya bisa dibaca di BscScan."

**Pre-arm "what if the AI is wrong?" (satu kalimat):** "Setiap verdict + reasoning-hash ada on-chain, jadi bisa diaudit dan didisput. `claimExpired` memastikan agent mati pun dana tak pernah terkunci. Human-appeal window opsional saya sengaja jadikan opsional untuk deal kecil, modelnya UMA/Kleros, tapi overkill untuk janji Rp50rb."

**Buang dari headline:** "arisan" (Arisako sudah on-chain arisan Bahasa, bisa di-fork peserta lain) dan "freelancer generik" (Zenland/TrustLance komoditas). **Lead dengan janji dua-orang intim** ("saya bayar kalau kamu kirim logonya"). Arisan/freelance cukup **satu kalimat roadmap**.

---

## 3. Target Kriteria Kemenangan (dipetakan ke rubrik juri)

| Sumbu skoring | Bagaimana JanjiChain menang |
|---|---|
| **Working live demo (bobot tertinggi)** | Deterministik, artefak tetap vs kriteria tetap, temp=0, tanpa latency candle/web-research. Uang bergerak DUA ARAH otonom. |
| **Real AI-agent depth** | Cron settle-loop otonom (pola Hermes live) + judge **semantik un-regexable** + signed attestation + reasoning-hash on-chain. |
| **Consumer / real-world impact** | Janji personal Bahasa untuk ekonomi kas 280jt orang; "99% yang tak pernah sentuh DeFi". |
| **BNB ecosystem fit** | Escrow + attestation di BSC testnet 97; fee rendah = agent jalan nonstop = narasi "#1 chain for agents" (147.800+ agent, +43.750% 2026). |
| **Maturity / pitch** | Sebut prior art sendiri; pre-arm liability; verdictHash auditable + claimExpired. |

---

## 4. MVP Scope, Dipetakan ke 9 Sesi

**Prinsip Ponytail:** satu kontrak + satu cron judge + dua layar + satu demo flawless. Semua di luar itu membahayakan satu-satunya hal yang menang.

### S1, S2, Kontrak kustodi (perlakukan sebagai risiko, BUKAN "90% jadi")
Tulis `JanjiChain.sol`, **single contract ~120 baris, native tBNB (payable), tanpa ERC20**:

```
struct Promise {
    address payor;
    address payee;
    uint256 amount;
    uint64  deadline;
    bytes32 criteriaHash;   // rubrik di-hash saat create → tak bisa digeser
    Status  status;         // {None, Pending, Resolved} + verdict di verdictHash
    bytes32 verdictHash;
}
Promise[] public promises;
bytes32 public constant ARBITER_ROLE = keccak256("ARBITER_ROLE");
```
Fungsi:
1. `createPromise(address payee, uint64 deadline, bytes32 criteriaHash) payable returns (uint256 id)`, kunci `msg.value`.
2. `submitProof(uint256 id, bytes32 proofHash)`, payee-only, flip ke Pending, emit `ProofSubmitted` (event yang di-poll agent).
3. `resolve(uint256 id, bool approved, bytes32 verdictHash) onlyRole(ARBITER_ROLE)`, approved→payee, else→refund payor; simpan verdictHash.
4. `claimExpired(uint256 id)`, lewat deadline+grace tanpa resolusi → payor self-refund (mematikan objeksi "agent mati = dana macet").

Events: `PromiseCreated`, `ProofSubmitted`, `Resolved(id, approved, verdictHash)`.

**Keamanan wajib (di sinilah kontrak hackathon hancur):** checks-effects-interactions di release DAN refund; **pull-over-push** withdrawal; guard double-resolve; aritmetika fee. **Reuse dari ProofOfWatt cuma enum + pola `onlyRole` callback.** **BUANG EIP-712 device-signing** (itu era hardware ProofOfWatt, YAGNI).

**8+ Foundry test khusus jalur uang** (mirror harness `test/ProofOfWatt.t.sol` yang ada: `vm.deal`/`vm.prank`/`vm.expectRevert`): happy release, refund-on-fail, only-arbiter, double-resolve revert, claimExpired-after-deadline, deadline math, reentrancy probe di refund, fee arithmetic. Deploy + verify di BSC testnet 97.

### S3, S4, Agent otonom (Python, reuse Hermes cron + SUVA judge, ~150 baris)
- cron ~15s → `web3.py getLogs(ProofSubmitted)` (poll block-range + 1-block lag).
- tarik artefak via signed URL / endpoint REST SUVA.
- **Prompt judge DETERMINISTIK:** `temperature=0`, system prompt tetap, kriteria di-inject verbatim, **schema JSON refusal strict** `{verdict: PASS|FAIL, reasons:[...], cite: failed_criterion}`, **validator retry sekali → default FAIL** (fail-closed: salah = refund, tak pernah keliru release). **Bukti diperlakukan sebagai DATA, bukan INSTRUKSI** (anti prompt-injection).
- keccak256 reasoning → `resolve()` ditandatangani wallet ARBITER gas-only (tak pernah pegang kustodi).
- publish reasoning full di panel, hash di on-chain (tx input data cukup, **tanpa kontrak EAS**).

### S5, dApp (dua layar, wagmi/viem SPA)
Layar 1: create-promise. Layar 2: promise-detail dengan **panel reasoning Bahasa live**. **Panel itu ADALAH demo, investasikan effort desain HANYA di sana.** Wallet-connect saja, tanpa auth lain. (Invoke `frontend-design` + `huashu-design` + taste skill sesuai aturan global.)

### S6, S7, Harden + rehearse
Jalankan sekuens 40s dua-beat end-to-end di testnet sampai **flawless 10x berturut** (go/no-go gate). Siapkan rekaman cadangan.

### S8, S9, Pitch polish
Kunci skrip 3 menit, tiga jawaban pre-emptive juri (verdictHash auditable, second-beat refusal, claimExpired), gesture "tangan lepas laptop" jadi muscle memory.

### CUT-LIST KERAS (JANGAN dibangun)
EIP-712 device signing · kontrak EAS asli · IPFS/Arweave/pinning · ERC20/token apa pun (termasuk 'suriota' di jalur settlement) · multi-party/streaming/partial-tranche · dispute/appeal DAO · multi/fine-tuned judge model · >2 layar · mobile app · mainnet · tipe promise di luar dua yang di-rehearse.

---

## 5. Tokenomics, Ship TOKEN-LESS

**JANGAN launch token JanjiChain. JANGAN paksa 'suriota' ERC20 ke jalur settlement** (menambah price-discovery, approve/allowance = 1 tx + 1 titik gagal demo, dan mengundang pertanyaan mematikan "kenapa butuh token" di event AI-x-Web3).

Tiga baris tak-terpalsukan:
1. **SIAPA BAYAR:** pemenang value bayar **fee settlement 1%** (undercut 5 sampai 20x Upwork ~10% / Fiverr ~5.5%+20% / Escrow.com ~1 sampai 3%, karena AI arbiter menggantikan staf sengketa manusia). Pengirim bukti bad-faith bayar **judging-fee non-refundable** (= lapisan anti-spam). Depositor buka deal **gratis** (free-to-try, kritikal untuk GTM consumer).
2. **SUSTAINABLE:** biaya marginal per deal = 2 sampai 3 tx BNB sub-sen + 1 inferensi Groq sub-$0.01 → **contribution margin positif dari transaksi #1**. Ini persis alasan BNB jadi #1 chain untuk AI agent: fee rendah = agent jalan nonstop.
3. **SYBIL-PROOF by construction:** tanpa airdrop/emisi/yield/governance → **tidak ada yang bisa di-farm**. Attacker harus bakar escrow riil + judging-fee → spam **self-taxing**.

> Framing fee sebagai **BUKTI unit economics tertutup & agent bisa self-sustain**, bukan slide revenue. Overselling monetisasi = terbaca naif.

---

## 6. Market / Business Case (judge-ready, jujur soal gap)

- **TAM:** deal kepercayaan P2P informal (janji personal, milestone freelance kecil, taruhan sosial) di ekonomi kas-first 280jt orang, segmen sub-$50, Bahasa, no-KYC yang Upwork/Fiverr/Escrow.com **secara struktural tak melayani.**
- **Consumer prior art (akui):** StickK & Forfeit ("AI mode" photo-proof-or-lose-money) sudah ada. Twist JanjiChain: (a) antar **dua orang** bukan self+charity, (b) referee = **AI otonom on-chain**, (c) settlement crypto trustless Bahasa.
- **Kejujuran adopsi (pre-empt GTM probe):** "Mainnet + custodial ramp adalah post-hackathon. Hari ini saya membuktikan **trust primitive-nya jalan.** Fiat on/off-ramp untuk mass-market ada di roadmap." Kejujuran = kedewasaan; glossing = naif.
- **Standards alignment (bonus):** reasoning attestation on-chain selaras **ERC-8004 Trustless Agents**: sebut sebagai "agent-trust layer" tanpa build tambahan.

---

## 7. Demo Day Pitch, Tabel Sub-3-Menit (~430 kata, bilingual)

| Waktu | Beat | Isi (Bahasa untuk emosi, English untuk term teknis) |
|---|---|---|
| **0:00 sampai 0:25** | **HOOK, janji yang diingkari** | "Angkat tangan siapa pernah di-PHP. Bukan kerjaan, JANJI. Transfer DP ke freelancer, logonya nggak pernah datang. Menang taruhan, temenmu ngilang. Di Indonesia ekonomi jalan di atas JANJI, dan janji nggak punya wasit." (jeda) "Malam ini saya kasih janji itu seorang HAKIM." |
| **0:25 sampai 0:50** | **WHAT IT IS, satu tarikan napas** | "Ini JanjiChain. Dua orang bikin janji pakai bahasa manusia. Pihak A kunci 5 tBNB. Pihak B kirim bukti. Dan, ini intinya, **nggak ada manusia yang menilai.** Sebuah **AI arbiter otonom** yang menilai dan mencairkan atau mengembalikan dana. Langsung on-chain. **Janji yang menepati dirinya sendiri.**" |
| **0:50 sampai 2:15** | **DEMO CLIMAX (seluruh pitch hidup di sini, lindungi 85 detik)** | **Beat 1 (semantik, un-regexable):** "Deal-nya: 5 tBNB, janji = 'tulis deskripsi produk 200 kata yang persuasif DAN menyebut garansi.'" (counterparty upload bukti valid). "Sekarang saya **ANGKAT TANGAN dari laptop.**" (mundur, tangan terlihat). Cron loop bangun, panel stream Bahasa: "persuasif ✓, menyebut garansi ✓ → LOLOS." Attestation ke BscScan, tBNB pindah, klik hash. **Beat 2 (killer, tak-terpalsukan):** "AI yang bilang iya ke semua itu stempel, bukan hakim. Lihat, bukti kedua: 200 kata tapi filler generik, garansi TIDAK disebut." (mundur lagi). Agent yang sama **MENOLAK** dan **refund ke Pihak A**, mengutip elemen semantik yang hilang. **Uang dua arah, otonom, tanpa sentuh laptop.** |
| **2:15 sampai 2:45** | **WHY IT WINS, moat + BNB + you** | "Moat-nya bukan 'pakai AI'. Moat-nya **hakim terkalibrasi yang menilai hal yang regex tak bisa** + jejak alasan on-chain auditable. AI-escrow sudah ada, GenLayer, UMA, Kleros. JanjiChain bukan itu; ini **produktisasi consumer Bahasa**. Native BNB: fee rendah bikin agent nonstop. Saya solo builder dengan **agent otonom sudah jalan di produksi** dan token terverifikasi di BSC testnet." |
| **2:45 sampai 3:00** | **CLOSE, the one line** | "Janji personal, bayaran, janji sosial, kepercayaan P2P untuk 99% yang tak pernah sentuh DeFi. **JanjiChain: janji yang menepati dirinya sendiri. A promise that keeps itself.** Terima kasih." |

**Budget keras:** maksimal 30 detik total untuk "how it works". Kalau masih jelasin stack setelah 2:15, kamu sedang kalah.

---

## 8. Demo Runbook (drill sampai muscle memory)

1. **Pra-panggung:** RPC dedicated/berbayar aktif; cron **pre-warm**; **kedua promise sudah di-create** (live cuma `submitProof`); wallet ARBITER terdanai gas; rekaman cadangan 40s di-cue.
2. **Beat 1:** trigger submitProof bukti valid → mundur, tangan naik → panel stream → tBNB release → tunjuk BscScan verdictHash.
3. **Beat 2:** submitProof bukti non-compliant semantik → mundur lagi → agent REFUSE + refund → kutip kriteria gagal.
4. **Gesture "tangan lepas laptop" = klaim otonomi.** Tampilkan countdown cron ("next poll in 8s") di layar agar otonomi self-evident, bukan sekadar diklaim.
5. **Verbal bridge kalau stall:** "sementara cron settle, ini run identik dari 5 menit lalu" → cut ke rekaman. Stall harus terbaca showmanship, bukan gagal.
6. **Go/no-go gate:** 10x flawless berturut sebelum naik panggung.

---

## 9. Repo Hygiene

- Repo **baru & bersih** (bukan rename ProofOfWatt di tempat), nama `janjichain`, jauhkan dari framing DePIN/energi/IoT (harus DISTINCT dari Option 1).
- `foundry.toml` + `remappings.txt` reuse (`@openzeppelin/`, `forge-std/`), lib sudah ada.
- **JANGAN commit secret** apa pun (arbiter private key, RPC key, Groq key), `.env` + `.gitignore`, key via env, sesuai insiden global.
- README: one-liner + arsitektur 3-kotak (dApp → escrow → cron judge) + alamat kontrak terverifikasi BscScan + GIF demo 40s.
- CI: `forge test` + `forge fmt --check` (pola `.github/` sudah ada).
- Commit history rapi per-sesi (bukti mengikuti kurikulum S3, S6 + ship melampauinya).

---

## 10. Kill-Shot Checklist (red-team, wajib centang sebelum Demo Day)

- [ ] **AI kerja un-regexable**: kriteria semantik (persuasif+sebut-garansi), bukan format/count/deadline. *Kalau juri bisa reproduksi verdict dengan if-statement, tak ada AI project, kalah.*
- [ ] **Live run un-stallable**: RPC berbayar + precreate promise + pre-warm cron + rekaman cadangan + verbal bridge, 10x flawless.
- [ ] **Kontrak diperlakukan sebagai risiko**: CEI, pull-over-push, claimExpired, 8+ test jalur uang. Bukan "90% jadi".
- [ ] **Novelty gap dikonversi**: sebut GenLayer/UMA/Kleros sendiri; pitch = produktisasi.
- [ ] **"What if AI wrong" ter-arm**: verdictHash auditable + claimExpired + optional appeal.
- [ ] **Anti prompt-injection**: bukti = DATA bukan instruksi; criteriaHash on-chain saat create.
- [ ] **Token-less**: native tBNB; 'suriota' TIDAK di jalur settlement.
- [ ] **Headline = janji dua-orang intim**: arisan/freelance cuma 1 kalimat roadmap.
- [ ] **GTM jujur**: mainnet + fiat ramp = post-hackathon, diakui eksplisit.
- [ ] **Scope beku**: 1 kontrak, 1 cron judge, 2 layar, 2 promise. Nol fitur ekstra.

---

## 11. Victory Metric

**Menang JIKA setelah pitch, juri bisa (a) mendeskripsikan proyek ke kolega hanya dengan "a promise that keeps itself", DAN (b) menyebut momen "AI-nya sendiri yang MENOLAK bukti buruk dan mengembalikan dana."**

Realistis 1st-place odds **~30 sampai 40%** (MEDIUM→HIGH), HIGH **hanya jika** dua non-negotiable (judgment un-regexable + demo un-stallable) dieksekusi sempurna. Melawan field pemula nasional yang ship chatbot/bounty-board/trading-bot fork, solo dev dengan demo money-moves-both-ways otonom Bahasa yang flawless adalah kasus top-3 nyata. Yang menaikkan ke juara 1 adalah **satu momen tak-terpalsukan** yang tak bisa direplikasi live oleh siapa pun: **hakim AI yang berkata TIDAK, dan uang bergerak mundur, tanpa tangan di keyboard.**