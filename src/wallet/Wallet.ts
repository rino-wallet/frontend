import monerojs from "@enterprisewallet/monero-javascript";
import { WalletConfig, WalletRaw, LocalWalletData, ExchangeMultisigKeysResult } from "../types";
import parseWalletData from "./parseWalletData";

type Multisig = string;

/** Wrapper for the monero-javascript to create multisig wallets */
class Wallet {
  wallet: WalletRaw;
  constructor(wallet: WalletRaw) {
    this.wallet = wallet;
  }
  /**
   * @param  {WalletConfig} config
   * @returns Promise object represents the instance of the Wallet class,
   * We use this method instead of "new Wallet(config)" construction to create the instance of the Wallet class
   * It's implemented this way because "createWalletFull" is async method
   */
  public static init = async (config: WalletConfig, open?: boolean): Promise<Wallet> => {
    const wallet = open ? await monerojs.openWalletFull(config) : await monerojs.createWalletFull(config);
    return new Wallet(wallet);
  }
  /**
   * Get wallet data in JSON format
   * @returns Promise object represents the wallet data in JSON format
   */
  public getWalletJSON = async (): Promise<LocalWalletData> => {
    return await parseWalletData(this.wallet);
  }
  /**
   * prepare multisig hex for the wallet
   * @returns Promise represents the multisig string
   */
  public prepareMultisig = async (): Promise<Multisig> => {
    const multisig = await this.wallet.prepareMultisig();
    return multisig;
  }
  /**
   * made multisig hex for the wallet
   * @returns Promise represents the multisig string
   */
  public makeMultisig = async (peerMultisigHexes: string[], numberOfParticipants: number,  walletPassword: string): Promise<Multisig> => {
    const baseXinfo = await this.wallet.makeMultisig(peerMultisigHexes, numberOfParticipants, walletPassword);
    return baseXinfo.getMultisigHex();
  };
  
  /**
   * exchange multisig keys among participants
   * @param  {string[]} multisigHexes multisig hex of all participants
   * @param  {string} walletPassword wallet password
   * @returns Promise
   */
  public exchangeMultisigKeys = async (multisigHexes: string[], walletPassword: string): Promise<ExchangeMultisigKeysResult> => {
    const result = await this.wallet.exchangeMultisigKeys(multisigHexes, walletPassword);
    return result;
  };
  /**
   * save then close the wallet.
   */
  public close = async (): Promise<string> => {
    return await this.wallet.close();
  };
  /**
   * Returns the wallet information [wallet keys + walllet cache].
   */
  public getData = async (): Promise<Uint8Array[]> => {
    return await this.wallet.getData();
  };
  /**
   * Get outputs created from previous transactions that belong to the wallet (i.e. that the wallet can spend one time).
   */
  public getOutputs = async (): Promise<number[]> => {
    const outputs = await this.wallet.getOutputs({});
    return outputs;
  };
  /**
   * Import outputs in hex format.
   */
  public importOutputs = async (outputsHex: string): Promise<number> => {
    return await this.wallet.importOutputs(outputsHex);
  };
  /**
   * Export this wallet's multisig info as hex for other participants.
   */
  public getMultisigHex = async (): Promise<string> => {
    return await this.wallet.getMultisigHex();
  };
  /**
   * Import multisig info as hex from other participants 
   */
  public importMultisigHex = async (multisigHexes: string[]): Promise<number> => {
    return await this.wallet.importMultisigHex(multisigHexes);
  };
  /**
   * Reconstruct the transaction
   */
  public reconstructTransaction = async (txHex: string): Promise<string> => {
    const txs = await this.wallet.reconstructTx(txHex);
    const txsHex = txs[0].getTxSet().getMultisigTxHex();
    return txsHex;
  };
}

export default Wallet;
