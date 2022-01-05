import QRCode from "qrcode";

export default async function createQRCodeImage(string: string): Promise<string> {
  try {
    return await QRCode.toDataURL(string, { errorCorrectionLevel: "L" })
  } catch (err) {
    console.error(err);
    return "";
  }
}
