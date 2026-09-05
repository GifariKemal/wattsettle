<div align="center">

![Bab](https://img.shields.io/badge/BAB-15%20Demo%20dan%20Pitch-06b6d4?style=for-the-badge)
&nbsp;
![WattSettle](https://img.shields.io/badge/WattSettle-Build%20Bible-22c55e?style=for-the-badge)
&nbsp;
![Durasi](https://img.shields.io/badge/pitch-3%3A00%20peak--end-a855f7?style=for-the-badge)

# 🎤 Demo dan Pitch

### Tujuh beat untuk video submission, tiga menit peak-end untuk panggung, dan uji jujur di akhir

</div>

**Navigasi:** [Hub](README.md) · [Sebelumnya: 14 Bisnis dan GTM](<14 Bisnis dan GTM.md>) · [Berikutnya: 16 Risiko dan Kill-shots](<16 Risiko dan Kill-shots.md>)

---

## 💡 Intisari Bab

Demo Day pada 31 Oktober 2026 berlangsung live dan online. Determinism adalah win condition, sebab loop yang jalan flawless mengalahkan narasi apapun. Bab ini memuat enam hal. Pertama, kerangka tujuh beat dari Workshop Sesi 9 yang sudah diisi dengan kalimat WattSettle, dipakai untuk video submission dan sesi tanya jawab. Kedua, pitch arc tiga menit sebagai tabel beat yang dibuka dengan moat dan ditutup dengan moat, dipakai di panggung Demo Day. Ketiga, memorable line yang wajib diucapkan. Keempat, runbook determinism agar tidak ada satu bagian pun yang bergantung pada keberuntungan panggung. Kelima, tiga killer Q and A dan bagian know your judges agar tiap kalimat menyasar orang yang tepat. Keenam, uji jujur antara yang diklaim naskah dan yang benar-benar sudah ada.

> ⚠️ Baca [16 Risiko dan Kill-shots](<16 Risiko dan Kill-shots.md>) berdampingan dengan bab ini. Runbook di sini adalah pelaksanaan dari fix kill-shot di sana.

---

## 🧭 Kerangka Tujuh Beat (Workshop Sesi 9)

Mentor Sesi 9 memberi urutan wajib yang berlaku untuk semua peserta. Aturan pembukanya
keras: jangan mulai dengan fitur, dan jangan habiskan waktu demo di layar login. Tabel
di bawah mengisi tiap beat dengan kalimat WattSettle yang siap diucapkan. Arsip materi
aslinya ada di [Sesi 9 Pitching Project](<../docs/Workshop/Sesi 9 Pitching Project.md>).

Kerangka ini adalah **daftar periksa isi**, bukan urutan panggung. Tujuh pertanyaan di
bawah semuanya harus terjawab, di video submission maupun di sesi tanya jawab. Urutan
pengucapannya di panggung tetap memakai pitch arc peak-end di seksi berikutnya, karena
panggung menuntut moat lebih dulu.

Hanya ada **satu video** yang direkam, berdurasi sekitar tiga menit mengikuti pitch arc,
dan video itu dipakai untuk dua keperluan sekaligus: lampiran submission dan cadangan
kalau demo panggung tersendat. Panitia belum mengumumkan durasi video yang diminta
(lihat [21 Checklist Submission](<21 Checklist Submission.md>)), jadi tiga menit dipilih
karena aman untuk hampir semua portal dan mudah dipotong kalau ternyata dibatasi lebih
pendek.

| # | Beat | Pertanyaan yang harus terjawab | Isi WattSettle |
|:--:|:--|:--|:--|
| 1 | 🧩 **Masalah** | Kenapa proyek ini harus ada | Sebuah smart contract tidak bisa mempercayai sensor. Di lapangan, tagihan energi antarpihak (sewa pendingin, atap surya, pengisian kendaraan listrik) diselesaikan dari angka yang sempat singgah di tangan manusia. Yang membayar harus percaya pada yang menagih, dan tidak punya cara memeriksa. |
| 2 | 🔥 **Kalau dibiarkan** | Rugi apa kalau tidak diselesaikan | Empat akibat konkret. Sengketa tagihan menahan pembayaran berminggu-minggu sehingga arus kas penyedia jasa terganggu. Model sewa berbasis pemakaian sulit diskalakan karena tiap kontrak menuntut audit manual. Klaim karbon dan REC tidak bisa diaudit, padahal CBAM sudah berlaku definitif sejak 1 Januari 2026. Dan memaksa angka yang tidak terbukti masuk ke blockchain hanya memindahkan sampah ke tempat yang lebih mahal. |
| 3 | ⚡ **Solusi (How)** | Bagaimana ide ini menjawabnya, dan apa pembedanya | Meter yang menandatangani sendiri angkanya di titik ukur, wasit AI yang menghitung ulang kewajarannya, dan kontrak yang membayar tanpa disuruh. Pembedanya satu kalimat: kami tidak menaruh angka ke blockchain, kami membuat angkanya lahir sudah bertanda tangan dari perangkat yang kami produksi sendiri. |
| 4 | 🔁 **End to end** | Apa yang user lakukan di awal, bagaimana fitur dipakai, bagaimana user untung | Tiga langkah, dijabarkan di tabel berikutnya. |
| 5 | 🛠️ **Teknis** | Teknologi apa, kenapa cocok, apa pembedanya | BNB Smart Chain testnet 97 dengan Solidity dan Foundry. Tanda tangan EIP-712 dibuat di gerbang SRT-MGATE-1210. Putusan verifier murni aritmetika deterministik; LLM tidak pernah berada di jalur keputusan dan hanya menuliskan alasan yang bisa dibaca manusia. Pembacaan riwayat memakai `eth_getLogs` langsung, tanpa subgraph. Identitas dan validasi agent ditulis ke registry ERC-8004 milik BNB yang sudah live (**jangan diucapkan sampai gate registry ditutup**, lihat tabel uji jujur di akhir bab). Kenapa cocok: biaya gas BNB cukup murah untuk settlement per periode tagihan, dan registry agent-nya sudah ada sehingga otonomi mesin bisa dibuktikan, bukan diklaim. |
| 6 | 🎥 **Live demo** | Buktinya mana | Satu putaran approve, satu putaran reject, dan satu putaran di mana verifier sengaja dibuat berbohong lalu tetap ditolak kontrak. Ketiganya berakhir di BscScan. Dompet sudah dalam keadaan tersambung sebelum berbagi layar, jadi layar hubungkan-dompet tidak pernah muncul sama sekali. |
| 7 | ⏰ **Why now** | Kenapa harus dibangun sekarang | CBAM masuk fase definitif 1 Januari 2026 sehingga eksportir Indonesia mulai butuh bukti yang bisa diaudit. Perpres 110/2025 membuka jalur jual beli listrik antarpihak. Registry ERC-8004 baru live di BSC testnet sejak 4 Februari 2026, jadi otonomi agent baru bisa dibuktikan on-chain tahun ini. Dan biaya gas baru cukup murah untuk menyelesaikan tagihan sekecil satu periode pendinginan. Setahun lalu, tiga hal ini belum ada sekaligus. |

> [!TIP]
> Beat 2 dan beat 7 adalah dua beat yang paling sering hilang dari pitch teknis, dan
> keduanya memang belum ada di pitch arc tiga menit versi lama. Kalau waktu sempit,
> beat 7 boleh dipadatkan jadi satu kalimat, tetapi beat 2 jangan dibuang karena
> beat itulah yang membuat juri peduli.

### Beat 4 diuraikan: alur End to End

Ini beat yang dituntut mentor tetapi paling mudah terlewat di proyek mesin-ke-mesin,
karena narasi "tanpa manusia" membuat orang lupa bahwa tetap ada manusia yang membayar
dan menerima uang. Peran pengguna dalam demo diperagakan presenter.

| Urutan | Pertanyaan mentor | Jawaban WattSettle (studi kasus Enovatek) |
|:--:|:--|:--|
| 1 | Apa yang harus user lakukan di awal? | Enovatek memasang unit pendingin hibrida beserta meter PM20H20Q di lokasi penyewa, lalu mendaftarkan perangkat itu sekali ke kontrak lewat `registerDevice`. Penyewa cukup mendaftar satu kali. Di demo, pendaftaran diperagakan lewat dompet yang sudah tersambung sejak sebelum berbagi layar, bukan dengan memperagakan proses menghubungkannya. Di produksi, penyewa membayar dengan rupiah dan dompetnya dikelola secara custodial di belakang layar, karena penyewa pabrik tidak akan mengurus frasa pemulihan. |
| 2 | Bagaimana fitur dipakai? | Penyewa tidak melakukan apa-apa selain memakai pendinginnya. Meter mengirim pembacaan bertanda tangan tiap periode, verifier menghitung ulang kewajarannya terhadap batas fisik perangkat dan data pembanding, lalu memasang attestation. Kontrak menghitung penilaiannya sendiri terhadap baseline yang tersimpan on-chain dan hanya membayar bila kedua penilaian sepakat menyetujui. Tidak ada tombol yang ditekan manusia di antara pemakaian dan pembayaran. |
| 3 | Bagaimana user mendapat keuntungan? | Penyewa hanya membayar kWh yang terbukti, dan bisa memeriksa sendiri dasar tagihannya di explorer tanpa meminta izin siapa pun. Ia bahkan bisa mensimulasikan putusan kontrak lebih dulu lewat view publik `assess`, sebelum satu transaksi pun dikirim. Enovatek dibayar di hari yang sama tanpa menunggu persetujuan, sehingga tidak ada lagi piutang yang menggantung karena sengketa angka. Protokol mengambil biaya satu persen dari nilai yang diselesaikan. |

> [!NOTE]
> Pemisahan lapisan privasi tetap berlaku saat menjawab pertanyaan ini. Yang publik
> hanyalah attestation (perangkat, kWh, putusan, alasan). Tarif dan nilai rupiah
> pelanggan Enovatek tidak ikut ditulis ke rantai. Angka yang tampil di demo testnet
> adalah angka contoh.

---

## 🎬 Pitch Arc Tiga Menit

Arc dirancang peak-end. Pembukaan dan penutupan sama-sama berdiri di atas moat hardware, karena itulah aset yang tidak bisa ditiru siapapun. Loop deterministik ada di tengah, dan penolakan sengaja ditunjukkan agar AI terlihat benar-benar memutuskan.

| Waktu | Beat | Isi |
|:--|:--|:--|
| 0:00 sampai 0:15 | 🏭 **Moat first, cold open** | Klip 12 detik SRT-MGATE-1210 di dinding pabrik customer plus PO ter-redaksi. "This is not a demo device. This machine bills a real Indonesian customer today. In the next 90 seconds it gets paid by an AI, no human touches the button." |
| 0:15 sampai 0:40 | 🧩 **Problem dalam vocab mereka** | "A smart contract cannot trust a sensor. The oracle problem for physical work is unsolved." Tanam frasa **proof of physical work**. |
| 0:40 sampai 1:30 | 🔁 **Deterministic peak loop** | Trigger reading yang pre-seeded, Hermes agent bangun sendiri lewat cron tanpa klik, recompute, memasang attestation, `attestAndSettle` auto-pay, tx confirmed live di BscScan dengan event decoded. |
| 1:30 sampai 1:45 | 🚫 **Show a rejection** | Reading kedua yang sengaja anomalous, agent menolak on-chain, tanpa payout. "It evaluates, it does not rubber-stamp." |
| 1:45 sampai 2:05 | 🎭 **Puncak, verifier yang berbohong** | Reading ketiga, 900 kWh terhadap baseline 100, dan attestation yang dikirim **sengaja bohong**: delta 0, anomali 0. Buka event `ReadingAttested` di BscScan, tunjuk `chainDelta` 800 dan `chainAnomalyBps` 10000 di sebelah klaim verifier. "Now watch me try to cheat my own AI. The verifier says clean. The contract computed it itself, and refused. A lying verifier holds a veto, never an approval." Nol token berpindah. |
| 2:05 sampai 2:10 | ✨ **Silence** | Diam 2 sampai 3 detik di tx yang menolak, dengan kedua penilaian ter-decode berdampingan. Jangan menarasi di atasnya. |
| 2:10 sampai 2:35 | 🟡 **BNB fit plus ERC-8004 live** | "Real kWh is RWA. An autonomous verifier settling machine-to-machine is Agentic Finance. My verifier is a registered agent in BNB's live ERC-8004 Identity Registry, agentId 2116. It is zkPull for physical energy." |
| 2:35 sampai 3:00 | 🏆 **Close on moat** | "A student can fork a chatbot in a weekend. Nobody can fork a licensed Indonesian energy company's field meters. Contract verified, commits public, txs live, check them yourself." STOP. |

> 💡 Satu-satunya bagian yang boleh dipotong bila waktu mepet adalah paragraf keyword BNB di 2:10 sampai 2:35. Jangan pernah memotong field clip di pembukaan, beat verifier berbohong di 1:45, atau silence sesudahnya. Beat 1:45 adalah puncak baru pitch ini, sebab hanya beat itu yang membuktikan sistemnya tetap benar walaupun bagian AI-nya sendiri berkhianat.

---

## 🗣️ Memorable Line

Line utama diucapkan pada penutupan, dan disiapkan pula line cadangan untuk merespons juri teknis.

> **Utama:** "zkPull for physical energy, a real Indonesian company, settling real kilowatt-hours, machine to machine, no human in the loop."

> **Cadangan untuk juri teknis:** "That is not a boolean approve, that is the AI's rationale, on-chain, forever."

> **Cadangan untuk pertanyaan "what if your AI lies":** "It cannot force a payment. It holds a veto, not an approval. Here is the transaction where I made it lie, and the contract refused."

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

### Tiga aturan demo dari mentor Sesi 9

Tiga aturan ini melengkapi tabel di atas, bukan menggantikannya.

1. **Jangan tunjukkan login atau sign-up.** Di WattSettle, layar hubungkan-dompet sudah harus dalam keadaan tersambung sebelum berbagi layar. Waktu panggung dipakai untuk putaran approve dan reject, bukan untuk memilih dompet.
2. **Satu skenario pengguna yang sukses dari A sampai Z tanpa error.** Bukan tur fitur. Satu pembacaan masuk, satu attestation terpasang, satu pembayaran keluar, satu tx confirmed, lalu satu penolakan sebagai pembanding.
3. **Selalu siapkan video rekaman.** Sudah ada di baris 2 tabel runbook. Aturan tambahannya dari mentor: potong ke video tanpa meminta maaf dan tanpa mengumumkan bahwa demo gagal.

> ⚠️ Kunci state malam sebelumnya sebagai kode. Pastikan contract masih verified, wallet agent punya testnet BNB minimal 10 kali gas satu tx, saldo `suriota` di kontrak lebih besar dari payout, dan reading id demo belum terpakai.

---

## ❓ Tiga Killer Q and A

Setiap jawaban dirancang di bawah 20 detik, langsung ke bukti, tanpa berputar.

| Pertanyaan | Jawaban ringkas |
|:--|:--|
| 🤖 "Apakah AI benar-benar otonom?" | Tunjukkan cron plus attestation event, tawarkan menunjuk config dan menjalankan satu reading unseeded live. Autonomy adalah properti sistem, bukan klaim slide. |
| 🎭 "Kalau verifier AI-nya berbohong bagaimana?" | Buka tx `0x7e8ba5a7...98391781`. Attestation itu **sengaja dibuat bohong**, mengaku delta 0 dan anomali 0 atas bacaan 900 kWh terhadap baseline 100. Kontrak menghitung sendiri dari `baselineKwh` on-chain, mendapat 800 dan 10000 bps, lalu menolak. Verifier memegang hak veto, bukan kuasa menyetujui. |
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

## 🔎 Uji Jujur Naskah terhadap Kenyataan

Naskah pitch hanya berharga kalau tiap kalimatnya bisa dibuktikan di layar. Tabel ini
diisi ulang setiap kali ada gate yang tertutup. Diperiksa langsung ke rantai dan ke berkas,
bukan dari ingatan, pada 5 September 2026.

| Yang diklaim naskah | Status per 5 September 2026 | Akibat kalau tetap terbuka |
|:--|:--|:--|
| Klip lapangan SRT-MGATE-1210 di dinding pabrik pelanggan plus PO ter-redaksi | Belum ada berkasnya di repo | Beat 1 dan penutup kehilangan moat, tinggal klaim lisan yang tidak bisa diperiksa |
| Kontrak dengan `attestAndSettle`, struct `Attestation`, pembagian biaya, dan penghitung reputasi | ✅ **Ada dan live.** `WattSettle.sol` di `0xCA0A97a70fF720447051bDa247F8EE87e7B8Bb12`, 28 test hijau | Loop 0:40 sampai 1:30 sudah bisa diperagakan |
| Kontrak menghitung penilaiannya sendiri, sehingga verifier yang berbohong tidak bisa memaksa pembayaran | ✅ **Ada, live, dan terbukti di rantai.** Gate dua lapis dengan `baselineKwh` on-chain, attestation palsu ditolak lewat tx `0x7e8ba5a7...98391781` | Beat 1:45 punya bukti, dan pertanyaan "kalau AI-nya bohong" berubah dari ancaman menjadi peluru |
| Kontrak ter-deploy dan verified di chain 97 | ✅ **Keduanya sudah.** Terverifikasi di BscScan chain 97 dan di Sourcify dengan hasil `exact_match` | Gate 3 tertutup, gate 4 masih terbuka di [21 Checklist Submission](<21 Checklist Submission.md>) |
| Minimal dua transaksi on-chain yang bisa dibuka juri | ✅ **Dua belas transaksi confirmed**, termasuk satu approve yang membayar 103,95 `suriota`, satu reject yang jujur, dan satu reject yang menolak walaupun verifier berbohong | Gate 5 tertutup |
| Agent bangun sendiri lewat cron tanpa klik | ✅ Wallet agent memegang `VERIFIER_ROLE` dan sudah settle tiga bacaan. Deployer sudah mencabut role itu dari dirinya sendiri, jadi hanya agent yang bisa settle | Kalimat "no human touches the button" kini punya bukti izin on-chain |
| Menulis `validationResponse` ke registry ERC-8004 yang live | ❌ **Tidak bisa dan jangan diucapkan.** Tidak ada Validation Registry yang ter-deploy di chain 97. Ganti dengan agentId 2116 di Identity Registry yang live | Mengucapkan versi lama akan dipatahkan juri BNB dalam sepuluh detik dengan satu `eth_getCode` |
| Antarmuka dApp WattSettle | Yang ada baru papan bounty di repo latihan `reward-token`, bukan WattSettle | Beat 6 harus didemokan lewat skrip dan explorer, bukan lewat UI |
| Video rekaman cadangan | Belum ada | Tidak ada jaring pengaman kalau demo tersendat |

> [!CAUTION]
> Jendela submission dibuka 1 September 2026 dan ditutup 30 September 2026. Baris kedua
> sampai kelima sudah hijau, jadi loop intinya bukan lagi rencana melainkan sesuatu yang
> sudah pernah berjalan di rantai. Yang tersisa: klip lapangan beserta PO ter-redaksi
> menuntut izin pelanggan, lencana verified BscScan menuntut kunci Etherscan V2 yang hanya
> bisa diterbitkan pemilik akun, dan video cadangan belum direkam. Baris ERC-8004 bukan
> pekerjaan yang tertunda melainkan kalimat yang harus diganti, rinciannya di
> [07 AI Verifier](<07 AI Verifier.md>).

### Urutan kerja tersempit sebelum naskah ini layak dibawakan

Urutan ini sengaja dipendekkan sesuai disiplin scope-freeze di
[16 Risiko dan Kill-shots](<16 Risiko dan Kill-shots.md>). Tidak ada satu pun langkah
tambahan yang boleh disisipkan sebelum keenamnya selesai.

1. ✅ ~~Terapkan delta kontrak~~ selesai, 28 test hijau dan nol dependency baru, termasuk gate dua lapis yang membuat verifier berbohong tidak bisa memaksa pembayaran.
2. ⚠️ ~~Deploy~~ selesai, tetapi verify baru tuntas di Sourcify. Terbitkan kunci Etherscan V2 lalu jalankan perintah verify yang sudah siap di [10 Deployment](<10 Deployment dan On-chain Ops.md>).
3. ✅ ~~Isi pool hadiah~~ selesai, 50000 `suriota` masuk, sisa 49895 setelah payout demo.
4. ✅ ~~Tembakkan satu putaran approve dan satu putaran reject~~ selesai, ditambah satu putaran yang menolak walaupun verifier berbohong. Ketiga tautan transaksinya ada di [10 Deployment](<10 Deployment dan On-chain Ops.md>).
5. Rekam satu video loop yang mulus, sekitar tiga menit, dipakai sebagai cadangan panggung sekaligus lampiran submission.
6. Kirim tweet dengan keempat handle dan tagar yang persis, lalu balik repo `reward-token` menjadi publik.

> [!TIP]
> Beat 5 dan beat 7 di kerangka tujuh beat boleh disusun sekarang karena isinya riset,
> bukan kode. Beat 6 tidak bisa, karena beat 6 adalah buktinya.

---

<div align="center">
<sub>© 2026 PT Surya Inovasi Prioritas (SURIOTA) · <a href="README.md">Hub WattSettle</a> · Update 5 September 2026</sub>
</div>
