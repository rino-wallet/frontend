import { NewWalletPDFData, PdfDocumentConfig } from "../../types";
import { createQRCodeImage, PdfDocument, getNetworkType } from "../../utils";

const networkType = getNetworkType();

class WalletPdf extends PdfDocument {}

export async function createPDF(config: PdfDocumentConfig, data: NewWalletPDFData): Promise<void> {
  const pdf = new WalletPdf(config);
  await pdf.addPage((self: PdfDocument) => {
    const layoutContext = self.doc.context2d;
    self.addBoldText("CONFIRMATION NUMBER", self.doc.internal.pageSize.getWidth() - 10, 8, { align: "right" }, "#797d80");
    self.addTitle1(data.checkString, self.doc.internal.pageSize.getWidth() - 10, 15, { align: "right" }, "#797d80");
    self.addTitle2("Introduction", self.leftOffset, 35);
    self.addText("Hello and welcome to your new wallet. Congratulations on choosing RINO, the fast and safe wallet!", self.leftOffset, 43);
    if (networkType === "stagenet") {
      self.addText("This account runs on the Monero stagenet.", self.leftOffset, 48);
    }
    layoutContext.fillStyle = "#fee9e9";
    layoutContext.fillRect(self.leftOffset, 53, 190, 12);
    layoutContext.fillStyle = "#000000";
    self.addTitle2("PRINT THIS DOCUMENT, OR KEEP IT SECURELY OFFLINE.", self.doc.internal.pageSize.getWidth() / 2, 61, { align: "center" }, "#EC0B0B");
    self.addText("This document is your tool to recover your funds if things go wrong.", self.leftOffset, 73);
    self.addText("We recommend removing it from the computer where you access your RINO account. Remember that with RINO, you are always in control of your money.", self.leftOffset, 78);

    self.doc.context2d.fillStyle = "#F3F3F3";
    self.doc.context2d.fillRect(self.leftOffset, 87, 3, 43);
    self.addText("YOUR SELECTED WALLET NAME", self.leftOffset + 10, 92);
    self.addBoldText(data.walletName, self.leftOffset + 10, 97);
    self.addText("USERNAME USED TO CREATE THIS WALLET", self.leftOffset + 10, 104);
    self.addBoldText(data.username, self.leftOffset + 10, 109);
    self.addText("WALLET PRIMARY ADDRESS", self.leftOffset + 10, 116);
    self.addBoldText(data.address, self.leftOffset + 10, 121, { maxWidth: 160 });

    self.addTitle2("What is this document?", self.leftOffset, 139);
    self.addText("This backup document contains important information which can be used to recover the Moneroj from your wallet in case of any reason you can't or don't want to access RINO service. Each RINO wallet has its own, unique backup document.", self.leftOffset, 146);
    self.addText("Each wallet has its own recovery document, so if you have created multiple wallets, you should retain the backup documents for each of them.", self.leftOffset, 155);
    self.addTitle2("What should I do with it?", self.leftOffset, 174);
    self.addText("You should print this document and/or save the PDF to an offline storage device like a USB stick. The print-out or USB stick should be kept in a safe place, such as a bank vault or home safe. It's a good idea to keep a second copy in a different location.", self.leftOffset, 181);
    self.addTitle2("What should I do if I lose it?", self.leftOffset, 200);
    self.addText("If you have lost or damaged all copies of your backup document, your Moneroj are still safe, but this Wallet should be considered at risk for loss. As soon as is convenient, you should use RINO Wallet Platform to empty the wallet into a new RINO wallet (and discontinue use of the old wallet).", self.leftOffset, 205);
    self.addTitle2("What if someone sees my backup document?", self.leftOffset, 229);
    self.addText("That's a problem! Owning this document is equivalent to owning the funds! It is essential to store it safely.", self.leftOffset, 236);
    self.addText("If your backup document does get exposed or copied in a way that makes you uncomfortable, the best course of action is to empty the compromised wallet as soon as possible into another RINO wallet and discontinue use of the old wallet.", self.leftOffset, 241);
    self.addTitle2("What if RINO becomes inaccessible for an extended period?", self.leftOffset, 261);
    self.addText("Of course we work very hard to make sure that doesn't happen. But if it does, that's precisely what this document is for. You can use the official Monero software to recover your wallet from this file. See below for instructions.", self.leftOffset, 268);
  });
  await pdf.addPage((self: PdfDocument) => {
    self.addTitle2("Recovering the wallet", self.leftOffset, 35);
    self.addText("There are two wallets in this document - both are parts of the multisignature wallet you have just created. In order to get to the Moneroj, you need to recover both parts one by one, and then use them together (described in the next chapter). You can see that this document has sections for “User Wallet” and “Backup Wallet”. These are the parts.", self.leftOffset, 43);
    self.addText("There are two ways to read the wallet seed: copy and paste the long piece of text, or scan the QR code. Both methods are equivalent and platform-agnostic", self.leftOffset, 60);

    self.addText("1. Copy the wallet seed from this PDF. By either copying the long piece of text, or scanning the QR code. Make sure it doesn't contain whitespaces or newlines.", self.leftOffset, 75);
    self.addText("2. Restore the multisig wallet from its seed. With command line wallet for example:", self.leftOffset, 85);
    self.addCommand(`./monero-wallet-cli ${networkType === "stagenet" ? "--stagenet" : ""} --restore-multisig-wallet`, self.leftOffset + 5, 90);
    self.addText("3. You will be prompted for a seed offset passphase. There isn't one", self.leftOffset, 95);
    self.addText(`4. When the wallet asks for a restoration date, provide a resonable date back. Example: ${data.date}`, self.leftOffset, 100);
    self.addTitle2("Sending Moneroj from the recovered wallet", self.leftOffset, 115);
    self.addText("The wallet you have just created is a multisignature wallet. To access the funds, it is necessary to use both parts from this document. So you start with recovering both wallets (see above). Once you have both ready, you can spend the funds with these steps in the command line wallet:", self.leftOffset, 123);
    self.addText("1. In the user wallet, run this command:", self.leftOffset, 140);
    self.addCommand("export_multisig_info multisig_info_user", self.leftOffset + 5, 145);
    self.addText("This command creates a new file in the current folder, called multisig_info_user.", self.leftOffset + 4, 150);
    self.addText("2. In the backup wallet, run this command:", self.leftOffset, 155);
    self.addCommand("export_multisig_info multisig_info_backup", self.leftOffset + 5, 160);
    self.addText("This command creates a new file in the current folder, called multisig_info_backup.", self.leftOffset + 4, 165);
    self.addText("3. In the user wallet, run this command:", self.leftOffset, 170);
    self.addCommand("import_multisig_info multisig_info_backup", self.leftOffset + 5, 175);
    self.addText("It needs the file multisig_info_backup in the current folder.", self.leftOffset + 4, 180);
    self.addText("4. In the backup wallet, run this command:", self.leftOffset, 185);
    self.addCommand("import_multisig_info multisig_info_user", self.leftOffset + 5, 190);
    self.addText("It needs the file multisig_info_user in the current folder.", self.leftOffset + 4, 195);
    self.addText("5. In one of the wallets (doesn't matter which), run this command to send funds to the given address.", self.leftOffset, 200);
    self.addCommand("transfer <address> <amount>", self.leftOffset + 5, 205);
    self.addText("It will not send the Moneroj, yet. Instead, it will create a file containing the partially signed transaction in the current folder. The file will be named multisig_monero_tx.", self.leftOffset + 4, 210);
    self.addText("6. In the other wallet, run this command:", self.leftOffset, 220);
    self.addCommand("sign_multisig multisig_monero_tx", self.leftOffset + 5, 225);
    self.addText("It needs the file multisig_monero_tx in the current folder.", self.leftOffset + 4, 230);
    self.addText("7. In the same wallet where you've run sign_multisig, run this command:", self.leftOffset, 235);
    self.addCommand("submit_multisig multisig_monero_tx", self.leftOffset + 5, 240);
    self.addText("This command will actually send the Moneroj.", self.leftOffset + 4, 245);
  });
  await pdf.addPage(async (self: PdfDocument) => {
    await createWalletSeedPage(self, data.userWalletSeed);
  });
  await pdf.addPage(async (self: PdfDocument) => {
    await createWalletSeedPage(self, data.backupWalletSeed, true);
  });
  if (config.downloadFile) {
    pdf.save();
  } else {
    const url = URL.createObjectURL(pdf.doc.output("blob"));
    window.open(url);
    URL.revokeObjectURL(url);
  }
}

/**
 * createWalletSeedPage creates the page of the Wallet Recovery Document that contains the
 * Wallet's Multisig Seed, both in hex and QR forms.
 */
async function createWalletSeedPage(pdf: PdfDocument, seed: string, isBackup?: boolean): Promise<void> {
  const title = `${isBackup ? "Backup " : "User "}Wallet Seed`;
  pdf.addTitle1(title, pdf.doc.internal.pageSize.getWidth() / 2, 35, { align: "center" });

  const description = isBackup
    ? "This is the third, backup wallet's seed. RINO Wallet Platform does not use it, but you need it in order to recover your funds."
    : "This is the seed of the wallet you use at RINO platform.";
  pdf.addText(description, pdf.doc.internal.pageSize.getWidth() / 2, 42, { align: "center" });

  pdf.addCommand(seed, pdf.leftOffset, 62);

  const qrCode = await createQRCodeImage(seed);
  const leftOffset = pdf.leftOffset + 20;
  const qrYOffset = 105;
  const qrCodeSize = 150;
  pdf.doc.addImage(
    qrCode,
    "png",
    leftOffset,
    qrYOffset,
    qrCodeSize,
    qrCodeSize,
  );
}
