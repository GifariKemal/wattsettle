// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Test} from "forge-std/Test.sol";
import {WattSettle} from "../src/WattSettle.sol";
import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {ReentrancyGuard} from "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import {IAccessControl} from "@openzeppelin/contracts/access/IAccessControl.sol";

contract MockToken is ERC20 {
    constructor() ERC20("suriota", "suriota") {
        _mint(msg.sender, 1_000_000 ether);
    }
}

/// @dev Token jahat yang mencoba masuk kembali ke `attestAndSettle` saat payout berjalan.
///      Dipakai membuktikan `nonReentrant` benar-benar menahan, bukan sekadar diklaim.
contract ReentrantToken is ERC20 {
    WattSettle private target;
    uint256 private reenterId;
    bool private armed;

    constructor() ERC20("evil", "EVIL") {
        _mint(msg.sender, 1_000_000 ether);
    }

    /// @param t Kontrak yang diserang.
    /// @param id Reading id LAIN yang masih Pending, supaya yang menahan benar-benar
    ///           `nonReentrant` dan bukan cek `NotPending` dari checks-effects-interactions.
    function arm(WattSettle t, uint256 id) external {
        target = t;
        reenterId = id;
        armed = true;
    }

    function transfer(address to, uint256 amount) public override returns (bool) {
        if (armed) {
            armed = false;
            target.attestAndSettle(reenterId, WattSettle.Attestation(0, 0, bytes32(0), bytes32(0), 0));
        }
        return super.transfer(to, amount);
    }
}

/// @dev Perkakas bersama: signing EIP-712 device dan pembangun Attestation.
abstract contract WattSettleHarness is Test {
    WattSettle internal ws;
    MockToken internal tok;

    uint256 internal constant DEVICE_KEY = 0xA11CE;
    address internal deviceSigner;
    address internal deviceOwner = address(0xBEEF);
    address internal treasury = address(0xFEE5);
    bytes32 internal deviceId = keccak256("SRT-MGATE-1210-#001");
    uint96 internal constant BASELINE_KWH = 100;

    bytes32 internal constant READING_TYPEHASH =
        keccak256("Reading(bytes32 deviceId,uint256 kWh,uint64 timestamp,uint256 nonce)");

    function _deploy() internal {
        deviceSigner = vm.addr(DEVICE_KEY);
        tok = new MockToken();
        ws = new WattSettle(tok);
        ws.setTreasury(treasury);
        assertTrue(tok.transfer(address(ws), 500_000 ether)); // pre-fund reward pool
        ws.registerDevice(deviceId, deviceSigner, deviceOwner, BASELINE_KWH);
    }

    function _sign(uint256 kWh, uint64 ts, uint256 nonce) internal view returns (bytes memory) {
        bytes32 structHash = keccak256(abi.encode(READING_TYPEHASH, deviceId, kWh, ts, nonce));
        (uint8 v, bytes32 r, bytes32 s) = vm.sign(DEVICE_KEY, _typedDigest(structHash));
        return abi.encodePacked(r, s, v);
    }

    /// @dev Rekonstruksi digest EIP-712 domain ProofOfWatt/1. Domain sengaja tidak ikut
    ///      berganti nama saat kontrak dievolusi, supaya fixture device lama tetap valid.
    function _typedDigest(bytes32 structHash) internal view returns (bytes32) {
        bytes32 domainSep = keccak256(
            abi.encode(
                keccak256("EIP712Domain(string name,string version,uint256 chainId,address verifyingContract)"),
                keccak256(bytes("ProofOfWatt")),
                keccak256(bytes("1")),
                block.chainid,
                address(ws)
            )
        );
        return keccak256(abi.encodePacked("\x19\x01", domainSep, structHash));
    }

    function _att(int256 delta, uint16 anomalyBps) internal pure returns (WattSettle.Attestation memory) {
        return WattSettle.Attestation({
            kwhDeltaVsBaseline: delta,
            anomalyScoreBps: anomalyBps,
            modelVersionHash: keccak256("wattsettle-verifier/1.0.0"),
            rulesetHash: keccak256("ruleset/anomaly_v1.json"),
            evaluatedAt: 1_767_225_600
        });
    }
}

// =====================================================================
// BASE: guard kriptografis warisan ProofOfWatt, wajib tetap hijau
// =====================================================================

