import { createQRCodeImage, getNetworkType, PdfDocument } from "../../utils";
import { PdfDocumentConfig } from "../../types";

class AccountPdf extends PdfDocument {}

export async function createPDF(config: PdfDocumentConfig, data: { username: string, recoveryKey: string }, t: (key: string) => string): Promise<void> {
  const pdf = new AccountPdf(config);
  await pdf.addPage((self: PdfDocument) => {
    // section 1
    self.addText(t("account.pdf.section1.row1"), self.leftOffset, 35);
    self.addText(`${t("account.pdf.section1.row2")} ${getNetworkType()}.`, self.leftOffset, 40);
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
    self.addText(t("account.pdf.your.key"), self.leftOffset + 50, 55);
    self.addBoldText(data.recoveryKey, self.leftOffset + 50, 60);
    self.addText(t("account.pdf.used.username"), self.leftOffset + 50, 70);
    self.addBoldText(data.username, self.leftOffset + 50, 75);
    self.addSmallText(t("account.pdf.your.key"), self.leftOffset + 12, 87);
    // section 2
    self.addTitle2(t("account.pdf.section2.title"), self.leftOffset, 100);
    self.addText(t("account.pdf.section2.row1"), self.leftOffset, 107);
    // section 3
    self.addTitle2(t("account.pdf.section3.title"), self.leftOffset, 125);
    self.addText(t("account.pdf.section3.row1"), self.leftOffset, 133);
    // section 4
    self.addTitle2(t("account.pdf.section4.title"), self.leftOffset, 150);
    self.addText(t("account.pdf.section4.row1"), self.leftOffset, 157);
    // section 5
    self.addTitle2(t("account.pdf.section5.title"), self.leftOffset, 180);
    self.addText(t("account.pdf.section5.row1"), self.leftOffset, 187);
    self.addText(t("account.pdf.section5.row2"), self.leftOffset, 202);
  });
  pdf.save();
}
