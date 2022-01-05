import { jsPDF } from "jspdf";
import { createQRCodeImage } from "../../utils";
import { NewWalletPDFData } from "../../types";


const leftOffset = 30;
const topOffset = 20;
const textWidth = 150;

async function createPage1(doc: any, walletName: string, walletKeyHex: string, address: string): Promise<void> {
  // Wallet address
  doc.setFontSize(14);
  doc.text(`${walletName} wallet address: `, leftOffset, topOffset);
  doc.setFontSize(8);
  doc.text(address, leftOffset, topOffset + 10);
  doc.addImage(await createQRCodeImage(address), "png", leftOffset, topOffset + 15, 40, 40);
  // Wallet key
  doc.setFontSize(14);
  doc.text(`${walletName} wallet key: `, leftOffset, topOffset + 70);
  doc.setFontSize(8);
  doc.text(walletKeyHex, leftOffset, topOffset + 80, { maxWidth: textWidth });
}

async function createPage2(doc: any, walletName: string, walletKeyB64: string, password: string): Promise<void> {
  // QR code
  doc.setFontSize(14);
  doc.text(`${walletName} wallet key encoded to base64: `, leftOffset, topOffset);
  doc.addImage(await createQRCodeImage(walletKeyB64), "png", leftOffset, topOffset + 10, 150, 150);
  // Instructions
  doc.text("To restore your wallet from the wallet key, please follow the steps below:", leftOffset, topOffset + 170);
  doc.setFontSize(10);
  doc.text("1a. Copy and paste the wallet key from this PDF to a new file: backup-hex.txt", leftOffset, topOffset + 180);
  doc.text("2a. Run this command: $ xxd -r -p backup-hex.txt > backup-wallet.keys", leftOffset, topOffset + 190);
  doc.text("1b. Alternatively, scan the QR code, and paste the content to a new file: backup-base64.txt", leftOffset, topOffset + 200);
  doc.text("2b. Run this command: $ base64 -D -i backup-base64.txt -o backup-wallet.keys", leftOffset, topOffset + 210);
  doc.text("3. Open the backup-wallet.keys file/wallet using Monero (just like any other wallet).", leftOffset, topOffset + 220);
  doc.text(`Wallet password: ${password}`, leftOffset, topOffset + 230);
}

export default async function createPdf({
  walletName,
  userWalletKeyHex,
  userWalletKeyB64,
  userWalletAddress,
  backupWalletKeyHex,
  backupWalletKeyB64,
  backupWalletAddress,
  password,
}: NewWalletPDFData): Promise<void> {
  const doc = new jsPDF();
  // userWallet page 1
  await createPage1(doc, "User", userWalletKeyHex, userWalletAddress);
  // userWallet page 2
  doc.addPage();
  await createPage2(doc, "User", userWalletKeyB64, password);
  // backupWallet page 1
  doc.addPage();
  await createPage1(doc, "Backup", backupWalletKeyHex, backupWalletAddress);
  // backupWallet page 2
  doc.addPage();
  await createPage2(doc, "Backup", backupWalletKeyB64, password);
  doc.save(`${walletName}.pdf`);
}
