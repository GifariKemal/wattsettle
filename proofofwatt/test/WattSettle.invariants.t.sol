// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Test} from "forge-std/Test.sol";
import {WattSettle} from "../src/WattSettle.sol";
import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract InvToken is ERC20 {
    constructor() ERC20("suriota", "suriota") {
        _mint(msg.sender, 1_000_000 ether);
    }
}

/// @notice Handler yang menyerang kontrak dengan bacaan dan attestation acak.
/// @dev Yang membuat suite ini bermakna adalah kebebasan handler untuk BERBOHONG. Ia
///      mengirim `kwhDeltaVsBaseline` dan `anomalyScoreBps` yang tidak ada hubungannya
///      dengan bacaan sebenarnya, persis seperti verifier yang berkhianat. Kalau kontrak
///      benar, tidak ada satu pun urutan kebohongan yang bisa memaksa pembayaran.
///
///      Handler sengaja dibuat TIDAK PERNAH revert, supaya `fail_on_revert = true` bisa
///      dipakai. Kalau handler boleh revert, sebagian besar panggilan bisa gagal diam-diam
///      dan invariant lolos hanya karena tidak ada yang terjadi.
contract Handler is Test {
    WattSettle public immutable ws;
    InvToken public immutable tok;

    uint256 internal constant DEVICE_KEY = 0xA11CE;
    bytes32 public immutable deviceId;
    address public immutable deviceOwner;
    address public immutable treasury;

    bytes32 private constant READING_TYPEHASH =
        keccak256("Reading(bytes32 deviceId,uint256 kWh,uint64 timestamp,uint256 nonce)");

    // Ghost variables, dihitung di sisi test bukan dibaca dari kontrak.
    uint256 public ghostGrossApproved;
    uint256 public ghostApproved;
    uint256 public ghostRejected;
    uint256 public ghostSettled;

    uint64 private ts = 1000;
    uint256 private nonce;

    constructor(WattSettle _ws, InvToken _tok, bytes32 _deviceId, address _owner, address _treasury) {
        ws = _ws;
        tok = _tok;
        deviceId = _deviceId;
        deviceOwner = _owner;
        treasury = _treasury;
    }

    function _sign(uint256 kWh, uint64 t, uint256 n) internal view returns (bytes memory) {
        bytes32 structHash = keccak256(abi.encode(READING_TYPEHASH, deviceId, kWh, t, n));
        bytes32 domainSeparator = keccak256(
            abi.encode(
                keccak256("EIP712Domain(string name,string version,uint256 chainId,address verifyingContract)"),
                keccak256(bytes("ProofOfWatt")),
                keccak256(bytes("1")),
                block.chainid,
                address(ws)
            )
        );
        (uint8 v, bytes32 r, bytes32 s) =
            vm.sign(DEVICE_KEY, keccak256(abi.encodePacked("\x19\x01", domainSeparator, structHash)));
        return abi.encodePacked(r, s, v);
    }

    /// @notice Kirim satu bacaan. Timestamp selalu maju supaya monotonic guard tidak revert.
    /// @dev Sebaran kWh sengaja TIDAK seragam. Versi pertama handler ini memakai rentang
    ///      seragam 0..5000 terhadap baseline 100, dan hasilnya nol approval dari 1505
    ///      settlement. Empat invariant jadi hampa, cuma membandingkan nol dengan nol.
    ///      Sekarang tiga dari empat bacaan berada di sekitar baseline supaya jalur
    ///      persetujuan benar-benar terlatih, sisanya tetap liar untuk menguji penolakan.
    function submitReading(uint256 kWhSeed) external {
        uint256 kWh = kWhSeed % 4 == 0 ? bound(kWhSeed, 0, 5_000) : bound(kWhSeed, 70, 140);
        ts += 1;
        nonce += 1;
        ws.submitReading(deviceId, kWh, ts, nonce, _sign(kWh, ts, nonce));
    }

    /// @notice Attest sebuah bacaan dengan angka yang boleh sepenuhnya karangan.
    function attestAndSettle(uint256 idSeed, uint256 deltaSeed, uint256 anomalySeed) external {
        uint256 total = ws.submissionCount();
        if (total == 0) return;

        uint256 id = bound(idSeed, 0, total - 1);
        (, uint256 kWh,,, WattSettle.Status status) = ws.submissions(id);
        if (status != WattSettle.Status.Pending) return; // hindari revert NotPending

        // Tiga watak verifier, dipilih dari seed. Campuran ini penting: kalau semua
        // attestation acak, verifier hampir tidak pernah lolos ambang dan jalur pembayaran
        // tidak pernah tersentuh, sehingga invariant akuntansi jadi hampa.
        int256 delta;
        uint16 anomalyBps;
        uint256 mood = anomalySeed % 3;
        if (mood == 0) {
            // Jujur. Memakai hitungan kontrak sendiri, jadi keputusannya murni soal bacaan.
            (delta, anomalyBps) = ws.assess(deviceId, kWh);
        } else if (mood == 1) {
            // Berkhianat. Mengaku bacaan sempurna apa pun kenyataannya. Inilah watak yang
            // membuat invariant utama bermakna.
            delta = 0;
            anomalyBps = 0;
        } else {
            // Ngawur. Rentang dijaga jauh dari type(int256).min supaya negasi di _abs aman.
            delta = int256(bound(deltaSeed, 0, 2_000)) - 1_000;
            anomalyBps = uint16(bound(anomalySeed, 0, 4_000));
        }

        WattSettle.Attestation memory a = WattSettle.Attestation({
            kwhDeltaVsBaseline: delta,
            anomalyScoreBps: anomalyBps,
            modelVersionHash: bytes32(0),
            rulesetHash: bytes32(0),
            evaluatedAt: uint64(block.timestamp)
        });

        ws.attestAndSettle(id, a);
        ghostSettled += 1;

        (,,,, WattSettle.Status settled) = ws.submissions(id);
        if (settled == WattSettle.Status.Approved) {
            ghostApproved += 1;
            ghostGrossApproved += kWh * ws.rewardPerKwh();
        } else {
            ghostRejected += 1;
        }
    }
}

