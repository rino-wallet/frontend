import { Html5Qrcode, Html5QrcodeScannerState } from "html5-qrcode";

export class QRCodeScanner {
  codeScanner: Html5Qrcode | undefined;

  cameraId: string | undefined;

  init = async (name: string) : Promise<void> => {
    if (!this.cameraId || !this.codeScanner) {
      const devices = await Html5Qrcode.getCameras();

      if (devices && devices.length) {
        this.cameraId = devices[0].id;
        this.codeScanner = new Html5Qrcode(name);
      }
    }
  };

  start = async (): Promise<string> => (
    new Promise((resolve, reject) => {
      if (
        this.codeScanner
        && this.codeScanner.getState() === Html5QrcodeScannerState.NOT_STARTED
      ) {
        this.codeScanner.start(
          this.cameraId || "",
          {
            fps: 10,
            qrbox: { width: 250, height: 250 },
          },
          (decodedText) => {
            if (this.codeScanner) {
              this.codeScanner.stop();
            }
            resolve(decodedText);
          },
          () => {},
        )
          .catch((error) => reject(error));
      }
    })
  );

  pause = () => {
    if (
      this.codeScanner
      && this.codeScanner.getState() === Html5QrcodeScannerState.SCANNING
    ) {
      this.codeScanner.pause();
    }
  };

  stop = () => {
    if (
      this.codeScanner
      && this.codeScanner.getState() === Html5QrcodeScannerState.SCANNING
    ) {
      this.codeScanner.stop();
    }
  };
}
