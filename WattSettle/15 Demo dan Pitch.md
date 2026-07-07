<div align="center">

![Bab](https://img.shields.io/badge/BAB-15%20Demo%20dan%20Pitch-06b6d4?style=for-the-badge)
&nbsp;
![WattSettle](https://img.shields.io/badge/WattSettle-Build%20Bible-22c55e?style=for-the-badge)
&nbsp;
![Durasi](https://img.shields.io/badge/pitch-3%3A00%20peak--end-a855f7?style=for-the-badge)

# 🎤 Demo dan Pitch

### Tiga menit yang dibuka dengan moat dan ditutup dengan moat, dengan loop deterministik di tengah

</div>

**Navigasi:** [Hub](README.md) · [Sebelumnya: 14 Bisnis dan GTM](<14 Bisnis dan GTM.md>) · [Berikutnya: 16 Risiko dan Kill-shots](<16 Risiko dan Kill-shots.md>)

---

## 💡 Intisari Bab

Demo Day pada 31 Oktober 2026 berlangsung live dan online. Determinism adalah win condition, sebab loop yang jalan flawless mengalahkan narasi apapun. Bab ini memuat empat hal. Pertama, pitch arc tiga menit sebagai tabel beat yang dibuka dengan moat dan ditutup dengan moat. Kedua, memorable line yang wajib diucapkan. Ketiga, runbook determinism agar tidak ada satu bagian pun yang bergantung pada keberuntungan panggung. Keempat, tiga killer Q and A dan bagian know your judges agar tiap kalimat menyasar orang yang tepat.

> ⚠️ Baca [16 Risiko dan Kill-shots](<16 Risiko dan Kill-shots.md>) berdampingan dengan bab ini. Runbook di sini adalah pelaksanaan dari fix kill-shot di sana.

---

## 🎬 Pitch Arc Tiga Menit

Arc dirancang peak-end. Pembukaan dan penutupan sama-sama berdiri di atas moat hardware, karena itulah aset yang tidak bisa ditiru siapapun. Loop deterministik ada di tengah, dan penolakan sengaja ditunjukkan agar AI terlihat benar-benar memutuskan.

| Waktu | Beat | Isi |
|:--|:--|:--|
| 0:00 sampai 0:15 | 🏭 **Moat first, cold open** | Klip 12 detik SRT-MGATE-1210 di dinding pabrik customer plus PO ter-redaksi. "This is not a demo device. This machine bills a real Indonesian customer today. In the next 90 seconds it gets paid by an AI, no human touches the button." |
| 0:15 sampai 0:40 | 🧩 **Problem dalam vocab mereka** | "A smart contract cannot trust a sensor. The oracle problem for physical work is unsolved." Tanam frasa **proof of physical work**. |
| 0:40 sampai 1:30 | 🔁 **Deterministic peak loop** | Trigger reading yang pre-seeded, Hermes agent bangun sendiri lewat cron tanpa klik, recompute, memasang attestation, `attestAndSettle` auto-pay, lalu menulis `validationResponse` ke registry ERC-8004 yang live, tx confirmed live di BscScan dengan event decoded. |
| 1:30 sampai 1:50 | 🚫 **Show a rejection** | Reading kedua yang sengaja anomalous, agent menolak on-chain, tanpa payout. "It evaluates, it does not rubber-stamp." |
| 1:50 sampai 2:10 | ✨ **Peak plus silence** | Diam 2 sampai 3 detik di tx confirmed dengan attestation decoded. Jangan menarasi di atasnya. |
| 2:10 sampai 2:35 | 🟡 **BNB fit plus ERC-8004 live** | "Real kWh is RWA. An autonomous verifier settling machine-to-machine is Agentic Finance. My device is the first physical-DePIN agent writing to BNB's live ERC-8004 registry. It is zkPull for physical energy." |
| 2:35 sampai 3:00 | 🏆 **Close on moat** | "A student can fork a chatbot in a weekend. Nobody can fork a licensed Indonesian energy company's field meters. Contract verified, commits public, txs live, check them yourself." STOP. |

> 💡 Satu-satunya bagian yang boleh dipotong bila waktu mepet adalah paragraf keyword BNB di 2:10 sampai 2:35. Jangan pernah memotong field clip di pembukaan atau silence di 1:50.

---

## 🗣️ Memorable Line

Line utama diucapkan pada penutupan, dan disiapkan pula line cadangan untuk merespons juri teknis.

> **Utama:** "zkPull for physical energy, a real Indonesian company, settling real kilowatt-hours, machine to machine, no human in the loop."

> **Cadangan untuk juri teknis:** "That is not a boolean approve, that is the AI's rationale, on-chain, forever."

Frasa **zkPull for physical energy** wajib muncul, karena juri sudah pribadi menang dengan pola zkPull dan akan mengenalinya seketika.

---

## 🧪 Runbook Determinism

Determinism adalah kondisi menang. Tujuh disiplin berikut memastikan autonomy tetap nyata, cron benar-benar zero-click, sementara input dipatok agar tidak ada revert di panggung.

| # | Disiplin | Isi |
|:--:|:--|:--|
| 1 | 🌱 **Pre-seed everything** | Tidak ada device, sensor, atau RPC-read live di critical path. Autonomy tetap nyata lewat cron zero-click, tetapi input dipatok. Rehearse rantai wall-clock cron sampai attest sampai settle sampai confirm sebanyak 20 kali. |
| 2 | 🎞️ **Video fallback** | Rekam demo flawless sebelum hari-H, full-screen satu keystroke. Bila live tersendat, potong ke video di tengah kalimat tanpa minta maaf. |
| 3 | 📌 **Pin confirmed tx** | Tab kedua berisi tx BscScan dari run sukses sebelumnya, event decoded sudah expanded. Jangan pernah menunggu indexer live di panggung. |
| 4 | 🪟 **Two-tab discipline** | Tab pertama untuk log dan trigger agent. Tab kedua BscScan pre-loaded. Tidak ada tab-hunting saat bicara. |
| 5 | ⏱️ **Time-box 3:00** | Loop sekitar 40 detik. Satu-satunya cut adalah paragraf keyword BNB. Jangan pernah memotong field clip atau silence. |
| 6 | 🔀 **MockUSD escape hatch** | Swap ke MockUSD dengan presisi 6 desimal adalah perubahan satu baris. Putuskan pagi hari-H, panel yang skew regulator memilih stablecoin, panel yang skew crypto-builder memilih `suriota` demi nol risiko token baru. |
| 7 | 🧯 **Fresh reading fixtures** | `submitReading` memakai monotonic guard dan replay guard, sehingga re-run akan REVERT. Pakai tuple deviceId, nonce, timestamp yang fresh, siapkan tiga fixture distinct-timestamp berantre agar tidak terkena replay-guard revert. |

> ⚠️ Kunci state malam sebelumnya sebagai kode. Pastikan contract masih verified, wallet agent punya testnet BNB minimal 10 kali gas satu tx, saldo `suriota` di kontrak lebih besar dari payout, dan reading id demo belum terpakai.

---

## ❓ Tiga Killer Q and A

Setiap jawaban dirancang di bawah 20 detik, langsung ke bukti, tanpa berputar.

| Pertanyaan | Jawaban ringkas |
|:--|:--|
| 🤖 "Apakah AI benar-benar otonom?" | Tunjukkan cron plus attestation event, tawarkan menunjuk config dan menjalankan satu reading unseeded live. Autonomy adalah properti sistem, bukan klaim slide. |
| 🔐 "Apa yang mencegah device memalsukan reading?" | Signature EIP-712 plus monotonic dan replay guard plus reputation counter plus re-execution independen oleh verifier. Empat lapisan, bukan satu. |
| 🟡 "Kenapa BNB?" | Pilar RWA dan Agentic Finance, ditambah scenario M2M-energy x402 yang literally dipublikasikan BNB, ditambah registry ERC-8004 yang live di testnet 97. |

---

## 👥 Know Your Judges

Mentor kemungkinan besar merangkap juri, dan mereka elite. Setiap kalimat pitch harus tahu siapa yang mendengarkan.

| Orang | Latar | Cara pitch menyasar |
|:--|:--|:--|
| **Yeheskiel Yunus Tame** | Co-founder OwnaFarm, juara RWA invoice financing di Mantle, mentor Sesi 1 sampai 4 | Punya taste kuat untuk RWA dan real-world settlement. Frame WattSettle sebagai perusahaan energi nyata yang men-settle kWh nyata, dead-center selera dia. |
| **Oktavianus Bima Jadiva** | Pencipta zkPull, real-world event terverifikasi lalu contract auto-release | Kerangka zkPull identik dengan WattSettle. Ucapkan zkPull for physical energy, dia akan mengenali polanya seketika. |
| **Mentor lain** | Kemungkinan besar ikut menilai | Perlakukan semua mentor sebagai juri. Konsistenkan pesan moat hardware plus revenue nyata di setiap sesi. |

> 💡 OwnaFarm menang dengan satu kasus konkret plus visi besar. WattSettle meniru pola itu satu tingkat di atasnya, karena punya hardware dan revenue nyata sementara mereka software.

---

<div align="center">
<sub>© 2026 PT Surya Inovasi Prioritas (SURIOTA) · <a href="README.md">Hub WattSettle</a> · Update 7 Juli 2026</sub>
</div>
