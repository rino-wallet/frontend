import monerojs from "@rino-wallet/monero-javascript";
import _sodium from "libsodium-wrappers";
import { LocalWalletData, ExchangeMultisigKeysResult } from "../types";
import Wallet from "./Wallet";

export type Multisig = string;

const networkType = process.env.REACT_APP_ENV === "production" ? monerojs.MoneroNetworkType.MAINNET : monerojs.MoneroNetworkType.STAGENET;

export async function generateWalletPassword(): Promise<Uint8Array> {
  await _sodium.ready;
  const sodium = _sodium;
  return sodium.randombytes_buf(16);
}

/** Class that handle all multisig wallets creation steps */
export default class WalletService {
  /**
   * Encrypt wallet keys with the public key
   */
  encryptWalletKeys = async (
    publicKey: Uint8Array,
    walletKeys: Uint8Array,
    walletPassword: Uint8Array,
  ): Promise<Uint8Array> => {
    await _sodium.ready;
    const sodium = _sodium;
    const message = new Uint8Array(walletPassword.length + walletKeys.length);
    message.set(walletPassword);
    message.set(walletKeys, walletPassword.length);
    return sodium.crypto_box_seal(message, publicKey);
  };

  /**
   * Decrypt wallet keys with user's encryption keys
   */
  decryptWalletKeys = async (
    encryptedWalletKeys: Uint8Array,
    publicKey: Uint8Array,
    privateKey: Uint8Array,
  ): Promise<{ walletKeys: Uint8Array; walletPassword: Uint8Array }> => {
    try {
      await _sodium.ready;
      const sodium = _sodium;
      const decryptedMessage = sodium
        .crypto_box_seal_open(encryptedWalletKeys, publicKey, privateKey);
      return {
        walletKeys: decryptedMessage.slice(16),
        walletPassword: decryptedMessage.slice(0, 16),
      };
    } catch (error) {
      throw ({ password: "Wallet keys decryption failed." });
    }
  };

  userWallet: InstanceType<typeof Wallet> | null;

  backupWallet: InstanceType<typeof Wallet> | null;

  walletPassword: Uint8Array;

  constructor() {
    this.userWallet = null;
    this.backupWallet = null;
    this.walletPassword = new Uint8Array();
  }

  /**
  * Create user and backup wallets
  */
  createWallets = async (): Promise<{
    userWallet: LocalWalletData,
    backupWallet: LocalWalletData
  }> => {
    const walletPassword = await generateWalletPassword();
    this.walletPassword = walletPassword;
    this.userWallet = await Wallet.init({ password: Buffer.from(walletPassword).toString("hex"), networkType });
    this.backupWallet = await Wallet.init({ password: Buffer.from(walletPassword).toString("hex"), networkType });
    const userWallet = await this.userWallet.getWalletJSON();
    const backupWallet = await this.backupWallet.getWalletJSON();
    return {
      userWallet,
      backupWallet,
    };
  };

  /**
   * prepare and collect multisig hex for user and backup wallets
   */
  prepareMultisigs = async (): Promise<Multisig[]> => {
    const preparedUserMultisig = await this.userWallet?.prepareMultisig();
    const preparedBackupMultisig = await this.backupWallet?.prepareMultisig();
    return [preparedUserMultisig || "", preparedBackupMultisig || ""];
  };

  /**
   * make wallet multisig and collect result hex for user and backup wallets
   * @param  {Multisig[]} preparedMultisigs - [preparedUserMultisig, preparedBackupMultisig, preparedServerMultisig]
   */
  makeMultisigs = async (preparedMultisigs: Multisig[]): Promise<Multisig[]> => {
    const madeUserMultisig = await this.userWallet?.makeMultisig([preparedMultisigs[1], preparedMultisigs[2]], 2, " ");
    const madeBackupMultisig = await this.backupWallet?.makeMultisig([preparedMultisigs[0], preparedMultisigs[2]], 2, " ");
    return [
      madeUserMultisig || "",
      madeBackupMultisig || "",
    ];
  };

  /**
   * exchange multisig keys among participants and collect results
   * @param  {Multisig[]} madeMultisigs - [madeUserMultisig, madeBackupMultisig, madeServerMultisig]
   */
  exchangeMultisigKeys = async (madeMultisigs: Multisig[]): Promise<{
    userResult: ExchangeMultisigKeysResult;
    backupResult: ExchangeMultisigKeysResult;
  }> => {
    const userResult = await this.userWallet?.exchangeMultisigKeys([madeMultisigs[1], madeMultisigs[2]], " ") as ExchangeMultisigKeysResult;
    const backupResult = await this.backupWallet?.exchangeMultisigKeys([madeMultisigs[0], madeMultisigs[2]], " ") as ExchangeMultisigKeysResult;
    return {
      userResult,
      backupResult,
    };
  };

  /**
   * Get JSON with wallets info
   */
  getWalletsData = async (): Promise<{ userWallet: LocalWalletData, backupWallet: LocalWalletData }> => {
    const userWallet = await this.userWallet?.getWalletJSON() as LocalWalletData;
    const backupWallet = await this.backupWallet?.getWalletJSON() as LocalWalletData;
    return {
      userWallet,
      backupWallet,
    };
  };

  /**
   * Encrypt wallet keys and wallet password with the public key
   */
  encryptUserWalletKeys = async (publicKey: Uint8Array): Promise<Uint8Array> => {
    const walletData = await this.userWallet?.getData();
    if (!walletData) {
      return new Uint8Array();
    }
    const keys = walletData[0];
    return this.encryptWalletKeys(publicKey, keys, this.walletPassword);
  };

  /**
   * Open walllet in browser using wallet keys
   */
  openWallet = async (decryptedKeys: Uint8Array, walletPassword: Uint8Array): Promise<LocalWalletData> => {
    this.userWallet = await Wallet.init({
      password: Buffer.from(walletPassword).toString("hex"),
      networkType,
      keysData: decryptedKeys,
      cacheData: new Uint8Array(),
      path: "",
    }, true);
    this.walletPassword = walletPassword;
    const userWallet = await this.userWallet.getWalletJSON();
    return userWallet;
  };

  /**
   * Close wallet
   */
  closeWallet = (): void => {
    this.userWallet?.close();
    this.backupWallet?.close();
    this.userWallet = null;
    this.backupWallet = null;
    this.walletPassword = new Uint8Array();
  };
}
