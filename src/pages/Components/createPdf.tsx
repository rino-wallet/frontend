import { PdfDocument } from "../../utils";
import { PdfDocumentConfig } from "../../types";

class WalletPdf extends PdfDocument {}

export async function createPDF(config: PdfDocumentConfig): Promise<void> {
  const pdf = new WalletPdf(config);
  await pdf.addPage(function(self: PdfDocument) {
    self.addTitle1("Title 1", self.doc.internal.pageSize.getWidth()/2, 35);
    self.addTitle2("Title 2", self.leftOffset, 45);
    self.addTitle3("Title 3", self.leftOffset, 55);
    self.addText("Text", self.leftOffset, 65);
    self.addBoldText("Text bold", self.leftOffset, 75);
    self.addCommand("command", self.leftOffset, 85);
  });
  pdf.save();
}6