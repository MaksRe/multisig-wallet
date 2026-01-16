# Frontend

Next.js + viem demo UI for the MultiSigWallet contract.

## Quick start

1. cd Frontend
2. Copy .env.example to .env.local and fill in the contract address.
3. npm install
4. npm run dev

## Env vars

- NEXT_PUBLIC_CONTRACT_ADDRESS: Deployed MultiSigWallet address.
- NEXT_PUBLIC_CHAIN_ID: Chain id (e.g. 11155111 for Sepolia, 31337 for Anvil).
- NEXT_PUBLIC_RPC_URL: Optional. If empty, the default RPC for the chain is used.
