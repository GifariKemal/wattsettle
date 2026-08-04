# Opsi 32 sampai 38 Non-Government Baru

Tanggal: 12 Juli 2026.
Scope: alternatif Web3 x AI terbaru yang tidak terkait SURIOTA, tidak memakai buyer pemerintah, dan tidak mengulang Opsi 1 sampai 31.

## Posisi Riset

Riset ini mencari opsi baru di luar shortlist lama. Opsi yang sengaja tidak diulang:

| Kelompok | Contoh | Alasan tidak diulang |
|---|---|---|
| SURIOTA dan energi | ProofOfWatt, WattSettle, Enovatek | Sudah menjadi jalur utama |
| Agent commerce trust | AgentCart, TrustCart, AgentSure | Sudah dianalisis sebagai challenger kuat |
| Dispute dan escrow merchant | ChargeProof, DropProof, SubProof, ReturnLens | Sudah masuk opsi non-government lama |
| Invoice dan payout financing | VeriFaktur, Talangan, Nafkah | Sudah masuk arsip dan roadmap |
| Government adjacent | BatchGuard, ServiceProof, NusaData, ScamShield, HalalOps | Di luar constraint user |
| Consumer escrow dan local finance | SafarVault, Karcis, KasKaca, HafalanVault | Sudah dianalisis dan tidak menembus benchmark |
| DeFi rescue | Jaring | Sudah red-team dan turun ke cadangan |

Benchmark lokal:

| Kandidat | Skor |
|---|---:|
| AgentCart TrustPay | 92.5 |
| AgentSure | 92.0 |
| WattSettle plus Enovatek | 90.0 |

Opsi baru harus menembus 90 agar layak dibahas serius. Idealnya menembus 92.5 agar bukan sekadar cadangan.

## Sinyal Pasar 2026

1. BNB Agent Studio dirilis 1 Juli 2026. Arah BNB jelas: agent punya identity, payment, hosting, ownership, dan persistence.
2. ERC-8004, ERC-8183, dan x402 makin jadi grammar agent economy: identity, commerce job, dan machine payment.
3. Stablecoin payment sudah besar, tetapi real commerce masih kecil. Gap terbesar bukan "bisa kirim uang", tetapi reconciliation, policy, usage proof, dan settlement yang bisa diaudit.
4. AI data supply chain makin mahal dan makin berisiko. Model, dataset, LoRA, style pack, dan RAG corpus butuh lisensi, provenance, usage log, dan royalty.
5. C2PA dan content credentials menjadi standar de facto untuk media provenance, tetapi belum otomatis memberi licensing dan payment rail.
6. Web data untuk AI masuk fase negotiated web: access legal, attested, metered, dan machine-paid lebih defensible daripada scraping gelap.

## Shortlist

| Rank | Opsi | Skor | Track | Buyer | One-liner |
|---:|---|---:|---|---|---|
| 1 | ModelRights | 93.0 | AI Agents / Finance | AI app builder, dataset owner, model creator, agency | Marketplace lisensi model, dataset, LoRA, dan style pack dengan royalty on-chain |
| 2 | SourceProof RAG | 90.5 | AI Agents / Commerce | Enterprise AI team, legal, audit, consulting | Jawaban RAG berbayar yang selalu membawa signed source receipt |
| 3 | ComputeSLA | 87.5 | AI Agents / Infrastructure | Startup AI, inference API, GPU provider | Broker job GPU DePIN dengan escrow berbasis completion proof |
| 4 | SpendCap402 | 86.5 | Consumer Apps / AI Agents | Power user, small team, API buyer | Wallet session untuk agent yang boleh belanja via x402 di bawah policy ketat |
| 5 | C2PALedger | 86.0 | Commerce / Creator | Agency, publisher, brand, creator | Content provenance plus licensing receipt untuk media AI dan campaign asset |
| 6 | AgentBenchPay | 85.5 | AI Agents | Agent marketplace, API marketplace | Benchmark marketplace tempat agent dibayar kalau menang task terukur |
| 7 | StableClose | 84.0 | Finance and Commerce | Exporter, remote team, marketplace ops | Stablecoin payout reconciliation untuk invoice, contractor, dan vendor kecil |

