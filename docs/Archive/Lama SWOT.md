> 🗄️ **ARSIP.** Opsi ini sudah divalidasi dan bukan fokus submission. Disimpan sebagai referensi dan roadmap. Fokus aktif: [Opsi 5 WattSettle](<../02 Opsi 5 WattSettle.md>) · [Opsi 6 Enovatek](<../03 Opsi 6 Enovatek.md>) · [Codex 7 dan 8](<../Codex Opsi 7 8/>). Index arsip: [README](README.md).

---

# SWOT & Peta Kompetitor, Opsi 5 (WattSettle) & Opsi 6 (Enovatek/PM20H20Q)
### Indonesia Web3 Hackathon 2026 · Track Finance & Commerce
**Builder:** Gifari Kemal Suryo, PT Surya Inovasi Prioritas (SURIOTA) · Update: 6 Juli 2026
Dasar: `STRATEGI-MASTER-6-OPSI.md` + `STRATEGI-MASTER-Opsi5-JUARA.md` (fakta tervalidasi Feb, Jul 2026).

> **Opsi 5 = rel/platform (horizontal).** **Opsi 6 = rel itu di produk nyata Enovatek/PM20H20Q (vertikal).** Satu proyek, satu track. Opsi 5 = visi (slide); Opsi 6 = mesin demo (panggung).

---

## 1. SWOT, Opsi 5 · WattSettle (rel M2M energy settlement)

### Strengths
- Rel horizontal → TAM besar (8 skenario: solar/REC, CBAM, P2P, EV, HVAC, ESCO, MRV karbon, diesel displacement).
- **Attestation AI legible on-chain** (kWh delta, anomaly score, model+ruleset hash), bukan sekadar boolean approve.
- Basis kontrak sudah jadi & teruji (`ProofOfWatt.sol`, 6 test PASS) + token `suriota` verified di BscScan.
- **Fee-split take-rate on-chain** = "payment rail dengan revenue model", bukan sekadar transfer.
- Memukul 3 pilar BNB 2026 sekaligus: RWA + Agentic Finance + settlement (ERC-8004/x402).
- Moat 5-lapis (lihat §3).

### Weaknesses
- **Abstrak**: pembeli bukti perlu dijelaskan (tidak se-intuitif "penyewa AC").
- Rel 2-fungsi (attest + transfer) bisa terlihat "tipis" vs builder DeFi (liquidity/pricing/counterparty).
- Demo kurang konkret bila berdiri sendiri tanpa produk.
- Bergantung AI verifier off-chain → harus dibuktikan benar-benar otonom (bukan rubber-stamp).
- Rawan **over-scoping** (godaan tambah staking/ZK/subgraph/mainnet).

### Opportunities
- **Track arbitrage**: Finance & Commerce diprediksi lebih sepi dari AI Agents (yang ramai fork-chatbot).
- Tailwind regulasi: **CBAM & OJK live Jan 2026** → "energi nyata terverifikasi on-chain oleh PT berizin".
- Ekosistem RWA BNB (~$3.6 sampai 3.9B) + warm intro (Binance Academy/Coinvestasi/Dev Web3 Jogja).
- **White-label** rel ke operator energy-DePIN SEA lain (B2B2X, CAC rendah).
- Trajektori 60 sampai 80 jt smart-meter PLN + 18.11% CAGR energy/utilities IoT.

### Threats
- Finance bisa **justru padat** dengan clone oracle/settlement (RWA/payments = jawaban kanonik kurikulum).
- Framing **"self-contained mirror of ERC-8004" = fatal** di depan juri BNB → wajib **integrate** registry live (bukan tiruan).
- Prior art energi: WeatherXM / Arkreen / Powerledger (kerjakan potongan, bukan kombinasi ini).
- Juri bisa probe edge-case (solvency pool, akuntansi carbon).

---

## 2. SWOT, Opsi 6 · Enovatek / PM20H20Q (Cooling-as-a-Service)

