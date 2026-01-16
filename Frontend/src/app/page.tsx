"use client";

import type { CSSProperties } from "react";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  createPublicClient,
  createWalletClient,
  custom,
  defineChain,
  formatEther,
  http,
  isAddress,
  parseEther
} from "viem";
import type { Chain } from "viem";
import {
  anvil,
  arbitrum,
  base,
  holesky,
  mainnet,
  optimism,
  polygon,
  sepolia
} from "viem/chains";
import { multisigAbi } from "../lib/contract";

const parsedChainId = Number(process.env.NEXT_PUBLIC_CHAIN_ID);
const DEFAULT_CHAIN_ID = Number.isFinite(parsedChainId) && parsedChainId > 0
  ? parsedChainId
  : 11155111;

const DEFAULT_CONTRACT_ADDRESS =
  process.env.NEXT_PUBLIC_CONTRACT_ADDRESS ?? "";
const DEFAULT_RPC_URL = process.env.NEXT_PUBLIC_RPC_URL ?? "";

const chainMap: Record<number, Chain> = {
  [mainnet.id]: mainnet,
  [sepolia.id]: sepolia,
  [holesky.id]: holesky,
  [anvil.id]: anvil,
  [polygon.id]: polygon,
  [optimism.id]: optimism,
  [arbitrum.id]: arbitrum,
  [base.id]: base
};

const LANGUAGE_STORAGE_KEY = "multisig_language";

const languageLabels = {
  en: "English",
  ru: "Русский"
};

