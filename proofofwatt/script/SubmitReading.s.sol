// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Script, console2} from "forge-std/Script.sol";
import {WattSettle} from "../src/WattSettle.sol";

/// @title Menandatangani satu bacaan sebagai device, lalu me-relay-nya on-chain.
/// @notice Kunci device hanya dipakai untuk MENANDATANGANI, tidak pernah membayar gas.
///         Gas dibayar relayer, persis seperti di produksi di mana device di lapangan
///         tidak memegang tBNB sama sekali.
/// @dev Parameter bacaan diambil dari env supaya script yang sama bisa dipakai berulang
///      untuk antrean fixture dengan timestamp dan nonce yang selalu segar.
///      Jalankan dengan: KWH=105 READING_TS=... READING_NONCE=1 forge script ...
contract SubmitReading is Script {
    bytes32 private constant READING_TYPEHASH =
        keccak256("Reading(bytes32 deviceId,uint256 kWh,uint64 timestamp,uint256 nonce)");

    function run() external {
        uint256 relayerPk = vm.envUint("DEPLOYER_PK");
        uint256 devicePk = vm.envUint("DEVICE_PK");
        address wattsettle = vm.envAddress("WATTSETTLE_CONTRACT");
        bytes32 deviceId = vm.envBytes32("DEVICE_ID");
        uint256 kWh = vm.envUint("KWH");
        uint64 timestamp = uint64(vm.envUint("READING_TS"));
        uint256 nonce = vm.envUint("READING_NONCE");

        bytes32 structHash = keccak256(abi.encode(READING_TYPEHASH, deviceId, kWh, timestamp, nonce));
        (uint8 v, bytes32 r, bytes32 s) = vm.sign(devicePk, _typedDigest(wattsettle, structHash));
        bytes memory sig = abi.encodePacked(r, s, v);

        vm.startBroadcast(relayerPk);
        uint256 id = WattSettle(wattsettle).submitReading(deviceId, kWh, timestamp, nonce, sig);
        vm.stopBroadcast();

        console2.log("reading id :", id);
        console2.log("kWh        :", kWh);
        console2.log("timestamp  :", timestamp);
        console2.log("signer     :", vm.addr(devicePk));
    }

    /// @dev Membangun digest EIP-712 domain ProofOfWatt/1 untuk kontrak dan chain saat ini.
    ///      Nama domain sengaja tetap "ProofOfWatt" walau kontraknya sudah bernama WattSettle,
    ///      supaya fixture tanda tangan device yang lama tetap sah.
    function _typedDigest(address verifyingContract, bytes32 structHash) private view returns (bytes32) {
        bytes32 domainSeparator = keccak256(
            abi.encode(
                keccak256("EIP712Domain(string name,string version,uint256 chainId,address verifyingContract)"),
                keccak256(bytes("ProofOfWatt")),
                keccak256(bytes("1")),
                block.chainid,
                verifyingContract
            )
        );
        return keccak256(abi.encodePacked("\x19\x01", domainSeparator, structHash));
    }
}
