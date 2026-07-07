// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {AccessControl} from "@openzeppelin/contracts/access/AccessControl.sol";
import {EIP712} from "@openzeppelin/contracts/utils/cryptography/EIP712.sol";
import {ECDSA} from "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";

/// @title ProofOfWatt — DePIN energy oracle: signed IoT readings, AI-verified, token-rewarded.
/// @notice Minimal winning surface. Device signs (EIP-712) a kWh reading; anyone relays it on-chain;
///         an AI verifier (VERIFIER_ROLE) approves/rejects; approval pays SURIOTA tokens to device owner.
contract ProofOfWatt is AccessControl, EIP712 {
    bytes32 public constant VERIFIER_ROLE = keccak256("VERIFIER_ROLE");

    // EIP-712 typed struct the device firmware signs.
    bytes32 private constant READING_TYPEHASH =
        keccak256("Reading(bytes32 deviceId,uint256 kWh,uint64 timestamp,uint256 nonce)");

    struct Device {
        address signer; // device public key (recovers to this)
        address owner;  // who gets paid
        uint64  lastTs; // monotonic timestamp guard
    }

    enum Status { None, Pending, Approved, Rejected }

    struct Submission {
        bytes32 deviceId;
        uint256 kWh;
        uint64  timestamp;
        uint256 nonce;
        Status  status;
    }

    IERC20  public immutable rewardToken;
    uint256 public rewardPerKwh; // token wei paid per kWh on approval

    mapping(bytes32 => Device) public devices;                 // deviceId => Device
    mapping(bytes32 => bool)   public usedDigest;              // replay guard (per unique reading)
    Submission[] public submissions;

    event DeviceRegistered(bytes32 indexed deviceId, address signer, address owner);
    event ReadingSubmitted(uint256 indexed id, bytes32 indexed deviceId, uint256 kWh, uint64 timestamp);
    event ReadingVerified(uint256 indexed id, bool approved, uint256 reward);

    error BadSignature();
    error ReplayedReading();
    error StaleTimestamp();
    error NotPending();
    error UnknownDevice();

    constructor(IERC20 _rewardToken, uint256 _rewardPerKwh) EIP712("ProofOfWatt", "1") {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(VERIFIER_ROLE, msg.sender);
        rewardToken = _rewardToken;
        rewardPerKwh = _rewardPerKwh;
    }

    function registerDevice(bytes32 deviceId, address signer, address owner)
        external onlyRole(DEFAULT_ADMIN_ROLE)
    {
        devices[deviceId] = Device({signer: signer, owner: owner, lastTs: 0});
        emit DeviceRegistered(deviceId, signer, owner);
    }

    function setRewardPerKwh(uint256 v) external onlyRole(DEFAULT_ADMIN_ROLE) { rewardPerKwh = v; }

    /// @notice Relay a device-signed reading. Verifies signature, monotonic ts, and replay.
    function submitReading(
        bytes32 deviceId,
        uint256 kWh,
        uint64  timestamp,
        uint256 nonce,
        bytes calldata sig
    ) external returns (uint256 id) {
        Device storage d = devices[deviceId];
        if (d.signer == address(0)) revert UnknownDevice();
        if (timestamp <= d.lastTs) revert StaleTimestamp();

        bytes32 digest = _hashTypedDataV4(
            keccak256(abi.encode(READING_TYPEHASH, deviceId, kWh, timestamp, nonce))
        );
        if (usedDigest[digest]) revert ReplayedReading();
        if (ECDSA.recover(digest, sig) != d.signer) revert BadSignature();

        usedDigest[digest] = true;
        d.lastTs = timestamp;

        id = submissions.length;
        submissions.push(Submission(deviceId, kWh, timestamp, nonce, Status.Pending));
        emit ReadingSubmitted(id, deviceId, kWh, timestamp);
    }

    /// @notice AI verifier decision. On approval, pays rewardPerKwh * kWh to device owner.
    function verifyReading(uint256 id, bool approved) external onlyRole(VERIFIER_ROLE) {
        Submission storage s = submissions[id];
        if (s.status != Status.Pending) revert NotPending();
        s.status = approved ? Status.Approved : Status.Rejected;

        uint256 reward = 0;
        if (approved) {
            reward = s.kWh * rewardPerKwh;
            require(rewardToken.transfer(devices[s.deviceId].owner, reward), "reward xfer failed");
        }
        emit ReadingVerified(id, approved, reward);
    }

    function submissionCount() external view returns (uint256) { return submissions.length; }
}