const copy = {
  en: {
    languageLabel: "Language",
    hero: {
      eyebrow: "MultiSig Wallet",
      title: "Ship approvals with a sharp, shared command desk.",
      lead:
        "This panel connects to your deployed MultiSigWallet and gives each owner a clear path to create, sign, and execute transactions."
    },
    chips: {
      chain: "Chain",
      contract: "Contract",
      rpc: "RPC",
      notSet: "Not set"
    },
    stats: {
      title: "Live status",
      balance: "Balance",
      requiredSignatures: "Required signatures",
      owners: "Owners",
      transactions: "Transactions"
    },
    buttons: {
      refresh: "Refresh",
      refreshing: "Refreshing...",
      clearStatus: "Clear status",
      create: "Create",
      sendDeposit: "Send deposit",
      confirm: "Confirm",
      revoke: "Revoke",
      execute: "Execute"
    },
    configuration: {
      title: "Configuration",
      contractAddress: "Contract address",
      chainId: "Chain id",
      rpcUrl: "RPC URL (optional)",
      hint:
        "Provide the deployed contract address and the chain you used for deployment. The UI will re-sync as soon as the address is valid."
    },
    wallet: {
      title: "Wallet",
      connected: "Connected",
      walletChain: "Wallet chain",
      chainWarning: "Wallet chain id does not match the configured chain.",
      connect: "Connect wallet",
      reconnect: "Reconnect wallet"
    },
    owners: {
      title: "Owners",
      empty: "No owners loaded yet."
    },
    createTx: {
      title: "Create transaction",
      to: "Recipient address",
      value: "Value (ETH)",
      data: "Data (hex)"
    },
    deposit: {
      title: "Deposit",
      value: "Value (ETH)",
      hint:
        "Deposit ETH directly to the contract balance so owners can execute outgoing transactions."
    },
    transactions: {
      title: "Transactions",
      empty: "No transactions created yet.",
      label: "Tx",
      to: "To",
      value: "Value",
      confirmations: "Confirmations",
      executed: "Executed",
      yes: "Yes",
      no: "No",
      data: "Data"
    },
    actions: {
      createTransaction: "Create transaction",
      confirmTransaction: "Confirm transaction",
      revokeConfirmation: "Revoke confirmation",
      executeTransaction: "Execute transaction"
    },
    status: {
      walletMissing: "No injected wallet found. Install MetaMask or similar.",
      walletConnected: "Wallet connected.",
      connectWalletToSend: "Connect a wallet to send transactions.",
      setContractAddressFirst: "Set a valid contract address first.",
      invalidRecipient: "Recipient address is invalid.",
      dataMustBeHex: "Data must be hex starting with 0x.",
      connectWalletFirst: "Connect a wallet first.",
      setContractAddress: "Set a valid contract address.",
      actionSent: (label: string, hash: string) => `${label} sent: ${hash}`,
      actionConfirmed: (label: string) => `${label} confirmed.`,
      depositSent: (hash: string) => `Deposit sent: ${hash}`,
      depositConfirmed: "Deposit confirmed.",
      unknownError: "Unknown error",
      unexpectedError: "Unexpected error"
    }
  },
  ru: {
    languageLabel: "Язык",
    hero: {
      eyebrow: "MultiSig Wallet",
      title: "Согласования без хаоса — единая командная панель.",
      lead:
        "Эта панель подключается к вашему развернутому MultiSigWallet и дает каждому владельцу понятный путь для создания, подписания и исполнения транзакций."
    },
    chips: {
      chain: "Сеть",
      contract: "Контракт",
      rpc: "RPC",
      notSet: "Не задан"
    },
    stats: {
      title: "Состояние",
      balance: "Баланс",
      requiredSignatures: "Необходимые подписи",
      owners: "Владельцы",
      transactions: "Транзакции"
    },
    buttons: {
      refresh: "Обновить",
      refreshing: "Обновление...",
      clearStatus: "Сбросить статус",
      create: "Создать",
      sendDeposit: "Отправить депозит",
      confirm: "Подписать",
      revoke: "Отозвать",
      execute: "Исполнить"
    },
    configuration: {
      title: "Конфигурация",
      contractAddress: "Адрес контракта",
      chainId: "Chain ID",
      rpcUrl: "RPC URL (опционально)",
      hint:
        "Укажите адрес развернутого контракта и сеть деплоя. Интерфейс обновится сразу после ввода корректного адреса."
    },
    wallet: {
      title: "Кошелек",
      connected: "Подключен",
      walletChain: "Сеть кошелька",
      chainWarning: "Chain ID кошелька не совпадает с выбранной сетью.",
      connect: "Подключить кошелек",
      reconnect: "Переподключить кошелек"
    },
    owners: {
      title: "Владельцы",
      empty: "Владельцы пока не загружены."
    },
    createTx: {
      title: "Создать транзакцию",
      to: "Адрес получателя",
      value: "Сумма (ETH)",
      data: "Данные (hex)"
    },
    deposit: {
      title: "Депозит",
      value: "Сумма (ETH)",
      hint:
        "Пополните баланс контракта ETH, чтобы владельцы могли исполнять исходящие транзакции."
    },
    transactions: {
      title: "Транзакции",
      empty: "Транзакций пока нет.",
      label: "Транзакция",
      to: "Кому",
      value: "Сумма",
      confirmations: "Подписей",
      executed: "Исполнено",
      yes: "Да",
      no: "Нет",
      data: "Данные"
    },
    actions: {
      createTransaction: "Создать транзакцию",
      confirmTransaction: "Подтвердить транзакцию",
      revokeConfirmation: "Отозвать подтверждение",
      executeTransaction: "Исполнить транзакцию"
    },
    status: {
      walletMissing: "Кошелек не найден. Установите MetaMask или аналогичный.",
      walletConnected: "Кошелек подключен.",
      connectWalletToSend: "Подключите кошелек, чтобы отправлять транзакции.",
      setContractAddressFirst: "Сначала укажите корректный адрес контракта.",
      invalidRecipient: "Некорректный адрес получателя.",
      dataMustBeHex: "Данные должны быть hex и начинаться с 0x.",
      connectWalletFirst: "Сначала подключите кошелек.",
      setContractAddress: "Укажите корректный адрес контракта.",
      actionSent: (label: string, hash: string) =>
        `Запрос отправлен: ${label}. Хэш: ${hash}`,
      actionConfirmed: (label: string) => `Запрос подтвержден: ${label}.`,
      depositSent: (hash: string) => `Депозит отправлен: ${hash}`,
      depositConfirmed: "Депозит подтвержден.",
      unknownError: "Неизвестная ошибка",
      unexpectedError: "Непредвиденная ошибка"
    }
  }
} as const;

