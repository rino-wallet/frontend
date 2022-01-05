import { WalletRaw, LocalWalletData } from "../types";

export default async function parseWalletData(wallet: WalletRaw): Promise<LocalWalletData> {
  let isMultisig = false;
  try {
    const multiSigInfo = await wallet.getMultisigInfo();
    isMultisig = multiSigInfo.isMultisig();
  } catch (e) {
    console.error("Multisig call failed");
  }
  // TODO: optimise promises to work in parallel
  const daemonHeight = null;
  const syncHeight = await wallet.getHeight() || null;
  const address = await wallet.getAddress(0, 0);
  const balance = await wallet.getBalance(0, 0);
  const mnemonic = await wallet.getMnemonic();
  const viewKey = await wallet.getPrivateViewKey();
  const keys = await wallet.getData();
  return {
    offlineMode: true,
    daemonHeight,
    syncHeight,
    isMultisig,
    address,
    mnemonic,
    viewKey,
    balance: balance.toString(),
    keyHex: Buffer.from(keys[0]).toString("hex"),
    base64Key: Buffer.from(keys[0]).toString("base64"),
  };
}