### Strengths
- **Konkret**: perusahaan (PT Enovatek Energy) + produk (DC meter PM20H20Q) + revenue nyata.
- **Pembayar jelas**: penyewa AC (bukan "bayangkan sebuah PLTS").
- **Demo deterministik & meyakinkan** → runtuhkan skeptisisme juri di 15 detik pertama.
- After-sales sudah ada (model rental Enovatek jalan).
- Revenue **recurring** (billing pemakaian per-kWh).

### Weaknesses
- Fokus 1 vertikal (HVAC) → TAM lebih sempit dari Opsi 5.
- **Bergantung partnership/relasi Enovatek** (di luar kendali penuh SURIOTA).
- Spec **PM20H20Q** + angka model rental/take-rate **belum diriset dalam** (risiko angka "mengada-ada").
- Konsentrasi 1 customer/partner.
- Billing nyata perlu **stablecoin** (bukan token volatil) → potensi tanya konsistensi vs demo `suriota`.

### Opportunities
- **Land-and-expand**: 1 meter → full-site sub-metering → multi-site.
- Upside **carbon / REC / ESG / CBAM** dari data terverifikasi.
- Pilot berbayar → **case study + PO/invoice redacted** = collateral pitch DAN sales enterprise.
- Cooling-as-a-Service sebagai model yang sedang tumbuh.

### Threats
- Ketergantungan & **konsentrasi 1 partner** (Enovatek bisa ganti arah).
- Vendor metering / HVAC-IoT lain masuk.
- Kompleksitas regulasi billing.
- Persepsi konsistensi: demo `suriota` vs produksi stablecoin.

---

## 3. Peta Kompetitor

| Pemain | Apa yang mereka lakukan | Gap vs WattSettle |
|---|---|---|
| **WeatherXM** | DePIN cuaca (hardware + data) | Punya hardware, tapi **bukan** settlement + AI-reasoning untuk billing energi |
| **Arkreen** | DePIN energi terbarukan, agregasi REC | Software/agregator; tanpa hardware industrial owned + AI reasoning + pasar Indonesia |
| **Powerledger** | Trading energi P2P (mapan) | Bukan attestation AI-verified; bukan industrial Indonesia; bukan BNB-native |
| **GenLayer / UMA / Kleros** | Oracle verifikasi optimistic / AI (umum) | General-purpose; tak menyentuh **last-mile trust energi fisik** + owned device |
| **AgentKarma** | Reputasi agent di ERC-8004 | Reputasi agent, bukan settlement energi fisik |
| **zkPull / OwnaFarm** | *Pattern-setter* (juara Mantle / RWA) | **Bukan kompetitor**: referensi selera juri; WattSettle 1 level di atas (hardware + revenue nyata) |

**Kompetitor langsung di celah spesifik ini: praktis tidak ada.** WattSettle jatuh di gap *"terlalu enterprise buat kerumunan crypto, terlalu crypto buat pemain energi lama"*. Butuh **5 hal langka sekaligus** dalam satu builder:
1. Hardware nyata (builder crypto software-only cuma simulasi).
2. Domain energi / OT industrial (Modbus/MQTT).
3. Penyelesaian last-mile trust (butuh device + fisika nyata).
4. Customer & distribusi (siapa yang pasang meter).
5. Timing regulasi (CBAM & OJK live Jan 2026).

---

## 4. Verdict Posisi

- **Opsi 5** = amunisi **visi** (TAM besar, future-proof), kuat di slide, lemah kalau demo sendirian.
- **Opsi 6** = amunisi **bukti** (konkret, deterministik), kuat di panggung, sempit kalau jadi visi tunggal.
- **Gabungan = paling kuat**: demo Opsi 6, ceritakan Opsi 5. Moat gabungan inilah yang tak tertiru kompetitor. Pola OwnaFarm (1 kasus konkret + visi besar), tapi 1 level di atas.

## 5. ⚠️ Dua hal yang WAJIB ditutup agar SWOT ini valid
1. **Validasi densitas track** akhir September (kontak Dev Web3 Jogja/Coinvestasi) → pilih Finance vs AI Agents by data, siapkan dua framing.
2. **Riset dalam spec PM20H20Q + model take-rate Enovatek** → angka Opsi 6 tidak mengada-ada.

---
*Versi interaktif ada di situs: halaman `/swot` (toggle Opsi 5 / Opsi 6 / Kompetitor).*
