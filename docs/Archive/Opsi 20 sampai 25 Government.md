# Opsi 20 sampai 25 Government

Tanggal: 11 Juli 2026.  
Scope: alternatif hackathon Web3 x AI yang bersandar pada problem publik, layanan negara, atau sektor yang sangat dipengaruhi regulasi.

## Posisi Riset

Riset ini dibuat untuk mencari opsi di luar WattSettle, AgentCart, TrustCart, VeriFaktur, TuntasCOD, Talangan, Faktur402, Mandat, dan opsi awal lain. Semua kandidat di bawah memakai government pain sebagai sumber problem, tetapi demo tetap harus bisa dibuat mandiri tanpa akses sistem pemerintah asli.

Prinsip seleksi:

1. Problem harus nyata dan bisa dijelaskan dalam 30 detik.
2. Data demo bisa disintesis dari dokumen publik atau fixture lokal.
3. On-chain layer harus menambah auditability, bukan sekadar tempelan.
4. AI harus mengambil keputusan atau menyusun evidence, bukan hanya chatbot.
5. Scope hackathon harus bisa dipotong menjadi satu loop deterministik.

## Shortlist

| Rank | Opsi | Skor | Track | Buyer / Stakeholder | One-liner |
|---|---:|---:|---|---|---|
| 1 | BatchGuard MBG | 88 | RWA / Finance / AI | Vendor katering, sekolah, operator MBG, auditor | Batch-level food safety and delivery attestation untuk program makan massal |
| 2 | ServiceProof SLA | 87 | Finance and Commerce | Pemda, operator layanan, vendor SLA | Proof-of-service untuk SLA layanan publik dan vendor payment |
| 3 | NusaData Bounty | 86 | AI Agents / Data | Pemda, kampus, komunitas civic tech | Marketplace bounty data publik yang diverifikasi AI |
| 4 | ScamShield Intent Firewall | 85 | AI Agents / Security | Bank, wallet, telco, OJK-adjacent | Agent yang memblokir transaksi scam dari intent, bukan dari blacklist saja |
| 5 | HalalOps Passport | 83 | RWA / Commerce | UMKM makanan, auditor, distributor | Operational halal passport untuk supplier dan batch |
| 6 | ColdSLA | 82 | RWA / Logistics | Klinik, distributor farmasi, cold-chain operator | Temperature SLA settlement untuk logistik vaksin, makanan, dan farmasi |

## Rekomendasi Utama: BatchGuard MBG

### Masalah

Program makan massal punya risiko klasik: batch makanan dibuat banyak, dikirim ke banyak titik, lalu jika ada masalah sulit membuktikan batch mana yang bermasalah, siapa yang menerima, kapan dikirim, dan apakah suhu atau waktu distribusi masih aman. Ini problem audit fisik, bukan problem dokumen.

### Before, Now, After

| Fase | Kondisi |
|---|---|
| Before | Vendor dan penerima memakai checklist manual. Bukti tersebar di foto, tanda tangan, spreadsheet, dan chat |
| Now | Skala program makin besar, tetapi audit batch belum real time dan sulit ditelusuri |
| After | Tiap batch punya passport: produksi, pickup, delivery, suhu, penerima, AI risk score, dan settlement status |

### Input, Process, Output

Input:

- batch ID
- vendor ID
- menu dan jumlah porsi
- pickup timestamp
- delivery timestamp
- foto seal atau tray
- optional suhu atau GPS dari perangkat
- laporan penerima

Process:

1. Vendor membuat batch passport.
2. Kurir menambahkan pickup proof.
3. Sekolah atau penerima menambahkan receive proof.
4. AI memeriksa anomali: delay, duplikasi foto, mismatch porsi, laporan sakit, dan pola vendor.
5. Kontrak menulis attestation dan release atau hold payment.

Output:

- batch passport
- risk score
- settlement decision
- evidence packet untuk audit

### SWOT

| Area | Catatan |
|---|---|
| Strength | Problem mudah dipahami, demo teatrikal, on-chain audit masuk akal |
| Weakness | Sensitif politik jika framing menyerang program pemerintah |
| Opportunity | Bisa digeser ke private catering, sekolah swasta, rumah sakit, dan pabrik |
| Threat | Butuh data fisik bagus agar tidak terlihat seperti form app biasa |

### Demo

Demo cukup 3 batch:

1. Batch normal, pickup dan delivery sesuai, AI approve, payment release.
2. Batch delay, AI memberi warning, payment partial hold.
3. Batch dengan foto duplikat atau porsi mismatch, AI reject, evidence packet terbentuk.

Pitch line:

> "Kami tidak mengawasi orang. Kami membuat batch makanan punya jejak bukti yang bisa diaudit."

## Runner Up: ServiceProof SLA

### Masalah

Banyak layanan publik dan vendor pemerintah dibayar berdasarkan klaim pekerjaan selesai. Masalahnya, bukti selesai sering manual: foto, laporan, tanda tangan, atau BAST. ServiceProof mengubah pekerjaan menjadi proof-of-service yang bisa dicek ulang.

### Input, Process, Output

Input:

- work order
- lokasi
- timestamp
- foto sebelum dan sesudah
- sensor optional
- penerima manfaat atau petugas approval

