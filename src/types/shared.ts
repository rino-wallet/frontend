import { asyncActionStatuses } from "../constants";

const asyncActionStatusesList = [asyncActionStatuses.idle, asyncActionStatuses.loading, asyncActionStatuses.succeeded, asyncActionStatuses.failed] as const;

export type WalletTxSet = {
  getMultisigTxHex: () => string;
};

export type WalletTx = {
  getTxSet: () => WalletTxSet;
};

export type CurrenciesList = [string, string][];

export type WalletRaw = {
  isConnected: () => boolean;
  getBalance: (a: number, b: number) => Promise<number>;
  getUnlockedBalance: (a: number, b: number) => Promise<number>;
  getDaemonHeight: () => Promise<number>;
  getHeight: () => Promise<number>;
  getMultisigInfo: () => Promise<{ isMultisig: () => boolean; }>;
  isMultisig: () => boolean;
  getAddress: (a: number, b: number) => Promise<string>;
  prepareMultisig: () => Promise<string>;
  makeMultisig: (peerMultisigHexes: string[], numberOfParticipants: number, walletPassword: string) => Promise<string>;
  exchangeMultisigKeys: (multisigHexes: string[], walletPassword: string) => Promise<ExchangeMultisigKeysResult>;
  close: () => Promise<any>;
  getData: () => Promise<Array<Uint8Array>>;
  importOutputs: (outputsHex: string) => Promise<any>;
  exportMultisigHex: () => Promise<string>;
  importMultisigHex: (multisigHexes: string[]) => Promise<number>;
  getOutputs: (query: Record<string, number | string>) => Promise<number[]>;
  reconstructValidateTx: (txHex: string, config: TransactionConfig) => Promise<WalletTx[]>;
  loadMultisigTx: (txHex: string) => Promise<{ state: TransactionConfig }>;
  getMultisigSeed: (passphrase: string) => Promise<string>;
  getSubaddresses: (accountIdx: number, subaddressIndices: number) => Promise<any>;
};

export type ExchangeMultisigKeysResult = {
  state: {
    address?: string;
    multisigHex: string;
  };
};

export type WalletConfig = {
  path?: string;
  password: string;
  networkType: "mainnet" | "testnet" | "stagenet";
  seedOffset?: string;
  primaryAddress?: string;
  privateViewKey?: string;
  privateSpendKey?: string;
  restoreHeight?: number;
  language?: string;
  serverUri?: string;
  serverUsername?: string;
  serverPassword?: string;
  rejectUnauthorized?: boolean;
  server?: any;
  proxyToWorker?: boolean;
  keysData?: Uint8Array,
  cacheData?: Uint8Array,
};

export type TransactionConfig = {
  address?: string,
  amount?: string,
  fee?: number
};

export type ExchangeCurrencies = "xmr" | "btc" | "eth" | "sol" | "ada" | "usdt" | "usdc" | "bnb" | "xrp" | "doge" | "dot";

export interface NewWalletPDFData {
  userWalletSeed: string;
  backupWalletSeed: string;
  walletName: string;
  password: string;
  address: string;
  username: string;
  checkString: string;
  date: string;
}

export interface PdfDocumentConfig {
  title: string;
  filename: string;
  totalPages?: number;
  downloadFile?: boolean;
}

export type UseThunkActionCreator<Response> = Promise<Response> & { abort: () => void };

export type AsyncActionStatuses = typeof asyncActionStatusesList[number];

export type TaskStatus = "COMPLETED" | "FAILED" | "CREATED";

export type Env = "production" | "test" | "staging" | "develop";

export type AccessLevel = "Owner" | "View-only" | "Spender" | "Admin";

export type ReactAppEnv = "production" | "test" | "staging" | "develop";

export type ApiErrorRaw = Record<string, string | string[]>;

export type ApiError = Record<string, string>;

export interface DerivedKeys { authKey: string; encryptionKey: string }

export interface WindowSize {
  width: number | undefined;
  height: number | undefined;
}

export interface KeyPairJsonWrapper {
  version: string;
  method: "symmetric";
  encContent: string;
  nonce: string;
}

export interface Keypair {
  privateKey: Uint8Array;
  publicKey: Uint8Array;
  keyType: string;
}

export interface EncryptedPrivateKeysData {
  encryptedMessage: Uint8Array;
  nonce: Uint8Array;
}

export interface EncryptedPrivateKeysDataSet {
  ek: EncryptedPrivateKeysData;
  rk: EncryptedPrivateKeysData;
}

export interface UserKeyPairInfo {
  authKey: Uint8Array;
  recoveryKey: Uint8Array;
  encryptionPublicKey: Uint8Array;
  signingPublicKey: Uint8Array;
  encPrivateKeysDataSet: EncryptedPrivateKeysDataSet;
  signature: Uint8Array;
  clean: () => void;
}

export interface ListMetadata {
  page?: number;
  pages: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
  count: number;
}
