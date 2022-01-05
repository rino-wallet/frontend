import QRCode from "qrcode";

interface Options {
  width?: number;
  errorCorrectionLevel?: string,
}

export default async function createQRCodeImage(string: string, options?: Options): Promise<string> {
  try {
    return await QRCode.toDataURL(string, { errorCorrectionLevel: "M", ...(options ? options : {}) })
  } catch (err) {
    console.error(err);
    return "";
  }
}