## Rekomendasi Utama: ModelRights

### Masalah

AI apps butuh dataset, LoRA, model checkpoint, prompt pack, style pack, dan eval set. Hari ini supply chain-nya berantakan:

- lisensi sering cuma teks di GitHub, Notion, atau invoice
- usage tidak tercatat per call atau per derivative model
- creator sulit membuktikan kontribusi saat model di-fine-tune ulang
- buyer sulit membuktikan bahwa data yang dipakai legal
- agent bisa membeli data/API, tetapi belum punya license receipt yang bisa diaudit

Ini problem non-government, private-sector, dan relevan langsung ke tema AI x Web3.

### Produk

ModelRights adalah marketplace lisensi aset AI. Setiap aset punya license card, content hash, owner, royalty split, allowed use, dan eval receipt. Agent atau developer membayar akses via stablecoin/x402, lalu menerima license receipt on-chain. Jika aset dipakai untuk fine-tuning atau derivative model, kontrak mencatat parent asset dan membagi royalty.

### Demo Loop

1. Creator mendaftarkan dataset kecil atau LoRA mock dengan hash, license terms, dan royalty split.
2. Buyer agent meminta akses untuk membuat mini classifier atau style model.
3. Endpoint mengembalikan payment required.
4. Buyer membayar stablecoin.
5. Kontrak mencetak license receipt dan mengizinkan download.
6. Verifier agent menjalankan eval kecil dan menulis score.
7. Derivative model didaftarkan dengan parent hash.
8. Royalty split berjalan ke creator saat derivative dipakai.

### Minimal Contract Surface

| Contract | Fungsi inti |
|---|---|
| `AssetRegistry` | register asset hash, license terms hash, owner, royalty bps |
| `LicenseEscrow` | pay, mint license receipt, refund if asset invalid |
| `DerivativeRegistry` | link derivative hash ke parent asset dan split |
| `UsageLedger` | emit usage event, usage hash, payer, asset id |

Ponytail version: mulai dengan dua contract saja, `AssetRegistry` dan `LicenseEscrow`. `DerivativeRegistry` bisa jadi event-only sampai demo butuh split nyata.

### AI Role

AI bukan chatbot. AI melakukan empat pekerjaan yang terlihat:

1. membaca license card dan menolak use case yang tidak cocok
2. memilih asset paling cocok untuk task buyer
3. menjalankan eval kecil untuk membuktikan asset berguna
4. membuat usage summary yang hash-nya masuk event

### Kenapa Ini Mengalahkan Opsi Lama

| Lawan | Kenapa ModelRights lebih segar |
|---|---|
| AgentSure | AgentSure memvalidasi paid call. ModelRights memvalidasi supply chain aset AI yang dipakai agent |
| DropProof | DropProof mengamankan deliverable digital. ModelRights mengamankan IP dan usage sebelum deliverable dibuat |
| AuthMint | AuthMint passport produk fisik. ModelRights passport aset AI |
| WattSettle | WattSettle punya moat hardware. ModelRights punya timing BNB/AI lebih kuat tetapi moat bisnis lebih lemah |

### Skor

| Dimensi | Skor | Catatan |
|---|---:|---|
| Fit tema BNB AI | 10 | Sangat dekat dengan ERC-8004, x402, agent marketplace, owned agent |
| Novelty | 9 | Model/data licensing muncul di ETHGlobal/0G, tetapi belum jenuh di BNB lokal |
| Demo clarity | 8 | Harus dibuat sangat konkret, satu asset, satu buyer, satu derivative |
| Build feasibility | 8 | Bisa dipotong ke registry plus escrow plus UI tipis |
| Buyer clarity | 8 | Buyer ada, tetapi sales cycle enterprise panjang |
| Moat | 7 | Tidak punya hardware moat, harus menang di category timing |
| On-chain necessity | 9 | License receipt, royalty, provenance, usage log memang cocok on-chain |

Skor akhir: 93.0.

### Kill-shots

