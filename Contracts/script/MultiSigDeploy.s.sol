// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "forge-std/Script.sol";
import "../src/MultiSigWallet.sol";

/// @dev Пример деплоя Multisig через Foundry Script.
/// Если переменные окружения OWNERS и REQUIRED не заданы,
/// используются значения по умолчанию.
///
/// Формат:
/// OWNERS=0xabc...,0xdef...,0x123...
/// REQUIRED=2
contract MultiSigDeploy is Script {
    function run() external {
        // Берём приватный ключ.
        // Foundry берёт ключ из переменной окружения PRIVATE_KEY.
        // Этим ключом подписывается транзакция деплоя.
        uint256 deployerKey = vm.envUint("PRIVATE_KEY");

        // Формируем список владельцев.
        // Можно переопределить через переменную окружения OWNERS (через запятую).
        address[] memory defaultOwners = new address[](3);
        defaultOwners[0] = 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266;
        defaultOwners[1] = 0x70997970C51812dc3A010C7d01b50e0d17dc79C8;
        defaultOwners[2] = 0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC;

        address[] memory owners = vm.envOr("OWNERS", ",", defaultOwners);

        // Задаём кворум, можно переопределить через REQUIRED.
        uint256 required = vm.envOr("REQUIRED", uint256(2));

        require(required > 0 && required <= owners.length, "invalid quorum");

        // Отправляем транзакцию деплоя.
        vm.startBroadcast(deployerKey);
        MultiSigWallet wallet = new MultiSigWallet(owners, required);
        vm.stopBroadcast();

        console2.log("MultiSig deployed at", address(wallet));
        console2.log("Owners:", owners.length, "Required:", required);
    }
}
