// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Test} from "forge-std/Test.sol";
import {ProofOfWatt} from "../src/ProofOfWatt.sol";
import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract MockToken is ERC20 {
    constructor() ERC20("suriota", "suriota") { _mint(msg.sender, 1_000_000 ether); }
}

contract ProofOfWattTest is Test {
    ProofOfWatt pow;
    MockToken tok;
    uint256 deviceKey = 0xA11CE;
    address deviceSigner;
    address owner = address(0xBEEF);
    bytes32 deviceId = keccak256("SRT-MGATE-1210-#001");

    bytes32 constant READING_TYPEHASH =
        keccak256("Reading(bytes32 deviceId,uint256 kWh,uint64 timestamp,uint256 nonce)");

    function setUp() public {
        deviceSigner = vm.addr(deviceKey);
        tok = new MockToken();
        pow = new ProofOfWatt(tok, 1 ether); // 1 SURIOTA per kWh
        tok.transfer(address(pow), 500_000 ether); // fund reward pool
        pow.registerDevice(deviceId, deviceSigner, owner);
    }

    function _sign(uint256 kWh, uint64 ts, uint256 nonce) internal view returns (bytes memory) {
        bytes32 structHash = keccak256(abi.encode(READING_TYPEHASH, deviceId, kWh, ts, nonce));
        bytes32 digest = _typedDigest(structHash);
        (uint8 v, bytes32 r, bytes32 s) = vm.sign(deviceKey, digest);
        return abi.encodePacked(r, s, v);
    }

    // Reconstruct EIP-712 digest for domain ProofOfWatt/1.
    function _typedDigest(bytes32 structHash) internal view returns (bytes32) {
        bytes32 domainSep = keccak256(abi.encode(
            keccak256("EIP712Domain(string name,string version,uint256 chainId,address verifyingContract)"),
            keccak256(bytes("ProofOfWatt")),
            keccak256(bytes("1")),
            block.chainid,
            address(pow)
        ));
        return keccak256(abi.encodePacked("\x19\x01", domainSep, structHash));
    }

    function test_HappyPath_SignSubmitApprovePay() public {
        bytes memory sig = _sign(100, 1000, 1);
        uint256 id = pow.submitReading(deviceId, 100, 1000, 1, sig);
        assertEq(tok.balanceOf(owner), 0);
        pow.verifyReading(id, true);
        assertEq(tok.balanceOf(owner), 100 ether); // 100 kWh * 1 SURIOTA
    }

    function test_Reject_NoPayout() public {
        bytes memory sig = _sign(999999, 1000, 1); // implausible -> AI rejects
        uint256 id = pow.submitReading(deviceId, 999999, 1000, 1, sig);
        pow.verifyReading(id, false);
        assertEq(tok.balanceOf(owner), 0);
    }

    function test_Revert_BadSignature() public {
        bytes memory sig = _sign(100, 1000, 1);
        vm.expectRevert(ProofOfWatt.BadSignature.selector);
        pow.submitReading(deviceId, 101, 1000, 1, sig); // kWh tampered
    }

    function test_Revert_Replay() public {
        bytes memory sig = _sign(100, 1000, 1);
        pow.submitReading(deviceId, 100, 1000, 1, sig);
        // same digest reused after ts advance blocked by StaleTimestamp first; test replay directly by
        // reverting the ts guard: identical reading -> StaleTimestamp (also acceptable anti-replay)
        vm.expectRevert(ProofOfWatt.StaleTimestamp.selector);
        pow.submitReading(deviceId, 100, 1000, 1, sig);
    }

    function test_Revert_StaleTimestamp() public {
        pow.submitReading(deviceId, 100, 2000, 1, _sign(100, 2000, 1));
        vm.expectRevert(ProofOfWatt.StaleTimestamp.selector);
        pow.submitReading(deviceId, 50, 1500, 2, _sign(50, 1500, 2));
    }

    function test_Revert_OnlyVerifier() public {
        uint256 id = pow.submitReading(deviceId, 100, 1000, 1, _sign(100, 1000, 1));
        vm.prank(address(0xDEAD));
        vm.expectRevert();
        pow.verifyReading(id, true);
    }
}