type Language = keyof typeof copy;

type StatusTone = "neutral" | "ok" | "error";

type Status = {
  tone: StatusTone;
  message: string;
  timeoutMs?: number;
};

type TransactionItem = {
  id: number;
  to: `0x${string}`;
  value: bigint;
  data: `0x${string}`;
  executed: boolean;
  confirmations: bigint;
};

const isSupportedLanguage = (value: string | null): value is Language =>
  value === "en" || value === "ru";

const resolveChain = (chainId: number, rpcUrl: string) => {
  const known = chainMap[chainId];
  if (known) {
    return known;
  }

  const fallbackRpc = rpcUrl || "http://127.0.0.1:8545";
  return defineChain({
    id: chainId,
    name: `Chain ${chainId}`,
    nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 },
    rpcUrls: {
      default: { http: [fallbackRpc] }
    }
  });
};

const shortenAddress = (value: string, size = 6) => {
  if (!value) return "";
  if (value.length <= size * 2) return value;
  return `${value.slice(0, size)}...${value.slice(-4)}`;
};

const parseError = (
  error: unknown,
  fallback: { unknown: string; unexpected: string }
) => {
  if (!error) return fallback.unknown;
  if (typeof error === "string") return error;
  if (error instanceof Error) return error.message;
  if (typeof error === "object" && "shortMessage" in error) {
    return String((error as { shortMessage?: string }).shortMessage);
  }
  return fallback.unexpected;
};

const resolveToastTimeout = (value: Status | null) => {
  if (!value) return null;
  if (typeof value.timeoutMs === "number") return value.timeoutMs;
  if (value.tone === "error") return 5200;
  if (value.tone === "ok") return 3600;
  return 4200;
};

