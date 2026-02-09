#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
unset FOUNDRY_DRY_RUN FOUNDRY_DRY_RUN_CREATE
if [[ -f "$SCRIPT_DIR/.env" ]]; then
  set -a
  # shellcheck disable=SC1090
  source "$SCRIPT_DIR/.env"
  set +a
fi

: "${PRIVATE_KEY:?Need PRIVATE_KEY}"
: "${MULTISIG_ADDRESS:?Need MULTISIG_ADDRESS}"

cd "$ROOT_DIR/Contracts"

cmd=(
  forge script script/TestTargetDeploy.s.sol:TestTargetDeploy
  --rpc-url http://127.0.0.1:8545
  --broadcast
)

echo "Running: ${cmd[*]}"
"${cmd[@]}"

# example:
# export PRIVATE_KEY=0xac0974...
# export MULTISIG_ADDRESS=0x5FbDB2315678afecb367f032d93F642f64180aa3

# bash scripts/deploy-testtarget.sh
