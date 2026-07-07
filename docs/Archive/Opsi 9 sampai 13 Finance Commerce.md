> 🗄️ **ARSIP.** Opsi ini sudah divalidasi dan bukan fokus submission. Disimpan sebagai referensi dan roadmap. Fokus aktif: [Opsi 5 WattSettle](<../02 Opsi 5 WattSettle.md>) · [Opsi 6 Enovatek](<../03 Opsi 6 Enovatek.md>) · [Codex 7 dan 8](<../Codex Opsi 7 8/>). Index arsip: [README](README.md).

---

# STRATEGI, OPSI 9 sampai 13 · Track Finance & Commerce
### Indonesia Web3 Hackathon 2026 · Binance Academy × BNB Chain × Coinvestasi × Dev Web3 Jogja
**Builder:** Gifari Kemal Suryo, PT Surya Inovasi Prioritas (SURIOTA)
**Metode:** deep-research 17-agen (argus web-intel) → ideasi 4-lensa → seleksi/dedup → red-team adversarial + prior-art hunt.
**Kalibrasi skor:** WattSettle = 90 · ProofOfWatt = 74.5 · Karmakhet = 58 · ProofOfAlpha = 54 · JanjiChain = 48.
**Tanggal:** 7 Juli 2026. **Bismillah.**

> Konteks penomoran: Opsi 1 sampai 6 sudah ada (lihat `STRATEGI-MASTER-6-OPSI.md`). Dokumen ini memuat kandidat baru **di luar** ruang 1 sampai 6, dinomori **Opsi 9 dst** atas permintaan Gifari (nomor 7 sampai 8 sengaja dikosongkan sebagai buffer).

---

## 0. Ringkasan Eksekutif (baca kalau buru-buru)

Riset mendalam ke 7 lensa (pemenang hackathon 2024 sampai 2026, agentic commerce/x402, PayFi/RWA, Indonesia, e-commerce×web3, arah BNB, prediksi frontier) menghasilkan 12 kandidat, disaring & di-red-team jadi **5 finalis**.

| # | Nama | Skor as-is | Dgn fixes | Inti mekanisme | Verdict red-team |
|---|---|---|---|---|---|
| **9** | **VeriFaktur** | **79** | **~84 sampai 85** | Invoice financing yang tak bisa bohong: bukti delivery ditandatangani device SURIOTA (EIP-712) + underwriter AI (Artha 16-persona) verdict on-chain + waterfall settlement | Kandidat entri-kedua **terkuat**; substansi finance terdalam |
| **10** | **TuntasCOD** | **79.5** | ~82 | Settlement oracle sengketa retur COD: timbangan IoT sign berat paket (EIP-712), AI arbiter putuskan fault on-chain, escrow release/split otomatis | Demo **paling teatrikal**, pain paling panas, tapi reskin WattSettle |
| **11** | **Talangan** | **71.5** |, | zkTLS payout-factoring: seller buktikan payout Shopee/TikTok yang akan cair, AI underwrite, advance IDRX cair | Track-fit & selera juri terbaik non-Watt; moat lunak |
| **12** | **Faktur402** | **64.5** |, | Tax-split + e-Faktur layer di atas x402 BSC: tiap micropayment auto-split PPN ke escrow + InvoiceNFT | Paling frontier/on-message BNB 2026; software-only |
| **13** | **Mandat** | **63** |, | On-chain spending mandate (AP2 terbuka) + AI CFO bayar vendor otonom dalam limit | Terlemah; terbantah Base Spend Permissions |

**Kesimpulan jujur (tidak diinflasi):** **tidak ada** kandidat baru yang mengalahkan **WattSettle (Opsi 5/6, 90)** apa adanya. Alasan struktural: di WattSettle, device **ADALAH** sumber data settlement (semantik rapat, tak ada oracle-gap); di kandidat baru, device/proof hanya **bukti pendukung** yang bisa ditembak juri. **VeriFaktur** dengan fixes lengkap tembus **~84 sampai 85**: cukup untuk jadi **entri track-kedua** yang kuat (jika hackathon mengizinkan 2 submission) atau **rencana pasca-hackathon**, bukan pengganti WattSettle.

