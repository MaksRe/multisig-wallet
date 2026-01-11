# MultiSig Wallet (Foundry)

Русский гайд по простому multisig-кошельку на Solidity с тестами на Foundry и CI.

## Возможности
- Кошелёк с N владельцами и настраиваемым кворумом подтверждений.
- Создание транзакций (адрес, сумма, calldata), сбор подписей, автоисполнение при достижении кворума.
- Отзыв подписи до исполнения, события на все ключевые действия.
- Тесты на основные и пограничные сценарии (revert-пути, события, депозиты).
- CI в GitHub Actions: форматирование, сборка, тесты.

## Архитектура и поток
1) Владелец вызывает `createTransaction(to, value, data)`.
2) Владелец подтверждает `confirmTransaction(txId)`. При достижении кворума вызывается `executeTransaction`.
3) До исполнения владелец может отозвать подпись `revokeConfirmation`.
4) Средства попадают на контракт через `receive()`; событие `Deposit`.

## Структура
- `src/MultiSigWallet.sol` — контракт.
- `test/MultiSigWallet.t.sol` — тесты на Foundry.
- `script/MultiSigDeploy.s.sol` — пример деплоя.
- `.github/workflows/test.yml` — CI (fmt, build, test).

## Быстрый старт
```bash
forge install
forge fmt
forge test
```

## Деплой (пример)
В `script/MultiSigDeploy.s.sol` используется Foundry Script.
```bash
forge script script/MultiSigDeploy.s.sol:MultiSigDeploy \
  --rpc-url $RPC_URL \
  --private-key $PRIVATE_KEY \
  --broadcast \
  --verify \
  -vvvv
```
Переменные:
- `OWNERS` — список владельцев через запятую (пример в скрипте).
- `REQUIRED` — кворум (<= числу владельцев).

## Тестирование
- Запуск: `forge test -vvv`
- Формат: `forge fmt`
- Профиль `FOUNDRY_PROFILE=ci` используется в CI.

## Безопасность и допущения
- Нет защиты от reentrancy у `executeTransaction` — calldata вызывается как есть. Добавьте guard, если требуется.
- Владелец списка статичен (нет добавления/удаления владельцев).
- Проверки: уникальность и не-null адресов владельцев, кворум <= владельцев, запрет повторного подтверждения/исполнения.
- Перед исполнением транзакции убедитесь, что контракт пополнен (через `receive` или деплой с балансом).

## Дорожная карта (идеи)
- Добавить управление составом владельцев и кворумом.
- Offchain подписи (EIP-712) и батчинг.
- Лимиты по сумме/количеству за период.
- Отдельный UI или CLI для UX.

## Лицензия
MIT (см. `LICENSE`).
