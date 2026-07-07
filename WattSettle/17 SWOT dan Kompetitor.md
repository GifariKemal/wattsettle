<div align="center">

![Bab](https://img.shields.io/badge/BAB-17%20SWOT%20dan%20Kompetitor-a855f7?style=for-the-badge)
&nbsp;
![WattSettle](https://img.shields.io/badge/WattSettle-Build%20Bible-22c55e?style=for-the-badge)
&nbsp;
![Posisi](https://img.shields.io/badge/celah-industrial%20B2B-06b6d4?style=for-the-badge)

# 📊 SWOT dan Kompetitor

### Di mana WattSettle berdiri, siapa lawannya, dan kenapa PiggyCell justru memvalidasi tesis

</div>

**Navigasi:** [Hub](README.md) · [Sebelumnya: 16 Risiko dan Kill-shots](<16 Risiko dan Kill-shots.md>) · [Berikutnya: 18 Roadmap Pasca-Hackathon](<18 Roadmap Pasca-Hackathon.md>)

---

## 💡 Mental Model Posisi

WattSettle punya dua wajah. Opsi 5 adalah rel platform yang horizontal, ceritanya besar dan mengisi slide. Opsi 6 adalah rel itu diterapkan di produk nyata Enovatek dan meter PM20H20Q, ceritanya konkret dan mengisi panggung. Satu proyek, satu track. Panggung menampilkan satu keran sempurna, slide menceritakan pipa ke semua pasar. Bab ini memetakan kekuatan dan kelemahan kedua wajah itu, lalu menempatkannya di peta kompetitor.

---

## ⚡ SWOT Opsi 5, WattSettle (rel horizontal)

<table>
<tr>
<td width="50%" valign="top">

**💪 Strengths**
- Rel horizontal dengan TAM besar, delapan skenario dari solar sampai HVAC.
- Attestation AI legible on-chain (kWh delta, anomaly score, model dan ruleset hash), bukan sekadar boolean.
- Basis kontrak sudah jadi dan teruji (`ProofOfWatt.sol`, 6 test PASS) plus token `suriota` verified.
- Fee split take-rate on-chain, jadi payment rail dengan revenue model.
- Memukul tiga pilar BNB 2026 sekaligus, yaitu RWA, Agentic Finance, dan settlement.
- Moat lima lapis yang langka dimiliki satu builder.

</td>
<td width="50%" valign="top">

**⚠️ Weaknesses**
- Abstrak, pembeli bukti perlu dijelaskan dulu.
- Rel dua fungsi bisa terlihat tipis di mata builder DeFi.
- Demo kurang konkret bila berdiri sendiri.
- Bergantung AI verifier off-chain yang harus terbukti otonom.
- Rawan over-scoping, godaan staking, ZK, subgraph, dan mainnet.

</td>
</tr>
<tr>
<td width="50%" valign="top">

**🚀 Opportunities**
- Track arbitrage, Finance diprediksi lebih sepi dari AI Agents.
- Tailwind regulasi CBAM dan OJK yang live Januari 2026.
- Ekosistem RWA BNB plus warm intro Dev Web3 Jogja.
- White label rel ke operator energy DePIN SEA lain.
- Trajektori 60 sampai 80 juta smart meter PLN.

</td>
<td width="50%" valign="top">

**🔥 Threats**
- Finance bisa justru padat dengan clone oracle atau settlement.
- Framing "mirror of ERC-8004" fatal di depan juri BNB.
- Prior art energi, yaitu WeatherXM, Arkreen, Powerledger.
- Juri bisa probe edge case seperti solvency pool atau akuntansi carbon.

</td>
</tr>
</table>

---

## 🌬️ SWOT Opsi 6, Enovatek / PM20H20Q (rel di produk nyata)

<table>
<tr>
<td width="50%" valign="top">

**💪 Strengths**
- Konkret, ada perusahaan plus produk plus revenue nyata.
- Pembayar jelas, yaitu penyewa AC.
- Demo deterministik dan meyakinkan.
- After sales sudah ada karena model rental berjalan.
- Revenue recurring dari billing per kWh.

</td>
<td width="50%" valign="top">

**⚠️ Weaknesses**
- Fokus satu vertikal HVAC, TAM lebih sempit.
- Bergantung partnership Enovatek yang di luar kendali penuh.
- Spec PM20H20Q dan angka take-rate belum diriset dalam.
- Konsentrasi ke satu customer atau partner.
- Billing nyata perlu stablecoin, potensi tanya konsistensi versus demo `suriota`.

</td>
</tr>
<tr>
<td width="50%" valign="top">

**🚀 Opportunities**
- Land and expand, satu meter lalu full site lalu multi site.
- Upside carbon, REC, ESG, CBAM dari data terverifikasi.
- Pilot berbayar jadi case study plus collateral pitch.
- Cooling as a Service sebagai model yang tumbuh.

</td>
<td width="50%" valign="top">

**🔥 Threats**
- Ketergantungan dan konsentrasi satu partner.
- Vendor metering atau HVAC IoT lain masuk.
- Kompleksitas regulasi billing.
- Persepsi konsistensi demo `suriota` versus produksi stablecoin.

</td>
</tr>
</table>

---

## 🥊 Peta Kompetitor

| Pemain | Apa yang mereka lakukan | Gap versus WattSettle |
|:--|:--|:--|
| **WeatherXM** | DePIN cuaca, punya hardware plus data | Punya hardware, tetapi bukan settlement plus AI reasoning untuk billing energi |
| **Arkreen** | DePIN energi terbarukan, agregasi REC | Software agregator, tanpa hardware industrial owned plus AI reasoning plus pasar Indonesia |
| **Powerledger** | Trading energi P2P yang sudah mapan | Bukan attestation AI verified, bukan industrial Indonesia, bukan BNB native |
| **GenLayer, UMA, Kleros** | Oracle verifikasi optimistic atau AI | General purpose, tidak menyentuh last mile trust energi fisik plus owned device |
| **PiggyCell** | DePIN sewa power bank consumer di BNB, Binance-endorsed | Consumer power-bank loyalty, tanpa AI verifier otonom, event logging deterministik saja (lihat bagian khusus di bawah) |
| **zkPull, OwnaFarm** | Pattern setter, para juara | 🟢 **Bukan kompetitor**, ini referensi selera juri, detail di [19 Referensi](<19 Referensi.md>) |

> 🎯 Kompetitor langsung di celah spesifik ini praktis tidak ada. WattSettle jatuh di gap "terlalu enterprise buat kerumunan crypto, terlalu crypto buat pemain energi lama".

---

## 🐷 Fokus: PiggyCell, cermin terdekat yang justru memvalidasi tesis

PiggyCell adalah cermin strategis terdekat WattSettle di BNB Chain, dan penting dipahami dengan benar. PiggyCell adalah jaringan sewa power bank nomor satu di Korea Selatan dengan market share 95 sampai 98 persen, 14 ribu lebih stasiun, 100 ribu lebih device, 4 juta lebih user berbayar, dan revenue Web2 nyata sekitar 7,5 juta dolar. Mereka mentransformasi bisnis Web2 nyata jadi DePIN plus RWA, sudah di-endorse Binance sebagai Alpha project, didukung Animoca Brands, DWF Labs, dan bank Korea.

### Kenapa PiggyCell memvalidasi, bukan mengancam

Tesis persis WattSettle, yaitu **perusahaan infrastruktur fisik dengan hardware, user, dan revenue nyata yang memasang bisnisnya on-chain lewat DePIN plus RWA**, sudah dipertaruhkan Binance sendiri lewat PiggyCell. Artinya argumen moat "sudah punya hardware lebih baik daripada bangun dari nol" kini punya preseden yang di-endorse BNB.

> 💡 Pitch line yang lahir dari sini: "BNB sudah bertaruh pada model ini lewat PiggyCell untuk energi consumer, WattSettle memainkan play yang sama untuk energi industrial."

### Di mana WattSettle BEDA (anti-clone, wajib tajam)

| Dimensi | PiggyCell | WattSettle |
|:--|:--|:--|
| Segmen | Consumer power-bank | Industrial B2B |
| Verifikasi | Event logging plus rule deterministik, tanpa AI verifier | AI verifier otonom, rationale plus anomaly plus modelHash on-chain |
| Arah nilai | User DAPAT token (reward emission), loyalty dan play-to-earn | Produsen DIBAYAR atas energi terverifikasi (settlement kewajiban plus fee), payment rail |
| Insentif fraud | Rendah, reward pemakaian | Tinggi, uang di-settle atas reading, jadi AI verifier necessary bukan dekorasi |
| Positioning | DePIN plus RWA | DePIN plus RWA plus Agentic AI |

Empat perbedaan ini adalah garis anti-clone. WattSettle tidak boleh mencoba mengalahkan PiggyCell di ranah consumer, karena mereka lebih besar, lebih terdanai, dan sudah menang di segmen itu. WattSettle menang di segmen yang berbeda, di mana insentif kecurangan tinggi sehingga verifier AI otonom benar-benar dibutuhkan.

### Jawaban siap untuk juri: "bedanya dengan PiggyCell?"

> 🎤 "PiggyCell adalah DePIN power-bank consumer yang membagikan reward token ke user, event-nya di-log secara deterministik tanpa AI verifier. WattSettle adalah settlement rail industrial B2B, produsen energi DIBAYAR atas kWh yang diverifikasi seorang verifier AI otonom yang menulis rationale-nya on-chain. PiggyCell memvalidasi bahwa perusahaan infra fisik memang bisa jadi DePIN plus RWA di BNB. WattSettle memainkan play yang sama untuk energi industrial, di ranah di mana insentif memalsukan reading tinggi, jadi verifier AI-nya bukan hiasan melainkan syarat."

---

## 🧱 Moat: lima hal langka yang harus ada sekaligus

```
1. 🔧 Hardware nyata          builder crypto software-only cuma simulasi
2. 🏭 Domain energi / OT       Modbus, MQTT, industrial
3. 🤝 Last mile trust          butuh device plus fisika nyata
4. 📦 Customer & distribusi    siapa yang pasang meter
5. 📜 Timing regulasi          CBAM dan OJK live Januari 2026
```

Satu builder yang punya kelimanya sekaligus adalah anomali. Itulah moat WattSettle, dan itulah kenapa peta kompetitor di atas selalu punya satu kolom gap yang tidak bisa ditutup lawan dalam timeline hackathon.

---

## 📚 Catatan: zkPull dan OwnaFarm bukan kompetitor

zkPull dan OwnaFarm adalah para juara yang menetapkan pola dan selera juri, bukan lawan yang harus dikalahkan. zkPull adalah kerangka trustless auto-payout yang identik dengan pola ProofOfWatt, dari situ lahir tagline "zkPull for physical energy". OwnaFarm adalah invoice financing petani yang di-tokenisasi, dead-center taste juri Dev Web3 Jogja. Keduanya diperlakukan sebagai referensi amunisi pitch, dan dibahas lengkap di [19 Referensi](<19 Referensi.md>). Menyebut mereka sebagai kompetitor adalah kesalahan framing.

---

## ⚖️ Verdict Posisi

| Opsi | Peran | Kuat di | Lemah bila |
|:--|:--|:--|:--|
| 5 WattSettle | amunisi visi | slide (TAM, future proof) | demo sendirian |
| 6 Enovatek | amunisi bukti | panggung (konkret, deterministik) | jadi visi tunggal |
| **Gabungan** | **entri juara** | **demo Opsi 6, ceritakan Opsi 5** | tidak ada, ini paling kuat |

### Celah moat yang masih harus ditutup (lima hal)

1. **Validasi densitas track** di akhir September lewat kontak Dev Web3 Jogja atau Coinvestasi, pilih Finance versus AI Agents berdasarkan data, siapkan dua framing.
2. **Riset dalam spec PM20H20Q dan model take-rate Enovatek**, supaya angka Opsi 6 tidak mengada-ada.
3. **Tangkap satu signature hardware nyata** agar moat terhubung ke tx on-chain, bukan sekadar klaim atas video.
4. **Integrasi ERC-8004 live** agar posisi novelty tidak terbalik jadi dismissal di depan juri BNB.
5. **Fee split on-chain** agar rail punya substansi finance, bukan sekadar transfer.

---

<div align="center">
<sub>© 2026 PT Surya Inovasi Prioritas (SURIOTA) · <a href="README.md">Hub WattSettle</a> · Update 7 Juli 2026</sub>
</div>