**Rekomendasi:** pertahankan **WattSettle/Enovatek (Opsi 5/6) sebagai entri utama**. Jadikan **VeriFaktur (Opsi 9) sebagai kandidat cadangan/entri-kedua** dan **arah produk komersial pasca-hackathon** (dogfooding invoice B2B SURIOTA asli). Simpan Opsi 10 sampai 13 sebagai amunisi/roadmap.

---

## 1. Temuan Riset yang Mengubah Peta (state-of-the-hype per Juli 2026)

Enam fakta ini menjadi fondasi penilaian, semuanya terverifikasi ≥2 sumber lewat argus:

1. **Track finance dimenangkan aplikasi settlement bisnis nyata, bukan yang "paling novel".** Bukti lintas ekosistem: CargoBill (freight B2B, Solana Breakout 2025 Stablecoins-track 1st), FXSwap (forex↔stablecoin), Ribh (restocking UKM), ETHPark-QR (parkir Bangkok), Omma Cash (kirim crypto via WhatsApp). Grand prize memang sering ke infra novel (TAPEDRIVE, Reflect), tapi **track** finance/commerce → applied settlement. **→ memvalidasi strategi submit WattSettle ke Finance & Commerce, bukan berebut AI Agents.**

2. **Loop escrow→verify→auto-payout deterministik = mesin demo pemenang.** Individuum (lock→auto-verify→release), PumpRoyale (loser-pool redistribusi), zkPull (PR merged→zkTLS→AVS→payout). Uang bergerak sendiri di depan juri. **→ semua kandidat kita mempertahankan pola ini.**

3. **AI autonomy menang HANYA jika visible & auditable on-chain.** YieldCoin (Grand Prize Chromion $35K) menang eksplisit karena "all decisions executed onchain for full transparency and auditability"; TokenIQ "autonomous CFO" sama. **AI-theater tanpa jejak on-chain tidak pernah menang track finance.** → **ini kill-shot terbesar untuk kandidat kita** (lihat §3).

4. **x402 = tema finance paling panas tapi SEMUA pemenangnya software-only** (compute/file/API; volume kumulatif hanya ~$41M USDC per Apr 2026, avg $0,37/tx, 76% service ≤$0,10, 54% traffic dari ekonomi karakter Virtuals). **Belum ada satu pun seller x402 yang menjual layanan FISIK ter-meter.** Pasar timpang: 4.400 buyer vs 477 seller, **kekurangan di sisi SELLER**. → celah untuk hardware SURIOTA; sekaligus mengkonfirmasi WattSettle (pay-per-use aset fisik) berada di ruang kosong.

5. **Gagalnya pembiayaan on-chain SELALU di verifikasi off-chain, bukan smart contract.** Maple 2022 −$54M (Orthogonal sembunyikan exposure FTX), Goldfinch −$18M (incl. Lend East SME SEA −$10.2M), Tugende Kenya −$5M. Kutipan kunci: *"the on-chain layer worked exactly as designed; the off-chain borrowers did not."* Di Indonesia: OJK cabut izin **Investree** (TWP90 16,44%, CEO buron) & **TaniFund** 2024; 22 platform P2P masih TWP90>5% per Okt 2025; gap pembiayaan UMKM **US$235 miliar** (IFC). Akar: invoice fiktif/double-financed. **→ inilah pandora box: tak ada yang membuat receivable-nya SENDIRI machine-attested dari sumber.**

6. **Selera juri terkonfirmasi STRUKTURAL, bukan tebakan.** Coinvestasi (co-host) menjalankan akselerator **"Tokenize Indonesia"** (bareng BRI Ventures, Saison Capital, MDI/Telkom, Pegadaian, PosDigi; est. peluang US$88 miliar). Pemenang lokal: **OwnaFarm** (invoice tani ter-tokenisasi, founder UKDW Blockchain Club Jogja = ekosistem juri) & **zkPull** (trustless auto-payout). **→ juri secara institusional berinvestasi pada tesis RWA + real-world settlement Indonesia.**

**Rail yang bisa dipakai gratis:** **IDRX** (stablecoin rupiah 1:1 teregulasi, audit CertiK, multichain incl. BNB Chain, diakui kerangka CFX/OJK), tapi supply hanya ~Rp18,5 miliar (~US$1 juta): **rail IDR on-chain nyaris kosong → first-mover application layer = nol kompetisi lokal.** Framing legal wajib: **"settlement/escrow instrument"**, bukan "alat bayar" (rupiah = satu-satunya legal tender, UU Mata Uang; POJK 27/2024 belum mengatur ITO = grey zone).

