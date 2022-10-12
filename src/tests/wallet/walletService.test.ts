import monerojs from "@rino-wallet/monero-javascript";
import WalletService, { generateWalletPassword } from "../../wallet/WalletService";
import { generateUserKeyPair } from "../../utils/keypairs";
import Wallet from "../../wallet/Wallet";

const walletService = new WalletService();

let localWalletsMultisigs: any;
let localWalletsXMultisig: any;
let serverWalletMultisig: any;
let serverWalletXMultisig: any;

jest.setTimeout(60 * 1000);


describe("WalletService", function() {
  it("All wallets are equal to null by default", async function() {
    expect(walletService.userWallet).toEqual(null);
    expect(walletService.backupWallet).toEqual(null);
  });
  it("createWallet should return two new wallets", async () => {
    const wallets = await walletService.createWallets()
    expect(wallets.backupWallet).not.toEqual(null);
    expect(wallets.userWallet).not.toEqual(null);
  });
  it("prepareMultisigs should return array of multisigs", async () => {
    localWalletsMultisigs = await walletService.prepareMultisigs();
    expect(localWalletsMultisigs.length).toEqual(2);
    expect(localWalletsMultisigs[0].includes("Multisig")).toEqual(true);
    expect(localWalletsMultisigs[1].includes("Multisig")).toEqual(true);
  });
  it("makeMultisigs should return array of x multisigs", async () => {
    const serverWallet = await Wallet.init({ password: " ", networkType: monerojs.MoneroNetworkType.STAGENET });
    serverWalletMultisig = await serverWallet.prepareMultisig();
    localWalletsXMultisig = await walletService.makeMultisigs([...localWalletsMultisigs, serverWalletMultisig]);
    serverWalletXMultisig = await serverWallet.makeMultisig(localWalletsMultisigs, 2, " ");
    expect(localWalletsXMultisig.length).toEqual(2);
    expect(localWalletsXMultisig[0].includes("Multisigx")).toEqual(true);
    expect(localWalletsXMultisig[1].includes("Multisigx")).toEqual(true);
    expect(serverWalletXMultisig.includes("Multisigx")).toEqual(true);
  });
  it("exchangeMultisigKeys. userWallet and backupWallet must have the same address after exchanging keys", async () => {
    const result = await walletService.exchangeMultisigKeys([...localWalletsXMultisig, serverWalletXMultisig]);
    expect(result.userResult.state.address).toEqual(result.backupResult.state.address);
  });
  it("encrypt wallet keys and decrypt them", async () => {
    const walletData = await (walletService.userWallet as any).getData();
    const walletKeys = walletData[0]; 
    const { encryption } = await generateUserKeyPair();
    const password = await generateWalletPassword();
    const encryptedWalletData = await walletService.encryptWalletKeys(encryption.publicKey, walletKeys, password);
    const decryptedWalletData = await walletService.decryptWalletKeys(
      encryptedWalletData,
      encryption.publicKey,
      encryption.privateKey,
    );
    expect(Buffer.from(decryptedWalletData.walletKeys).toString("hex"))
    .toEqual(Buffer.from(walletKeys).toString("hex"));
  });
});
