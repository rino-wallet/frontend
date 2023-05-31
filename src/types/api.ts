import {
  PendingTransfer, Promotion, Referral, Subaddress,
} from "./store";
import { AccessLevel } from "./shared";

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
  maxDailyAmount: null;
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
  user: {
    email: string;
  } | string;
  accessLevel: AccessLevel;
  encryptedKeys: string;
  createdAt: string;
  updatedAt: string
  deletedAt?: string;
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
  memo: string;
}

interface ApiKey {
  id: string;
  apiKey: string;
  name: string;
  createdAt: string;
  expiresAt: string;
}

export interface SignInPayload {
  username: string;
  password: string;
  code?: string;
}

export interface SignInResponse {
  token: string;
  expiry: string;
}

// Sign Up api interface
export interface SignUpPayload {
  email: string;
  username: string;
  password: string;
  password_confirmation: string;
  company_name?: string;
  company_website?: string;
  account_type?: string;
  referral_code?: string;
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
  tx_notifications: boolean;
}

// Reset password api interface
export interface ResetPasswordRequestPayload {
  email: string;
}

export interface ResendActivationEmailPayload {
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

// Accept wallet sahre api interface
export interface AcceptWalletSharePayload {
  walletId: string;
  shareId: string;
}

// Create wallet api interface
export interface CreateWalletPayload {
  name: string;
  user_multisig_info: string;
  backup_multisig_info: string;
}

export type CreateWalletResponse = {
  taskId: string;
};

// Create Api keys api interface
export interface CreateApiKeyPayload {
  name: string;
  expires_at: string;
}

export interface CreateApiKeyResponse {
  id: string;
  apiKey: string;
  name: string;
  createdAt: string;
  expiresAt: string;
}

export interface FetchApiKeysResponse extends ListResponse {
  results: ApiKey[];
}

// Finalize wallet api interface
export interface FinalizeWalletPayload {
  user_multisig_xinfo: string;
  backup_multisig_xinfo: string;
  user_multisig_final: string;
  backup_multisig_final: string;
}

export interface FinalizeWalletResponse {
  taskId: string;
}

// User api interface
export interface UserResponse {
  id: string;
  email: string;
  accountType: string;
  companyName: string;
  companyWebsite: string;
  extraFeatures: {
    exchange: boolean;
    publicWallet: boolean;
    viewOnlyShare: boolean;
    limits: boolean;
    approvals: boolean;
  };
  is2FaEnabled: boolean;
  isKeypairSet: boolean;
  name: string;
  username: string;
  nonce: string;
  txNotifications: boolean;
  keypair: {
    encPrivateKey: string;
    encryptionPublicKey: string;
    signingPublicKey: string;
  };
}

// Setup keypair api interface
export interface SetUpKeyPairPayload {
  enc_private_key: string;
  enc_private_key_backup: string;
  encryption_public_key: string;
  signing_public_key: string;
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
  name?: string;
  requires_2fa?: boolean;
  code?: string;
  is_public?: boolean;
  public_slug?: string | null;
  max_daily_amount?: number | null;
  max_amount?: number | null;
  min_approvals?: number | null;
}

export type UpdateWalletDetailsResponse = Wallet;

// fetch private key api interface
export interface FetchBackupPrivateKeyPayload {
  uid: string;
  token: string;
}

export interface FetchBackupPrivateKeyResponse {
  encPrivateKeyBackup: string;
  username: string;
  nonce: string;
}

// fetch public key api interface
export interface FetchPublicKeyPayload {
  email: string;
}

export type FetchPublicKeyResponse = {
  encryptionPublicKey: string;
  email: string;
}[];

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

export interface SyncMultisigPayload {
  id: string;
  multisig_hex: string;
}

export interface SyncMultisigResponse {
  taskId: string;
}

export interface PersistWalletPayload {
  encrypted_keys: string;
}

export interface RequestWalletSharePayload {
  email: string,
}

// share wallet api interface
export interface ShareWalletPayload {
  access_level: number;
  encrypted_keys: string;
  email: string;
}

export interface ShareWalletResponse {
  id: string;
  accessLevel: AccessLevel;
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

export interface FetchWalletMembersThunkPayload {
  walletId: string;
  page: number;
}

export interface FetchWalletMembersResponse extends ListResponse {
  results: WalletMember[];
}

export interface FetchReferralsResponse extends ListResponse {
  results: Referral[];
}

export interface FetchPromotionsResponse extends ListResponse {
  results: Promotion[];
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
  order_id?: string;
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

// update transaction details api interface
export interface UpdateTransactionDetailsPayload {
  walletId: string;
  transactionId: string;
  memo: string;
}

export interface UpdateTransactionDetailsResponse {
  id: string;
  amount: string;
  timestamp: string;
  direction: string;
  fee?: string;
  confirmations: number;
  memo: string;
}
// delete wallet api interface

export interface DeleteWalletPayload {
  id: string;
}

export type DeleteWalletResponse = void;

// create subaddress api interface

export type SubaddressResponse = Subaddress;

export interface FetchSubaddressResponse extends ListResponse {
  results: Subaddress[];
}

export interface AddSubaddressSignaturePayload {
  signature: string;
}
export interface FetchPublicWalletDetailsResponse {
  address: string;
  balance: string;
  created_at: string;
  height: number;
  locked_amounts: [];
  name: string;
  unlocked_balance: string;
  updated_at: string;
}

export interface FetchPublicWalletTransactionDetailsPayload {
  publicSlug: string;
  transactionId: string;
}

export interface WalletShareRequest {
  id: string;
  wallet: string;
  email: string;
  isAccepted: boolean;
  accessLevel: string;
}

// Fetch wallet share requests api interface
export interface FetchWalletShareRequestsResponse extends ListResponse {
  results: WalletShareRequest[];
}

export interface UpdateSubaddressPayload {
  label: string;
}

export interface GetExchangeRangePayload {
  platform: string;
}

export interface GetExchangeRangeResponse {
  minAmount: number;
  maxAmount: number;
}

export interface GetExchangeEstimationPayload {
  platform: string;
  to_currency: string;
  amount_set_in: "from" | "to";
  amount: number;
}

export interface GetExchangeEstimationResponse {
  fromAmount: number;
  toAmount: number;
  rateId: string;
  validUntil: string;
}

export interface GetExchangeOrderPayload {
  id: string;
}

export interface CreateExchangeOrderPayload {
  to_currency: string;
  platform: string;
  wallet: string;
  amount_set_in: "from" | "to";
  amount: number;
  address: string;
  refund_address: string;
  rate_id: string;
}

export interface GetExchangeOrderResponse {
  id: string;
  paidWith: string;
  status: number;
  createdAt: string;
  updatedAt: string;
  platform: string;
  platformFee: number;
  paymentCurrency: string;
  paymentAmount: number;
  paymentAddress: string;
  paymentTxid: string;
  refundAddress: string;
  paidAt: string;
  acknowledgedAt: string;
  outgoingCurrency: string;
  outgoingAmount: number;
  outgoingAddress: string;
  outgoingTxid: string;
}

export interface CreateZammadTicketPayload {
  title: string;
  message: string;
}

export interface FetchPendingTranfersResponse extends ListResponse {
  results: PendingTransfer[];
}

export interface PendingTransferApprovalPayload {
  walletId: string;
  transactionId: string;
}
