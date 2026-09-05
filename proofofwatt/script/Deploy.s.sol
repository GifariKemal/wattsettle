// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Script, console2} from "forge-std/Script.sol";
import {WattSettle} from "../src/WattSettle.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";

/// @title Deploy WattSettle ke BSC testnet 97 sekaligus mengunci state siap demo.
/// @notice Satu broadcast melakukan lima hal berurutan: deploy, pasang treasury,
///         daftarkan device, serahkan VERIFIER_ROLE ke wallet agent, lalu isi reward pool.
/// @dev Deployer melepas VERIFIER_ROLE miliknya sendiri di langkah terakhir. Setelah script
///      ini jalan, satu-satunya alamat yang bisa memicu settlement adalah wallet agent AI.
///      Otonomi jadi bisa dibuktikan on-chain, bukan sekadar diklaim di slide.
///      DEFAULT_ADMIN_ROLE tetap di deployer supaya role masih bisa dipulihkan bila kunci
///      agent hilang.
contract Deploy is Script {
    function run() external {
        uint256 deployerPk = vm.envUint("DEPLOYER_PK");
        address token = vm.envAddress("SURIOTA_TOKEN");
        address treasury = vm.envAddress("TREASURY_ADDR");
        address deviceSigner = vm.envAddress("DEVICE_ADDR");
        address deviceOwner = vm.envAddress("DEVICE_OWNER_ADDR");
        address verifier = vm.envAddress("VERIFIER_ADDR");
        bytes32 deviceId = vm.envBytes32("DEVICE_ID");
        uint256 prefund = vm.envOr("PREFUND_WEI", uint256(500_000 ether));

        address deployer = vm.addr(deployerPk);

        vm.startBroadcast(deployerPk);

        WattSettle ws = new WattSettle(IERC20(token));
        ws.setTreasury(treasury);
        ws.registerDevice(deviceId, deviceSigner, deviceOwner);

        bytes32 verifierRole = ws.VERIFIER_ROLE();
        ws.grantRole(verifierRole, verifier);
        ws.revokeRole(verifierRole, deployer); // hanya agent yang boleh settle

        require(IERC20(token).transfer(address(ws), prefund), "prefund gagal");

        vm.stopBroadcast();

        console2.log("WattSettle          :", address(ws));
        console2.log("settlement token    :", token);
        console2.log("treasury            :", treasury);
        console2.log("device signer       :", deviceSigner);
        console2.log("device owner        :", deviceOwner);
        console2.log("verifier (agent)    :", verifier);
        console2.log("reward pool (wei)   :", IERC20(token).balanceOf(address(ws)));
        console2.log("deployer masih verifier?", ws.hasRole(verifierRole, deployer));
    }
}
