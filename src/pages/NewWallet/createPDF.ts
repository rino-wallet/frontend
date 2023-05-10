import { NewWalletPDFData, PdfDocumentConfig } from "../../types";
import { createQRCodeImage, PdfDocument, getNetworkType } from "../../utils";

type T = (key: string) => string;

const networkType = getNetworkType();

class WalletPdf extends PdfDocument {}

export async function createPDF(
  config: PdfDocumentConfig,
  data: NewWalletPDFData,
  t: T,
): Promise<void> {
  const pdf = new WalletPdf(config);
  await pdf.addPage((self: PdfDocument) => {
    const layoutContext = self.doc.context2d;
    self.addBoldText(t("walletpdf.confirmation.number"), self.doc.internal.pageSize.getWidth() - 10, 8, { align: "right" }, "#797d80");
    self.addTitle1(data.checkString, self.doc.internal.pageSize.getWidth() - 10, 15, { align: "right" }, "#797d80");
    self.addTitle2(t("walletpdf.section1.title"), self.leftOffset, 35);
    self.addText(t("walletpdf.section1.row1"), self.leftOffset, 43);
    if (networkType === "stagenet") {
      self.addText(t("walletpdf.stagenet.message"), self.leftOffset, 48);
    }
    layoutContext.fillStyle = "#fee9e9";
    layoutContext.fillRect(self.leftOffset, 53, 190, 12);
    layoutContext.fillStyle = "#000000";
    // section 2
    self.addTitle2(t("walletpdf.section2.title"), self.doc.internal.pageSize.getWidth() / 2, 61, { align: "center" }, "#EC0B0B");
    self.addText(t("walletpdf.section2.row1"), self.leftOffset, 73);
    self.addText(t("walletpdf.section2.row2"), self.leftOffset, 78);

    self.doc.context2d.fillStyle = "#F3F3F3";
    self.doc.context2d.fillRect(self.leftOffset, 87, 3, 43);
    self.addText(t("walletpdf.section2.row3"), self.leftOffset + 10, 92);
    self.addBoldText(data.walletName, self.leftOffset + 10, 97);
    self.addText(t("walletpdf.section2.row4"), self.leftOffset + 10, 104);
    self.addBoldText(data.username, self.leftOffset + 10, 109);
    self.addText(t("walletpdf.section2.row5"), self.leftOffset + 10, 116);
    self.addBoldText(data.address, self.leftOffset + 10, 121, { maxWidth: 160 });
    // section 3
    self.addTitle2(t("walletpdf.section3.title"), self.leftOffset, 139);
    self.addText(t("walletpdf.section3.row1"), self.leftOffset, 146);
    self.addText(t("walletpdf.section3.row2"), self.leftOffset, 155);
    // section 4
    self.addTitle2(t("walletpdf.section4.title"), self.leftOffset, 172);
    self.addText(t("walletpdf.section4.row1"), self.leftOffset, 179);
    // section 5
    self.addTitle2(t("walletpdf.section5.title"), self.leftOffset, 198);
    self.addText(t("walletpdf.section5.row1"), self.leftOffset, 203);
    // section 6
    self.addTitle2(t("walletpdf.section6.title"), self.leftOffset, 229);
    self.addText(t("walletpdf.section6.row1"), self.leftOffset, 236);
    self.addText(t("walletpdf.section6.row2"), self.leftOffset, 241);
    // section 7
    self.addTitle2(t("walletpdf.section7.title"), self.leftOffset, 259);
    self.addText(t("walletpdf.section7.row1"), self.leftOffset, 266);
  });
  await pdf.addPage((self: PdfDocument) => {
    // section 8
    self.addTitle2(t("walletpdf.section8.title"), self.leftOffset, 35);
    self.addText(t("walletpdf.section8.row1"), self.leftOffset, 43);
    self.addText(t("walletpdf.section8.row2"), self.leftOffset, 60);

    self.addText(t("walletpdf.section8.row3"), self.leftOffset, 75);
    self.addText(t("walletpdf.section8.row4"), self.leftOffset, 85);
    self.addCommand(`./monero-wallet-cli ${networkType === "stagenet" ? "--stagenet" : ""} --restore-multisig-wallet`, self.leftOffset + 5, 90);
    self.addText(t("walletpdf.section8.row5"), self.leftOffset, 95);
    self.addText(`${t("walletpdf.section8.row6")} ${data.date}`, self.leftOffset, 100);
    // section 9
    self.addTitle2(t("walletpdf.section9.title"), self.leftOffset, 115);
    self.addText(t("walletpdf.section9.row1"), self.leftOffset, 123);
    self.addText(t("walletpdf.section9.row2"), self.leftOffset, 140);
    self.addCommand("export_multisig_info multisig_info_user", self.leftOffset + 5, 145);
    self.addText(t("walletpdf.section9.row3"), self.leftOffset + 4, 150);
    self.addText(t("walletpdf.section9.row4"), self.leftOffset, 155);
    self.addCommand("export_multisig_info multisig_info_backup", self.leftOffset + 5, 160);
    self.addText(t("walletpdf.section9.row5"), self.leftOffset + 4, 165);
    self.addText(t("walletpdf.section9.row6"), self.leftOffset, 170);
    self.addCommand("import_multisig_info multisig_info_backup", self.leftOffset + 5, 175);
    self.addText(t("walletpdf.section9.row7"), self.leftOffset + 4, 180);
    self.addText(t("walletpdf.section9.row8"), self.leftOffset, 185);
    self.addCommand("import_multisig_info multisig_info_user", self.leftOffset + 5, 190);
    self.addText(t("walletpdf.section9.row9"), self.leftOffset + 4, 195);
    self.addText(t("walletpdf.section9.row10"), self.leftOffset, 200);
    self.addCommand("transfer <address> <amount>", self.leftOffset + 5, 205);
    self.addText(t("walletpdf.section9.row11"), self.leftOffset + 4, 210);
    self.addText(t("walletpdf.section9.row12"), self.leftOffset, 220);
    self.addCommand("sign_multisig multisig_monero_tx", self.leftOffset + 5, 225);
    self.addText(t("walletpdf.section9.row13"), self.leftOffset + 4, 230);
    self.addText(t("walletpdf.section9.row14"), self.leftOffset, 235);
    self.addCommand("submit_multisig multisig_monero_tx", self.leftOffset + 5, 240);
    self.addText(t("walletpdf.section9.row15"), self.leftOffset + 4, 245);
  });
  await pdf.addPage(async (self: PdfDocument) => {
    await createWalletSeedPage(self, data.userWalletSeed, t);
  });
  await pdf.addPage(async (self: PdfDocument) => {
    await createWalletSeedPage(self, data.backupWalletSeed, t, true);
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
async function createWalletSeedPage(pdf: PdfDocument, seed: string, t: T, isBackup?: boolean): Promise<void> {
  const title = `${isBackup ? "Backup " : "User "}${t("walletpdf.section10.title")}`;
  // section 10
  pdf.addTitle1(title, pdf.doc.internal.pageSize.getWidth() / 2, 35, { align: "center" });

  const description = isBackup
    ? t("walletpdf.section10.row1.backup")
    : t("walletpdf.section10.row1.user");
  pdf.addText(description, pdf.doc.internal.pageSize.getWidth() / 2, 42, { align: "center" });
  pdf.addText(t("walletpdf.section10.row2"), pdf.leftOffset, 50);

  pdf.addCommand(seed, pdf.leftOffset, 70);

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