export default function Home() {
  const [contractAddress, setContractAddress] = useState(
    DEFAULT_CONTRACT_ADDRESS
  );
  const [chainId, setChainId] = useState(DEFAULT_CHAIN_ID);
  const [rpcUrl, setRpcUrl] = useState(DEFAULT_RPC_URL);
  const [account, setAccount] = useState<`0x${string}` | null>(null);
  const [walletChainId, setWalletChainId] = useState<number | null>(null);
  const [owners, setOwners] = useState<`0x${string}`[]>([]);
  const [transactions, setTransactions] = useState<TransactionItem[]>([]);
  const [balance, setBalance] = useState<bigint>(0n);
  const [requiredSignatures, setRequiredSignatures] = useState<bigint>(0n);
  const [status, setStatus] = useState<Status | null>(null);
  const [isWorking, setIsWorking] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [newTx, setNewTx] = useState({ to: "", value: "", data: "" });
  const [depositValue, setDepositValue] = useState("");
  const [language, setLanguage] = useState<Language>("en");

  const t = copy[language];
  const errorFallback = useMemo(
    () => ({
      unknown: t.status.unknownError,
      unexpected: t.status.unexpectedError
    }),
    [t.status.unknownError, t.status.unexpectedError]
  );

  const chain = useMemo(() => resolveChain(chainId, rpcUrl), [chainId, rpcUrl]);
  const resolvedRpcUrl =
    rpcUrl || chain.rpcUrls.default.http[0] || "http://127.0.0.1:8545";

  const publicClient = useMemo(
    () =>
      createPublicClient({
        chain,
        transport: http(resolvedRpcUrl)
      }),
    [chain, resolvedRpcUrl]
  );

  const walletClient = useMemo(() => {
    if (typeof window === "undefined") return null;
    if (!(window as Window & { ethereum?: unknown }).ethereum) return null;

    return createWalletClient({
      chain,
      transport: custom((window as Window & { ethereum: unknown }).ethereum)
    });
  }, [chain]);

  const contract = useMemo(() => {
    if (!isAddress(contractAddress)) return null;
    return {
      address: contractAddress as `0x${string}`,
      abi: multisigAbi
    };
  }, [contractAddress]);

  const refresh = useCallback(async () => {
    if (!contract) {
      setOwners([]);
      setTransactions([]);
      setBalance(0n);
      setRequiredSignatures(0n);
      return;
    }

    setIsRefreshing(true);
    try {
      const [ownerCount, txCount, nextRequired, nextBalance] =
        await Promise.all([
          publicClient.readContract({
            ...contract,
            functionName: "getOwnerCount"
          }),
          publicClient.readContract({
            ...contract,
            functionName: "getTransactionCount"
          }),
          publicClient.readContract({
            ...contract,
            functionName: "requiredSignatures"
          }),
          publicClient.readContract({
            ...contract,
            functionName: "getBalance"
          })
        ]);

      const ownerTotal = Number(ownerCount);
      const txTotal = Number(txCount);

      const ownerReads = Array.from({ length: ownerTotal }, (_, index) =>
        publicClient.readContract({
          ...contract,
          functionName: "owners",
          args: [BigInt(index)]
        })
      );

      const ownerAddresses = (await Promise.all(ownerReads)) as `0x${string}`[];

      const txReads = Array.from({ length: txTotal }, (_, index) =>
        publicClient.readContract({
          ...contract,
          functionName: "getTransaction",
          args: [BigInt(index)]
        })
      );

      const txResults = await Promise.all(txReads);
      const parsedTxs: TransactionItem[] = txResults.map((item, index) => {
        const [to, value, data, executed, confirmations] = item as [
          `0x${string}`,
          bigint,
          `0x${string}`,
          boolean,
          bigint
        ];

        return {
          id: index,
          to,
          value,
          data,
          executed,
          confirmations
        };
      });

      setOwners(ownerAddresses);
      setTransactions(parsedTxs);
      setRequiredSignatures(nextRequired as bigint);
      setBalance(nextBalance as bigint);
    } catch (error) {
      setStatus({ tone: "error", message: parseError(error, errorFallback) });
    } finally {
      setIsRefreshing(false);
    }
  }, [contract, errorFallback, publicClient]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  useEffect(() => {
    if (!status) return;

    const timeoutMs = resolveToastTimeout(status);
    if (!timeoutMs) return;
    const timer = window.setTimeout(() => setStatus(null), timeoutMs);

    return () => window.clearTimeout(timer);
  }, [status]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    try {
      const stored = window.localStorage.getItem(LANGUAGE_STORAGE_KEY);
      if (isSupportedLanguage(stored)) {
        setLanguage(stored);
        return;
      }

      const navigatorLanguage =
        window.navigator.language || window.navigator.languages?.[0] || "en";
      if (navigatorLanguage.toLowerCase().startsWith("ru")) {
        setLanguage("ru");
      }
    } catch {
      // Ignore storage access issues.
    }
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      window.localStorage.setItem(LANGUAGE_STORAGE_KEY, language);
    } catch {
      // Ignore storage access issues.
    }
  }, [language]);

  useEffect(() => {
    if (!walletClient) return;

    walletClient
      .getAddresses()
      .then((addresses) => {
        setAccount(addresses[0] ?? null);
      })
      .catch(() => {
        setAccount(null);
      });
  }, [walletClient]);

  useEffect(() => {
    if (!walletClient) {
      setWalletChainId(null);
      return;
    }

    walletClient
      .getChainId()
      .then((id) => setWalletChainId(id))
      .catch(() => setWalletChainId(null));
  }, [walletClient, account]);

  const connectWallet = async () => {
    if (!walletClient) {
      setStatus({
        tone: "error",
        message: t.status.walletMissing,
        timeoutMs: 3000
      });
      return;
    }

    try {
      const addresses = await walletClient.requestAddresses();
      setAccount(addresses[0] ?? null);
      setStatus({ tone: "ok", message: t.status.walletConnected });
    } catch (error) {
      setStatus({
        tone: "error",
        message: parseError(error, errorFallback),
        timeoutMs: 3000
      });
    }
  };

  const sendContractTx = async (
    label: string,
    config: { functionName: string; args?: readonly unknown[]; value?: bigint }
  ) => {
    if (!walletClient || !account) {
      setStatus({
        tone: "error",
        message: t.status.connectWalletToSend
      });
      return;
    }

    if (!contract) {
      setStatus({
        tone: "error",
        message: t.status.setContractAddressFirst
      });
      return;
    }

    setIsWorking(true);
    try {
      const hash = await walletClient.writeContract({
        ...contract,
        functionName: config.functionName,
        args: config.args,
        account,
        value: config.value
      });

      setStatus({ tone: "ok", message: t.status.actionSent(label, hash) });
      await publicClient.waitForTransactionReceipt({ hash });
      setStatus({ tone: "ok", message: t.status.actionConfirmed(label) });
      await refresh();
    } catch (error) {
      setStatus({ tone: "error", message: parseError(error, errorFallback) });
    } finally {
      setIsWorking(false);
    }
  };

  const handleCreateTransaction = async () => {
    if (!isAddress(newTx.to)) {
      setStatus({ tone: "error", message: t.status.invalidRecipient });
      return;
    }

    const value = newTx.value.trim() === "" ? "0" : newTx.value.trim();
    const dataValue = newTx.data.trim() === "" ? "0x" : newTx.data.trim();

    if (!/^0x[0-9a-fA-F]*$/.test(dataValue)) {
      setStatus({ tone: "error", message: t.status.dataMustBeHex });
      return;
    }

    let valueWei: bigint;
    try {
      valueWei = parseEther(value);
    } catch (error) {
      setStatus({ tone: "error", message: parseError(error, errorFallback) });
      return;
    }

    await sendContractTx(t.actions.createTransaction, {
      functionName: "createTransaction",
      args: [newTx.to as `0x${string}`, valueWei, dataValue as `0x${string}`]
    });
  };

  const handleDeposit = async () => {
    if (!walletClient || !account) {
      setStatus({ tone: "error", message: t.status.connectWalletFirst });
      return;
    }

    if (!contract) {
      setStatus({ tone: "error", message: t.status.setContractAddress });
      return;
    }

    const value = depositValue.trim() === "" ? "0" : depositValue.trim();
    let valueWei: bigint;

    try {
      valueWei = parseEther(value);
    } catch (error) {
      setStatus({ tone: "error", message: parseError(error, errorFallback) });
      return;
    }

    setIsWorking(true);
    try {
      const hash = await walletClient.sendTransaction({
        account,
        to: contract.address,
        value: valueWei
      });

      setStatus({ tone: "ok", message: t.status.depositSent(hash) });
      await publicClient.waitForTransactionReceipt({ hash });
      setStatus({ tone: "ok", message: t.status.depositConfirmed });
      await refresh();
    } catch (error) {
      setStatus({ tone: "error", message: parseError(error, errorFallback) });
    } finally {
      setIsWorking(false);
    }
  };

  const toastClass = status
    ? `toast ${status.tone === "ok" ? "ok" : status.tone === "error" ? "error" : ""}`
    : "toast";

  const showChainWarning =
    walletChainId !== null && walletChainId !== chain.id;
  const toastTimeoutMs = resolveToastTimeout(status);

  return (
    <main className="page">
      {status && (
        <div
          className={toastClass}
          style={
            toastTimeoutMs
              ? ({ "--toast-duration": `${toastTimeoutMs}ms` } as CSSProperties)
              : undefined
          }
        >
          {status.message}
        </div>
      )}
      <div className="lang-toggle">
        <span className="muted">{t.languageLabel}</span>
        <div className="button-row">
          {(Object.keys(languageLabels) as Language[]).map((code) => (
            <button
              key={code}
              className={`button ghost lang ${language === code ? "active" : ""}`}
              onClick={() => setLanguage(code)}
              type="button"
            >
              {languageLabels[code]}
            </button>
          ))}
        </div>
      </div>

      <header className="hero">
        <div>
          <p className="eyebrow">{t.hero.eyebrow}</p>
          <h1>{t.hero.title}</h1>
          <p className="lead">{t.hero.lead}</p>
          <div className="chips">
            <span className="chip">
              {t.chips.chain}: {chain.name}
            </span>
            <span className="chip">
              {t.chips.contract}: {contract ? shortenAddress(contract.address) : t.chips.notSet}
            </span>
            <span className="chip">
              {t.chips.rpc}: {resolvedRpcUrl}
            </span>
          </div>
        </div>
        <div className="hero-panel">
          <div>
            <p className="eyebrow">{t.stats.title}</p>
            <div className="stat-grid">
              <div className="stat">
                <span>{t.stats.balance}</span>
                <strong>{formatEther(balance)} ETH</strong>
              </div>
              <div className="stat">
                <span>{t.stats.requiredSignatures}</span>
                <strong>{requiredSignatures.toString()}</strong>
              </div>
              <div className="stat">
                <span>{t.stats.owners}</span>
                <strong>{owners.length}</strong>
              </div>
              <div className="stat">
                <span>{t.stats.transactions}</span>
                <strong>{transactions.length}</strong>
              </div>
            </div>
          </div>
          <div className="button-row">
            <button
              className="button secondary"
              onClick={() => void refresh()}
              disabled={isRefreshing}
              type="button"
            >
              {isRefreshing ? t.buttons.refreshing : t.buttons.refresh}
            </button>
            <button
              className="button ghost"
              onClick={() => setStatus(null)}
              type="button"
            >
              {t.buttons.clearStatus}
            </button>
          </div>
        </div>
      </header>

      <section className="grid">
        <div className="card">
          <h2 className="section-title">{t.configuration.title}</h2>
          <div className="field">
            <label className="label" htmlFor="contract-address">
              {t.configuration.contractAddress}
            </label>
            <input
              id="contract-address"
              className="input"
              placeholder="0x..."
              value={contractAddress}
              onChange={(event) => setContractAddress(event.target.value.trim())}
            />
          </div>
          <div className="field">
            <label className="label" htmlFor="chain-id">
              {t.configuration.chainId}
            </label>
            <input
              id="chain-id"
              className="input"
              placeholder="11155111"
              value={chainId.toString()}
              onChange={(event) =>
                setChainId(Number(event.target.value.trim()) || chainId)
              }
            />
          </div>
          <div className="field">
            <label className="label" htmlFor="rpc-url">
              {t.configuration.rpcUrl}
            </label>
            <input
              id="rpc-url"
              className="input"
              placeholder="https://..."
              value={rpcUrl}
              onChange={(event) => setRpcUrl(event.target.value.trim())}
            />
          </div>
          <p className="muted">{t.configuration.hint}</p>
        </div>

        <div className="card">
          <h2 className="section-title">{t.wallet.title}</h2>
          <div className="list">
            <div className="list-item">
              <strong>{t.wallet.connected}:</strong> {account ? shortenAddress(account) : "-"}
            </div>
            <div className="list-item">
              <strong>{t.wallet.walletChain}:</strong> {walletChainId ?? "-"}
            </div>
          </div>
          {showChainWarning && (
            <div className="status error">{t.wallet.chainWarning}</div>
          )}
          <div className="button-row" style={{ marginTop: 16 }}>
            <button className="button" onClick={connectWallet} type="button">
              {account ? t.wallet.reconnect : t.wallet.connect}
            </button>
          </div>
        </div>

        <div className="card">
          <h2 className="section-title">{t.owners.title}</h2>
          <div className="list">
            {owners.length === 0 ? (
              <div className="list-item">{t.owners.empty}</div>
            ) : (
              owners.map((owner) => (
                <div key={owner} className="list-item">
                  <span className="address">{owner}</span>
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      <section className="grid-two">
        <div className="card">
          <h2 className="section-title">{t.createTx.title}</h2>
          <div className="field">
            <label className="label" htmlFor="tx-to">
              {t.createTx.to}
            </label>
            <input
              id="tx-to"
              className="input"
              placeholder="0x..."
              value={newTx.to}
              onChange={(event) =>
                setNewTx((prev) => ({ ...prev, to: event.target.value }))
              }
            />
          </div>
          <div className="field">
            <label className="label" htmlFor="tx-value">
              {t.createTx.value}
            </label>
            <input
              id="tx-value"
              className="input"
              placeholder="0.1"
              value={newTx.value}
              onChange={(event) =>
                setNewTx((prev) => ({ ...prev, value: event.target.value }))
              }
            />
          </div>
          <div className="field">
            <label className="label" htmlFor="tx-data">
              {t.createTx.data}
            </label>
            <textarea
              id="tx-data"
              className="textarea"
              placeholder="0x"
              value={newTx.data}
              onChange={(event) =>
                setNewTx((prev) => ({ ...prev, data: event.target.value }))
              }
            />
          </div>
          <div className="button-row">
            <button
              className="button"
              onClick={() => void handleCreateTransaction()}
              disabled={isWorking}
              type="button"
            >
              {t.buttons.create}
            </button>
          </div>
        </div>

        <div className="card">
          <h2 className="section-title">{t.deposit.title}</h2>
          <div className="field">
            <label className="label" htmlFor="deposit-value">
              {t.deposit.value}
            </label>
            <input
              id="deposit-value"
              className="input"
              placeholder="1.0"
              value={depositValue}
              onChange={(event) => setDepositValue(event.target.value)}
            />
          </div>
          <div className="button-row">
            <button
              className="button secondary"
              onClick={() => void handleDeposit()}
              disabled={isWorking}
              type="button"
            >
              {t.buttons.sendDeposit}
            </button>
          </div>
          <p className="muted">{t.deposit.hint}</p>
        </div>
      </section>

      <section className="card">
        <h2 className="section-title">{t.transactions.title}</h2>
        {transactions.length === 0 ? (
          <p className="muted">{t.transactions.empty}</p>
        ) : (
          <div className="tx-list">
            {transactions.map((tx) => (
              <div key={tx.id} className="tx-row">
                <div className="tx-meta">
                  <div>
                    <strong>
                      {t.transactions.label} #{tx.id}
                    </strong>
                  </div>
                  <div>
                    {t.transactions.to}: {tx.to}
                  </div>
                  <div>
                    {t.transactions.value}: {formatEther(tx.value)} ETH
                  </div>
                  <div>
                    {t.transactions.confirmations}: {tx.confirmations.toString()} / {requiredSignatures.toString()}
                  </div>
                  <div>
                    {t.transactions.executed}: {tx.executed ? t.transactions.yes : t.transactions.no}
                  </div>
                  <div>
                    {t.transactions.data}: {tx.data === "0x" ? "0x" : shortenAddress(tx.data, 10)}
                  </div>
                </div>
                <div className="tx-actions">
                  <button
                    className="button secondary"
                    onClick={() =>
                      void sendContractTx(t.actions.confirmTransaction, {
                        functionName: "confirmTransaction",
                        args: [BigInt(tx.id)]
                      })
                    }
                    disabled={isWorking || tx.executed}
                    type="button"
                  >
                    {t.buttons.confirm}
                  </button>
                  <button
                    className="button ghost"
                    onClick={() =>
                      void sendContractTx(t.actions.revokeConfirmation, {
                        functionName: "revokeConfirmation",
                        args: [BigInt(tx.id)]
                      })
                    }
                    disabled={isWorking || tx.executed}
                    type="button"
                  >
                    {t.buttons.revoke}
                  </button>
                  <button
                    className="button"
                    onClick={() =>
                      void sendContractTx(t.actions.executeTransaction, {
                        functionName: "executeTransaction",
                        args: [BigInt(tx.id)]
                      })
                    }
                    disabled={isWorking || tx.executed}
                    type="button"
                  >
                    {t.buttons.execute}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