---

## 2. Lima Finalis (detail)

### ⭐ OPSI 9, VeriFaktur · Machine-Verified Invoice Financing
**One-liner:** Invoice financing yang tidak bisa bohong, bukti delivery ditandatangani oleh perangkat yang di-invoice-kan itu sendiri (EIP-712), AI underwriter memutus advance secara legible on-chain, settlement waterfall berjalan otomatis. **Jawaban langsung atas kolapsnya Investree.**

**Problem:** gap UMKM US$235B; Investree/TaniFund dicabut; semua default private-credit on-chain = *"the borrower lied"*.

**Mekanisme (BSC testnet, fork `ProofOfWatt.sol` 6-tests-pass):**
1. `InvoiceRegistry`, **canonical field-hash** `keccak256(NPWP_buyer ‖ NPWP_vendor ‖ invoice_no ‖ amount ‖ due_date)` (bukan document-hash naif); hash duplikat REVERT = double-financing mati by-design.
2. **Device-attested delivery:** SRT-MGATE ESP32 di site customer sign `commissioning attestation` EIP-712 `{serial, site-hash, timestamp, heartbeat}`; invoice eligible hanya jika ada bukti mesin terpasang & hidup, **di-co-sign buyer** (site registration sekali via wallet/email-link) + heartbeat history N-hari.
3. **AI underwriter = komite Artha** (16 persona → risk gate → PM verdict, live di VPS) + argus verifikasi entitas buyer (NIB/NPWP/web) via Hermes cron → emit `UnderwriteVerdict{advanceRate 60 sampai 85%, confidence, reasonHash, personaVotesHash}`, **advance-rate DINAMIS** dari debat komite (bukan APPROVE/REJECT biner) → AI mengubah outcome on-chain, bukan dekoratif.
4. Approve → receivable minted; single **whitelisted institutional facility** (bukan crowd) deposit mock-IDRX; vendor terima advance 80%.
5. Buyer bayar T+30 → waterfall: pokok+discount 2% → facility, sisa → vendor, fee 1% → treasury.

**Moat:** invoice/quotation B2B **nyata SURIOTA** sebagai underlying + hardware yang menandatangani bukti delivery-nya sendiri (tak tertiru tim software 36 jam) + Artha/Hermes/argus hidup 24/7 dengan histori verdict BscScan berminggu-minggu pra-submission + ProofOfWatt.sol tinggal fork.

**Skor red-team: 79 → dengan fixes ~84 sampai 85.** Substansi finance 3-lapis (origination+verification+financing+settlement+fee) terdalam dari semua opsi; narasi juri terkuat (Investree = skandal nasional yang semua juri kenal).

**Kill-shot & fixes (WAJIB):**
- *Hash-dedup naif dibypass ganti 1 byte* → **canonical field-hash + normalisasi ketat**; sebut MonetaGo eksplisit sbg validasi pasar ("kami versi public-chain untuk long-tail UMKM").
- *Semantic gap: device hidup ≠ barang terkirim* → kecilkan klaim jadi **"proof of commissioned equipment at declared site"** + buyer co-sign + **fraud-cost framing** ("dari edit PDF gratis → pasang hardware fisik berjejak"). Klaim "impossible" runtuh; klaim "biaya fraud naik >10×" tahan interogasi.
- *AI-theater (rule engine memutus, LLM cuma menulis)* → **advance-rate dinamis** dari komite; dua invoice APPROVE dengan rate BEDA karena debat beda.
- *Regulatory elephant (pool investor)* → **hapus investor retail dari demo**; single institutional facility; pitch fase-2 = **jual verification-oracle API ke 22 pindar bermasalah** (POJK 40/2024 pipeline), jadi oracle, bukan pemegang izin.
- *Demo-stall (5 tx + argus live)* → cache entity-check + hash on-chain sebelum demo; demo = replay; zero live external call kecuali device signing (hotspot sendiri) + pre-signed fallback.

