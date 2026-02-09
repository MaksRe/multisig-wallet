# Frontend - MultiSig Wallet UI

Next.js + viem frontend for interacting with `MultiSigWallet`.

**Implemented Changes**
- RU/EN localization with manual switch.
- Browser language auto-detection and persistence in `localStorage`.
- Wallet connect/reconnect flow with user feedback.
- Top toast notifications with auto-hide.
- Chain mismatch warning with local compatibility support (`1337 <-> 31337`).
- Owners list with safe long-address wrapping.
- Transaction statuses in list: `Awaiting confirmations`, `Ready to execute`, `Executed`.
- Auto-refresh of contract state (periodic sync + manual refresh).
- Action buttons for `create`, `confirm`, `revoke`, `execute`, `deposit`.
- Local font stack usage (no runtime dependency on Google Fonts).

**Environment**
Create `Frontend/.env.local`:
```dotenv
NEXT_PUBLIC_CONTRACT_ADDRESS=0x5FbDB2315678afecb367f032d93F642f64180aa3
NEXT_PUBLIC_CHAIN_ID=31337
NEXT_PUBLIC_RPC_URL=http://127.0.0.1:8545
```

**Run**
```bash
cd Frontend
npm install
npm run dev
```
Open `http://localhost:3000`.

**How Transaction Status Works**
- `Awaiting confirmations`: confirmations are below quorum.
- `Ready to execute`: confirmations reached quorum but `executed == false`.
- `Executed`: `executed == true` on-chain.

Note: in this contract, execution may happen automatically when the quorum is reached in `confirmTransaction`.

**Frontend Form Examples (`to` / `value` / `data`)**
1. Send ETH to EOA:
- `to`: `<EOA_ADDRESS>`
- `value`: `0.05`
- `data`: `0x`

2. Call `TestTarget.setValue(42)`:
- `to`: `<TESTTARGET_ADDRESS>`
- `value`: `0`
- `data`: `0x55241077000000000000000000000000000000000000000000000000000000000000002a`

3. Call `TestTarget.setMessage("Hello multisig")`:
- `to`: `<TESTTARGET_ADDRESS>`
- `value`: `0`
- `data`: `0x368b87720000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000000e48656c6c6f206d756c7469736967000000000000000000000000000000000000`

4. Call `TestTarget.withdraw(recipient, 0.1 ether)`:
- `to`: `<TESTTARGET_ADDRESS>`
- `value`: `0`
- `data`: `0xf3fef3a3000000000000000000000000f39fd6e51aad88f6f4ce6ab8827279cfffb92266000000000000000000000000000000000000000000000000016345785d8a0000`

**Troubleshooting**
- If wallet chain warning appears, switch wallet to `Anvil Local` (`chainId: 31337`).
- If actions fail with revert, check:
1. sender is an owner,
2. contract has enough ETH,
3. calldata matches target function.
- If port `8545` is occupied, stop old process and restart `anvil`.

**License**
MIT

<details>
<summary>Русская версия</summary>

# Frontend - UI MultiSig Wallet

Фронтенд на Next.js + viem для взаимодействия с `MultiSigWallet`.

**Реализованные изменения**
- Локализация RU/EN с ручным переключением.
- Автоопределение языка браузера и сохранение выбора в `localStorage`.
- Сценарий подключения/переподключения кошелька с понятными статусами.
- Верхние toast-уведомления с автоскрытием.
- Предупреждение о несовпадении chain id с поддержкой локальной совместимости (`1337 <-> 31337`).
- Корректный перенос длинных адресов в блоке владельцев.
- Статусы транзакций в списке: `Ожидает подписи`, `Готова к исполнению`, `Исполнена`.
- Автообновление состояния контракта (периодический sync + ручное обновление).
- Действия: `create`, `confirm`, `revoke`, `execute`, `deposit`.
- Локальные шрифты без runtime-зависимости от Google Fonts.

**Окружение**
Создайте `Frontend/.env.local`:
```dotenv
NEXT_PUBLIC_CONTRACT_ADDRESS=0x5FbDB2315678afecb367f032d93F642f64180aa3
NEXT_PUBLIC_CHAIN_ID=31337
NEXT_PUBLIC_RPC_URL=http://127.0.0.1:8545
```

**Запуск**
```bash
cd Frontend
npm install
npm run dev
```
Откройте `http://localhost:3000`.

**Как работает статус транзакции**
- `Ожидает подписи`: число подтверждений меньше кворума.
- `Готова к исполнению`: кворум достигнут, но `executed == false`.
- `Исполнена`: в контракте `executed == true`.

Важно: в этом контракте исполнение может происходить автоматически внутри `confirmTransaction` при достижении кворума.

**Готовые примеры для полей (`to` / `value` / `data`)**
1. Перевод ETH на обычный адрес:
- `to`: `<EOA_ADDRESS>`
- `value`: `0.05`
- `data`: `0x`

2. Вызов `TestTarget.setValue(42)`:
- `to`: `<TESTTARGET_ADDRESS>`
- `value`: `0`
- `data`: `0x55241077000000000000000000000000000000000000000000000000000000000000002a`

3. Вызов `TestTarget.setMessage("Hello multisig")`:
- `to`: `<TESTTARGET_ADDRESS>`
- `value`: `0`
- `data`: `0x368b87720000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000000e48656c6c6f206d756c7469736967000000000000000000000000000000000000`

4. Вызов `TestTarget.withdraw(recipient, 0.1 ether)`:
- `to`: `<TESTTARGET_ADDRESS>`
- `value`: `0`
- `data`: `0xf3fef3a3000000000000000000000000f39fd6e51aad88f6f4ce6ab8827279cfffb92266000000000000000000000000000000000000000000000000016345785d8a0000`

**Траблшутинг**
- Если есть предупреждение о сети, переключите кошелек на `Anvil Local` (`chainId: 31337`).
- Если транзакция падает с revert, проверьте:
1. отправитель действительно owner,
2. у контракта достаточно ETH,
3. calldata соответствует вызываемой функции.
- Если порт `8545` занят, завершите старый процесс и перезапустите `anvil`.

**Лицензия**
MIT

</details>
