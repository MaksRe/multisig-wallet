# Contracts — MultiSig Wallet (Foundry)

A compact multisig wallet contract written in Solidity with a Foundry test suite and scripts for deployment.

**Features**
- N owners with a configurable quorum of required signatures.
- Create, confirm, revoke, and execute transactions.
- Auto‑execute once the quorum is reached.
- Events for all key actions.
- Tests for core paths and edge cases.

**Core Flow**
1. An owner calls `createTransaction(to, value, data)`.
2. Owners call `confirmTransaction(txId)`.
3. When confirmations reach the required quorum, `executeTransaction` is triggered.
4. ETH is received via `receive()` and tracked by `getBalance()`.

**Project Layout**
- `src/MultiSigWallet.sol` Contract implementation.
- `test/MultiSigWallet.t.sol` Foundry tests.
- `script/MultiSigDeploy.s.sol` Example deployment script.
- `.github/workflows/test.yml` CI for formatting, build, and tests.

**Local Setup**
```bash
forge install
forge fmt
forge test
```

**Deployment**
The script in `script/MultiSigDeploy.s.sol` demonstrates deployment with Foundry.
```bash
forge script script/MultiSigDeploy.s.sol:MultiSigDeploy \
  --rpc-url $RPC_URL \
  --private-key $PRIVATE_KEY \
  --broadcast \
  --verify \
  -vvvv
```

**Testing**
- Run tests: `forge test -vvv`
- Format: `forge fmt`

**Security Notes**
- `executeTransaction` uses a low‑level `call` to the target; add a reentrancy guard if needed.
- Owner set is fixed after deployment in this version.
- Confirmations are tracked per owner to prevent duplicates.
- Ensure the contract is funded before executing outgoing transactions.

**Roadmap Ideas**
- Owner management (add/remove) and quorum updates.
- Off‑chain signatures with EIP‑712 and batched execution.
- Limits by amount or period.
- Dedicated UI or CLI tooling.

**License**
MIT.

<details>
<summary>Русская версия</summary>

# Contracts — MultiSig Wallet (Foundry)

Компактный мультисиг‑контракт на Solidity с тестами Foundry и скриптами деплоя.

**Возможности**
- N владельцев и настраиваемый кворум подписей.
- Создание, подтверждение, отзыв и исполнение транзакций.
- Авто‑исполнение при достижении кворума.
- События для всех ключевых действий.
- Тесты базовых и пограничных сценариев.

**Основной поток**
1. Владелец вызывает `createTransaction(to, value, data)`.
2. Владельцы подтверждают `confirmTransaction(txId)`.
3. При достижении кворума вызывается `executeTransaction`.
4. ETH поступает через `receive()` и отображается в `getBalance()`.

**Структура проекта**
- `src/MultiSigWallet.sol` Реализация контракта.
- `test/MultiSigWallet.t.sol` Тесты Foundry.
- `script/MultiSigDeploy.s.sol` Пример деплоя.
- `.github/workflows/test.yml` CI для форматирования, сборки и тестов.

**Локальный запуск**
```bash
forge install
forge fmt
forge test
```

**Деплой**
Скрипт в `script/MultiSigDeploy.s.sol` показывает пример деплоя через Foundry.
```bash
forge script script/MultiSigDeploy.s.sol:MultiSigDeploy \
  --rpc-url $RPC_URL \
  --private-key $PRIVATE_KEY \
  --broadcast \
  --verify \
  -vvvv
```

**Тестирование**
- Запуск тестов: `forge test -vvv`
- Форматирование: `forge fmt`

**Замечания по безопасности**
- `executeTransaction` делает низкоуровневый `call`; при необходимости добавьте reentrancy‑guard.
- Список владельцев фиксирован после деплоя.
- Подписи отслеживаются по владельцам, повторные подтверждения запрещены.
- Перед исполнением транзакций убедитесь, что контракт пополнен.

**Идеи для развития**
- Управление владельцами и кворумом.
- Off‑chain подписи по EIP‑712 и батч‑исполнение.
- Лимиты по сумме или периоду.
- Отдельный UI или CLI.

**Лицензия**
MIT.

</details>
