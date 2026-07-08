<div align="center">

![Bab](https://img.shields.io/badge/BAB-04%20Setup%20Lingkungan-06b6d4?style=for-the-badge)
&nbsp;
![WattSettle](https://img.shields.io/badge/WattSettle-Build%20Bible-22c55e?style=for-the-badge)
&nbsp;
![Foundry](https://img.shields.io/badge/Foundry-v1.7.1-orange?style=for-the-badge)

# 🧰 Setup Lingkungan

### Dari nol sampai 6 test PASS dan wallet siap deploy

</div>

**Navigasi:** [Hub](README.md) · [Sebelumnya: 03 Arsitektur](<03 Arsitektur.md>) · [Berikutnya: 05 Device dan Firmware](<05 Device dan Firmware.md>)

---

## 💡 Tujuan Bab Ini

Bab ini adalah getting started untuk **Sesi 1 (Environment dan First Deploy)**. Setelah selesai, kamu punya Foundry terpasang, wallet testnet berisi tBNB, repo ter-clone, dan bukti bahwa kontrak base berjalan (6 test PASS). Ini fondasi sebelum menyentuh delta WattSettle di bab berikutnya.

> ⚠️ Aturan penting sepanjang buku ini: seluruh perintah Foundry dijalankan lewat **Git Bash**, bukan PowerShell. Nama folder workspace mengandung spasi, dan beberapa tool berperilaku berbeda di PowerShell. Git Bash memberi lingkungan POSIX yang konsisten.

---

## ✅ Prerequisites

| Kebutuhan | Kenapa | Cek |
|:--|:--|:--|
| Git plus Git Bash | shell POSIX untuk semua perintah forge | `git --version` |
| Foundry (`forge`, `cast`, `anvil`, `chisel`) | build, test, deploy, kirim tx | `forge --version` |
| Browser wallet (Rabby) | pegang key testnet, verifikasi wallet | ekstensi terpasang |
| tBNB testnet | bayar gas di BSC testnet 97 | saldo di Rabby |
| Koneksi internet | clone repo, RPC testnet, faucet | ping RPC |

---

## 1. Install Foundry (lewat Git Bash)

Jalankan **di Git Bash**, bukan PowerShell:

```bash
curl -L https://foundry.paradigm.xyz | bash
```

Perintah di atas memasang `foundryup`. Buka terminal Git Bash baru, lalu jalankan:

```bash
foundryup
```

Ini mengunduh biner `forge`, `cast`, `anvil`, dan `chisel` ke `~/.foundry/bin`. Pastikan direktori itu ada di `PATH`. Verifikasi:

```bash
forge --version
cast --version
```

> 💡 Di proyek ini versi yang terpasang dan teruji adalah **Foundry v1.7.1**. Jika versi kamu berbeda jauh, jalankan `foundryup` lagi untuk update, lalu ulangi verifikasi.

Checklist install:

- [ ] `foundryup` selesai tanpa error
- [ ] `forge --version` menampilkan versi
- [ ] `cast --version` menampilkan versi
- [ ] `~/.foundry/bin` ada di `PATH`

---

## 2. Siapkan Wallet (Rabby)

1. Pasang ekstensi **Rabby** di browser.
2. Buat wallet baru atau import wallet testnet khusus (jangan pakai wallet berisi aset mainnet).
3. Tambahkan jaringan **BNB Smart Chain Testnet** bila belum ada:

| Parameter | Nilai |
|:--|:--|
| Network name | BNB Smart Chain Testnet |
| RPC URL | `https://bsc-testnet-rpc.publicnode.com` |
| chainId | 97 |
| Symbol | tBNB |
| Explorer | `https://testnet.bscscan.com` |

> ⚠️ Wallet ini khusus testnet. Private key dan password proyek ini disimpan hanya di `.secrets/` yang sudah masuk `.gitignore`. Jangan pernah commit key, dan jangan pernah memakai pola key yang sama untuk mainnet.

---

## 3. Ambil tBNB dari Faucet

Kontrak dan transaksi butuh gas dalam bentuk tBNB. Ambil dari BSC testnet faucet:

1. Salin alamat wallet Rabby kamu (format `0x...`).
2. Buka BSC testnet faucet resmi (cari "BNB Smart Chain Testnet Faucet" di dokumentasi BNB Chain).
3. Tempel alamat, minta drip tBNB.
4. Tunggu beberapa detik, cek saldo muncul di Rabby.

> 💡 Untuk demo, saldo perlu cukup untuk minimal 10 kali gas satu transaksi. Ambil beberapa drip agar aman saat rehearsal berulang.

Checklist wallet dan faucet:

- [ ] Jaringan BSC testnet 97 tersedia di Rabby
- [ ] Alamat wallet tercatat
- [ ] Saldo tBNB masuk dari faucet

---

## 4. Clone dan Masuk Repo

```bash
git clone https://github.com/GifariKemal/wattsettle.git
cd wattsettle
```

Struktur relevan yang akan kamu temui:

| Path | Isi |
|:--|:--|
| `proofofwatt/` | Foundry project (kontrak base, test, README) |
| `WattSettle/` | Build Bible (dokumentasi aktif, termasuk file ini) |
| `docs/` | dokumen strategi dan arsip |
| `web/` | website pemaparan (Astro) |
| `.secrets/` | key testnet, gitignored, tidak pernah di-track |

---

## 5. Jalankan Test Pertama (Harapkan 6 PASS)

Masuk ke Foundry project dan jalankan test:

```bash
cd proofofwatt
forge test
```

Untuk output verbose (berguna saat debugging):

```bash
forge test -vvv
```

Output yang benar menunjukkan **6 test PASS**, mencakup:

| Test | Yang diuji |
|:--|:--|
| `test_HappyPath_SignSubmitApprovePay` | sign, submit, approve, bayar reward untuk 100 kWh ke owner |
| `test_Reject_NoPayout` | reject tanpa payout |
| `test_Revert_BadSignature` | tanda tangan tidak cocok ditolak |
| `test_Revert_Replay` | bacaan yang sama ditolak (anti replay) |
| `test_Revert_StaleTimestamp` | timestamp mundur ditolak |
| `test_Revert_OnlyVerifier` | non verifier tidak boleh memverifikasi |

> 💡 Kalau ini pertama kali `forge test` dijalankan, Foundry akan mengompilasi kontrak dan dependency OpenZeppelin dulu. Kompilasi awal butuh waktu, run berikutnya jauh lebih cepat karena cache.

Checklist first test:

- [ ] `cd proofofwatt` berhasil
- [ ] `forge test` menampilkan 6 passing
- [ ] tidak ada test yang failing

---

## 6. Troubleshooting Umum

| Gejala | Kemungkinan sebab | Solusi |
|:--|:--|:--|
| `forge: command not found` | `~/.foundry/bin` tidak di `PATH` atau jalan di PowerShell | buka Git Bash baru, cek `PATH`, jalankan `foundryup` |
| Perintah aneh atau path tidak terbaca | dijalankan di PowerShell, bukan Git Bash | pindah ke Git Bash |
| `forge test` gagal compile OpenZeppelin | dependency lib belum ter-install | jalankan `forge install` di dalam `proofofwatt/` |
| Test failing padahal belum menyentuh kode | versi Foundry terlalu jauh berbeda | `foundryup` lalu ulangi `forge test` |
| Transaksi testnet gagal, out of gas | saldo tBNB kurang | ambil lagi dari faucet |
| RPC lambat atau timeout | endpoint testnet flaky | ganti RPC ke endpoint publik lain, coba lagi |

---

## 🔐 Catatan Keamanan Secret

Seluruh secret di proyek ini adalah **testnet only** dan hidup di direktori `.secrets/` yang sudah masuk `.gitignore`. Aturan yang tidak boleh dilanggar:

- Private key wallet **tidak pernah** di-hardcode di script deploy. Pakai variabel lingkungan atau file di `.secrets/`.
- `.secrets/`, `.env`, dan build artifacts tidak pernah di-commit.
- Key testnet tidak pernah dipakai ulang polanya untuk mainnet.

Setelah checklist bab ini hijau semua, kamu siap masuk ke [05 Device dan Firmware](<05 Device dan Firmware.md>) untuk memahami bagaimana device menandatangani bacaan. Peta urutan build per sesi ada di [13 Workflow Build](<13 Workflow Build.md>).

---

<div align="center">
<sub>© 2026 PT Surya Inovasi Prioritas (SURIOTA) · <a href="README.md">Hub WattSettle</a> · Update 7 Juli 2026</sub>
</div>
