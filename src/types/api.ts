import { string } from "yup/lib/locale";

interface ListResponse {
  count: number;
  next: string | null;
  previous: string | null;
}

export interface ListRequestParams {
  offset: number;
  limit: number;
}
interface Wallet {
  id: string;
  name: string;
  maxAmount: null;
  minApprovals: null;
  members: WalletMember[]
  createdAt: string;
  updatedAt: string;
  height: number;
  address: string;
  balance: string;
  unlockedBalance: string;
  status: boolean;
}
interface WalletMember {
  id: string;
  user: string;
  accessLevel: string;
  encryptedKeys: string;
  createdAt: string;
  updatedAt: string
}

interface TransactionDestination {
  index: number;
  address: string;
  amount: string;
}

interface Transaction {
  id: string;
  amount: string;
  timestamp: string;
  direction: string;
  fee?: string;
  confirmations: number;
  destinations: TransactionDestination[]
}

export interface SignInPayload {
  email: string;
  password: string;
}

export interface SignInResponse {
  token: string;
  expiry: string;
}

// Sign Up api interface
export interface SignUpPayload {
  email: string;
  password: string;
  password_confirmation: string;
}

export interface SignUpResponse {
  email: string;
}

// Change password api interface
export interface ChangePasswordPayload {
  new_password: string;
  re_new_password: string;
  current_password: string;
  enc_private_key: string;
  signature: string;
}

// updateUser api interface
export interface UpdateUserPayload {
  name: string;
}

// Reset password api interface
export interface ResetPasswordRequestPayload {
  email: string;
}
export interface ResetPasswordConfirmPayload {
  uid: string;
  token: string;
  new_password: string;
  re_new_password: string;
  signature: string;
  enc_private_key: string;
}

// Confirm email api interface
export interface ConfirmEmailPayload {
  token: string;
  uid: string;
}

// Create wallet api interface
export interface CreateWalletPayload {
  name: string;
  user_multisig_info: string;
  backup_multisig_info: string;
}

export type CreateWalletResponse = {
  taskId: string;
}

// Finalize wallet api interface
export interface FinalizeWalletPayload {
  address: string;
  user_multisig_xinfo: string;
  backup_multisig_xinfo: string;
  encrypted_keys: string;
}

export interface FinalizeWalletResponse {
  taskId: string;
}

// User api interface
export interface UserResponse {
  id: string;
  email: string;
  is2FaEnabled: boolean;
  isKeypairSet: boolean;
  name: string;
  username: string;
  keypair: {
    encPrivateKey: string;
    fingerprint: string;
    publicKey: string;
  };
}

// Setup keypair api interface
export interface SetUpKeyPairPayload {
  enc_private_key: string;
  enc_private_key_backup: string;
  public_key: string;
  signature: string;
}

export interface SetUpKeyPairResponse {
  recoveryKey: string;
}

// Fetch wallet transactions api interface
export interface FetchWalletTransactionsResponse extends ListResponse {
  results: Transaction[];
}

// Fetch wallets api interface
export interface FetchWalletsResponse extends ListResponse {
  results: Wallet[];
}

// fetch wallet details api interface
export interface FetchWalletDetailsPayload {
  id: string;
}

export type FetchWalletDetailsResponse = Wallet;

// update wallet details api interface
export interface UpdateWalletDetailsPayload {
  id: string;
  name: string;
}

export type UpdateWalletDetailsResponse = Wallet;

// fetch private key api interface
export interface FetchBackupPrivateKeyPayload {
  uid: string;
  token: string;
}

export interface FetchBackupPrivateKeyResponse {
  encPrivateKeyBackup: string;
}

// fetch public key api interface
export interface FetchPublicKeyPayload {
  email: string;
}

export type FetchPublicKeyResponse = {
  publicKey: string;
  email: string;
}[]

// 2FA  api interface
export interface Create2FAResponse {
  secretKey: string;
  provisioningUri: string;
}

export interface Enable2FAPayload {
  code: string;
}

export type Enable2FAResponse = void;

export interface Delete2FAPayload {
  code: string;
}

// change email interface
export interface ChangeEmailRequestPayload {
  new_email: string;
  current_password: string;
}

export interface ChangingEmailInfoPayload {
  token: string;
}

export interface ChangingEmailInfoResponse {
  token: string;
  newEmail: string;
}

export interface ChangeEmailConfirmPayload {
  token: string;
}

// get wallet outputs  api interface
export interface GetOutputsPayload {
  id: string;
}

export interface GetOutputsResponse {
  taskId: string;
}

// share wallet api interface
export interface ShareWalletPayload {
  access_level: number;
  encrypted_keys: string;
  email: string;
}

export interface ShareWalletResponse {
    id: string;
    accessLevel: string;
    createdAt: string;
    user: {
    id: 0,
    email: string;
    name: string;
  },
  wallet: {
    id: string;
    name: string;
  }
}

// remove wallet access api interface
export interface RemoveWalletAccessPayload {
  walletId: string;
  userId: string;
}

export type RemoveWalletAccessResponse = void;

// create unsigned transaction api interface
export interface Destination {
  address: string;
  amount: number;
}

export interface CreateUnsignedTransactionPayload {
  destinations: Destination[];
  multisig_hex: string;
  priority: string;
}

export interface CreateUnsignedTransactionResponse {
  taskId: string;
}

// submit transaction api interface
export interface SubmitTransactionPayload {
  tx_hex: string;
  memo: string;
}

export interface SubmitTransactionResponse {
  taskId: string;
}

// fetch transaction details api interface

export interface FetchTransactionDetailsPayload {
  walletId: string;
  transactionId: string;
}

export type FetchTransactionDetailsResponse = Transaction;

// delete wallet api interface

export interface DeleteWalletPayload {
  id: string;
}

export type DeleteWalletResponse = void;

// create subaddress api interface

interface Subaddress {
  address: string;
}
export interface CreateSubaddressResponse {
  taskId: string;
}

export interface FetchSubaddressResponse extends ListResponse {
  results: Subaddress[];
}