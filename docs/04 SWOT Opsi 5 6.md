<div align="center">

<svg width="100%" height="12" viewBox="0 0 1200 12" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="accent">
  <defs><linearGradient id="swbar" x1="0" y1="0" x2="1" y2="0">
    <stop offset="0" stop-color="#22c55e"/><stop offset="0.33" stop-color="#eab308"/><stop offset="0.66" stop-color="#06b6d4"/><stop offset="1" stop-color="#ef4444"/>
    <animate attributeName="x1" values="0;0.4;0" dur="7s" repeatCount="indefinite"/>
  </linearGradient></defs>
  <rect width="1200" height="12" rx="6" fill="url(#swbar)"/>
</svg>

# 🧠 SWOT dan Peta Kompetitor

### Opsi 5 (WattSettle) dan Opsi 6 (Enovatek / PM20H20Q)

**Track:** Finance & Commerce · Dasar: [`01 Master Strategi.md`](<01 Master Strategi.md>) dan [`02 Opsi 5 WattSettle.md`](<02 Opsi 5 WattSettle.md>)

</div>

> 🧭 Opsi 5 = rel platform (horizontal). Opsi 6 = rel itu di produk nyata (vertikal). Satu proyek, satu track. Opsi 5 = visi (slide), Opsi 6 = mesin demo (panggung).

---

## 1. ⚡ SWOT Opsi 5, WattSettle

<table>
<tr>
<td width="50%" valign="top">

**💪 Strengths**
- Rel horizontal, TAM besar (8 skenario).
- Attestation AI legible on-chain (kWh delta, anomaly score, model dan ruleset hash), bukan sekadar boolean.
- Basis kontrak jadi dan teruji (`ProofOfWatt.sol`, 6 test PASS) plus token `suriota` verified.
- Fee split take rate on-chain = payment rail dengan revenue model.
- Memukul 3 pilar BNB 2026 (RWA, Agentic Finance, settlement).
- Moat 5 lapis (lihat bagian 3).

</td>
<td width="50%" valign="top">

**⚠️ Weaknesses**
- Abstrak, pembeli bukti perlu dijelaskan.
- Rel 2 fungsi bisa terlihat tipis vs builder DeFi.
- Demo kurang konkret bila berdiri sendiri.
- Bergantung AI verifier off-chain, harus terbukti otonom.
- Rawan over-scoping (godaan staking, ZK, subgraph, mainnet).

</td>
</tr>
<tr>
<td width="50%" valign="top">

**🚀 Opportunities**
- Track arbitrage: Finance diprediksi lebih sepi dari AI Agents.
- Tailwind regulasi CBAM dan OJK live Jan 2026.
- Ekosistem RWA BNB plus warm intro Dev Web3 Jogja.
- White label rel ke operator energy DePIN SEA lain.
- Trajektori 60 sampai 80 juta smart meter PLN.

</td>
<td width="50%" valign="top">

**🔥 Threats**
- Finance bisa justru padat dengan clone oracle atau settlement.
- Framing "mirror of ERC-8004" = fatal di depan juri BNB.
- Prior art energi: WeatherXM, Arkreen, Powerledger.
- Juri bisa probe edge case (solvency pool, akuntansi carbon).

</td>
</tr>
</table>

---

## 2. 🌬️ SWOT Opsi 6, Enovatek / PM20H20Q

<table>
<tr>
<td width="50%" valign="top">

**💪 Strengths**
- Konkret: perusahaan plus produk plus revenue nyata.
- Pembayar jelas (penyewa AC).
- Demo deterministik dan meyakinkan.
- After sales sudah ada (model rental jalan).
- Revenue recurring (billing per kWh).

</td>
<td width="50%" valign="top">

**⚠️ Weaknesses**
- Fokus 1 vertikal (HVAC), TAM lebih sempit.
- Bergantung partnership Enovatek (di luar kendali penuh).
- Spec PM20H20Q dan angka take rate belum diriset dalam.
- Konsentrasi 1 customer atau partner.
- Billing nyata perlu stablecoin (potensi tanya konsistensi vs demo `suriota`).

</td>
</tr>
<tr>
<td width="50%" valign="top">

**🚀 Opportunities**
- Land and expand: 1 meter, full site, multi site.
- Upside carbon, REC, ESG, CBAM dari data terverifikasi.
- Pilot berbayar jadi case study plus collateral pitch.
- Cooling as a Service sebagai model yang tumbuh.

</td>
<td width="50%" valign="top">

**🔥 Threats**
- Ketergantungan dan konsentrasi 1 partner.
- Vendor metering atau HVAC IoT lain masuk.
- Kompleksitas regulasi billing.
- Persepsi konsistensi demo `suriota` vs produksi stablecoin.

</td>
</tr>
</table>

---

## 3. 🥊 Peta Kompetitor

| Pemain | Apa yang mereka lakukan | Gap vs WattSettle |
|:--|:--|:--|
| **WeatherXM** | DePIN cuaca (hardware + data) | punya hardware, tetapi bukan settlement + AI reasoning untuk billing energi |
| **Arkreen** | DePIN energi terbarukan, agregasi REC | software agregator, tanpa hardware industrial owned + AI reasoning + pasar Indonesia |
| **Powerledger** | Trading energi P2P (mapan) | bukan attestation AI verified, bukan industrial Indonesia, bukan BNB native |
| **GenLayer, UMA, Kleros** | Oracle verifikasi optimistic atau AI | general purpose, tak menyentuh last mile trust energi fisik + owned device |
| **AgentKarma** | Reputasi agent di ERC-8004 | reputasi agent, bukan settlement energi fisik |
| **zkPull, OwnaFarm** | Pattern setter (juara) | 🟢 **bukan kompetitor**, referensi selera juri. WattSettle satu level di atas (hardware + revenue nyata) |

> 🎯 **Kompetitor langsung di celah spesifik ini praktis tidak ada.** WattSettle jatuh di gap *"terlalu enterprise buat kerumunan crypto, terlalu crypto buat pemain energi lama"*.

**Moat butuh 5 hal langka sekaligus dalam satu builder:**

```
1. 🔧 Hardware nyata          builder crypto software only cuma simulasi
2. 🏭 Domain energi / OT       Modbus, MQTT, industrial
3. 🤝 Last mile trust          butuh device + fisika nyata
4. 📦 Customer & distribusi    siapa yang pasang meter
5. 📜 Timing regulasi          CBAM & OJK live Jan 2026
```

---

## 4. ⚖️ Verdict Posisi

| Opsi | Peran | Kuat di | Lemah bila |
|:--|:--|:--|:--|
| 5 WattSettle | amunisi visi | slide (TAM, future proof) | demo sendirian |
| 6 Enovatek | amunisi bukti | panggung (konkret, deterministik) | jadi visi tunggal |
| **Gabungan** | **entri juara** | **demo Opsi 6, ceritakan Opsi 5** | tidak ada, ini paling kuat |

## 5. 🚧 Dua Hal Wajib agar SWOT Ini Valid

1. **Validasi densitas track** akhir September (kontak Dev Web3 Jogja atau Coinvestasi), pilih Finance vs AI Agents by data, siapkan dua framing.
2. **Riset dalam spec PM20H20Q dan model take rate Enovatek**, supaya angka Opsi 6 tidak mengada ada.

---

<div align="center">
<sub>Versi interaktif ada di website: halaman <code>/swot</code> · Kembali ke <a href="../README.md">hub</a> · <a href="README.md">docs</a> · Update 7 Juli 2026</sub>
</div>
