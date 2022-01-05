import { asyncActionStatuses } from "../constants";

const asyncActionStatusesList = [asyncActionStatuses.idle, asyncActionStatuses.loading, asyncActionStatuses.succeeded, asyncActionStatuses.failed] as const;

export type WalletTxSet = {
  getMultisigTxHex: () => string;
}

export type WalletTx = {
  getTxSet: () => WalletTxSet;
}

export type WalletRaw = {
  isConnected: () => boolean;
  getBalance: (a: number, b: number) => Promise<number>;
  getUnlockedBalance: (a: number, b: number) => Promise<number>;
  getDaemonHeight: () => Promise<number>;
  getHeight: () => Promise<number>;
  getMultisigInfo: () => Promise<{ isMultisig: () => boolean; }>;
  isMultisig: () => boolean;
  getAddress: (a: number, b: number) => Promise<string>;
  getMnemonic: () => Promise<string>;
  getPrivateViewKey: () => Promise<string>;
  prepareMultisig: () => Promise<string>;
  makeMultisig: (peerMultisigHexes: string[], numberOfParticipants: number,  walletPassword: string) => Promise<{ getMultisigHex: () => string}>;
  exchangeMultisigKeys: (multisigHexes: string[], walletPassword: string) => Promise<ExchangeMultisigKeysResult>;
  close: () => Promise<any>;
  getData: () => Promise<Array<Uint8Array>>;
  importOutputs: (outputsHex: string) => Promise<any>;
  getMultisigHex: () => Promise<string>;
  importMultisigHex: (multisigHexes: string[]) => Promise<number>;
  getOutputs: (query: Record<string, number | string>) => Promise<number[]>;
  reconstructTx: (txHex: string) => Promise<WalletTx[]>;
}

export type ExchangeMultisigKeysResult = {
  state: {
    address: string;
  };
}

export type WalletConfig = {
  path?: string;
  password: string;
  networkType: "mainnet" | "testnet" | "stagenet";
  mnemonic?: string;
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
}

export interface NewWalletPDFData {
  userWalletKeyHex: string;
  userWalletKeyB64: string;
  userWalletAddress: string;
  backupWalletKeyHex: string;
  backupWalletKeyB64: string;
  backupWalletAddress: string;
  walletName: string;
  password: string;
}

export type AsyncActionStatuses = typeof asyncActionStatusesList[number];

export type TaskStatus = "COMPLETED" | "FAILED" | "CREATED";

export type ApiErrorRaw = Record<string, string | string[]>

export type ApiError = Record<string, string>

export interface DerivedKeys { authKey: string; encryptionKey: string }