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

    /// @dev Batas atas bacaan per pengiriman, satu triliun kWh. Angka ini absurd untuk satu
    ///      meter, jadi tidak pernah menolak bacaan sah. Gunanya menjaga aritmetika di
    ///      `_assess` tetap jauh dari batas `uint256` dan `int256`, sehingga bacaan raksasa
    ///      tidak bisa dipakai membuat perhitungan meluap.
    uint256 private constant MAX_KWH_PER_READING = 1e12;

    /// @dev Typed struct yang ditandatangani firmware device. JANGAN diubah, fixture lapangan
    ///      dan test base bergantung pada bentuk persis ini.
    bytes32 private constant READING_TYPEHASH =
        keccak256("Reading(bytes32 deviceId,uint256 kWh,uint64 timestamp,uint256 nonce)");

    /// @notice Satu unit meter terdaftar.
    /// @param signer Alamat publik kunci ECDSA device, tujuan `ECDSA.recover`.
    /// @param owner Penerima pembayaran atas bacaan yang disetujui.
    /// @param lastTs Timestamp bacaan terakhir yang diterima, penjaga monotonic.
    /// @param baselineKwh Konsumsi wajar device per interval. Kontrak memakainya untuk
    ///        menghitung sendiri penyimpangan sebuah bacaan, tanpa bergantung pada angka
    ///        yang dikirim verifier. Baseline nol berarti device belum dikalibrasi, dan
    ///        bacaannya tidak akan pernah lolos gate.
    struct Device {
        address signer;
        address owner;
        uint64 lastTs;
        uint96 baselineKwh;
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
    /// @dev Ini adalah penilaian INDEPENDEN milik verifier, bukan sumber kebenaran. Kontrak
    ///      menghitung angkanya sendiri dari baseline on-chain, lalu keduanya harus sama-sama
    ///      lolos. Artinya verifier bisa menolak bacaan yang secara aritmetika terlihat wajar
    ///      (misalnya karena sinyal cuaca atau kesehatan perangkat yang hanya dia lihat),
    ///      tetapi tidak pernah bisa meloloskan bacaan yang ditolak kontrak.
    ///      Nama field mencerminkan semantik `validationResponse` ERC-8004 agar integrasi ke
    ///      Validation Registry tidak perlu terjemahan tambahan.
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

    event DeviceRegistered(bytes32 indexed deviceId, address signer, address owner, uint96 baselineKwh);
    event DeviceBaselineUpdated(bytes32 indexed deviceId, uint96 baselineKwh);
    event ReadingSubmitted(uint256 indexed id, bytes32 indexed deviceId, uint256 kWh, uint64 timestamp);

    /// @notice Rationale AI lengkap berdampingan dengan hitungan kontrak sendiri.
    /// @dev Dua angka sengaja ditulis bersebelahan supaya siapa pun bisa membandingkan apa
    ///      yang DIKATAKAN verifier dengan apa yang DIHITUNG kontrak. Selisih di antara
    ///      keduanya adalah sinyal, bukan detail teknis.
    /// @param a Penilaian verifier.
    /// @param chainDelta Selisih kWh terhadap baseline, dihitung kontrak sendiri.
    /// @param chainAnomalyBps Skor anomali, dihitung kontrak sendiri.
    event ReadingAttested(
        uint256 indexed id,
        bytes32 indexed deviceId,
        bool approved,
        Attestation a,
        int256 chainDelta,
        uint16 chainAnomalyBps
    );

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
    error ImplausibleReading();

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

    /// @notice Mendaftarkan satu unit meter beserta signer, penerima pembayaran, dan baselinenya.
    /// @param deviceId Identitas device, contoh keccak256("SRT-MGATE-1210-#001").
    /// @param signer Alamat publik kunci ECDSA device.
    /// @param owner Penerima pembayaran. Wajib bukan alamat nol supaya payout tidak terbakar.
    /// @param baselineKwh Konsumsi wajar per interval, dipakai kontrak untuk menilai sendiri.
    ///        Boleh nol saat pendaftaran awal, tetapi selama masih nol seluruh bacaan device
    ///        ini akan ditolak gate. Kalibrasi dulu lewat `setDeviceBaseline`.
    function registerDevice(bytes32 deviceId, address signer, address owner, uint96 baselineKwh)
        external
        onlyRole(DEFAULT_ADMIN_ROLE)
    {
        if (signer == address(0) || owner == address(0)) revert ZeroAddress();
        devices[deviceId] = Device({signer: signer, owner: owner, lastTs: 0, baselineKwh: baselineKwh});
        emit DeviceRegistered(deviceId, signer, owner, baselineKwh);
    }

    /// @notice Mengkalibrasi ulang baseline sebuah device.
    /// @dev Baseline bergeser mengikuti musim dan perubahan beban, jadi ia memang harus bisa
    ///      diperbarui tanpa mendaftar ulang device (mendaftar ulang akan mereset `lastTs`).
    function setDeviceBaseline(bytes32 deviceId, uint96 baselineKwh) external onlyRole(DEFAULT_ADMIN_ROLE) {
        Device storage d = devices[deviceId];
        if (d.signer == address(0)) revert UnknownDevice();
        d.baselineKwh = baselineKwh;
        emit DeviceBaselineUpdated(deviceId, baselineKwh);
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
        if (kWh > MAX_KWH_PER_READING) revert ImplausibleReading();

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
    /// @dev Menggantikan `verifyReading(uint256,bool)` dari base.
    ///
    ///      Gate-nya berlapis dua dan urutannya penting. Kontrak lebih dulu menghitung
    ///      penyimpangan bacaan terhadap baseline device yang tersimpan on-chain, memakai
    ///      aritmetikanya sendiri. Baru sesudah itu penilaian verifier ikut diperhitungkan.
    ///      Keduanya harus sama-sama lolos.
    ///
    ///      Konsekuensinya adalah properti keamanan yang paling penting di kontrak ini:
    ///      verifier yang berbohong TIDAK BISA memaksa pembayaran. Ia hanya bisa menolak
    ///      bacaan yang secara aritmetika terlihat wajar, misalnya karena melihat sinyal cuaca
    ///      atau kesehatan perangkat yang tidak terlihat on-chain. Hak veto ada padanya, hak
    ///      meloloskan tidak.
    ///
    ///      Urutan checks-effects-interactions dijaga penuh, status di-set sebelum transfer
    ///      apa pun, diperkuat `nonReentrant` dan solvency check.
    /// @param id Reading id hasil `submitReading`.
    /// @param a Penilaian independen dari verifier.
    function attestAndSettle(uint256 id, Attestation calldata a) external onlyRole(VERIFIER_ROLE) nonReentrant {
        Submission storage s = submissions[id];
        if (s.status != Status.Pending) revert NotPending();

        // Lapis satu, hitungan kontrak sendiri dari baseline on-chain. Tidak bisa dipengaruhi verifier.
        (int256 chainDelta, uint16 chainAnomalyBps) = _assess(devices[s.deviceId].baselineKwh, s.kWh);
        bool contractApproves = (chainAnomalyBps <= maxAnomalyBps) && (_abs(chainDelta) <= maxDeltaBound);

        // Lapis dua, penilaian verifier. Hanya bisa memperketat, tidak pernah melonggarkan.
        bool verifierApproves = (a.anomalyScoreBps <= maxAnomalyBps) && (_abs(a.kwhDeltaVsBaseline) <= maxDeltaBound);

        bool approved = contractApproves && verifierApproves;

        // Effects, status di-set sebelum interaksi eksternal.
        s.status = approved ? Status.Approved : Status.Rejected;

        // Counter reputasi per device. Yang dicatat adalah skor yang lebih buruk di antara
        // kedua penilaian, supaya reputasi tidak bisa dipoles verifier yang lunak.
        Reputation storage rep = deviceReputation[s.deviceId];
        if (approved) {
            rep.approvedReadings += 1;
        } else {
            rep.rejectedReadings += 1;
        }
        uint16 worstAnomalyBps = a.anomalyScoreBps > chainAnomalyBps ? a.anomalyScoreBps : chainAnomalyBps;
        rep.avgAnomalyBps =
            _rollAvg(rep.avgAnomalyBps, worstAnomalyBps, uint256(rep.approvedReadings) + rep.rejectedReadings);

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

        emit ReadingAttested(id, s.deviceId, approved, a, chainDelta, chainAnomalyBps);
    }

    // ---------------------------------------------------------------------
    // View dan helper
    // ---------------------------------------------------------------------

    /// @notice Jumlah bacaan yang pernah masuk.
    function submissionCount() external view returns (uint256) {
        return submissions.length;
    }

    /// @notice Menghitung penyimpangan sebuah bacaan terhadap baseline, persis seperti yang
    ///         dilakukan kontrak saat menyelesaikan pembayaran.
    /// @dev Dibuka sebagai `public view` supaya siapa pun bisa mensimulasikan penilaian
    ///      kontrak sebelum mengirim apa pun, dan supaya klaim "kontrak menghitung sendiri"
    ///      bisa dicek langsung dari tab Read Contract di block explorer.
    /// @param deviceId Device yang dinilai.
    /// @param kWh Bacaan yang hendak diuji.
    /// @return delta Selisih terhadap baseline, bertanda.
    /// @return anomalyBps Skor anomali 0..10000 basis points.
    function assess(bytes32 deviceId, uint256 kWh) external view returns (int256 delta, uint16 anomalyBps) {
        return _assess(devices[deviceId].baselineKwh, kWh);
    }

    /// @dev Aritmetika penilaian, sengaja bilangan bulat penuh supaya hasilnya identik dengan
    ///      yang dihitung ulang siapa pun di luar rantai.
    ///
    ///      Baseline nol diperlakukan sebagai device belum dikalibrasi. Pembaginya dipaksa
    ///      satu, sehingga bacaan sekecil apa pun menghasilkan skor anomali maksimum dan
    ///      pasti ditolak gate. Ini disengaja: lebih baik menolak membayar device yang belum
    ///      dikalibrasi daripada membayar berdasarkan baseline yang tidak pernah ditetapkan.
    ///
    ///      `kWh` sudah dibatasi `MAX_KWH_PER_READING` di `submitReading` dan `baselineKwh`
    ///      muat di `uint96`, jadi `diff * BPS_DENOMINATOR` tidak mungkin meluap dan
    ///      konversi ke `int256` selalu aman.
    function _assess(uint96 baselineKwh, uint256 kWh) internal pure returns (int256 delta, uint16 anomalyBps) {
        uint256 baseline = uint256(baselineKwh);
        uint256 diff = kWh >= baseline ? kWh - baseline : baseline - kWh;
        uint256 span = baseline == 0 ? 1 : baseline;

        uint256 bps = (diff * BPS_DENOMINATOR) / span;
        anomalyBps = bps > BPS_DENOMINATOR ? BPS_DENOMINATOR : uint16(bps);

        // casting to 'int256' is safe because diff is bounded by MAX_KWH_PER_READING plus
        // type(uint96).max, jauh di bawah type(int256).max
        // forge-lint: disable-next-line(unsafe-typecast)
        delta = kWh >= baseline ? int256(diff) : -int256(diff);
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
