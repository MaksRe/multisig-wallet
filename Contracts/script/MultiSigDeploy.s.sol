// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "forge-std/Script.sol";
import "../src/MultiSigWallet.sol";

/// @dev Пример деплоя Multisig через Foundry Script. Настройте owners и required перед запуском.
contract MultiSigDeploy is Script {
    function run() external {
        uint256 deployerKey = vm.envUint("PRIVATE_KEY");

        address[] memory owners = new address[](3);
        owners[0] = 0x1111111111111111111111111111111111111111;
        owners[1] = 0x2222222222222222222222222222222222222222;
        owners[2] = 0x3333333333333333333333333333333333333333;

        uint256 required = 2;

        require(required > 0 && required <= owners.length, "invalid quorum");

        vm.startBroadcast(deployerKey);
        MultiSigWallet wallet = new MultiSigWallet(owners, required);
        vm.stopBroadcast();

        console2.log("MultiSig deployed at", address(wallet));
        console2.log("Owners:", owners.length, "Required:", required);
    }
}
