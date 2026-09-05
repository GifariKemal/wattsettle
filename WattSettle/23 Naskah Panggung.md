<div align="center">

![Bab](https://img.shields.io/badge/BAB-23%20Naskah%20Panggung-06b6d4?style=for-the-badge)
&nbsp;
![WattSettle](https://img.shields.io/badge/WattSettle-Build%20Bible-22c55e?style=for-the-badge)
&nbsp;
![Durasi](https://img.shields.io/badge/target-3%3A00%20tepat-f0b90b?style=for-the-badge)

# 🎤 Naskah Panggung

### Kata per kata, terhitung waktunya, lengkap dengan arahan layar dan cabang darurat

</div>

**Navigasi:** [Hub](README.md) · [Sebelumnya: 22 Decision Log](<22 Decision Log.md>)

---

## 💡 Kenapa Bab Ini Ada

[15 Demo dan Pitch](<15 Demo dan Pitch.md>) memberi **kerangka**: tujuh beat, arc tiga menit,
memorable line, runbook determinisme. Bab ini memberi **naskahnya**: kalimat persis yang
diucapkan, di detik keberapa, sambil tangan melakukan apa.

Perbedaannya penting. Kerangka bisa dibaca sambil mengangguk lalu tetap membuat orang tergagap
di panggung, sebab menyusun kalimat sambil gugup adalah pekerjaan yang sama sekali berbeda dari
menyusun kalimat sambil duduk tenang. Naskah menghapus pekerjaan itu.

> [!IMPORTANT]
> Kalimat yang diucapkan ditulis dalam bahasa Inggris, mengikuti seluruh kutipan di Bab 15.
> Panel juri melibatkan BNB Chain dan Binance Academy, dan istilah teknisnya memang hidup dalam
> bahasa Inggris. Arahan panggung tetap bahasa Indonesia karena itu untuk Anda sendiri.

> [!TIP]
> Naskah ini sengaja lapang. Rata-ratanya 111 kata per menit, jauh di bawah tempo bicara normal
> sekitar 150, sebab sebagian besar waktu panggung dipakai menonton layar bekerja, bukan
> berbicara di atasnya. Ruang itu bukan kelonggaran yang bisa diisi, ia bagian dari naskah.
> Satu-satunya beat yang padat adalah Beat 5, dan itu memang disengaja.

---

## ✅ Pre-flight, sebelum layar dibagikan

Kerjakan semuanya SEBELUM tombol share screen ditekan. Tidak satu pun boleh terlihat juri.

- [ ] `bash proofofwatt/scripts/night-before.sh` lolos semua assert
- [ ] Tab 1 terminal, sudah di direktori `proofofwatt`, layar bersih, font diperbesar
- [ ] Tab 2 BscScan, halaman kontrak sudah terbuka, tab Events sudah ter-expand
- [ ] Tab 3 BscScan, transaksi verifier berbohong sudah terbuka dan ter-decode, sebagai cadangan
- [ ] Video fallback siap, satu keystroke menuju full-screen
- [ ] Dompet sudah tersambung. **Jangan pernah** menunjukkan layar connect wallet
- [ ] Notifikasi mati, mode jangan ganggu menyala
- [ ] **Tutup aplikasi berat lain lebih dulu.** Foundry berjalan di WSL, dan WSL menolak start
      sama sekali kalau RAM bebas menipis. Pesannya `Not enough memory resources`, bukan pesan
      yang menyerupai masalah demo, jadi mudah salah didiagnosis saat panik. Pemulihannya
      `wsl --shutdown` lalu jalankan lagi
- [ ] Sekali jalankan `bash proofofwatt/scripts/demo.sh` sebagai gladi bersih, lalu biarkan
      transaksinya sebagai cadangan Tab 3

> [!CAUTION]
> Aturan mentor Sesi 9: jangan tunjukkan login atau sign-up. Waktu panggung dipakai untuk satu
> putaran approve dan satu penolakan, bukan untuk memilih dompet.

---

## 🎬 Naskah

### Beat 1 · 0:00 sampai 0:15 · Moat dulu, cold open

**Layar:** klip 12 detik SRT-MGATE-1210 terpasang di dinding pabrik pelanggan, lalu PO yang
sudah diredaksi. Tanpa slide judul. Tanpa perkenalan diri.

> "This is not a demo device.
>
> This machine bills a real Indonesian customer today.
>
> In the next ninety seconds, it gets paid by an AI. No human touches the button."

*30 kata dalam 15 detik, 120 kata per menit. Jeda satu ketukan penuh setelah "demo device". Biarkan klipnya bekerja.*

---

### Beat 2 · 0:15 sampai 0:40 · Masalah, dalam kosakata mereka

**Layar:** satu baris teks. Jangan diagram.

> "A smart contract cannot trust a sensor.
>
> Every energy payment on chain today ends at one self-reported number, from the party who
> profits when that number is large.
>
> That is the oracle problem for physical work, and it is still unsolved. Call it proof of
> physical work."

*47 kata dalam 25 detik, 113 kata per menit. Frasa **proof of physical work** ditanam di sini dan dipanen di penutup.*

---

### Beat 3 · 0:40 sampai 1:30 · Loop deterministik

**Layar:** Tab 1. Jalankan agent. Biarkan lognya bergulir. Tangan menjauh dari keyboard.

> "The meter signs its reading at the source. EIP-712, on the device.
>
> Now I start nothing. This agent wakes on its own schedule, reads the chain, and recomputes the
> number itself."

*[Tunggu log recompute muncul. Jangan menarasi angkanya, tunjuk saja.]*

> "It writes its reasoning on chain, not a boolean. Delta against baseline. Anomaly score. The
> hash of the ruleset it used, which you can compute yourself from my repo.
>
> And it settles."

*[Pindah ke Tab 2. Transaksi confirmed, event ter-decode.]*

> "Producer paid. Protocol fee taken. One transaction, no human in the loop."

*75 kata dalam 50 detik, 90 kata per menit. Ini beat paling lapang dan paling banyak diam, sebab layarlah yang bekerja. Tahan diri untuk tidak mengisi jeda.*

---

### Beat 4 · 1:30 sampai 1:45 · Tunjukkan penolakan

**Layar:** bacaan kedua yang anomali. Agent jalan lagi.

> "Second reading. Four thousand two hundred kilowatt-hours from a meter that averages one
> hundred.
>
> Same agent. Same code path. Rejected on chain. Zero tokens moved.
>
> It evaluates. It does not rubber-stamp."

*31 kata dalam 15 detik, 124 kata per menit.*

---

### Beat 5 · 1:45 sampai 2:05 · Puncak, verifier yang berbohong

**Layar:** Tab 2, event `ReadingAttested` dari transaksi ketiga, ter-decode.

> "Now watch me cheat my own AI.
>
> Third reading, nine hundred kilowatt-hours against a baseline of one hundred. And this time I
> made the verifier lie. It reported zero deviation. Zero anomaly.
>
> Look at the same event. The contract computed it itself: eight hundred, ten thousand basis
> points. And it refused.
>
> A lying verifier holds a veto. Never an approval."

*60 kata dalam 20 detik, 180 kata per menit. Ini beat terpadat di seluruh naskah. Ucapkan "I made the verifier lie" pelan-pelan, dan ambil waktunya dari Beat 3 kalau perlu. Ini kalimat yang akan mereka ingat.*

---

### Beat 6 · 2:05 sampai 2:10 · Diam

**Layar:** tetap di transaksi yang menolak, kedua penilaian berdampingan.

> *[Tidak ada kata. Dua sampai tiga detik. Jangan menarasi di atasnya. Jangan mengisi dengan
> "jadi", "nah", atau "seperti yang Anda lihat". Diam adalah bagian dari naskah.]*

---

### Beat 7 · 2:10 sampai 2:35 · Kecocokan dengan BNB

**Layar:** halaman Identity Registry ERC-8004, agentId 2116.

> "Real kilowatt-hours are RWA. An autonomous verifier settling machine to machine is agentic
> finance.
>
> And my verifier is not a mirror of your standard. It is a registered agent in BNB's live
> ERC-8004 Identity Registry. Agent ID two one one six.
>
> This is zkPull for physical energy."

*47 kata dalam 25 detik, 113 kata per menit. **Ini satu-satunya beat yang boleh dipotong** kalau waktu mepet.*

---

### Beat 8 · 2:35 sampai 3:00 · Tutup di atas moat

**Layar:** kembali ke klip lapangan dari Beat 1, dibekukan.

> "A student can fork a chatbot in a weekend.
>
> Nobody can fork a licensed Indonesian energy company's field meters.
>
> Contract deployed. Source verified. Commits public. Transactions live. Check them yourself.
>
> Proof of physical work. Real kilowatt-hours, machine to machine, no human in the loop."

*44 kata dalam 25 detik, 106 kata per menit. Setelah kalimat terakhir, **BERHENTI**. Jangan menambah "terima kasih", jangan
menawarkan pertanyaan. Diam sampai juri bicara duluan.*

---

## 📊 Anggaran Kata

Dihitung dari naskah di atas, bukan diperkirakan.

| Beat | Durasi | Kata | Tempo |
|:--|:--:|--:|:--:|
| 1 Cold open | 15 dtk | 30 | 120 kpm |
| 2 Masalah | 25 dtk | 47 | 113 kpm |
| 3 Loop | 50 dtk | 75 | 90 kpm |
| 4 Penolakan | 15 dtk | 31 | 124 kpm |
| 5 Verifier bohong | 20 dtk | 60 | **180 kpm** |
| 6 Diam | 5 dtk | 0 | - |
| 7 BNB fit | 25 dtk | 47 | 113 kpm |
| 8 Penutup | 25 dtk | 44 | 106 kpm |
| **Total** | **3:00** | **334** | **111 kpm** |

> [!WARNING]
> Beat 5 tercatat 180 kata per menit, dua kali lipat tempo Beat 3 dan jauh di atas rata-rata
> naskah. Padahal justru beat itulah yang paling tidak boleh terburu-buru. Kalau saat latihan
> terasa sempit, ambil lima detik dari Beat 3 yang memang lapang, dan pindahkan ke Beat 5.
> Jangan memotong kalimatnya.

---

## 🔀 Cabang Darurat

| Yang terjadi | Yang dilakukan |
|:--|:--|
| Transaksi tidak confirmed dalam 10 detik | Lanjut bicara, pindah ke Tab 3 yang sudah berisi transaksi confirmed dari run sebelumnya. Jangan mengumumkan bahwa ada masalah |
| RPC error atau agent gagal | Potong ke video fallback **di tengah kalimat**, tanpa minta maaf, tanpa mengumumkan demo gagal |
| Waktu tinggal 30 detik di Beat 5 | Buang Beat 7 seluruhnya, langsung ke Beat 8. Jangan pernah membuang Beat 5 atau diamnya |
| Juri memotong dengan pertanyaan di tengah | Jawab dalam satu kalimat, lalu "I will show you that in ten seconds" dan kembali ke naskah |
| Bacaan revert `StaleTimestamp` | Fixture sudah terpakai. Jangan bereksperimen di panggung, langsung potong ke video |

---

## 💬 Kartu Q and A

Jawaban di bawah 20 detik, langsung ke bukti. Versi lengkap ada di
[15 Demo dan Pitch](<15 Demo dan Pitch.md>).

| Pertanyaan | Kalimat pembuka |
|:--|:--|
| "Is the AI really autonomous?" | "The deployer renounced the verifier role in the deploy transaction. Only the agent can settle. One `hasRole` call proves it." |
| "What if your AI lies?" | "It cannot force a payment. It holds a veto, not an approval. Here is the transaction where I made it lie, and the contract refused." |
| "What stops the device faking a reading?" | "Four layers. EIP-712 signature, monotonic guard, replay guard, and independent recomputation by the contract itself." |
| "Why BNB?" | "RWA and agentic finance are your own pillars, and your ERC-8004 registry is live on testnet 97. My agent is registered in it." |
| "Is this just testnet?" | "Yes, and the hardware is not. The meters bill a paying customer today. The chain is the only part that is a testnet." |

---

## 🎯 Tiga Hal yang Menentukan

Kalau seluruh bab ini terlupa di panggung, tiga hal ini yang tetap harus terjadi.

1. **Klip lapangan di Beat 1.** Moat hardware adalah satu-satunya aset yang tidak bisa ditiru
   peserta lain dalam satu akhir pekan.
2. **Beat 5 beserta diamnya.** Hanya beat itu yang membuktikan sistem tetap benar walaupun
   bagian AI-nya sendiri berkhianat. Ini pembeda terbesar entri ini.
3. **Berhenti di detik 3:00.** Pitch yang melewati batas waktu kehilangan kredibilitas yang
   susah payah dibangun tiga menit sebelumnya.

---

<div align="center">
<sub>Copyright 2026 PT Surya Inovasi Prioritas (SURIOTA) · <a href="README.md">Hub WattSettle</a> · Update 5 September 2026</sub>
</div>