contract WattSettleBaseTest is WattSettleHarness {
    function setUp() public {
        _deploy();
    }

    function testRegisterDevice() public view {
        (address signer, address owner, uint64 lastTs, uint96 baselineKwh) = ws.devices(deviceId);
        assertEq(signer, deviceSigner);
        assertEq(owner, deviceOwner);
        assertEq(lastTs, 0);
        assertEq(baselineKwh, BASELINE_KWH);
    }

    function testSubmitReadingValidSig() public {
        uint256 id = ws.submitReading(deviceId, 100, 1000, 1, _sign(100, 1000, 1));
        assertEq(id, 0);
        assertEq(ws.submissionCount(), 1);
        (bytes32 dId, uint256 kWh,,, WattSettle.Status status) = ws.submissions(0);
        assertEq(dId, deviceId);
        assertEq(kWh, 100);
        assertEq(uint8(status), uint8(WattSettle.Status.Pending));
    }

    function testSubmitReadingRejectsBadSig() public {
        bytes memory sig = _sign(100, 1000, 1);
        vm.expectRevert(WattSettle.BadSignature.selector);
        ws.submitReading(deviceId, 101, 1000, 1, sig); // kWh diubah setelah ditandatangani
    }

    /// @dev Replay hanya bisa dicapai lewat jalur re-register, sebab timestamp ikut masuk digest
    ///      sehingga pengiriman ulang biasa tertahan `StaleTimestamp` lebih dulu. Re-register
    ///      mereset `lastTs` ke nol, dan di titik itulah `usedDigest` yang menahan.
    function testReplayGuardReverts() public {
        bytes memory sig = _sign(100, 1000, 1);
        ws.submitReading(deviceId, 100, 1000, 1, sig);

        ws.registerDevice(deviceId, deviceSigner, deviceOwner, BASELINE_KWH); // lastTs kembali 0
        vm.expectRevert(WattSettle.ReplayedReading.selector);
        ws.submitReading(deviceId, 100, 1000, 1, sig);
    }

    function testMonotonicTimestampGuard() public {
        ws.submitReading(deviceId, 100, 2000, 1, _sign(100, 2000, 1));
        vm.expectRevert(WattSettle.StaleTimestamp.selector);
        ws.submitReading(deviceId, 50, 1500, 2, _sign(50, 1500, 2));
    }

    function testSubmitReadingUnknownDevice() public {
        bytes32 ghost = keccak256("SRT-MGATE-1210-#404");
        vm.expectRevert(WattSettle.UnknownDevice.selector);
        ws.submitReading(ghost, 100, 1000, 1, _sign(100, 1000, 1));
    }

    function testSetRewardPerKwh() public {
        ws.setRewardPerKwh(2 ether);
        assertEq(ws.rewardPerKwh(), 2 ether);
    }

    function testRegisterDeviceRejectsZeroOwner() public {
        vm.expectRevert(WattSettle.ZeroAddress.selector);
        ws.registerDevice(keccak256("zero"), deviceSigner, address(0), BASELINE_KWH);
    }

    function testSubmitRejectsImplausibleKwh() public {
        uint256 absurd = 1e12 + 1;
        vm.expectRevert(WattSettle.ImplausibleReading.selector);
        ws.submitReading(deviceId, absurd, 1000, 1, _sign(absurd, 1000, 1));
    }
}

// =====================================================================
// DELTA: gate ruleset, settlement, fee, reputasi, dan pertahanan payout
// =====================================================================

