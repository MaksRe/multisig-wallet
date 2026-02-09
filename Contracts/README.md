# Contracts - MultiSig Wallet (Foundry)

Solidity part of the project: multisig contract, tests, and deployment scripts.

**Contents**
- `src/MultiSigWallet.sol` main multisig contract.
- `src/TestTarget.sol` helper target contract for multisig call testing.
- `script/MultiSigDeploy.s.sol` deploy script for multisig with env vars.
- `script/TestTargetDeploy.s.sol` deploy script for test target.
- `test/MultiSigWallet.t.sol` Foundry tests.

**Implemented Changes**
- Deploy flow switched to `forge script` with env vars (`PRIVATE_KEY`, `OWNERS`, `REQUIRED`).
- Added `TestTarget.sol` for practical integration testing from multisig.
- Added `TestTargetDeploy.s.sol` and script support from `Scripts/` folder.
- `MultiSigDeploy.s.sol` supports owner/quorum override via environment variables.

**MultiSig Execution Model**
- Owner creates tx via `createTransaction(to, value, data)`.
- Owners confirm via `confirmTransaction(txId)`.
- When confirmations reach `requiredSignatures`, execution is triggered automatically.
- Gas is paid by the caller of the final confirmation transaction.
- ETH for transfer is taken from multisig contract balance.

**Deploy Multisig (Recommended)**
From `Contracts/` directory:
```bash
export PRIVATE_KEY=0xac0974...
export OWNERS=0xf39F...2266,0x7099...79C8,0x3C44...93BC
export REQUIRED=2

forge script script/MultiSigDeploy.s.sol:MultiSigDeploy \
  --rpc-url http://127.0.0.1:8545 \
  --broadcast
```

**Deploy TestTarget**
```bash
export PRIVATE_KEY=0xac0974...
export MULTISIG_ADDRESS=0x5FbDB2315678afecb367f032d93F642f64180aa3

forge script script/TestTargetDeploy.s.sol:TestTargetDeploy \
  --rpc-url http://127.0.0.1:8545 \
  --broadcast
```

**Calldata Examples (for frontend fields)**
- `setValue(42)`:
```bash
cast calldata "setValue(uint256)" 42
```
- `setMessage("Hello multisig")`:
```bash
cast calldata "setMessage(string)" "Hello multisig"
```
- `withdraw(<recipient>, 0.1 ether)`:
```bash
cast calldata "withdraw(address,uint256)" <RECIPIENT> 100000000000000000
```

**Local Test Commands**
```bash
forge install
forge fmt
forge test -vvv
```

**License**
MIT

<details>
<summary>Русская версия</summary>

# Contracts - MultiSig Wallet (Foundry)

Solidity-часть проекта: мультисиг-контракт, тесты и скрипты деплоя.

**Состав**
- `src/MultiSigWallet.sol` основной контракт мультисига.
- `src/TestTarget.sol` вспомогательный контракт-цель для проверки вызовов через мультисиг.
- `script/MultiSigDeploy.s.sol` скрипт деплоя мультисига через переменные окружения.
- `script/TestTargetDeploy.s.sol` скрипт деплоя тестового контракта.
- `test/MultiSigWallet.t.sol` тесты Foundry.

**Реализованные изменения**
- Переход на деплой через `forge script` и env (`PRIVATE_KEY`, `OWNERS`, `REQUIRED`).
- Добавлен `TestTarget.sol` для практического тестирования внешних вызовов из мультисига.
- Добавлен `TestTargetDeploy.s.sol` и поддержка запуска через `Scripts/`.
- В `MultiSigDeploy.s.sol` добавлено переопределение владельцев и кворума через переменные окружения.

**Модель исполнения мультисига**
- Владелец создает транзакцию через `createTransaction(to, value, data)`.
- Владельцы подтверждают через `confirmTransaction(txId)`.
- При достижении `requiredSignatures` транзакция исполняется автоматически.
- Gas платит отправитель финальной транзакции подтверждения.
- ETH на перевод берется с баланса контракта мультисига.

**Деплой мультисига (рекомендуемый)**
Из директории `Contracts/`:
```bash
export PRIVATE_KEY=0xac0974...
export OWNERS=0xf39F...2266,0x7099...79C8,0x3C44...93BC
export REQUIRED=2

forge script script/MultiSigDeploy.s.sol:MultiSigDeploy \
  --rpc-url http://127.0.0.1:8545 \
  --broadcast
```

**Деплой TestTarget**
```bash
export PRIVATE_KEY=0xac0974...
export MULTISIG_ADDRESS=0x5FbDB2315678afecb367f032d93F642f64180aa3

forge script script/TestTargetDeploy.s.sol:TestTargetDeploy \
  --rpc-url http://127.0.0.1:8545 \
  --broadcast
```

**Примеры calldata (для полей фронтенда)**
- `setValue(42)`:
```bash
cast calldata "setValue(uint256)" 42
```
- `setMessage("Hello multisig")`:
```bash
cast calldata "setMessage(string)" "Hello multisig"
```
- `withdraw(<recipient>, 0.1 ether)`:
```bash
cast calldata "withdraw(address,uint256)" <RECIPIENT> 100000000000000000
```

**Локальные команды тестирования**
```bash
forge install
forge fmt
forge test -vvv
```

**Лицензия**
MIT

</details>
