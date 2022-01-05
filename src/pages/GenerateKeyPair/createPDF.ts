import { PdfDocument } from "../../utils";
import { PdfDocumentConfig } from "../../types";

class AccountPdf extends PdfDocument {}

export async function createPDF(config: PdfDocumentConfig, data: { username: string, recoveryKey: string }): Promise<void> {
  const pdf = new AccountPdf(config);
  await pdf.addPage(function(self: PdfDocument) {
    self.doc.context2d.fillStyle = "#F3F3F3"
    self.doc.context2d.fillRect(self.leftOffset, 45, 3, 38);

    self.addText("Hello and welcome to your new account. Congratulations on choosing RINO, the fast and safe wallet!", self.leftOffset, 35);
    self.addText("This account runs on the Monero stagenet.", self.leftOffset, 40);
    self.addText("YOUR ACCOUNT KEY:", self.leftOffset + 10, 55);
    self.addBoldText(data.recoveryKey, self.leftOffset + 10, 60);
    self.addText("USERNAME USED TO REGISTER THIS ACCOUNT:", self.leftOffset + 10, 70);
    self.addBoldText(data.username, self.leftOffset + 10, 75);
    self.addTitle2("What is Your Account Key?", self.leftOffset, 98);
    self.addText("If you forget your account password, RINO cannot reset it for you! It's a security feature - only you are in control of your funds at RINO. RINO Account Recovery Document provides a way to recover your account in case you forget your password.", self.leftOffset, 105);
    self.addTitle2("What should I do with this document?", self.leftOffset, 123);
    self.addText("You should print this document and/or save the PDF to an offline storage device like a USB stick. The print-out or USB stick should be kept in a safe place, such as a bank vault or home safe. It's a good idea to keep a second copy in a different location.", self.leftOffset, 130);
    self.addTitle2("What should I do if I lose this document?", self.leftOffset, 148);
    self.addText("If you have lost or damaged all copies of your Account Recovery Document, you can still access your RINO account as long as you remember your account password. Even if you lose both your password and your Account Recovery Document, your funds are still safe - you can use your Wallet Recovery Document to recover your Moneroj directly from your wallet without accessing RINO service.", self.leftOffset, 155);
    self.addTitle2("What if someone sees this document?", self.leftOffset, 178);
    self.addText("Account Recovery Document is required to change your password. Fortunately, the account key alone is not sufficient; the attacker would need to get access to your email, too (to click the password reset link). And, if you have 2FA enabled, the attacker would need that, too.", self.leftOffset, 185);
    self.addText("However, if someone has seen this document, you should still consider that your account security has been compromised. The best course of action is to empty the corresponding wallets into a new RINO account and discontinue use of the old account.", self.leftOffset, 200);
  });
  pdf.save();
}
