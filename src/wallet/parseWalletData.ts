import { WalletRaw, LocalWalletData } from "../types";

export default async function parseWalletData(wallet: WalletRaw): Promise<LocalWalletData> {
  let isMultisig = false;
  try {
    const multiSigInfo = await wallet.getMultisigInfo();
    isMultisig = multiSigInfo.isMultisig();
  } catch (e) {
    // eslint-disable-next-line
    console.error("Multisig call failed");
  }

  const daemonHeight = null;

  const [syncHeight, address, balance, keys, multisigSeed] = await Promise.all([
    wallet.getHeight(),
    wallet.getAddress(0, 0),
    wallet.getBalance(0, 0),
    wallet.getData(),
    isMultisig ? wallet.getMultisigSeed("") : Promise.resolve(""),
  ]);

  return {
    offlineMode: true,
    daemonHeight,
    syncHeight,
    isMultisig,
    address,
    balance: balance.toString(),
    keyHex: Buffer.from(keys[0]).toString("hex"),
    base64Key: Buffer.from(keys[0]).toString("base64"),
    multisigSeed,
  };
}
