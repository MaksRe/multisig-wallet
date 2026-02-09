// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "forge-std/Script.sol";
import "../src/TestTarget.sol";

/// @dev Деплой TestTarget через Foundry Script.
/// Требуются переменные окружения:
/// PRIVATE_KEY - приватный ключ деплойера
/// MULTISIG_ADDRESS - адрес мультисиг-контракта (станет owner в TestTarget)
contract TestTargetDeploy is Script {
    function run() external {
        uint256 deployerKey = vm.envUint("PRIVATE_KEY");
        address multisig = vm.envAddress("MULTISIG_ADDRESS");

        vm.startBroadcast(deployerKey);
        TestTarget target = new TestTarget(multisig);
        vm.stopBroadcast();

        console2.log("TestTarget deployed at", address(target));
        console2.log("Owner:", multisig);
    }
}
