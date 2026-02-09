# Frontend — MultiSig Wallet UI

A Next.js + viem interface for interacting with the MultiSigWallet contract. The UI supports language switching (RU/EN), auto‑detects browser language, and shows toast notifications on actions.

**Features**
- Connect to an injected wallet (MetaMask or compatible).
- Read owners, balance, and transactions from the contract.
- Create, confirm, revoke, and execute transactions.
- Deposit ETH to the contract.
- Language toggle with auto‑detection and local storage.
- Toast notifications with auto‑hide.

**Requirements**
- Node.js 18+ recommended.
- A local or testnet RPC endpoint.
- A deployed MultiSigWallet contract.

**Setup**
1. Install dependencies:
```bash
npm install
```
2. Configure environment:
Create or edit `Frontend/.env.local` and set:
```
NEXT_PUBLIC_CONTRACT_ADDRESS=<DEPLOYED_ADDRESS>
NEXT_PUBLIC_CHAIN_ID=31337
NEXT_PUBLIC_RPC_URL=http://127.0.0.1:8545
```
3. Start dev server:
```bash
npm run dev
```

**Wallet Notes**
- The “Connect wallet” button uses the browser‑injected provider.
- Make sure your wallet is on the same chain as `NEXT_PUBLIC_CHAIN_ID`.

**Troubleshooting**
- If you see a chain mismatch warning, switch the network in your wallet.
- If reads fail, check the RPC URL and contract address.

**License**
MIT.

<details>
<summary>Русская версия</summary>

# Frontend — UI MultiSig Wallet

Интерфейс на Next.js + viem для работы с контрактом MultiSigWallet. В UI есть переключение языка (RU/EN), автодетект языка браузера и всплывающие уведомления.

**Возможности**
- Подключение к кошельку (MetaMask или совместимые).
- Чтение владельцев, баланса и транзакций.
- Создание, подтверждение, отзыв и исполнение транзакций.
- Депозит ETH на контракт.
- Переключение языка и сохранение выбора.
- Toast‑уведомления с автоскрытием.

**Требования**
- Рекомендуется Node.js 18+.
- RPC для локальной сети или тестнета.
- Развернутый контракт MultiSigWallet.

**Настройка**
1. Установите зависимости:
```bash
npm install
```
2. Настройте окружение:
Создайте или отредактируйте `Frontend/.env.local` и задайте:
```
NEXT_PUBLIC_CONTRACT_ADDRESS=<DEPLOYED_ADDRESS>
NEXT_PUBLIC_CHAIN_ID=31337
NEXT_PUBLIC_RPC_URL=http://127.0.0.1:8545
```
3. Запустите dev‑сервер:
```bash
npm run dev
```

**Примечания по кошельку**
- Кнопка “Connect wallet” использует провайдера, внедренного в браузер.
- Сеть кошелька должна совпадать с `NEXT_PUBLIC_CHAIN_ID`.

**Траблшутинг**
- При предупреждении о сети переключите сеть в кошельке.
- При ошибках чтения проверьте RPC и адрес контракта.

**Лицензия**
MIT.

</details>