**Prior art (semua mitigable, JANGAN klaim "first"):** MonetaGo (registry anti-duplikasi production sejak 2018, dipakai bank/central-bank), Skuchain EC3 (milestone shipment→payment), Chainlink invoice-tokenization (oracle ERP), InvoiceMate, Centrifuge (pool+waterfall), hackathon-fare (BillFlow, ChainInvoice). Kombinasi spesifik *"vendor-hardware sign commissioning attestation EIP-712 sebagai syarat eligibility"* **tidak ditemukan clone langsung** (confidence sedang).

**Bisnis/GTM:** fase-1 vendor IoT/equipment tiket Rp50 sampai 500jt (SURIOTA dogfooding); fase-2 verification-oracle SaaS ke pindar. Revenue: spread discount + fee verifikasi. **Bisa jadi bisnis nyata pasca-hackathon, bukan proyek buang.**

---

### OPSI 10, TuntasCOD · Settlement Oracle Sengketa Retur COD
**One-liner:** Escrow yang memutus sengketa retur dengan bukti fisik tak-bisa-bohong, timbangan IoT sign berat paket (EIP-712) saat kirim & saat retur, AI arbiter tetapkan fault on-chain, dana release/split otomatis.

**Problem (paling panas & terverifikasi):** seller TikTok Shop/Shopee rugi puluhan juta, Rp300jt (retur berisi batu/kotak kosong); 5 sampai 10% transaksi marketplace RI = fake sales (Cube Asia 2025); Fraud-as-a-Service terindustrialisasi; **TikTok Shop per 1 Jun 2026 geser ongkir retur ke seller** (pain memuncak 3 bulan sebelum submission; Menteri UMKM turun tangan).

**Mekanisme:** `CODEscrow.sol` fork ProofOfWatt, dana locked mock-IDRX; `DeliveryProof` EIP-712 `{orderId, weightGrams, photoHash, geohash, ts}` disign device key timbangan IoT (load cell HX711/Modbus → SRT-MGATE, ~2 hari kerja) saat packing & saat retur tiba; **kontrak** hitung weight-delta sendiri `require(delta ≤ 5%)` (AI tak bisa override fisika); AI hanya memutus gray-zone (SPLIT, fault-attribution kurir/buyer/seller) → `Verdict{faultParty, reasonHash}` → escrow eksekusi, fee 1%.

**Skor: 79.5.** **Demo paling teatrikal dari semua kandidat:** tukar isi kotak jadi batu 150g **di depan juri** → gateway sign berat baru → verdict RELEASE_SELLER live (pola BananaBets/OmiSwap yang diingat juri).

**Kill-shot fatal & fixes:**
- *Mass≠content (batu 480g lolos)* → framing **"mass-equality + seal-integrity oracle"** (bukan "anti-fraud"); tambah seal-hash; fraud-cost naik >10×. **Demo-mu sendiri mengajari serangan ini, hati-hati.**
- *Trusted-oracle wallet tunggal* → pindah cek deterministik **ke contract** (verifikasi 2 signature EIP-712 on-chain); "AI kami tidak bisa berbohong tentang berat, kontrak yang menghitung" (jawab selera zkPull juri).
- *Kontradiksi "COD"* (dana locked ≠ cash-on-delivery) → **rename & reframe jadi "Return-Dispute Settlement Rail untuk rekber/escrow commerce"**; COD marketplace jadi roadmap.
- *Netralitas asimetris* (hanya seller punya timbangan) → posisikan device di **hub 3PL netral terkontrak**, key tamper-evident.
- **Kanibalisasi WattSettle:** arsitektur identik. **JANGAN submit keduanya sebagai ide setara**; pilih WattSettle primary, TuntasCOD hanya jika butuh entri track-berbeda.

**Prior art:** 4+ paper COD-blockchain (satu dengan IoT: IEEE 2025), Kleros (escrow dispute production), 3+ AI-escrow hackathon 2026, dan **non-web3 paling berbahaya**: hub kurir (SPX/J&T) sudah menimbang+memfoto tiap paket sebagai SOP → siapkan jawaban "kenapa butuh blockchain" (settlement multi-pihak lintas platform + fee rail + audit netral).

---

### OPSI 11, Talangan · zkTLS Payout-Factoring untuk Seller Marketplace
**One-liner:** Seller buktikan payout Shopee/TikTok yang akan cair (T+7) lewat web-proof zkTLS → receivable lahir on-chain (tak bisa dipalsukan/double-financed) → AI underwriter putus advance IDRX dengan verdict legible di BscScan.

