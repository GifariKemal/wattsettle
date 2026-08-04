# Pertemuan 2: Foundry & Dasar Solidity

> **DevWeb3 Jogja - Online Bootcamp.** Minggu, 12 Juli 2026, jam 19.30-21.30 WIB.

> **Repo & lanjutan:** semua kode bootcamp ada di [GitHub repo](https://github.com/DevWeb3Jogja/boootcamp-indonesia-web3-hacathon). Habis sesi ini, lanjut ke [Sesi 3: Papan Sayembara (Bounty)](https://app.notion.com/p/39683efb869d813e894fdc9769577e6d).

Sebelum ngoding beneran, kita pahami dulu **senjatanya (Foundry)** dan **bahasanya (Solidity)**. Sesi full praktek, tanpa PPT.

### Isi halaman ini (3 tab)

1. **🛠 Tab 1: Instalasi & Setup Foundry.** Pasang semua tooling sampai siap deploy, plus WSL buat pengguna Windows.
2. **📚 Tab 2: Dasar & Struktur Solidity.** Anatomi file `.sol`, tipe data, visibility, lokasi data, sampai best practice hemat gas.
3. **📄 Tab 3: Smart Contract Kita.** Bikin RewardToken (token hadiah) versi best practice, sambil ngoding.

> Buka sub-halaman di bawah ⬇

### Target sesi

- [ ] Foundry jalan di semua peserta (`forge --version`)
- [ ] Paham struktur & istilah Solidity (bisa baca kontrak)
- [ ] Siap lanjut koding di Tab 3

## Tab 1: Instalasi & Setup (Foundry + OpenZeppelin)

Panduan dari nol sampai lingkunganmu siap ngoding **dan** deploy smart contract. Ikuti berurutan. Kalau satu langkah gagal, beresin dulu sebelum lanjut.

### Peta langkah

1. (Windows) Install WSL
2. Install Foundry
3. Bikin project (`forge init`)
4. Install OpenZeppelin (+ remappings)
5. Bikin wallet dev baru (`cast wallet`)
6. Ambil API key Etherscan V2
7. Setup `foundry.toml` + `.env`
8. Cek semua siap
9. Command deploy + verify (buat token nanti)

---

### 0. Apa itu Foundry

---

### 1. (Windows) Install WSL

Foundry butuh lingkungan Linux. Di Windows, pakai WSL (Linux resmi di dalam Windows). PowerShell dan CMD gak didukung buat `foundryup`.

1. Buka **PowerShell as Administrator** (klik kanan ikon PowerShell, pilih Run as administrator).
2. Jalankan `wsl --install` di PowerShell, lalu tunggu sampai selesai.
3. **Restart** komputer.
4. Buka **Ubuntu** dari Start menu. Bikin username + password Linux (password gak keliatan pas diketik, itu normal).
5. Update dan pasang alat dasar:

```bash
sudo apt update && sudo apt upgrade -y
sudo apt install -y git curl build-essential
```

> Kalau `wsl --install` gagal: aktifkan **virtualization** di BIOS/UEFI (Intel VT-x / AMD-V), lalu update Windows.

> macOS atau Linux: lewati langkah ini.

---

### 2. Install Foundry

Di terminal (Windows: di dalam Ubuntu/WSL):

```bash
curl -L https://foundry.paradigm.xyz | bash
```

Tutup lalu buka lagi terminalnya (atau jalankan `source ~/.bashrc`), terus:

```bash
foundryup
```

Verifikasi:

```bash
forge --version
cast --version
```

Kalau muncul versinya, berarti sukses.

---

### 3. Bikin project

```bash
forge init bootcamp-web3id-s2
cd bootcamp-web3id-s2
```

Struktur yang kebentuk:

Cek semua jalan:

```bash
forge build
forge test
```

`forge test` bakal hijau (ada contoh Counter bawaan).

---

### 4. Install OpenZeppelin

OpenZeppelin (OZ) itu kumpulan kontrak standar yang sudah diaudit (ERC20, Ownable, dan lainnya). Reward token yang kita bikin di Tab 3 pakai ini, dan bounty minggu depan juga.

```bash
forge install OpenZeppelin/openzeppelin-contracts
```

Bikin `remappings.txt` otomatis dari library yang keinstall (cara paling simpel, gak usah ketik manual):

```javascript
forge remappings > remappings.txt
```

Cek resolve:

```bash
forge build
```

Sekarang kamu bisa import kayak gini di kontrak:

```solidity
import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
```

> Kalau `forge install` gagal karena ada perubahan belum di-commit, commit dulu (`git add . && git commit -m "init"`) baru install.

---

### 5. Bikin wallet dev baru (WAJIB)

Jangan pakai wallet utama atau wallet yang ada aset aslinya. Buat wallet baru khusus development, isinya cuma dana testnet. Kalau private key-nya bocor, gak ada yang hilang.

Bikin wallet baru:

```bash
cast wallet new
```

Outputnya dua hal: **Address** dan **Private key**. Simpan dua-duanya baik-baik.

Isi wallet dengan tBNB dari faucet BNB testnet, lalu cek saldo:

```bash
cast balance <ALAMAT> --rpc-url https://bsc-testnet-rpc.publicnode.com
```

#### Simpan private key dengan aman (disarankan): keystore terenkripsi

Daripada naruh private key mentah di file, import ke keystore terenkripsi Foundry:

```bash
cast wallet import deployer --interactive
```

Kamu diminta paste private key, lalu bikin password. Key tersimpan terenkripsi di `~/.foundry/keystores/deployer`. Private key-nya gak pernah ketulis di project atau di `.env`.

Cek keystore-nya ada:

```bash
cast wallet list
```

Nanti pas deploy, pakai `--account deployer` (Foundry minta password saat itu), bukan private key mentah.

---

### 6. Ambil API key Etherscan V2

Guna: buat verify kontrak otomatis, biar source code-nya kebaca publik di explorer.

1. Buka **[etherscan.io](http://etherscan.io)**, daftar atau login.
2. Masuk ke **API Dashboard** (menu profil, bagian API Keys).
3. Klik **Add**, kasih nama (mis. `bootcamp`), lalu **Create**. Copy key-nya.

> Etherscan V2: satu key ini jalan di semua chain, termasuk BNB Testnet (chainid 97). Gak perlu daftar BscScan terpisah.

---

### 7. Setup `foundry.toml` + `.env`

#### `foundry.toml`

Edit jadi begini:

```toml
[profile.default]
src = "src"
out = "out"
libs = ["lib"]

[rpc_endpoints]
bsc_testnet = "${BSC_TESTNET_RPC}"

[etherscan]
bsc_testnet = { key = "${ETHERSCAN_API_KEY}", chain = 97 }
```

- `[rpc_endpoints]` bikin alias `bsc_testnet`, biar bisa dipakai `--rpc-url bsc_testnet`.
- `[etherscan]` buat verify. `chain = 97` artinya BNB Testnet. Nama aliasnya sengaja sama biar `--verify` otomatis kebaca.

#### `.env`

Bikin file `.env` di root project:

```bash
BSC_TESTNET_RPC=https://bsc-testnet-rpc.publicnode.com
ETHERSCAN_API_KEY=paste_key_etherscan_kamu
```

Kalau kamu pilih cara cepat (bukan keystore), tambah juga:

```bash
PRIVATE_KEY=0xprivate_key_wallet_dev_kamu
```

#### Lindungi `.env` (WAJIB)

```bash
echo ".env" >> .gitignore
```

Jangan pernah commit `.env`. Kalau pakai keystore (`--account`), private key gak perlu ditaruh di sini sama sekali.

---

### 8. Cek semua siap

```bash
forge build                 # kompilasi sukses (termasuk import OZ)
cast wallet list            # ada "deployer"
source .env
cast balance <ALAMAT> --rpc-url $BSC_TESTNET_RPC   # ada saldo tBNB
```

---

### 9. Command deploy + verify (buat token nanti)

Token-nya kita bikin di Tab 3. Ini command referensinya. Jalankan `source .env` dulu tiap buka terminal baru.

**Cara aman (pakai keystore):**

```bash
source .env
forge script script/RewardToken.s.sol:RewardTokenScript \
  --rpc-url bsc_testnet \
  --account deployer \
  --broadcast \
  --verify \
  -vvvv
```

**Cara cepat (private key di **`**.env**`**):**

```bash
source .env
forge script script/RewardToken.s.sol:RewardTokenScript \
  --rpc-url bsc_testnet \
  --private-key $PRIVATE_KEY \
  --broadcast \
  --verify \
  -vvvv
```

## Tab 2: Dasar & Struktur Solidity

Solidity itu bahasa buat nulis smart contract di EVM (Ethereum, BNB Chain, dan chain sejenis). Anggap `contract` seperti `class`: ada properti (variabel) dan method (fungsi). Bedanya, sekali di-deploy, dia hidup permanen di blockchain dan datanya tersimpan selamanya.

> Halaman ini disusun persis kayak urutan kamu baca file kontrak dari atas ke bawah. Jadi pas ngajar sambil buka Notion, tinggal ikutin dari atas.

> **Buat yang dari JavaScript:** `contract` = `class`, `struct` mirip object, `mapping` mirip `Map`, `event` mirip `EventEmitter`, `modifier` mirip middleware. Peta lengkapnya ada di bagian bawah.

---

### 1. Baris pertama: SPDX License Identifier

```solidity
// SPDX-License-Identifier: MIT
```

Baris paling atas di kontrak yang rapi. Gunanya nyatain lisensi kode. Kalau gak ada, compiler ngasih warning. Bentuknya: komentar `//` diikuti `SPDX-License-Identifier:` lalu kode lisensinya.

> Hati-hati: `UNLICENSED` (pakai D) artinya "gak ada lisensi" alias tertutup. Beda sama `Unlicense` (tanpa D) yang justru public domain (bebas total). Gampang ketuker.

---

### 2. Baris kedua: versi compiler (pragma)

```solidity
pragma solidity ^0.8.13;
```

- `pragma`: instruksi ke compiler, bukan kode yang dijalankan.
- `solidity`: nyebut ini aturan versi bahasa Solidity.
- `^0.8.13`: versi yang diizinkan.
- `;`: penutup statement.

> Buat production, pin ke satu versi pasti (mis. `0.8.28`). Buat belajar, `^0.8.x` udah cukup.

---

### 3. Baris import (kalau ada)

```solidity
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
```

Ambil kode dari file lain biar gak nulis ulang. Kurung kurawal `{Ownable}` artinya named import: cuma ambil yang kita sebut. Dibahas lebih dalam di bagian OpenZeppelin.

---

### 4. Baris contract

```solidity
contract Counter {
    // isi
}
```

- `contract`: kata kunci buat mulai kontrak (seperti `class`).
- `Counter`: nama kontrak, konvensinya CapWords.
- `{ ... }`: badan kontrak.

Selain `contract`, ada 3 bentuk lain. Ini bedanya:

---

### 5. Apa aja yang ada di dalam kontrak (urutan penulisan)

Begitu masuk `{`, isi kontrak sebaiknya ditulis dengan urutan ini biar rapi dan gampang diaudit:

1. Type declarations (`struct`, `enum`, `using`)
2. State variables (`constant`, `immutable`, lalu storage biasa)
3. Events
4. Errors (custom error)
5. Modifiers
6. Functions

Urutan fungsi: `constructor`, `receive`, `fallback`, lalu `external`, `public`, `internal`, `private`. Dalam tiap grup: `payable`, non-payable, `view`, `pure`.

Baris pertama yang biasanya kamu tulis di dalam kontrak itu sebuah variabel, contohnya `uint256 public number;`. Baris ini gabungan dua konsep: tipe data (`uint256`) dan visibility (`public`). Dua-duanya dibahas persis di bawah.

---

### 6. Tipe data

#### 6a. Value types (nilainya disalin saat dipakai)

> Solidity gak punya desimal/float. Uang dihitung pakai integer satuan terkecil. Contoh: token 18 desimal, 1 token ditulis `1e18`. `uint` juga punya ukuran lebih kecil (`uint8` sampai `uint128`) buat hemat storage lewat packing.

#### 6b. Reference types (butuh lokasi data)

#### 6c. Nilai default

Gak ada `null` atau `undefined`. Semua langsung punya default: `uint` jadi `0`, `bool` jadi `false`, `address` jadi `address(0)`, `string` jadi `""`, array jadi kosong.

---

### 7. Visibility (siapa yang boleh manggil)

Tiap variabel dan fungsi punya visibility. Ini nentuin siapa yang boleh akses.

> Di `uint256 public number;`, kata `public` inilah yang bikin siapa aja bisa baca `number` dari luar (lewat getter otomatis `number()`).

---

### 8. State mutability (fungsi ngapain ke data)

> `setNumber` di Counter gak punya `view`, jadi dia nulis state (bayar gas). Getter `number()` itu `view` (gratis).

---

### 9. Variabel: state, local, global

- **State variable**: ditulis di level kontrak, tersimpan di storage (permanen). Contoh: `uint256 public number;`
- **Local variable**: dideklarasi di dalam fungsi, sementara, hilang setelah fungsi selesai.
- **Global variable**: disediakan EVM, mis. `msg.sender`, `block.timestamp` (lihat bagian 14).

Dua kata kunci hemat gas buat nilai yang gak berubah:

- `**constant**`: nilainya ditentuin saat nulis kode. Contoh: `uint256 public constant MAX = 100;`
- `**immutable**`: diisi sekali di `constructor`, habis itu terkunci. Contoh: `address public immutable owner;`

Keduanya masuk ke bytecode, jadi gak baca storage yang mahal.

---

### 10. Lokasi data: storage / memory / calldata

Analogi: `storage` = brankas, `memory` = catatan tangan, `calldata` = surat masuk (baca doang).

Jebakan umum: `storage` itu pointer ke data asli, jadi ngubah lewat variabel storage bikin data aslinya ikut berubah. `memory` itu salinan, ubahannya gak nyentuh aslinya.

```solidity
Data storage t = daftarData[0]; // pointer: ubah t = ubah data asli
Data memory m = daftarData[0];  // salinan: ubah m gak ngaruh ke asli
```

---

## Tab 3: Bikin RewardToken (Best Practice)

RewardToken itu token ERC-20 yang jadi hadiah di Papan Sayembara, proyek yang kita bangun mulai minggu depan. Di sesi ini kamu bikin token ini dari nol, dan sambil bikin kamu bakal ketemu hampir semua konsep Solidity dari Tab 2.

> **Kenapa token dulu:** token ini yang dipakai sebagai hadiah di bounty (minggu 3-4). Jadi begitu token beres minggu ini, minggu depan tinggal fokus ke logika bounty-nya.

Di bawah ada kode utuh (hasil akhirnya). Kalau kamu mau paham pelan-pelan, jangan langsung ketik semua. Ikutin bagian **Bangun bertahap**: token dibangun dari yang paling sederhana sampai lengkap.

---

### Kode utuh (hasil akhir)

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

/// @title RewardToken - token hadiah buat Papan Sayembara
contract RewardToken is ERC20, Ownable {
    uint256 public constant MAX_SUPPLY = 1_000_000 ether;
    mapping(address => bool) public isMinter;

    event MinterSet(address indexed account, bool allowed);

    error BukanMinter(address caller);
    error MelebihiMaxSupply(uint256 diminta, uint256 sisa);
    error AlamatNol();

    modifier hanyaMinter() {
        if (msg.sender != owner() && !isMinter[msg.sender]) {
            revert BukanMinter(msg.sender);
        }
        _;
    }

    constructor(uint256 initialSupply, address initialOwner)
        ERC20("Reward Token", "RWD")
        Ownable(initialOwner)
    {
        _mintDenganCek(initialOwner, initialSupply);
    }

    function setMinter(address account, bool allowed) external onlyOwner {
        if (account == address(0)) revert AlamatNol();
        isMinter[account] = allowed;
        emit MinterSet(account, allowed);
    }

    function mint(address to, uint256 amount) external hanyaMinter {
        _mintDenganCek(to, amount);
    }

    function _mintDenganCek(address to, uint256 amount) internal {
        uint256 sisa = MAX_SUPPLY - totalSupply();
        if (amount > sisa) revert MelebihiMaxSupply(amount, sisa);
        _mint(to, amount);
    }

    function burn(uint256 amount) external {
        _burn(msg.sender, amount);
    }
}
```

---

### Bangun bertahap

Biar gampang paham, token ini dibangun dari sederhana ke lengkap. Tiap langkah, timpa isi `src/RewardToken.sol` dengan kode di bawah, lalu jalanin `forge build`. Semua kode di sini udah dipastikan bisa dikompilasi.

#### Langkah 1: Token yang langsung jalan

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract RewardToken is ERC20 {
    constructor() ERC20("Reward Token", "RWD") {
        _mint(msg.sender, 1000 ether);
    }
}
```

Kamu mewarisi `ERC20` dari OpenZeppelin (`is ERC20`), jadi gak perlu nulis token dari nol. `constructor` jalan sekali pas deploy, dan `_mint` nyetak 1000 token ke kamu (si deployer). Habis `forge build`, kamu udah punya token beneran.

#### Langkah 2: Owner bisa mint, siapa pun bisa burn

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

contract RewardToken is ERC20, Ownable {
    constructor() ERC20("Reward Token", "RWD") Ownable(msg.sender) {
        _mint(msg.sender, 1000 ether);
    }

    function mint(address to, uint256 amount) external onlyOwner {
        _mint(to, amount);
    }

    function burn(uint256 amount) external {
        _burn(msg.sender, amount);
    }
}
```

Sekarang kamu tambah `Ownable` biar token punya pemilik. `mint` dikasih `onlyOwner`, jadi cuma pemilik yang boleh nyetak token baru. `burn` bikin siapa pun bisa bakar token miliknya sendiri.

#### Langkah 3: Daftar minter + batas suplai

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

contract RewardToken is ERC20, Ownable {
    uint256 public constant MAX_SUPPLY = 1_000_000 ether;
    mapping(address => bool) public isMinter;

    constructor() ERC20("Reward Token", "RWD") Ownable(msg.sender) {
        _mint(msg.sender, 1000 ether);
    }

    function setMinter(address account, bool allowed) external onlyOwner {
        isMinter[account] = allowed;
    }

    function mint(address to, uint256 amount) external {
        require(msg.sender == owner() || isMinter[msg.sender], "bukan minter");
        require(totalSupply() + amount <= MAX_SUPPLY, "lewat cap");
        _mint(to, amount);
    }

    function burn(uint256 amount) external {
        _burn(msg.sender, amount);
    }
}
```

`MAX_SUPPLY` (`constant`) ngebatasin total token yang bisa ada. `mapping isMinter` nyimpen daftar alamat yang boleh mint, nanti kontrak escrow bounty didaftarin di sini. Cek di langkah ini masih pakai `require` biasa. Di langkah 4 kita rapihin biar lebih hemat gas.

#### Langkah 4: Versi best practice

Langkah 4 itu penyempurnaan dari langkah 3, dan hasilnya sama persis dengan **Kode utuh** di atas halaman ini. Yang berubah:

- `require("string")` diganti **custom error** (`if (..) revert Error()`), lebih hemat gas karena string gak nempel di bytecode.
- Cek izin yang panjang dirapikan jadi satu **modifier** `hanyaMinter`.
- Ditambah **event** `MinterSet` dan validasi `address(0)` di `setMinter`. (Owner `address(0)` gak perlu dicek manual di constructor, karena `Ownable` OpenZeppelin udah nolak duluan, jadi gak ada kode mubazir.)
- `constructor` dibikin berparameter (`initialSupply`, `initialOwner`) biar fleksibel dan gampang dites.
- Cek cap dipindah ke fungsi `internal` `_mintDenganCek` biar bisa dipakai ulang di `constructor` dan `mint`.

Habis ini, `forge test` harus 10 hijau dan `forge coverage` buat RewardToken 100%.

---

### Konsep Solidity yang kamu pakai

Cuma satu kontrak, tapi hampir semua konsep dari Tab 2 kepakai:

- [x] import + inheritance (OpenZeppelin)
- [x] constructor + constructor induk
- [x] `constant`
- [x] `mapping`
- [x] `event` + `emit` + `indexed`
- [x] custom `error` + `revert`
- [x] `modifier`
- [x] visibility: `external`, `internal`, `public`
- [x] `msg.sender`
- [x] validasi input (`address(0)` di `setMinter`)

---

### Test (coverage 100%)

Bikin file `test/RewardToken.t.sol` dengan isi di bawah, lalu jalanin `forge test -vv`. Harusnya 10 test hijau, dan `forge coverage` nunjukin RewardToken.sol 100% (semua fungsi + cabang sukses dan gagal kepanggil).

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Test} from "forge-std/Test.sol";
import {RewardToken} from "../src/RewardToken.sol";

contract RewardTokenTest is Test {
    RewardToken token;
    address owner = address(0xA11CE);
    address minter = address(0x515C0);
    address bob = address(0xB0B);

    function setUp() public {
        token = new RewardToken(1000 ether, owner);
    }

    function test_InitialSupplyKeOwner() public view {
        assertEq(token.balanceOf(owner), 1000 ether);
        assertEq(token.totalSupply(), 1000 ether);
    }

    function test_Revert_ConstructorOwnerNol() public {
        // owner address(0) ditolak Ownable OpenZeppelin (bukan cek kita)
        vm.expectRevert(abi.encodeWithSignature("OwnableInvalidOwner(address)", address(0)));
        new RewardToken(1000 ether, address(0));
    }

    function test_SetMinter() public {
        vm.prank(owner);
        token.setMinter(minter, true);
        assertTrue(token.isMinter(minter));
    }

    function test_Revert_SetMinterAlamatNol() public {
        vm.prank(owner);
        vm.expectRevert(RewardToken.AlamatNol.selector);
        token.setMinter(address(0), true);
    }

    function test_Revert_SetMinterBukanOwner() public {
        vm.expectRevert(abi.encodeWithSignature("OwnableUnauthorizedAccount(address)", bob));
        vm.prank(bob);
        token.setMinter(minter, true);
    }

    function test_MintOlehOwner() public {
        vm.prank(owner);
        token.mint(bob, 10 ether);
        assertEq(token.balanceOf(bob), 10 ether);
    }

    function test_MintOlehMinter() public {
        vm.prank(owner);
        token.setMinter(minter, true);
        vm.prank(minter);
        token.mint(bob, 25 ether);
        assertEq(token.balanceOf(bob), 25 ether);
    }

    function test_Revert_MintBukanMinter() public {
        vm.expectRevert(abi.encodeWithSelector(RewardToken.BukanMinter.selector, bob));
        vm.prank(bob);
        token.mint(bob, 1 ether);
    }

    function test_Revert_MintMelebihiMaxSupply() public {
        uint256 max = token.MAX_SUPPLY();
        vm.prank(owner);
        vm.expectRevert();
        token.mint(owner, max);
    }

    function test_Burn() public {
        vm.prank(owner);
        token.burn(400 ether);
        assertEq(token.balanceOf(owner), 600 ether);
        assertEq(token.totalSupply(), 600 ether);
    }
}
```

---

### Deploy + verify

Command lengkapnya ada di **Tab 1 bagian 9**. `constructor` butuh dua argumen: `initialSupply` (mis. `1000 ether`) dan `initialOwner` (alamat wallet kamu).

---

### Token ini dipakai di mana

RewardToken jadi hadiah di Papan Sayembara (Pertemuan 3). Di Sesi 3, `RewardToken.sol` dan `RewardToken.t.sol` ini disalin ke project bounty biar hadiahnya siap.
