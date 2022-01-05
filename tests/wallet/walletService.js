import monerojs from "@rino-wallet/monero-javascript";
import { expect } from "chai";
import WalletService, { decryptWalletKeys, encryptWalletKeys, generateWalletPassword } from "../../src/wallet";
import { generateUserKeyPair } from "../../src/utils/keypairs";
import Wallet from "../../src/wallet/Wallet";

const walletService = new WalletService();

let localWalletsMultisigs;
let localWalletsXMultisig;
let serverWalletMultisig;
let serverWalletXMultisig;

describe("WalletService", function() {
  it("All wallets are equal to null by default", async function() {
    expect(walletService.userWallet).to.equal(null);
    expect(walletService.backupWallet).to.equal(null);
  });
  it("createWallet should return two new wallets", async () => {
    const wallets = await walletService.createWallets()
    expect(wallets.backupWallet).not.to.equal(null);
    expect(wallets.userWallet).not.to.equal(null);
  });
  it("prepareMultisigs should return array of multisigs", async () => {
    localWalletsMultisigs = await walletService.prepareMultisigs();
    expect(localWalletsMultisigs.length).to.equal(2);
    expect(localWalletsMultisigs[0].includes("Multisig")).to.equal(true);
    expect(localWalletsMultisigs[1].includes("Multisig")).to.equal(true);
  });
  it("makeMultisigs should return array of x multisigs", async () => {
    const serverWallet = await Wallet.init({ password: " ", networkType: monerojs.MoneroNetworkType.STAGENET });
    serverWalletMultisig = await serverWallet.prepareMultisig();
    localWalletsXMultisig = await walletService.makeMultisigs([...localWalletsMultisigs, serverWalletMultisig]);
    serverWalletXMultisig = await serverWallet.makeMultisig(localWalletsMultisigs, 2, " ");
    expect(localWalletsXMultisig.length).to.equal(2);
    expect(localWalletsXMultisig[0].includes("Multisigx")).to.equal(true);
    expect(localWalletsXMultisig[1].includes("Multisigx")).to.equal(true);
    expect(serverWalletXMultisig.includes("Multisigx")).to.equal(true);
  });
  it("exchangeMultisigKeys. userWallet and backupWallet must have the same address after exchanging keys", async () => {
    const result = await walletService.exchangeMultisigKeys([...localWalletsXMultisig, serverWalletXMultisig]);
    expect(result.userResult.state.address).to.equal(result.backupResult.state.address);
  });
  it("encrypt wallet keys and decrypt them", async () => {
    const walletData = await walletService.userWallet.getData();
    const walletKeys = walletData[0]; 
    const { encryption } = await generateUserKeyPair();
    const password = await generateWalletPassword();
    const encryptedWalletData = await encryptWalletKeys(encryption.publicKey, walletKeys, password);
    const decryptedWalletData = await decryptWalletKeys(
      encryptedWalletData,
      encryption.publicKey,
      encryption.privateKey,
    );
    expect(Buffer.from(decryptedWalletData.walletKeys).toString("hex"))
    .to.equal(Buffer.from(walletKeys).toString("hex"));
  });
});
