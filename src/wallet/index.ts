import monerojs from "@enterprisewallet/monero-javascript";
import * as openpgp from "openpgp";
import { LocalWalletData, ExchangeMultisigKeysResult } from "../types";
import Wallet from "./Wallet";
import { defaultWalletPassword } from "../constants";
import { deriveUserKeys, decryptKey } from "../utils/keypairs";

export type Multisig = string;

/**
 * Decrypt message with private pgp key
 */
export async function decryptMessageWithPrivateKey(armoredMessage: string, privateKey: string): Promise<Uint8Array> {
  const encryptedMessage = await openpgp.readMessage({
    armoredMessage,
  });
  const { data: decrypted } = await openpgp.decrypt({
    message: encryptedMessage,
    privateKeys: await openpgp.readKey({ armoredKey: privateKey }),
    format: "binary",
  });
  return decrypted;
}

/**
 * Encrypt wallet keys with the public pgp key
 */
export async function encryptWalletKeys(publicKey: string, walletKeys: Uint8Array): Promise<string> {
  const message = await openpgp.createMessage({ binary: walletKeys  });
  const _publicKey = await openpgp.readKey({ armoredKey: publicKey });
  const encrypted = await openpgp.encrypt({
      message: message,
      publicKeys: [_publicKey], 
  });
  return encrypted;
}

/**
 * Decrypt wallet keys with user password
 */
export async function decryptWalletKeys(
  encryptedWalletKeys: string,
  encPrivateKey: string,
  password: string,
): Promise<Uint8Array> {
  try {
    const { encryptionKey } = await deriveUserKeys(password);
    const privateKey = await decryptKey(encPrivateKey, encryptionKey);
    return await decryptMessageWithPrivateKey(encryptedWalletKeys, privateKey);
  } catch(error) {
    throw({ password: "Incorrect password" })
  }
}

/** Class that handle all multisig wallets creation steps */
export default class WalletService {
  userWallet: InstanceType<typeof Wallet> | null;
  backupWallet: InstanceType<typeof Wallet> | null;
  constructor() {
    this.userWallet = null;
    this.backupWallet = null;
  }
  /**
  * Create user and backup wallets
  */
  createWallets = async (): Promise<{ userWallet: LocalWalletData, backupWallet: LocalWalletData }> => {
    this.userWallet = await Wallet.init({ password: defaultWalletPassword, networkType: monerojs.MoneroNetworkType.STAGENET });
    this.backupWallet = await Wallet.init({ password: defaultWalletPassword, networkType: monerojs.MoneroNetworkType.STAGENET });
    const userWallet = await this.userWallet.getWalletJSON();
    const backupWallet = await this.backupWallet.getWalletJSON();
    return {
      userWallet,
      backupWallet,
    };
  }
  /**
   * prepare and collect multisig hex for user and backup wallets
   */
  prepareMultisigs = async (): Promise<Multisig[]> => {
    const preparedUserMultisig = await this.userWallet?.prepareMultisig();
    const preparedBackupMultisig = await this.backupWallet?.prepareMultisig();
    return [ preparedUserMultisig || "", preparedBackupMultisig || "" ];
  }
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
  }
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
      backupResult
    }
  }
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
  }
  /**
   * Encrypt wallet keys with the public pgp key
   */
  encryptWalletKeys = async (publicKey: string): Promise<string> => {
    const walletData = await this.userWallet?.getData();
    if (!walletData) {
      return "";
    }
    const keys = walletData[0];
    return encryptWalletKeys(publicKey, keys);
  }
  /**
   * Open walllet in browser using wallet keys
   */
  openWallet = async (decryptedKeys: Uint8Array): Promise<LocalWalletData> => {
    this.userWallet = await Wallet.init({
      password: defaultWalletPassword,
      networkType: monerojs.MoneroNetworkType.STAGENET,
      keysData: decryptedKeys,
      cacheData: new Uint8Array(),
      path: "",
    }, true);
    const userWallet = await this.userWallet.getWalletJSON();
    return userWallet;
  }
}
