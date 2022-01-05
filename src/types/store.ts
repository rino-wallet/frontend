
import {store} from "../store";

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;

export interface WalletMember {
  id: string;
  user: string;
  accessLevel: string;
  encryptedKeys: string;
  createdAt: string;
  updatedAt: string;
}

export type Wallet = {
  id: string;
  name: string;
  maxAmount: number;
  minApprovals: number;
  members: WalletMember[];
  createdAt: string;
  updatedAt: string;
  height: string;
  address: string;
  balance: string;
  unlockedBalance: string;
  status: string;
}

export type LocalWalletData = {
  offlineMode: boolean;
  daemonHeight: number | null;
  syncHeight: number | null;
  isMultisig: boolean;
  address: string;
  mnemonic: string;
  viewKey: string;
  keyHex: string;
  base64Key: string;
  balance: string;
};

export type User = {
  id: string;
  email: string;
  is2FaEnabled: boolean;
  isKeypairSet: boolean;
  name: string;
  username: string;
  publicKey: string;
  encPrivateKey: string;
  fingerprint: string;
}

export interface TransactionDestination {
  index: number;
  address: string;
  amount: string;
}

export type Direction = "in" | "out";

export interface Transaction {
  id: string;
  amount: string;
  timestamp: string;
  createdAt: string;
  direction: Direction;
  fee?: string;
  confirmations: number;
  destinations: TransactionDestination[];
  memo: string;
}

export interface FetchWalletTransactionsThunkPayload {
  walletId: string;
  page: number;
}

export interface FetchSubaddressesThunkPayload {
  walletId: string;
  page: number;
}

export interface FetchWalletSubaddressThunkPayload {
  walletId: string;
}

export interface CreateSubaddressThunkPayload {
  walletId: string;
  updateList?: boolean;
}

export interface FetchWalletListThunkPayload {
  page: number;
}

export interface Subaddress {
  address: string;
}