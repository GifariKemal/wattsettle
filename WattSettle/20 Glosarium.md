<div align="center">

![Bab](https://img.shields.io/badge/BAB-20%20Glosarium-a855f7?style=for-the-badge)
&nbsp;
![WattSettle](https://img.shields.io/badge/WattSettle-Build%20Bible-22c55e?style=for-the-badge)

# 🔤 Glosarium

### Istilah dan singkatan yang dipakai di seluruh Build Bible

</div>

**Navigasi:** [Hub](README.md) · [Sebelumnya: 19 Referensi](<19 Referensi.md>) · [Berikutnya: 21 Checklist Submission](<21 Checklist Submission.md>)

---

## 💡 Cara Pakai

Glosarium ini alfabetis. Kolom kiri adalah istilah atau identifier apa adanya (termasuk `-` dan `_` bila itu sintaks yang benar), kolom kanan definisi ringkas Bahasa Indonesia. Jika sebuah istilah punya bab sendiri, definisi di sini hanya cukup untuk memahami konteks, detail penuh ada di bab terkait.

---

## 📚 Daftar Istilah

| Istilah | Definisi |
|:--|:--|
| **Anomaly score** | Skor kelainan sebuah bacaan, dinyatakan sebagai `anomalyScoreBps` (0 sampai 10000). Semakin tinggi semakin jauh dari perilaku normal perangkat, dipakai sebagai salah satu gerbang approve atau reject. |
| **Attestation** | Struct on-chain berisi rationale AI verifier atas satu Reading, yaitu delta kWh terhadap baseline, anomaly score, model version hash, ruleset hash, dan waktu evaluasi. Ini pengganti boolean approve yang bikin autonomy jadi legible di BscScan. |
| **Baseline** | Perilaku energi acuan sebuah perangkat yang jadi pembanding bacaan baru. Verifier menghitung `kwhDeltaVsBaseline`, yaitu selisih bacaan terhadap baseline ini. |
| **BEP-620** | Nomor proposal BNB untuk standar registry agent, secara praktis setara ERC-8004 di ekosistem BNB. Validation Registry-nya sudah live di BSC. |
| **BscScan** | Block explorer untuk BNB Smart Chain. WattSettle memakainya sebagai UI resmi, semua transaksi, event ter-decode, dan verifikasi kontrak dibuktikan di sini. |
| **CBAM** | Carbon Border Adjustment Mechanism, mekanisme pajak karbon lintas batas Uni Eropa yang live 1 Januari 2026. Jadi pendorong pasar untuk attestation energi hijau terverifikasi. |
| **chainId 97** | Identitas jaringan BSC testnet, target deploy WattSettle untuk hackathon. |
| **DePIN** | Decentralized Physical Infrastructure Network, jaringan infrastruktur fisik yang dikoordinasi on-chain. Energi adalah vertikal terbesarnya, dan domain langsung WattSettle. |
| **EIP-712** | Standar tanda tangan data terstruktur di Ethereum. Perangkat memakainya untuk menandatangani `Reading{deviceId,kWh,timestamp,nonce}` di domain `ProofOfWatt/1`. |
| **ERC-8004** | Standar registry untuk agent on-chain (identity, reputation, validation). Validation Registry-nya sudah live singleton di BSC, WattSettle mengintegrasi lewat `validationResponse`, bukan meniru. |
| **ERC20** | Standar token fungibel di EVM. Token `suriota` dan `MockUSD` keduanya ERC20 sebagai token settlement. |
| **Foundry** | Toolchain pengembangan smart contract berbasis Rust (`forge`, `cast`, `anvil`, `chisel`). Versi v1.7.1 dipakai, kontrak base 6 test PASS. |
| **Hermes** | Infrastruktur agent AI internal SURIOTA di VPS. Dipakai ulang sebagai AI verifier WattSettle yang subscribe event, recompute, dan memanggil `attestAndSettle` tanpa klik manusia. |
| **kWh** | Kilowatt-hour, satuan energi yang diukur perangkat lapangan dan yang di-settle on-chain. Yang di-settle adalah bacaan meter itu sendiri. |
| **M2M** | Machine-to-Machine, komunikasi dan pembayaran antar mesin tanpa manusia di tengah. WattSettle adalah settlement rail M2M untuk energi. |
| **MockUSD** | Token ERC20 stablecoin tiruan (6 desimal) di dalam repo, cadangan pengganti `suriota` lewat swap satu baris di constructor bila keyword "stablecoin" penting di hari-H. |
| **Monotonic guard** | Penjaga di `submitReading` yang menolak timestamp yang tidak lebih baru dari `lastTs`, mencegah bacaan basi atau berurutan mundur. |
| **MRV** | Measurement, Reporting, and Verification, kerangka baku pelaporan emisi dan energi. Attestation WattSettle adalah bentuk MRV yang machine-verified. |
| **nonce** | Angka sekali pakai dalam `Reading` yang, bersama replay guard, mencegah satu tanda tangan dipakai ulang. |
| **OJK** | Otoritas Jasa Keuangan, regulator keuangan Indonesia yang mengambil alih supervisi kripto (Januari 2026) dan menjalankan sandbox RWA. Jadi wedge kredibilitas regulasi WattSettle. |
| **opBNB** | Layer 2 BNB Chain untuk throughput tinggi dan biaya rendah. Jalur scaling event-logging di roadmap, bukan scope demo. |
| **Oracle gap** | Celah kepercayaan antara bukti fisik dan pembayaran on-chain. WattSettle menutupnya karena yang di-settle adalah bacaan meter itu sendiri, meter ADALAH transaksi. |
| **PM20H20Q** | Meter DC milik Enovatek untuk Hybrid HVAC, perangkat pada use case demo Cooling-as-a-Service. |
| **Reentrancy** | Serangan di mana kontrak dipanggil ulang di tengah eksekusi sebelum state selesai diperbarui. Dicegah dengan checks-effects-interactions plus `nonReentrant` di payout. |
| **Replay guard** | Penjaga di `submitReading` (via `usedDigest`) yang menolak tanda tangan yang sudah pernah dipakai, mencegah bacaan yang sama disubmit dua kali. |
| **RWA** | Real World Asset, aset dunia nyata yang direpresentasikan on-chain. kWh terverifikasi adalah RWA, salah satu pilar 2026 BNB. |
| **SafeERC20** | Library OpenZeppelin untuk transfer token yang aman terhadap token non-standar. Menggantikan raw transfer di jalur payout (perbaikan line 103). |
| **Settlement** | Pelunasan pembayaran on-chain atas energi terverifikasi. Inti WattSettle, produsen dibayar dan protokol memungut fee. |
| **SRT-MGATE-1210** | Gateway IoT ESP32 milik SURIOTA (Modbus RTU/TCP ke MQTT). Berperan sebagai device signer yang menandatangani `Reading` secara EIP-712. |
| **suriota** | Token ERC20 (18 desimal) milik SURIOTA yang sudah verified di BscScan testnet 97, token settlement default WattSettle. |
| **VERIFIER_ROLE** | Peran AccessControl yang wajib dimiliki pemanggil `attestAndSettle`. Hanya verifier ter-otorisasi yang bisa menuliskan attestation dan memicu payout. |
| **x402** | Standar pembayaran HTTP 402 stablecoin M2M yang live di BNB. Diperlakukan sebagai handshake self-contained "402, pay, prove" di on-chain ruleset gate. |
| **zkPull** | Protokol bounty trustless pemenang Mantle 2025 (verifikasi dulu, bayar kemudian). Kerangka identik WattSettle, dasar tagline "zkPull for physical energy". |

---

<div align="center">
<sub>© 2026 PT Surya Inovasi Prioritas (SURIOTA) · <a href="README.md">Hub WattSettle</a> · Update 7 Juli 2026</sub>
</div>
