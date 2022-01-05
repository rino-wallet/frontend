import { jsPDF } from "jspdf";

const leftOffset = 30;
const topOffset = 20;

async function createPage1(doc: any, email: string, recoveryKey: string): Promise<void> {
  // Wallet address
  doc.setFontSize(14);
  doc.text(`Email: ${email}`, leftOffset, topOffset);
  doc.text(`Recovery key: ${recoveryKey}`, leftOffset, topOffset + 10);
}

export default async function createPdf({
  email,
  recoveryKey,
}: {
  email: string;
  recoveryKey: string;
}): Promise<void> {
  const doc = new jsPDF();
  await createPage1(doc, email, recoveryKey);
  doc.save("recovery_key.pdf");
}