| Risiko | Fix |
|---|---|
| Terlihat seperti NFT marketplace biasa | Jangan jual gambar atau collectible. Jual license receipt untuk dataset/model/LoRA dengan eval score |
| Royalty tidak bisa enforce off-chain usage | Jujur: on-chain hanya enforce access dan paid usage di gateway sendiri. Roadmap enforcement lintas platform via watermark, C2PA, dan model fingerprint |
| Dataset demo terlalu palsu | Pakai dataset kecil tapi nyata dan public-safe, misalnya eval set e-commerce copy, legal clause classifier, atau brand tone dataset |
| Overlap dengan AgentSure | Framing: AgentSure adalah trust layer untuk agent call. ModelRights adalah legal/provenance layer untuk asset yang agent beli dan pakai |
| x402 belum matang di BNB stack lokal | Jadikan x402 sebagai payment interface demo, settlement tetap simple stablecoin transfer di kontrak |

## Runner Up: SourceProof RAG

### Masalah

Enterprise tidak kekurangan chatbot. Mereka kekurangan jawaban AI yang bisa dibuktikan. RAG sering memberi source link, tetapi tidak selalu memberi hash, policy, snapshot, retrieval score, dan signed receipt yang bisa diaudit.

### Demo Loop

1. User membayar query premium.
2. Retriever mengambil chunk dari corpus privat mock.
3. AI menjawab hanya dari chunk yang lolos policy.
4. Sistem membuat receipt: query hash, source chunk hash, policy hash, answer hash.
5. Kontrak mencatat receipt hash.
6. UI bisa verify bahwa jawaban berasal dari source yang sama.

### Skor

Skor akhir: 90.5.

Kelebihan: jelas untuk enterprise, punya audit value, mudah dibangun.
Kekurangan: kurang sexy untuk panggung BNB dibanding ModelRights. Bisa terlihat seperti RAG app biasa kalau on-chain receipt tidak ditonjolkan.

## Opsi Infrastruktur: ComputeSLA

### Masalah

DePIN GPU murah belum cukup untuk startup AI. Yang dibeli startup bukan GPU, tetapi job selesai dengan biaya dan SLA yang jelas. Marketplace compute butuh escrow yang release hanya saat output selesai dan verifikasi lolos.

### Demo Loop

1. User submit inference atau fine-tuning job kecil.
2. Dua provider bid.
3. Agent memilih provider berdasarkan price, latency, dan reliability.
4. Provider mengirim output hash.
5. Verifier mengecek output.
6. Escrow release atau slash.

Skor akhir: 87.5.

Kelemahan utama: butuh provider palsu atau mock. Tanpa compute network nyata, juri bisa melihatnya sebagai marketplace simulasi.

## Opsi Safety Agent: SpendCap402

### Masalah

Agent payment akan gagal adopsi kalau user takut agent belanja tanpa batas. Session wallet dengan budget, merchant allowlist, dan receipt log adalah safety primitive yang mudah dipahami.

### Demo Loop

1. User membuat session: max 20 USD, hanya dua merchant API.
2. Agent membeli data API dan image asset via x402.
3. Kontrak menolak pembelian ketiga yang melanggar cap.
4. Semua receipt terlihat di UI.

Skor akhir: 86.5.

Kelemahan utama: terlalu dekat dengan wallet UX dan tidak cukup unik kalau tidak ada merchant nyata.

## Opsi Creator: C2PALedger

### Masalah

C2PA memberi provenance media, tetapi tidak otomatis memberi payment, license terms, atau royalty split. Agency dan brand butuh campaign asset yang bisa dibuktikan asal-usul dan hak pakainya.

### Demo Loop

1. Creator upload asset dengan C2PA manifest atau mock manifest.
2. AI membaca provenance dan license.
3. Brand membayar lisensi campaign.
4. Kontrak mencatat license receipt dan usage hash.
5. Jika asset di-remix, parent asset tetap tercatat.

Skor akhir: 86.0.

Kelemahan utama: C2PA sudah punya standar kuat. Blockchain harus diposisikan sebagai payment dan license rail, bukan pengganti C2PA.

## Opsi Tambahan

### AgentBenchPay

Marketplace task terukur untuk agent. Tiga agent submit jawaban, validator agent memberi score, pemenang dibayar. Skor 85.5 karena cold start dan overlap dengan AgentSure.

### StableClose

Stablecoin payout reconciliation untuk invoice, contractor, dan vendor kecil. Skor 84.0 karena pain nyata tetapi dekat dengan VeriFaktur, Talangan, dan Nafkah.

