# MultiSig Wallet

A pragmatic multisig smart contract with Foundry tests plus a Next.js + viem frontend demo.

**Repository Overview**
This repository contains:
- `Contracts/` Solidity contract, scripts, and tests built with Foundry.
- `Frontend/` Demo UI for interacting with the contract using Next.js and viem.

**Architecture**
```mermaid
flowchart LR
  User[User] -->|Clicks UI| Frontend[Frontend\nNext.js + viem]
  Frontend -->|Read| RPC[RPC\nAnvil / Testnet]
  Frontend -->|Write| Wallet[Wallet\nMetaMask]
  Wallet -->|Sign Tx| RPC
  RPC --> Contract[MultiSigWallet\nSolidity Contract]
  Contract --> RPC
  RPC --> Frontend
```

**Quick Start (Local)**
1. Start a local chain:
```bash
anvil --port 8545 --silent
```
2. Deploy the contract:
```bash
cd Contracts
forge install
forge create src/MultiSigWallet.sol:MultiSigWallet \
  --rpc-url http://127.0.0.1:8545 \
  --private-key <ANVIL_PRIVATE_KEY> \
  --constructor-args '["<OWNER1>","<OWNER2>","<OWNER3>"]' 2 \
  --broadcast
```
3. Configure the frontend environment:
Open `Frontend/.env.local` and set:
```
NEXT_PUBLIC_CONTRACT_ADDRESS=<DEPLOYED_ADDRESS>
NEXT_PUBLIC_CHAIN_ID=31337
NEXT_PUBLIC_RPC_URL=http://127.0.0.1:8545
```
4. Run the frontend:
```bash
cd Frontend
npm install
npm run dev
```

**Notes**
- Foundry is required for the `Contracts` project.
- Node.js 18+ is recommended for the frontend.
- The UI expects the owner addresses used during deployment.

**License**
MIT.

<details>
<summary>Русская версия</summary>

# MultiSig Wallet

Практичный мультисиг‑контракт с тестами на Foundry и демонстрационный фронтенд на Next.js + viem.

**Обзор репозитория**
В репозитории есть:
- `Contracts/` Контракт Solidity, скрипты и тесты на Foundry.
- `Frontend/` UI для работы с контрактом на Next.js и viem.

**Архитектура**
```mermaid
flowchart LR
  User[Пользователь] -->|Кликает UI| Frontend[Frontend\nNext.js + viem]
  Frontend -->|Чтение| RPC[RPC\nAnvil / Testnet]
  Frontend -->|Запись| Wallet[Кошелек\nMetaMask]
  Wallet -->|Подпись Tx| RPC
  RPC --> Contract[MultiSigWallet\nSolidity Contract]
  Contract --> RPC
  RPC --> Frontend
```

**Быстрый старт (локально)**
1. Запустите локальную сеть:
```bash
anvil --port 8545 --silent
```
2. Разверните контракт:
```bash
cd Contracts
forge install
forge create src/MultiSigWallet.sol:MultiSigWallet \
  --rpc-url http://127.0.0.1:8545 \
  --private-key <ANVIL_PRIVATE_KEY> \
  --constructor-args '["<OWNER1>","<OWNER2>","<OWNER3>"]' 2 \
  --broadcast
```
3. Настройте фронтенд:
Откройте `Frontend/.env.local` и задайте:
```
NEXT_PUBLIC_CONTRACT_ADDRESS=<DEPLOYED_ADDRESS>
NEXT_PUBLIC_CHAIN_ID=31337
NEXT_PUBLIC_RPC_URL=http://127.0.0.1:8545
```
4. Запустите фронтенд:
```bash
cd Frontend
npm install
npm run dev
```

**Примечания**
- Для `Contracts` нужен Foundry.
- Для фронтенда рекомендуется Node.js 18+.
- UI ожидает адреса владельцев, указанные при деплое.

**Лицензия**
MIT.

</details>
