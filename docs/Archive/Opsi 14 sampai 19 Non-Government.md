# Opsi 14 sampai 19 Non-Government

Tanggal: 11 Juli 2026.  
Scope: alternatif hackathon Web3 x AI yang tidak bergantung ke pemerintah sebagai buyer, regulator, atau sumber data utama.

## Posisi Riset

Riset ini dibuat setelah opsi government-heavy seperti MBG, bansos, halal ops, dan SLA publik dianggap terlalu bergantung pada instansi. Constraint baru: buyer harus private, data harus bisa didapat dari workflow bisnis biasa, dan demo harus bisa jalan tanpa izin pemerintah.

Opsi lama yang sengaja tidak diulang:

| Kelompok | Contoh | Alasan tidak diulang |
|---|---|---|
| Energy settlement | WattSettle, Enovatek, ProofOfWatt | Sudah menjadi jalur utama |
| Commerce escrow lama | AgentCart, TrustCart, TuntasCOD | Sudah pernah dianalisis |
| Invoice financing | VeriFaktur, Talangan | Sudah masuk roadmap atau arsip |
| Government adjacent | BatchGuard MBG, HalalOps, bansos, ServiceProof SLA | Tidak sesuai constraint non-government |
| Cold chain | ColdSLA | Sudah pernah muncul, terlalu dekat dengan opsi lama |

## Sinyal Pasar

1. BNB Chain mendorong agent economy lewat ERC-8004, x402, dan ERC-8183. Problemnya bukan lagi "bisa bikin agent", tetapi apakah agent bisa dipercaya lintas organisasi.
2. Merchant private masih bocor di chargeback dan friendly fraud. Ini pain operasional, bukan isu regulasi.
3. SMB dan freelancer punya masalah invoice telat bayar. QuickBooks 2025 mencatat 56 persen small business punya unpaid invoice dan 47 persen punya invoice overdue 30 hari lebih.
4. Counterfeit dan fake listing makin AI-native. Amazon melaporkan penyitaan lebih dari 15 juta produk counterfeit pada 2025.
5. Cold chain tetap besar, tetapi tidak dijadikan rekomendasi utama karena sudah dekat dengan ColdSLA.

## Shortlist

| Rank | Opsi | Skor | Track | Buyer | One-liner |
|---|---:|---:|---|---|---|
| 1 | AgentSure | 92 | AI Agents / Finance | AI-agent builder, API marketplace, agent marketplace | Trust layer untuk paid AI-agent calls di x402 plus ERC-8004 |
| 2 | ChargeProof | 89 | Finance and Commerce | Merchant, D2C brand, marketplace seller | Evidence ledger untuk melawan friendly fraud dan chargeback |
| 3 | DropProof | 86 | Finance and Commerce | Creator, freelancer, agency, client SMB | Milestone escrow untuk deliverable digital |
| 4 | AuthMint | 84 | RWA / Commerce | Brand, distributor, marketplace seller | Unit-level product passport anti-counterfeit |
| 5 | SubProof | 79 | Commerce | SaaS dan subscription merchant | Cancellation and refund receipt untuk dispute subscription |
| 6 | ReturnLens | 77 | Commerce | Marketplace seller, D2C ops | AI verifier untuk return abuse |

## Rekomendasi Utama: AgentSure

### Masalah

Agent economy akan butuh trust layer. ERC-8004 memberi identity, reputation, dan validation registry. x402 memberi payment rail. Tetapi paid interaction masih punya gap: payment proof belum selalu mengikat resource, output agent belum selalu divalidasi, dan reputasi bisa diisi oleh interaksi yang tidak benar-benar paid atau tidak benar-benar sukses.

### Before, Now, After

| Fase | Kondisi |
|---|---|
| Before | Agent dipanggil via API biasa. Pembayaran dan kualitas output tidak punya bukti yang dapat diaudit |
| Now | ERC-8004 dan x402 memberi primitives, tetapi reputation dan validation masih butuh policy layer |
| After | Setiap paid agent call punya request-bound receipt, output hash, validation score, dan reputation event |

### Input, Process, Output

Input:

- `agentId`
- MCP atau A2A endpoint
- x402 payment proof
- request hash
- output hash

Process:

1. Pre-flight endpoint check.
2. Bind payment ke request dan resource spesifik.
3. Validator agent replay atau sanity-check output.
4. Tulis validation response ke registry.
5. Update private reliability score.

