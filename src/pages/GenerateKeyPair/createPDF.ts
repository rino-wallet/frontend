import { createQRCodeImage, getNetworkType, PdfDocument } from "../../utils";
import { PdfDocumentConfig } from "../../types";

class AccountPdf extends PdfDocument {}

export async function createPDF(config: PdfDocumentConfig, data: { username: string, recoveryKey: string }): Promise<void> {
  const pdf = new AccountPdf(config);
  await pdf.addPage((self: PdfDocument) => {
    self.addText("Hello and welcome to your new account. Congratulations on choosing RINO, the fast and safe wallet!", self.leftOffset, 35);
    self.addText(`This account runs on the Monero ${getNetworkType()}.`, self.leftOffset, 40);
    const qrCodeSize = 40;
    createQRCodeImage(data.recoveryKey).then((qrCode) => {
      pdf.doc.addImage(
        qrCode,
        "png",
        self.leftOffset + 5,
        45,
        qrCodeSize,
        qrCodeSize,
      );
    });
    self.addText("YOUR ACCOUNT KEY:", self.leftOffset + 50, 55);
    self.addBoldText(data.recoveryKey, self.leftOffset + 50, 60);
    self.addText("USERNAME USED TO REGISTER THIS ACCOUNT:", self.leftOffset + 50, 70);
    self.addBoldText(data.username, self.leftOffset + 50, 75);
    self.addSmallText("YOUR ACCOUNT KEY", self.leftOffset + 12, 87);

    self.addTitle2("What is Your Account Key?", self.leftOffset, 100);
    self.addText("If you forget your account password, RINO cannot reset it for you! It's a security feature - only you are in control of your funds at RINO. RINO Account Recovery Document provides a way to recover your account in case you forget your password.", self.leftOffset, 107);
    self.addTitle2("What should I do with this document?", self.leftOffset, 125);
    self.addText("You should print this document and/or save the PDF to an offline storage device like a USB stick. The print-out or USB stick should be kept in a safe place, such as a bank vault or home safe. It's a good idea to keep a second copy in a different location.", self.leftOffset, 133);
    self.addTitle2("What should I do if I lose this document?", self.leftOffset, 150);
    self.addText("If you have lost or damaged all copies of your Account Recovery Document, you can still access your RINO account as long as you remember your account password. Even if you lose both your password and your Account Recovery Document, your funds are still safe - you can use your Wallet Recovery Document to recover your Moneroj directly from your wallet without accessing RINO service.", self.leftOffset, 157);
    self.addTitle2("What if someone sees this document?", self.leftOffset, 180);
    self.addText("Account Recovery Document is required to change your password. Fortunately, the account key alone is not sufficient; the attacker would need to get access to your email, too (to click the password reset link). And, if you have 2FA enabled, the attacker would need that, too.", self.leftOffset, 187);
    self.addText("However, if someone has seen this document, you should still consider that your account security has been compromised. The best course of action is to empty the corresponding wallets into a new RINO account and discontinue use of the old account.", self.leftOffset, 202);
  });
  pdf.save();
}
