import QRCode from "qrcode";

interface Options {
  width?: number;
  errorCorrectionLevel?: string,
}

export default async function createQRCodeImage(string: string, options?: Options): Promise<string> {
  try {
    return await Promise.resolve(QRCode.toDataURL(string, { errorCorrectionLevel: "M", ...(options || {}) }));
  } catch (err) {
    // eslint-disable-next-line
    console.error(err);
    return "";
  }
}