## Keputusan

| Tujuan | Pilihan |
|---|---|
| Kandidat baru terbaik, non-government, non-SURIOTA | ModelRights |
| Kandidat paling enterprise dan defensible | SourceProof RAG |
| Kandidat paling infrastructure-native | ComputeSLA |
| Kandidat paling consumer-agent safety | SpendCap402 |
| Kandidat creator/brand | C2PALedger |

Rekomendasi: lanjutkan **ModelRights** sebagai challenger baru nomor satu. Ia cukup kuat untuk mengalahkan WattSettle dari sisi timing BNB/AI, tetapi belum otomatis mengalahkan WattSettle dari sisi moat dunia nyata. Posisi jujur: **primary challenger, bukan pengganti default sampai demo ModelRights bisa dibuat lebih tajam daripada demo WattSettle**.

## Build Plan Minimal ModelRights

| Sesi | Target |
|---|---|
| Sesi 2 | Draft `AssetRegistry`, `LicenseEscrow`, event schema, dan satu asset fixture |
| Sesi 3 | Foundry test: register asset, pay license, reject invalid license, royalty split |
| Sesi 4 | Security pass: replay guard, owner check, fee bps cap, refund path |
| Sesi 5 | Backend agent: parse license card, choose asset, write usage hash |
| Sesi 6 | x402-like endpoint: payment required, verify payment, serve asset |
| Sesi 7 | UI: creator list asset, buyer agent buys, receipt appears |
| Sesi 8 | AI eval: model/data score, derivative registration |
| Sesi 9 | Pitch: "legal data supply chain for AI agents" plus live buy/eval/royalty |

## Demo Script 3 Menit

0:00-0:20 Hook. "AI agents can pay for APIs now. But what exactly are they allowed to use, and who gets paid when a dataset becomes a derivative model?"

0:20-0:50 Show creator asset. Dataset or LoRA has content hash, license terms hash, allowed use, and royalty split.

0:50-1:30 Buyer agent asks for an asset for a task. It rejects one asset due to license mismatch, selects the valid asset, and pays.

1:30-2:10 Contract emits license receipt. UI shows payer, asset hash, license hash, usage hash, and royalty split.

2:10-2:40 Verifier agent runs eval and writes score. Derivative model is registered with parent asset.

2:40-3:00 Close. "This is not another model marketplace. This is the receipt layer that lets agent commerce use licensed AI assets without guessing."

## Source Ledger

| Sumber | Dipakai untuk |
|---|---|
| https://www.bnbchain.org/en/solutions/ai-agent | Arah BNB Agent Studio, agent identity, payment, and persistence |
| https://cryptobriefing.com/bnb-chain-launches-ai-agent-platform-built-with-aws/ | Konfirmasi BNB Agent Studio 1 Juli 2026 dan positioning agent economy |
| https://www.crowdfundinsider.com/2026/05/278559-certik-examines-agent-economy-explains-how-eip-8004-eip-8183-x402-turn-ai-agents-into-sovereign-economic-actors/ | ERC-8004, ERC-8183, x402 sebagai stack agent commerce |
| https://ethglobal.com/events/cannes2026/prizes/0g | Sinyal model marketplace, licensing, royalties, provenance, fine-tuning bounty |
| https://www.zyte.com/blog/web-data-for-scraping-developers/ | Sinyal negotiated web, x402, MCP, dan data access untuk agent |
| https://stablecoininsider.org/ai-agents-for-stablecoins-in-2026/ | Arsitektur x402, stablecoin, pay-per-tool invocation, policy wallet |
| https://www.opendue.com/blog/understanding-cross-border-payments-trends-and-technology | Stablecoin cross-border pain, payout, marketplace, gig worker |
| https://openfx.com/stablecoins-cross-border-payments-report-2026 | Stablecoin adoption gap dan infrastructure gap |
| https://oakgen.ai/blog/ai-content-provenance-disclosure-laws-2026 | C2PA, disclosure, watermarking, dan compliance 2026 |
| https://github.com/provenex/provenex-core/ | Proof receipt untuk RAG/tool-call access sebagai prior art SourceProof RAG |

