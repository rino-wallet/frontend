import { jsPDF } from "jspdf";
import logo from "./logo.png";
import { PdfDocumentConfig } from "../../types";

const pageWidth = 190;

interface Options {
  align?: string;
  maxWidth?: number;
}

export class PdfDocument {
  page = 1;

  headerHeight = 22;

  footerHeight = 15;

  pageWidth = 210;

  leftOffset = 10;

  lineSpace = 5;

  config: PdfDocumentConfig;

  doc: any;

  constructor(config: PdfDocumentConfig) {
    // eslint-disable-next-line
    this.doc = new jsPDF();
    this.config = config;
  }

  renderLayout(page: number): void {
    const layoutContext = this.doc.context2d;
    layoutContext.fillStyle = "#F3F3F3";
    layoutContext.fillRect(0, 0, this.pageWidth, this.headerHeight);
    layoutContext.fillRect(0, 282, this.pageWidth, this.footerHeight);
    this.doc.addImage(logo, "png", this.leftOffset, 6, 27, 10);
    this.doc.addImage(logo, "png", this.leftOffset, 286, 16, 6);
    layoutContext.fillStyle = "#000000";
    this.doc.setFont("helvetica", "bold");
    this.doc.setTextColor("#000000");
    this.doc.setFontSize(14);
    const textArray = this.config.title.split(" ");
    this.doc.text(textArray[0], this.doc.internal.pageSize.getWidth() / 2 - 25, 14, { align: "center" });
    this.doc.setTextColor("#797d80");
    this.doc.text(textArray.slice(1).join(" "), this.doc.internal.pageSize.getWidth() / 2 + 10, 14, { align: "center" });
    this.doc.setFontSize(13);
    this.doc.setTextColor("#000000");
    this.doc.text(textArray[0], this.doc.internal.pageSize.getWidth() / 2 - 23, 291, { align: "center" });
    this.doc.setTextColor("#797d80");
    this.doc.text(textArray.slice(1).join(" "), this.doc.internal.pageSize.getWidth() / 2 + 9, 291, { align: "center" });
    this.doc.setFontSize(9);
    this.doc.setTextColor(0, 0, 0);
    this.doc.setFont("helvetica", "normal");
    if (this.config.totalPages && this.config.totalPages > 1) {
      this.doc.text(`PAGE ${page} / ${this.config.totalPages}`, this.doc.internal.pageSize.getWidth() - 10, 291, { align: "right" });
    }
  }

  addTitle1(text: string, x: number, y: number, options?: Options, color?: string): void {
    const colorArg = color || "#000000";
    this.doc.setTextColor(colorArg);
    this.doc.setFontSize(16);
    this.doc.setFont("helvetica", "bold");
    this.doc.text(text, x, y, { maxWidth: pageWidth, lineHeightFactor: 1.5, ...(options || {}) });
  }

  addTitle2(text: string, x: number, y: number, options?: Options, color?: string): void {
    const colorArg = color || "#000000";
    this.doc.setTextColor(colorArg);
    this.doc.setFontSize(14);
    this.doc.setFont("helvetica", "bold");
    this.doc.text(text, x, y, { maxWidth: pageWidth, lineHeightFactor: 1.5, ...(options || {}) });
  }

  addTitle3(text: string, x: number, y: number, options?: Options, color?: string): void {
    const colorArg = color || "#000000";
    this.doc.setTextColor(colorArg);
    this.doc.setFontSize(12);
    this.doc.setFont("helvetica", "bold");
    this.doc.text(text, x, y, { maxWidth: pageWidth, lineHeightFactor: 1.5, ...(options || {}) });
  }

  addSmallText(text: string, x: number, y: number, options?: Options, color?: string): void {
    const colorArg = color || "#000000";
    this.doc.setTextColor(colorArg);
    this.doc.setFontSize(7);
    this.doc.setFont("helvetica", "normal");
    this.doc.text(text, x, y, { maxWidth: pageWidth, lineHeightFactor: 1.5, ...(options || {}) });
  }

  addText(text: string, x: number, y: number, options?: Options, color?: string): void {
    const colorArg = color || "#000000";
    this.doc.setTextColor(colorArg);
    this.doc.setFontSize(9);
    this.doc.setFont("helvetica", "normal");
    this.doc.text(text, x, y, { maxWidth: pageWidth, lineHeightFactor: 1.5, ...(options || {}) });
  }

  addCommand(text: string, x: number, y: number, options?: Options, color?: string): void {
    const colorArg = color || "#1D70CA";
    this.doc.setTextColor(colorArg);
    this.doc.setFontSize(9);
    this.doc.setFont("courier", "bold");
    this.doc.text(text, x, y, { maxWidth: pageWidth, lineHeightFactor: 1.5, ...(options || {}) });
  }

  addBoldText(text: string, x: number, y: number, options?: Options, color?: string): void {
    const colorArg = color || "#000000";
    this.doc.setTextColor(colorArg);
    this.doc.setFontSize(10);
    this.doc.setFont("helvetica", "bold");
    this.doc.text(text, x, y, { maxWidth: pageWidth, lineHeightFactor: 1.5, ...(options || {}) });
  }

  addPage = async (render: (self: PdfDocument) => void): Promise<PdfDocument> => {
    if (this.page > 1) {
      this.doc.addPage();
    }
    this.renderLayout(this.page);
    await render(this);
    this.page += 1;
    return this;
  };

  save(): PdfDocument {
    this.doc.save(this.config.filename);
    return this;
  }

  getBlobUrl(): string {
    return this.doc.output("bloburl", { filename: this.config.filename });
  }
}