Process:

1. Vendor submit job proof.
2. AI membandingkan before-after dan lokasi.
3. Sistem cek duplikasi bukti dan waktu kerja.
4. Kontrak mencatat service attestation.
5. Payment atau SLA score diperbarui.

Output:

- service receipt
- SLA score
- vendor reliability
- dispute packet

### Kenapa Menarik

Lebih generik dari BatchGuard. Bisa dipakai untuk sampah, jalan, lampu, maintenance, atau instalasi. Tetapi justru karena generik, demo harus sangat spesifik agar tidak terasa seperti dashboard vendor biasa.

## Opsi Data: NusaData Bounty

### Masalah

Banyak data publik berantakan, tidak lengkap, atau sulit dipakai AI. Pemerintah daerah, kampus, komunitas, dan media butuh data bersih, tetapi tidak ada insentif jelas untuk membersihkan dataset kecil.

### Alur

1. Sponsor membuat bounty dataset.
2. Kontributor submit cleaned dataset atau extraction result.
3. AI validator mengecek schema, duplikasi, sumber, dan coverage.
4. Kontrak release bounty untuk kontribusi valid.
5. Dataset dan validation report dipublish.

### Kekuatan

Ini cocok untuk track AI Agents karena agent melakukan extraction dan validation. Weakness-nya: problem kurang emosional dibanding makanan, scam, atau layanan publik.

## Opsi Security: ScamShield Intent Firewall

### Masalah

Scam pembayaran sering lolos karena sistem hanya melihat alamat tujuan atau blacklist. ScamShield membaca intent: siapa penerima, alasan transfer, pola chat, domain, QR, dan social signal. AI memberi risk score sebelum transaksi jalan.

### Alur

1. User paste payment intent atau QR.
2. Agent membaca context dan mengecek pola scam.
3. Jika risk tinggi, transaksi di-hold.
4. Jika user tetap lanjut, sistem mencatat consent dan warning hash.
5. Feedback setelah transaksi memperbarui model risiko.

### Catatan

Ini sangat relevan untuk publik, bank, wallet, dan telco. Risiko: perlu hati-hati agar tidak menjanjikan deteksi scam 100 persen. Demo harus memakai skenario jelas: fake invoice, romance scam, fake admin marketplace.

## Opsi Compliance: HalalOps Passport

### Masalah

UMKM makanan sering punya dokumen halal, supplier, dan batch bahan yang tidak rapi. HalalOps bukan "sertifikasi halal baru", tetapi operational passport untuk membuktikan bahan, supplier, dan batch produksi.

### Alur

1. UMKM input supplier dan bahan.
2. AI membaca dokumen supplier dan label.
3. Batch produksi mendapat passport.
4. Anomali supplier atau bahan flag merah.
5. Passport bisa dibagikan ke distributor atau marketplace.

### Catatan

Problem kuat, tetapi dekat regulasi. Jangan pitch sebagai pengganti BPJPH atau auditor. Pitch sebagai compliance ops layer untuk UMKM.

## Opsi Logistics: ColdSLA

### Masalah

Vaksin, farmasi, makanan beku, dan produk sensitif suhu butuh bukti cold chain. Jika barang rusak, dispute biasanya menyangkut siapa yang melanggar suhu atau SLA.

### Alur

1. Device atau fixture membuat temperature log.
2. AI memeriksa excursion dan durasi.
3. Kontrak menentukan SLA pass, partial fail, atau reject.
4. Evidence packet dibuat untuk claim.

### Catatan

Secara bisnis kuat, tetapi untuk hackathon ini kurang baru karena sudah dekat dengan ColdSLA yang pernah muncul. Simpan sebagai fallback jika ingin demo sensor fisik tanpa energi.

## Keputusan

| Tujuan | Pilihan |
|---|---|
| Demo paling mudah dipahami publik | BatchGuard MBG |
| Produk paling generik untuk banyak vendor | ServiceProof SLA |
| Paling AI-agent dan civic data | NusaData Bounty |
| Paling security dan fintech | ScamShield Intent Firewall |
| Paling compliance UMKM | HalalOps Passport |
| Paling cocok kalau ingin pakai sensor | ColdSLA |

Rekomendasi: jika jalur government dipakai, pilih BatchGuard MBG. Framing harus hati-hati: bukan menyerang program, tetapi membuat audit batch makanan lebih jelas, cepat, dan tidak bergantung pada kepercayaan manual.

## Source Ledger

| Sumber | Dipakai untuk |
|---|---|
| https://bgn.go.id | Konteks program makan bergizi dan skala operasional |
| https://apnews.com | Risiko korupsi dan pengawasan program makan massal |
| https://www.ojk.go.id | Konteks anti-scam dan perlindungan konsumen jasa keuangan |
| https://www.ppatk.go.id | Sinyal fraud dan transaksi mencurigakan |
| https://www.bi.go.id | Konteks QRIS dan pembayaran digital |
| https://bpjph.halal.go.id | Konteks kewajiban halal dan kebutuhan compliance UMKM |
| https://setkab.go.id | Konteks bansos dan layanan publik |
| https://www.bnbchain.org/en/solutions/ai-agent | Kesesuaian Web3 x AI, ERC-8004, x402, dan agent economy |