Output:

- paid-call receipt
- validation score
- dispute or refund path
- public reliability profile

### SWOT

| Area | Catatan |
|---|---|
| Strength | Paling cocok dengan arah BNB, AI agent, x402, dan ERC-8004 |
| Weakness | Lebih sulit daripada app marketplace biasa |
| Opportunity | Bisa diposisikan sebagai "Stripe Radar untuk AI agents" |
| Threat | Standar agent commerce masih cepat berubah |

### Demo

Demo cukup 2 agent dan 1 validator:

1. Buyer agent membayar worker agent via mock x402 flow.
2. Worker mengembalikan output.
3. Validator menghitung ulang atau mengecek hash output.
4. Kontrak mencatat validation response dan score.
5. Dashboard menunjukkan paid job valid, fake review ditolak, dan failed job tidak menaikkan reputasi.

## Runner Up: ChargeProof

### Masalah

Merchant kalah di chargeback karena bukti tercecer di banyak sistem: order, chat, delivery, return photo, refund policy, dan SKU serial. AI bisa menyusun evidence packet, sedangkan blockchain dipakai untuk integrity anchor.

### Input, Process, Output

Input:

- order data
- delivery proof
- chat transcript
- return photo
- policy snapshot
- SKU atau serial

Process:

1. AI menyusun dispute timeline.
2. Evidence di-hash.
3. Hash di-anchor on-chain.
4. Sistem membuat representment brief.

Output:

- dispute packet
- tamper-evident evidence timeline
- merchant recovery dashboard

### Kenapa Menarik

Pain jelas, buyer jelas, dan demo mudah. Risiko utamanya: Web3 harus diposisikan sebagai evidence integrity, bukan gimmick.

## Opsi Komersial Cepat: DropProof

### Masalah

Creator, freelancer, dan agency sering terjebak di deliverable dispute. Client bilang output belum sesuai, worker bilang scope sudah selesai. Ini berbeda dari invoice financing karena yang diverifikasi adalah milestone dan acceptance criteria, bukan piutang.

### Alur

1. Client membuat brief dan acceptance criteria.
2. Dana masuk escrow.
3. Worker submit deliverable URL atau file hash.
4. AI verifier mengecek deliverable terhadap brief.
5. Jika lolos, kontrak release pembayaran.
6. Jika gagal, masuk dispute window.

### Kenapa Beda dari VeriFaktur

VeriFaktur membiayai invoice yang sudah ada. DropProof mengamankan pembayaran sebelum dispute terjadi.

## Keputusan

| Tujuan | Pilihan |
|---|---|
| Maksimal cocok BNB dan Web3 x AI | AgentSure |
| Paling cepat dijual ke merchant | ChargeProof |
| Demo paling mudah dan tetap private-sector | DropProof |

Rekomendasi: lanjutkan AgentSure sebagai kandidat riset non-government nomor satu. Simpan ChargeProof sebagai fallback komersial kalau AgentSure terlalu berat untuk timeline hackathon.

## Source Ledger

| Sumber | Dipakai untuk |
|---|---|
| https://www.bnbchain.org/en/solutions/ai-agent | Arah BNB Chain untuk ERC-8004, x402, ERC-8183, dan agent economy |
| https://eips.ethereum.org/EIPS/eip-8004 | Struktur identity, reputation, validation registry |
| https://quickbooks.intuit.com/r/small-business-data/small-business-late-payments-report-2025/ | Data late payment SMB |
| https://chargebacks911.com/chargeback-field-report/ | Friendly fraud dan chargeback recovery |
| https://www.mastercard.com/content/dam/mccom/shared/news-and-trends/insights/2026/2026-javelin-chargebacks-white/2026%20Chargebacks%20Javelin%20White%20Paper.pdf | Chargeback market signal |
| https://trustworthyshopping.aboutamazon.com/2025-trustworthy-shopping-experience-report | Counterfeit, seller verification, product trust |
| https://publicinterestnetwork.org/wp-content/uploads/2025/12/Red-Points-Report-2025-Counterfeit-Teardown_.pdf | Counterfeit buyer impact dan AI-enabled fake listings |
| https://www.marketsandmarkets.com/Market-Reports/cold-chain-market-811.html | Cold chain market check, tidak diprioritaskan |

