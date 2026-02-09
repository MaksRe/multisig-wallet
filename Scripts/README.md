# Scripts

Git Bash helper scripts for local development and deployment.

**Files**
- `anvil.sh` starts local node on port `8545`.
- `deploy-multisig.sh` deploys `MultiSigWallet` via Foundry script.
- `deploy-testtarget.sh` deploys `TestTarget` via Foundry script.
- `.env.example` template for script environment variables.

**Requirements**
- Run via Git Bash.
- Foundry installed (`forge`, `anvil`).
- Local RPC available at `http://127.0.0.1:8545`.

**Environment Variables**
Use `Scripts/.env` (copied from `.env.example`) or export in shell:
- `PRIVATE_KEY` deployer private key.
- `OWNERS` comma-separated owners for multisig.
- `REQUIRED` quorum for multisig.
- `MULTISIG_ADDRESS` multisig address for `TestTarget` owner.

**Run**
```bash
bash Scripts/anvil.sh
bash Scripts/deploy-multisig.sh
bash Scripts/deploy-testtarget.sh
```

**Notes**
- Scripts auto-load `Scripts/.env` if file exists.
- Scripts internally switch to `Contracts/` directory, so they can be started from repo root or from `Scripts/`.
- If `anvil` fails with socket error (`os error 10048`), old process is still running on the same port.

<details>
<summary>Русская версия</summary>

# Scripts

Вспомогательные скрипты Git Bash для локального запуска и деплоя.

**Файлы**
- `anvil.sh` запускает локальную ноду на порту `8545`.
- `deploy-multisig.sh` деплоит `MultiSigWallet` через Foundry script.
- `deploy-testtarget.sh` деплоит `TestTarget` через Foundry script.
- `.env.example` шаблон переменных окружения для скриптов.

**Требования**
- Запускать через Git Bash.
- Установленный Foundry (`forge`, `anvil`).
- Доступный локальный RPC `http://127.0.0.1:8545`.

**Переменные окружения**
Используйте `Scripts/.env` (копия `.env.example`) или экспортируйте вручную:
- `PRIVATE_KEY` приватный ключ деплойера.
- `OWNERS` владельцы мультисига через запятую.
- `REQUIRED` кворум мультисига.
- `MULTISIG_ADDRESS` адрес мультисига для владельца `TestTarget`.

**Запуск**
```bash
bash Scripts/anvil.sh
bash Scripts/deploy-multisig.sh
bash Scripts/deploy-testtarget.sh
```

**Примечания**
- Скрипты автоматически подгружают `Scripts/.env`, если файл существует.
- Скрипты сами переходят в `Contracts/`, поэтому их можно запускать и из корня, и из `Scripts/`.
- Если `anvil` падает с ошибкой сокета (`os error 10048`), значит старый процесс все еще занят тем же портом.

</details>
