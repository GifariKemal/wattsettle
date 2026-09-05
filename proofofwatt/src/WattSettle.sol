// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {AccessControl} from "@openzeppelin/contracts/access/AccessControl.sol";
import {EIP712} from "@openzeppelin/contracts/utils/cryptography/EIP712.sol";
import {ECDSA} from "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {SafeERC20} from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import {ReentrancyGuard} from "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/// @title WattSettle - DePIN energy settlement rail: signed IoT readings, AI-attested, token-settled.
/// @author PT Surya Inovasi Prioritas (SURIOTA)
/// @notice Sebuah device meter menandatangani bacaan kWh (EIP-712), siapa pun boleh me-relay-nya
///         on-chain, lalu AI verifier (VERIFIER_ROLE) menuliskan rationale numerik sebagai
///         `Attestation`. Kontrak yang memutus approve atau reject lewat gate ruleset on-chain,
///         bukan verifier, lalu menyelesaikan pembayaran ke pemilik device dengan potongan fee
///         protokol ke treasury.
/// @dev Evolusi terkendali dari `ProofOfWatt.sol`. Jalur masuk kriptografis (EIP-712 recover,
///      `usedDigest` replay guard, `lastTs` monotonic guard) sengaja dipertahankan apa adanya,
///      termasuk domain separator EIP-712 `ProofOfWatt/1`, supaya fixture tanda tangan device
///      yang sudah ada tetap valid. Yang berubah hanya lapisan keputusan dan settlement.
contract WattSettle is AccessControl, EIP712, ReentrancyGuard {
    using SafeERC20 for IERC20;

    /// @notice Role yang boleh memanggil `attestAndSettle`. Dipegang wallet AI verifier.
    bytes32 public constant VERIFIER_ROLE = keccak256("VERIFIER_ROLE");

    /// @dev Penyebut basis points. 10000 bps = 100 persen.
    uint16 private constant BPS_DENOMINATOR = 10_000;

    /// @dev Batas keras fee protokol, 1000 bps = 10 persen. Menjaga admin tidak bisa menyedot
    ///      seluruh reward produsen lewat satu panggilan setter.
    uint16 private constant MAX_FEE_BPS = 1_000;

    /// @dev Typed struct yang ditandatangani firmware device. JANGAN diubah, fixture lapangan
    ///      dan test base bergantung pada bentuk persis ini.
    bytes32 private constant READING_TYPEHASH =
        keccak256("Reading(bytes32 deviceId,uint256 kWh,uint64 timestamp,uint256 nonce)");

    /// @notice Satu unit meter terdaftar.
    /// @param signer Alamat publik kunci ECDSA device, tujuan `ECDSA.recover`.
    /// @param owner Penerima pembayaran atas bacaan yang disetujui.
    /// @param lastTs Timestamp bacaan terakhir yang diterima, penjaga monotonic.
    struct Device {
        address signer;
        address owner;
        uint64 lastTs;
    }

    /// @notice Siklus hidup satu bacaan.
    enum Status {
        None,
        Pending,
        Approved,
        Rejected
    }

    /// @notice Satu bacaan yang sudah lolos verifikasi tanda tangan dan menunggu attestation.
    struct Submission {
        bytes32 deviceId;
        uint256 kWh;
        uint64 timestamp;
        uint256 nonce;
        Status status;
    }

    /// @notice Rationale AI yang ditulis on-chain, menggantikan boolean approve.
    /// @dev Nama field mencerminkan semantik `validationResponse` ERC-8004 agar integrasi ke
    ///      Validation Registry live tidak perlu terjemahan tambahan.
    /// @param kwhDeltaVsBaseline Selisih kWh terhadap baseline device, boleh negatif.
    /// @param anomalyScoreBps Skor anomali 0..10000 basis points. Nilai di luar rentang hanya bisa
    ///        berujung reject, tidak pernah menaikkan payout, jadi tidak perlu divalidasi terpisah.
    /// @param modelVersionHash keccak256 versi model atau logic yang dipin, membuatnya auditable.
    /// @param rulesetHash keccak256 isi file ruleset di repo, bisa dihitung ulang siapa pun.
    /// @param evaluatedAt Waktu verifier mengevaluasi bacaan.
    struct Attestation {
        int256 kwhDeltaVsBaseline;
        uint16 anomalyScoreBps;
        bytes32 modelVersionHash;
        bytes32 rulesetHash;
        uint64 evaluatedAt;
    }

    /// @notice Health score dan trust score per device, terakumulasi on-chain.
    /// @param approvedReadings Jumlah bacaan yang lolos gate.
    /// @param rejectedReadings Jumlah bacaan yang ditolak gate.
    /// @param avgAnomalyBps Rata-rata berjalan skor anomali seluruh bacaan device.
    struct Reputation {
        uint32 approvedReadings;
        uint32 rejectedReadings;
        uint16 avgAnomalyBps;
    }

    /// @notice Token settlement yang dibayarkan ke pemilik device.
    IERC20 public immutable rewardToken;

    /// @notice Token wei yang dibayar per kWh pada bacaan yang disetujui.
    uint256 public rewardPerKwh;

    /// @notice Penerima fee protokol.
    address public treasury;

    /// @notice Take rate protokol dalam basis points. 100 bps = 1 persen.
    uint16 public feeBps;

    /// @notice Ambang gate, bacaan dengan skor anomali di atas nilai ini ditolak.
    uint16 public maxAnomalyBps;

    /// @notice Ambang gate, bacaan dengan nilai mutlak delta di atas nilai ini ditolak.
    uint256 public maxDeltaBound;

    /// @notice deviceId ke data device terdaftar.
    mapping(bytes32 => Device) public devices;

    /// @notice Digest EIP-712 yang sudah dipakai, penjaga anti-replay.
    mapping(bytes32 => bool) public usedDigest;

    /// @notice deviceId ke counter reputasi.
    mapping(bytes32 => Reputation) public deviceReputation;

    /// @notice Seluruh bacaan yang pernah masuk, index-nya adalah reading id.
    Submission[] public submissions;

    event DeviceRegistered(bytes32 indexed deviceId, address signer, address owner);
    event ReadingSubmitted(uint256 indexed id, bytes32 indexed deviceId, uint256 kWh, uint64 timestamp);

    /// @notice Rationale AI lengkap, ter-decode di block explorer.
    event ReadingAttested(uint256 indexed id, bytes32 indexed deviceId, bool approved, Attestation a);

    /// @notice Setiap potongan fee protokol terlihat publik.
    event SettlementFeeTaken(uint256 indexed id, address indexed treasury, uint256 fee);

    /// @notice Snapshot penuh parameter setiap kali admin mengubah salah satunya.
    event ParametersUpdated(
        uint256 rewardPerKwh, address treasury, uint16 feeBps, uint16 maxAnomalyBps, uint256 maxDeltaBound
    );

    error BadSignature();
    error ReplayedReading();
    error StaleTimestamp();
    error NotPending();
    error UnknownDevice();
    error InsufficientRewardPool();
    error ZeroAddress();
    error FeeTooHigh();
    error InvalidAnomalyBound();

    /// @notice Memasang settlement token dan parameter default yang siap demo.
    /// @dev Constructor sengaja hanya menerima satu argumen supaya perintah deploy dan
    ///      `cast abi-encode "constructor(address)"` untuk verifikasi tetap sederhana.
    ///      Seluruh parameter lain diubah lewat setter ber-role admin.
    /// @param _rewardToken ERC20 yang dipakai membayar produsen, default token suriota.
    constructor(IERC20 _rewardToken) EIP712("ProofOfWatt", "1") {
        if (address(_rewardToken) == address(0)) revert ZeroAddress();

        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(VERIFIER_ROLE, msg.sender);

        rewardToken = _rewardToken;
        rewardPerKwh = 1 ether; // 1 suriota per kWh
        treasury = msg.sender;
        feeBps = 100; // 1 persen
        maxAnomalyBps = 2_000; // toleransi penyimpangan 20 persen terhadap baseline
        maxDeltaBound = 500; // nilai mutlak delta maksimum 500 kWh per bacaan

        emit ParametersUpdated(rewardPerKwh, treasury, feeBps, maxAnomalyBps, maxDeltaBound);
    }

    // ---------------------------------------------------------------------
    // Admin
    // ---------------------------------------------------------------------

    /// @notice Mendaftarkan satu unit meter beserta signer dan penerima pembayarannya.
    /// @param deviceId Identitas device, contoh keccak256("SRT-MGATE-1210-#001").
    /// @param signer Alamat publik kunci ECDSA device.
    /// @param owner Penerima pembayaran. Wajib bukan alamat nol supaya payout tidak terbakar.
    function registerDevice(bytes32 deviceId, address signer, address owner) external onlyRole(DEFAULT_ADMIN_ROLE) {
        if (signer == address(0) || owner == address(0)) revert ZeroAddress();
        devices[deviceId] = Device({signer: signer, owner: owner, lastTs: 0});
        emit DeviceRegistered(deviceId, signer, owner);
    }

    /// @notice Mengatur token wei yang dibayar per kWh.
    function setRewardPerKwh(uint256 v) external onlyRole(DEFAULT_ADMIN_ROLE) {
        rewardPerKwh = v;
        emit ParametersUpdated(rewardPerKwh, treasury, feeBps, maxAnomalyBps, maxDeltaBound);
    }

    /// @notice Mengatur penerima fee protokol.
    function setTreasury(address v) external onlyRole(DEFAULT_ADMIN_ROLE) {
        if (v == address(0)) revert ZeroAddress();
        treasury = v;
        emit ParametersUpdated(rewardPerKwh, treasury, feeBps, maxAnomalyBps, maxDeltaBound);
    }

    /// @notice Mengatur take rate protokol dalam basis points, dibatasi MAX_FEE_BPS.
    function setFeeBps(uint16 v) external onlyRole(DEFAULT_ADMIN_ROLE) {
        if (v > MAX_FEE_BPS) revert FeeTooHigh();
        feeBps = v;
        emit ParametersUpdated(rewardPerKwh, treasury, feeBps, maxAnomalyBps, maxDeltaBound);
    }

    /// @notice Mengatur dua ambang gate ruleset on-chain.
    /// @param _maxAnomalyBps Ambang skor anomali, wajib di dalam 0..10000.
    /// @param _maxDeltaBound Ambang nilai mutlak delta kWh terhadap baseline.
    function setGateParams(uint16 _maxAnomalyBps, uint256 _maxDeltaBound) external onlyRole(DEFAULT_ADMIN_ROLE) {
        if (_maxAnomalyBps > BPS_DENOMINATOR) revert InvalidAnomalyBound();
        maxAnomalyBps = _maxAnomalyBps;
        maxDeltaBound = _maxDeltaBound;
        emit ParametersUpdated(rewardPerKwh, treasury, feeBps, maxAnomalyBps, maxDeltaBound);
    }

    // ---------------------------------------------------------------------
    // Jalur masuk device, dipertahankan dari base
    // ---------------------------------------------------------------------

    /// @notice Me-relay bacaan yang sudah ditandatangani device.
    /// @dev Memverifikasi tanda tangan EIP-712, timestamp monotonic, dan replay digest.
    ///      Siapa pun boleh menjadi relayer, keabsahan dijamin tanda tangan bukan pengirim.
    /// @param deviceId Identitas device pengirim bacaan.
    /// @param kWh Bacaan energi.
    /// @param timestamp Waktu bacaan menurut device, wajib lebih besar dari bacaan sebelumnya.
    /// @param nonce Pembeda bacaan agar digest unik.
    /// @param sig Tanda tangan ECDSA device atas struct Reading.
    /// @return id Index bacaan, dipakai sebagai reading id di `attestAndSettle`.
    function submitReading(bytes32 deviceId, uint256 kWh, uint64 timestamp, uint256 nonce, bytes calldata sig)
        external
        returns (uint256 id)
    {
        Device storage d = devices[deviceId];
        if (d.signer == address(0)) revert UnknownDevice();
        if (timestamp <= d.lastTs) revert StaleTimestamp();

        bytes32 digest = _hashTypedDataV4(keccak256(abi.encode(READING_TYPEHASH, deviceId, kWh, timestamp, nonce)));
        if (usedDigest[digest]) revert ReplayedReading();
        if (ECDSA.recover(digest, sig) != d.signer) revert BadSignature();

        usedDigest[digest] = true;
        d.lastTs = timestamp;

        id = submissions.length;
        submissions.push(Submission(deviceId, kWh, timestamp, nonce, Status.Pending));
        emit ReadingSubmitted(id, deviceId, kWh, timestamp);
    }

    // ---------------------------------------------------------------------
    // Attestation dan settlement
    // ---------------------------------------------------------------------

    /// @notice Menerima rationale AI, menjalankan gate ruleset on-chain, lalu menyelesaikan pembayaran.
    /// @dev Menggantikan `verifyReading(uint256,bool)` dari base. Verifier hanya memasok angka,
    ///      kontrak yang memutus. Urutan checks-effects-interactions dijaga penuh, status di-set
    ///      sebelum transfer apa pun, diperkuat `nonReentrant` dan solvency check.
    /// @param id Reading id hasil `submitReading`.
    /// @param a Rationale numerik dari verifier.
    function attestAndSettle(uint256 id, Attestation calldata a) external onlyRole(VERIFIER_ROLE) nonReentrant {
        Submission storage s = submissions[id];
        if (s.status != Status.Pending) revert NotPending();

        // Gate ruleset on-chain, deterministik, bukan cap karet.
        bool approved = (a.anomalyScoreBps <= maxAnomalyBps) && (_abs(a.kwhDeltaVsBaseline) <= maxDeltaBound);

        // Effects, status di-set sebelum interaksi eksternal.
        s.status = approved ? Status.Approved : Status.Rejected;

        // Counter reputasi per device.
        Reputation storage rep = deviceReputation[s.deviceId];
        if (approved) {
            rep.approvedReadings += 1;
        } else {
            rep.rejectedReadings += 1;
        }
        rep.avgAnomalyBps =
            _rollAvg(rep.avgAnomalyBps, a.anomalyScoreBps, uint256(rep.approvedReadings) + rep.rejectedReadings);

        // Interactions, hitung reward, fee split, solvency, lalu transfer.
        if (approved) {
            uint256 reward = s.kWh * rewardPerKwh;
            uint256 fee = (reward * feeBps) / BPS_DENOMINATOR;

            if (rewardToken.balanceOf(address(this)) < reward) revert InsufficientRewardPool();

            rewardToken.safeTransfer(devices[s.deviceId].owner, reward - fee);
            if (fee > 0) {
                rewardToken.safeTransfer(treasury, fee);
                emit SettlementFeeTaken(id, treasury, fee);
            }
        }

        emit ReadingAttested(id, s.deviceId, approved, a);
    }

    // ---------------------------------------------------------------------
    // View dan helper
    // ---------------------------------------------------------------------

    /// @notice Jumlah bacaan yang pernah masuk.
    function submissionCount() external view returns (uint256) {
        return submissions.length;
    }

    /// @dev Nilai mutlak, dipakai gate delta terhadap baseline.
    ///      Kasus ekstrem `type(int256).min` tidak punya pasangan positif, dan aritmetika
    ///      checked Solidity 0.8 akan revert di `-x`. Efeknya bacaan tidak jadi diproses,
    ///      tidak pernah berubah menjadi payout, jadi aman ditinggalkan tanpa cabang khusus.
    function _abs(int256 x) internal pure returns (uint256) {
        // casting to 'uint256' is safe because both branches yield a non-negative int256
        // forge-lint: disable-next-line(unsafe-typecast)
        return x >= 0 ? uint256(x) : uint256(-x);
    }

    /// @dev Rata-rata berjalan bilangan bulat atas `count` sampel, tanpa menyimpan riwayat.
    ///      Dipanggil setelah counter dinaikkan sehingga `count` selalu minimal 1.
    function _rollAvg(uint16 prevAvg, uint16 sample, uint256 count) internal pure returns (uint16) {
        if (count <= 1) return sample;
        // casting to 'uint16' is safe because a weighted mean of two uint16 values never
        // exceeds the larger of the two, jadi hasilnya selalu di bawah type(uint16).max
        // forge-lint: disable-next-line(unsafe-typecast)
        return uint16((uint256(prevAvg) * (count - 1) + sample) / count);
    }
}