contract WattSettleDeltaTest is WattSettleHarness {
    function setUp() public {
        _deploy();
    }

    function _pending(uint256 kWh, uint64 ts, uint256 nonce) internal returns (uint256) {
        return ws.submitReading(deviceId, kWh, ts, nonce, _sign(kWh, ts, nonce));
    }

    function testAttestApprovePaysViaSafeERC20() public {
        uint256 id = _pending(100, 1000, 1);
        assertEq(tok.balanceOf(deviceOwner), 0);

        ws.attestAndSettle(id, _att(10, 500));

        // reward 100 suriota, fee 1 persen, produsen menerima 99
        assertEq(tok.balanceOf(deviceOwner), 99 ether);
        (,,,, WattSettle.Status status) = ws.submissions(id);
        assertEq(uint8(status), uint8(WattSettle.Status.Approved));
    }

    function testRejectWhenAnomalyAboveThreshold() public {
        uint256 id = _pending(100, 1000, 1);
        ws.attestAndSettle(id, _att(10, 5000)); // 5000 bps > maxAnomalyBps 2000

        assertEq(tok.balanceOf(deviceOwner), 0);
        assertEq(tok.balanceOf(treasury), 0);
        (,,,, WattSettle.Status status) = ws.submissions(id);
        assertEq(uint8(status), uint8(WattSettle.Status.Rejected));
    }

    function testRejectWhenDeltaOutOfBound() public {
        uint256 id = _pending(100, 1000, 1);
        ws.attestAndSettle(id, _att(900, 100)); // |900| > maxDeltaBound 500
        assertEq(tok.balanceOf(deviceOwner), 0);

        uint256 id2 = _pending(100, 2000, 2);
        ws.attestAndSettle(id2, _att(-900, 100)); // delta negatif juga ditolak
        assertEq(tok.balanceOf(deviceOwner), 0);
    }

    function testReputationIncrement() public {
        uint256 id = _pending(100, 1000, 1);
        ws.attestAndSettle(id, _att(10, 500));

        (uint32 approved, uint32 rejected, uint16 avgBps) = ws.deviceReputation(deviceId);
        assertEq(approved, 1);
        assertEq(rejected, 0);
        assertEq(avgBps, 500);

        uint256 id2 = _pending(100, 2000, 2);
        ws.attestAndSettle(id2, _att(10, 5000));

        (approved, rejected, avgBps) = ws.deviceReputation(deviceId);
        assertEq(approved, 1);
        assertEq(rejected, 1);
        assertEq(avgBps, 2750); // (500 * 1 + 5000) / 2
    }

    function testReentrancyAttemptReverts() public {
        ReentrantToken evil = new ReentrantToken();
        WattSettle victim = new WattSettle(IERC20(address(evil)));
        assertTrue(evil.transfer(address(victim), 500_000 ether));
        victim.registerDevice(deviceId, deviceSigner, deviceOwner, BASELINE_KWH);
        victim.grantRole(victim.VERIFIER_ROLE(), address(evil)); // token lolos role, tersisa nonReentrant

        WattSettle saved = ws;
        ws = victim; // digest EIP-712 harus memakai alamat kontrak korban
        uint256 id0 = victim.submitReading(deviceId, 100, 1000, 1, _sign(100, 1000, 1));
        uint256 id1 = victim.submitReading(deviceId, 100, 2000, 2, _sign(100, 2000, 2));
        ws = saved;

        evil.arm(victim, id1); // masuk kembali lewat id LAIN yang masih Pending

        vm.expectRevert(ReentrancyGuard.ReentrancyGuardReentrantCall.selector);
        victim.attestAndSettle(id0, _att(10, 500));
    }

    function testInsufficientPoolReverts() public {
        WattSettle poor = new WattSettle(tok);
        poor.registerDevice(deviceId, deviceSigner, deviceOwner, BASELINE_KWH);
        assertTrue(tok.transfer(address(poor), 50 ether)); // butuh 100, hanya ada 50

        WattSettle saved = ws;
        ws = poor;
        uint256 id = poor.submitReading(deviceId, 100, 1000, 1, _sign(100, 1000, 1));
        ws = saved;

        vm.expectRevert(WattSettle.InsufficientRewardPool.selector);
        poor.attestAndSettle(id, _att(10, 500));
    }

    function testOnlyVerifierCanAttest() public {
        uint256 id = _pending(100, 1000, 1);
        address intruder = address(0xDEAD);
        // Role dibaca SEBELUM prank. Panggilan view ke `ws` akan memakan prank kalau
        // ditaruh di dalam argumen, sehingga yang ter-prank bukan attestAndSettle.
        bytes32 role = ws.VERIFIER_ROLE();

        vm.expectRevert(
            abi.encodeWithSelector(IAccessControl.AccessControlUnauthorizedAccount.selector, intruder, role)
        );
        vm.prank(intruder);
        ws.attestAndSettle(id, _att(10, 500));
        assertEq(tok.balanceOf(deviceOwner), 0);
    }

    function testFeeSplitCorrect() public {
        uint256 id = _pending(100, 1000, 1);
        uint256 poolBefore = tok.balanceOf(address(ws));

        ws.attestAndSettle(id, _att(10, 500));

        assertEq(tok.balanceOf(deviceOwner), 99 ether); // reward - fee
        assertEq(tok.balanceOf(treasury), 1 ether); // fee 100 bps dari 100
        assertEq(tok.balanceOf(address(ws)), poolBefore - 100 ether); // pool berkurang tepat reward kotor
    }

    function testEventEmitsDecodedAttestation() public {
        uint256 id = _pending(100, 1000, 1);
        WattSettle.Attestation memory a = _att(10, 500);

        vm.expectEmit(true, true, false, true, address(ws));
        emit WattSettle.SettlementFeeTaken(id, treasury, 1 ether);
        vm.expectEmit(true, true, false, true, address(ws));
        // Angka kontrak ikut masuk event: kWh 100 sama persis dengan baseline, jadi nol dan nol.
        emit WattSettle.ReadingAttested(id, deviceId, true, a, 0, 0);

        ws.attestAndSettle(id, a);
    }

    function testNotPendingOnDoubleAttest() public {
        uint256 id = _pending(100, 1000, 1);
        ws.attestAndSettle(id, _att(10, 500));

        vm.expectRevert(WattSettle.NotPending.selector);
        ws.attestAndSettle(id, _att(10, 500)); // double pay ditutup
        assertEq(tok.balanceOf(deviceOwner), 99 ether);
    }

    function testFeeBpsCapEnforced() public {
        vm.expectRevert(WattSettle.FeeTooHigh.selector);
        ws.setFeeBps(1001); // di atas MAX_FEE_BPS 1000

        ws.setFeeBps(1000); // tepat di batas tetap boleh
        assertEq(ws.feeBps(), 1000);
    }

    function testSetGateParamsRejectsImpossibleBound() public {
        vm.expectRevert(WattSettle.InvalidAnomalyBound.selector);
        ws.setGateParams(10_001, 500);
    }

    // =================================================================
    // Properti keamanan inti: verifier tidak bisa memaksa pembayaran
    // =================================================================

    /// @dev Ini test terpenting di berkas ini. Verifier yang sepenuhnya berbohong,
    ///      mengaku bacaan 900 kWh sama sekali tidak menyimpang dari baseline 100,
    ///      tetap tidak bisa membuat kontrak membayar. Kontrak menghitung sendiri.
    function testLyingVerifierCannotForcePayout() public {
        uint256 id = _pending(900, 1000, 1); // baseline 100, menyimpang jauh

        ws.attestAndSettle(id, _att(0, 0)); // verifier mengaku nol penyimpangan, nol anomali

        assertEq(tok.balanceOf(deviceOwner), 0);
        assertEq(tok.balanceOf(treasury), 0);
        (,,,, WattSettle.Status status) = ws.submissions(id);
        assertEq(uint8(status), uint8(WattSettle.Status.Rejected));
    }

    /// @dev Sisi sebaliknya, dan ini yang membuat verifier tetap punya guna. Bacaan yang
    ///      secara aritmetika sempurna pun bisa ditolak verifier, misalnya karena ia melihat
    ///      sinyal yang tidak terlihat on-chain. Hak veto ada, hak meloloskan tidak.
    function testVerifierCanVetoAReadingTheContractWouldAccept() public {
        uint256 id = _pending(100, 1000, 1); // sama persis dengan baseline

        (int256 chainDelta, uint16 chainAnomalyBps) = ws.assess(deviceId, 100);
        assertEq(chainDelta, 0);
        assertEq(chainAnomalyBps, 0); // kontrak sendiri akan meloloskan

        ws.attestAndSettle(id, _att(0, 9000)); // verifier menolak

        assertEq(tok.balanceOf(deviceOwner), 0);
        (,,,, WattSettle.Status status) = ws.submissions(id);
        assertEq(uint8(status), uint8(WattSettle.Status.Rejected));
    }

    function testContractComputesOwnAssessment() public view {
        (int256 delta, uint16 bps) = ws.assess(deviceId, 120);
        assertEq(delta, 20);
        assertEq(bps, 2000); // 20 dari baseline 100 sama dengan 2000 bps

        (delta, bps) = ws.assess(deviceId, 80);
        assertEq(delta, -20);
        assertEq(bps, 2000); // penyimpangan ke bawah dinilai sama beratnya

        (, bps) = ws.assess(deviceId, 1_000_000);
        assertEq(bps, 10_000); // skor dipatok di 10000, tidak meluap
    }

    /// @dev Device yang belum dikalibrasi tidak boleh dibayar. Lebih baik menolak daripada
    ///      membayar berdasarkan baseline yang tidak pernah ditetapkan.
    function testDeviceWithoutBaselineIsNeverPaid() public {
        ws.setDeviceBaseline(deviceId, 0);
        uint256 id = _pending(100, 1000, 1);

        ws.attestAndSettle(id, _att(0, 0));

        assertEq(tok.balanceOf(deviceOwner), 0);
        (,,,, WattSettle.Status status) = ws.submissions(id);
        assertEq(uint8(status), uint8(WattSettle.Status.Rejected));
    }

    function testSetDeviceBaseline() public {
        ws.setDeviceBaseline(deviceId, 250);
        (,,, uint96 baselineKwh) = ws.devices(deviceId);
        assertEq(baselineKwh, 250);

        (int256 delta, uint16 bps) = ws.assess(deviceId, 250);
        assertEq(delta, 0);
        assertEq(bps, 0);
    }

    function testSetDeviceBaselineRejectsUnknownDevice() public {
        vm.expectRevert(WattSettle.UnknownDevice.selector);
        ws.setDeviceBaseline(keccak256("SRT-MGATE-1210-#404"), 100);
    }

    /// @dev Reputasi memakai skor terburuk di antara dua penilaian, sehingga verifier yang
    ///      lunak tidak bisa memoles catatan sebuah device.
    function testReputationUsesWorstOfBothAssessments() public {
        uint256 id = _pending(120, 1000, 1); // kontrak menilai 2000 bps
        ws.attestAndSettle(id, _att(20, 0)); // verifier mengaku 0 bps

        (,, uint16 avgBps) = ws.deviceReputation(deviceId);
        assertEq(avgBps, 2000); // yang tercatat angka kontrak, bukan angka verifier
    }
}