**Skor: 71.5**: **track-fit & selera juri terbaik di antara semua non-Watt** (narasi Investree+KoinWorks+IDRX sangat tajam; PayFi/Huma sudah PMF nyata: Huma Q4 2025 $2.2B volume). **Kelemahan:** moat lunak tanpa hardware; attestor = oracle-of-one; zkTLS sudah commodity (889+ provider Reclaim/Opacity); zkPull (pemenang lokal, pakai zkTLS) sudah dikenal juri → novelty tergerus. Repayment tanpa recourse on-chain; nullifier hanya intra-registry.

**Nilai:** cadangan/submission-kedua yang murni-finance & Indonesia-relevan, atau **modul di dalam VeriFaktur** (jalur receivable non-hardware untuk seller yang tak punya device).

---

### OPSI 12, Faktur402 · Tax-Split & e-Faktur Layer untuk x402 di BSC
**One-liner:** Tiap micropayment mesin x402 di BSC auto-split PPN 11% ke tax-escrow + fee protokol dalam satu tx, AI reconciler agregasi jadi InvoiceNFT format e-Faktur, menjawab keluhan publik yang belum dijawab siapa pun: *"siapa yang saya invoice untuk 10.000 micropayment, dan PPN-nya bagaimana?"*

**Skor: 64.5**: **paling frontier & on-message stack resmi BNB 2026** (Binance launch x402 di BSC 19 Mei 2026; gasless via MegaFuel paymaster). Demo 100% software = **floor risk terendah** (Hermes VPS benar-benar bayar argus per-call = self-funding loop nyata). Lokalitas e-Faktur/PPN/Coretax = diferensiasi Indonesia.

**Kill-shot:** **Pieverse x402b** (Binance-backed, di BNB Chain: EIP-3009 gasless + "compliant electronic receipts at settlement on Greenfield" + marketing "audit and tax standardization") = prior art **paling berbahaya**: klaim pitch "mereka cuma receipt+timestamp" adalah understatement yang bisa membunuh kredibilitas di depan juri BNB. Jika modul tax mereka rilis sebelum Okt 2026, novelty runtuh. Juga: AI reconciler regexable; escrow PPN tanpa jalur legal DJP; moat software-only clonable.

**Nilai:** **layer di atas WattSettle** (tiap settlement meter menghasilkan faktur PPN), sinergi, bukan pengganti. Bagus sebagai SDK open-source (MVB call menyebut middleware).

---

### OPSI 13, Mandat · On-Chain Spending Mandate + AI CFO Agent
**One-liner:** Versi terbuka on-chain dari Google AP2, CFO tandatangani mandate EIP-712 (budget/vendor-whitelist/kategori), AI agent bayar invoice vendor otonom dalam batas yang di-enforce contract, tiap approve/reject legible di BscScan (anti-BEC fraud).

**Skor: 63 (terlemah).** Novelty inti **terbantahkan** oleh Base Spend Permissions + AP2/x402 yang sudah shipping; lapisan AI redundan-by-design di skenario BEC andalan. **Nilai tertinggi:** modul **payer-side di dalam WattSettle** (penyewa HVAC set limit bulanan, meter+AI menagih dalam mandate), bukan submission berdiri sendiri.

---

## 3. Kill-Shot Lintas-Kandidat (pelajaran meta)

Tiga pola kelemahan muncul di HAMPIR SEMUA kandidat baru, inilah mengapa tak ada yang melampaui WattSettle apa adanya:

1. **Oracle-gap / proxy bocor.** VeriFaktur (device hidup ≠ piutang benar), TuntasCOD (massa ≠ konten), Talangan/Faktur402 (server-side web-proof). Di WattSettle, meter energi **adalah** transaksi yang di-settle → tak ada gap. **Ini keunggulan struktural yang sulit ditiru kandidat commerce.**
2. **AI-theater.** Reject-path deterministik (if-statement) sementara LLM cuma "menulis alasan" = definisi regexable di rubrik sendiri. **Fix universal:** biarkan AI mengubah *outcome* yang tak bisa di-regex (advance-rate dinamis, fault-attribution gray-zone), bukan hanya verdict biner.
3. **Trusted single-wallet oracle.** Verdict diposting satu EOA = tak bisa dibedakan dari admin backdoor; kalah dari zkPull (trustless AVS). **Fix:** dorong sebanyak mungkin cek ke contract (verifikasi signature + hitung delta on-chain), AI hanya untuk residual.