/// @notice Properti yang harus benar untuk SETIAP urutan aksi, bukan hanya contoh yang dipilih.
contract WattSettleInvariantTest is Test {
    WattSettle internal ws;
    InvToken internal tok;
    Handler internal handler;

    bytes32 internal constant DEVICE_ID = keccak256("SRT-MGATE-1210-#001");
    uint96 internal constant BASELINE = 100;
    address internal deviceOwner = address(0xBEEF);
    address internal treasury = address(0xFEE5);

    uint256 internal initialPool;

    function setUp() public {
        tok = new InvToken();
        ws = new WattSettle(tok);
        ws.setTreasury(treasury);
        ws.registerDevice(DEVICE_ID, vm.addr(0xA11CE), deviceOwner, BASELINE);

        // Reward per kWh dikecilkan supaya pool tidak pernah kering sepanjang kampanye
        // invariant, sehingga InsufficientRewardPool tidak menutupi properti yang diuji.
        ws.setRewardPerKwh(1e12);

        initialPool = 900_000 ether;
        assertTrue(tok.transfer(address(ws), initialPool));

        handler = new Handler(ws, tok, DEVICE_ID, deviceOwner, treasury);
        ws.grantRole(ws.VERIFIER_ROLE(), address(handler));

        targetContract(address(handler));
    }

    /// @dev INVARIANT UTAMA. Setiap bacaan yang berstatus Approved WAJIB lolos penilaian
    ///      kontrak sendiri terhadap baseline on-chain. Handler bebas berbohong sebesar
    ///      apa pun, jadi kalau properti ini bertahan, verifier memang tidak punya kuasa
    ///      meloloskan apa pun yang ditolak kontrak.
    function invariant_ApprovedReadingsAlwaysPassContractAssessment() public view {
        uint256 total = ws.submissionCount();
        uint16 maxAnomalyBps = ws.maxAnomalyBps();
        uint256 maxDeltaBound = ws.maxDeltaBound();

        for (uint256 i = 0; i < total; i++) {
            (bytes32 deviceId, uint256 kWh,,, WattSettle.Status status) = ws.submissions(i);
            if (status != WattSettle.Status.Approved) continue;

            (int256 delta, uint16 anomalyBps) = ws.assess(deviceId, kWh);
            uint256 absDelta = delta >= 0 ? uint256(delta) : uint256(-delta);

            assertLe(anomalyBps, maxAnomalyBps, "approved padahal anomali kontrak di atas ambang");
            assertLe(absDelta, maxDeltaBound, "approved padahal delta kontrak di luar bound");
        }
    }

    /// @dev Token yang keluar dari pool persis sama dengan total reward kotor bacaan yang
    ///      disetujui. Tidak ada kebocoran, dan bacaan yang ditolak tidak memindahkan apa pun.
    function invariant_PoolDrainEqualsApprovedGross() public view {
        assertEq(initialPool - tok.balanceOf(address(ws)), handler.ghostGrossApproved());
    }

    /// @dev Reward kotor terbagi habis antara produsen dan treasury, tanpa sisa yang hilang.
    function invariant_ProducerPlusTreasuryEqualsGross() public view {
        assertEq(tok.balanceOf(deviceOwner) + tok.balanceOf(treasury), handler.ghostGrossApproved());
    }

    /// @dev Counter reputasi on-chain tidak pernah menyimpang dari jumlah settle sebenarnya.
    function invariant_ReputationMatchesSettledCount() public view {
        (uint32 approved, uint32 rejected,) = ws.deviceReputation(DEVICE_ID);
        assertEq(uint256(approved), handler.ghostApproved());
        assertEq(uint256(rejected), handler.ghostRejected());
        assertEq(uint256(approved) + rejected, handler.ghostSettled());
    }

    /// @dev Treasury tidak pernah menerima lebih dari batas keras fee, 1000 bps.
    function invariant_TreasuryNeverExceedsFeeCap() public view {
        assertLe(tok.balanceOf(treasury) * 10_000, handler.ghostGrossApproved() * 1_000);
    }

    /// @dev Pool tidak pernah menjadi negatif secara efektif, dan kontrak tidak pernah
    ///      membayar melebihi yang pernah dimilikinya.
    function invariant_PoolNeverOverdrawn() public view {
        assertLe(handler.ghostGrossApproved(), initialPool);
    }
}
