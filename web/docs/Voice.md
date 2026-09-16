# Voice dan Leksikon

Acuan tunggal saat menulis atau menyunting teks di `src/content/*.ts`. Tujuannya satu:
tujuh halaman terdengar seperti satu produk, bukan seperti tujuh penulis.

## Suara

Protocol docs. Kalimat pendek dan deklaratif, klaim konkret, angka yang bisa dicek.
Pembaca memindai, bukan membaca esai.

| Aturan | Batas |
|:--|:--|
| Panjang kalimat | maksimal sekitar 20 kata |
| Panjang lead | maksimal 2 kalimat |
| Sapaan | tanpa "kamu" dan "Anda", pakai imperatif ("Kirim reading") |
| Metafora | maksimal satu kerangka per halaman, jangan dicampur |
| Angka | selalu spesifik, dan harus benar-benar ada di rantai atau di repo |

## Leksikon yang dikunci

Satu benda, satu nama. Jangan menambah sinonim baru.

| Pakai ini | Jangan |
|:--|:--|
| perangkat (penandatangan, SRT-MGATE-1210) | device signer di teks biasa, "meter" untuk penandatangan |
| meter (sumber angka kWh, PM20H20Q) | dipertukarkan dengan perangkat |
| agent (proses Python yang menilai) | AI verifier, verifier AI, wasit AI, agent AI |
| verifier / VERIFIER_ROLE (peran on-chain) | dipakai untuk menyebut prosesnya |
| kontrak | smart contract di tiap kalimat, rel pembayaran |
| settlement rail (sekali, sebagai kategori) | rel settlement dan rel pembayaran bergantian |
| gate | ruleset gate, gerbang, cap |

Istilah protokol dibiarkan Inggris dan tidak dimiringkan: Reading, Attestation, baseline,
replay guard, settlement, on-chain, rationale, ruleset, treasury, nonce.

Verba selalu Indonesia: menandatangani, menghitung ulang, merakit, memutus, membayar,
menolak, memancarkan, memindai. Jangan menulis "recompute delta", "build Attestation",
atau "subscribe event" di dalam kalimat Indonesia.

## Yang dilarang masuk copy produk

- Bahasa deck pitch: moat, amunisi, kill-shot, win-probability, "lebih meyakinkan".
- Kata "demo" atau "hackathon" di halaman produk, kecuali memang membicarakan demo.
- Nama internal opsi: Opsi 5, Opsi 6, codex, benchmark.
- Sindiran ke pihak lain, misalnya "bukan startup imajiner".
- Klaim tanpa angka yang bisa diperiksa.

## Nada penutup

Mekanisme dijelaskan, kesimpulan diserahkan ke pembaca. Kalimat terkuat di situs ini bukan
pujian terhadap diri sendiri, melainkan fakta yang tidak nyaman: verifier pernah dibuat
berbohong, dan kontrak tetap menolak membayar.

---

Copyright 2026 PT Surya Inovasi Prioritas (SURIOTA).