**Regulatory framing (semua kandidat):** JANGAN sebut "P2P lending"/"alat bayar"; pakai "settlement/escrow/verification instrument, testnet". Hapus investor retail dari demo. Kutip tailwind: PP 28/2025 (blockchain diakui), Tokenize Indonesia (BRI/Pegadaian), POJK 40/2024 (pindar dipaksa adopsi verifikasi).

---

## 4. Pandora Box / Blackbox (yang orang lain belum punya)

Riset mengunci **satu celah kategori yang belum diduduki siapa pun** dan tepat di aset SURIOTA:

> **Machine-verified receivable**: receivable yang dibuat SENDIRI ter-tanda-tangan mesin dari sumber, sehingga *"invoice yang tidak bisa bohong"*.

Semua default on-chain private credit terjadi karena data borrower tak terverifikasi; semua respon industri = KYC/custody lebih berat (mahal, meninggalkan long-tail UMKM). **Tak ada yang menyelesaikan dari sisi data-origin.** SURIOTA punya kombinasi 5-langka untuk mengisinya: (1) hardware yang menandatangani datanya sendiri, (2) domain OT/IoT, (3) invoice B2B nyata, (4) AI committee (Artha) + web-intel (argus) hidup, (5) timing regulasi (OJK/PP 28/2025/Tokenize Indonesia). Inilah tesis di balik **VeriFaktur (Opsi 9)**: dan juga mengapa **WattSettle tetap raja**: energi adalah machine-verified receivable yang paling rapat semantiknya.

**Prediksi 12 sampai 24 bulan (sinyal kuat):** (a) juri finance akan **jenuh dengan x402 generik**: diferensiasi bergeser ke *"apa yang dibayar"* (aset fisik, tagihan nyata); (b) **usage-based/metered billing (IoT/energi/CaaS) jadi kelas receivable baru** paling mudah difinance karena datanya lahir bertanda-tangan mesin (Huma sudah listing DePIN financing); (c) **rail IDR on-chain jadi regulated mainstream** (BI Project Garuda tokenized-SBN pilot 2026); (d) format penilaian bergeser ke **performa live/terukur** (BNB HACK AI Trading Edition pakai live-trading-week) → sertakan bukti "sudah jalan 30 hari" (cron VPS, uptime, jumlah reading/verdict ter-settle di testnet).

---

## 5. Rekomendasi Final

1. **Entri utama TETAP WattSettle/Enovatek (Opsi 5/6).** Tidak ada kandidat baru yang mengalahkannya apa adanya; keunggulan semantik meter-as-settlement tak tertiru.
2. **VeriFaktur (Opsi 9) = kandidat cadangan terkuat + arah produk komersial pasca-hackathon.** Bila panitia mengizinkan 2 submission lintas-track, VeriFaktur (dgn fixes → ~84 sampai 85) adalah entri kedua. Bila hanya 1, jadikan VeriFaktur sebagai **fase-2 bisnis** (dogfood invoice SURIOTA asli).
3. **Opsi 10 sampai 13 = amunisi & roadmap**, bukan submission mandiri: TuntasCOD (jaga jarak, reskin WattSettle), Talangan (modul receivable non-hardware), Faktur402 (layer faktur di atas WattSettle), Mandat (modul payer-side).
4. **Jangan pernah** submit dua ide berarsitektur identik sebagai setara, melemahkan keduanya.

---

## 6. Sumber (verifikasi argus, 6 sampai 7 Jul 2026)
Colosseum blog (Reflect/CargoBill), Chainlink Chromion (YieldCoin/Yieldx/Spout), Coinbase x402 + x402scan analytics, Messari State of Huma Q4 2025, rwa.xyz/Redstone (private credit), Tazapay/Artemis (stablecoin B2B), EY-Parthenon Jun 2025, OJK POJK 27/2024 & 40/2024, IDRX/CoinGecko, Cube Asia (fake sales), Bisnis.com/Detik (retur COD TikTok Jun 2026), MonetaGo/Skuchain/Kleros/Pieverse x402b, Tokenize Indonesia (Coinvestasi/BRI Ventures). Detail lengkap di transcript workflow `wf_2675c43e-8f3`.
