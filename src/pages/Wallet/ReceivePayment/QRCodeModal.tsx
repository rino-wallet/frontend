import React, { useEffect, useState } from "react";
import { createModal } from "promodal";
import { Button } from "../../../components";
import { createQRCodeImage } from "../../../utils";
import { Modal } from "../../../modules/index";

interface Props {
  submit: () => Promise<void>;
  cancel: () => void;
  address: string;
}
const QRCodeModal: React.FC<Props> = ({
  submit,
  cancel,
  address,
}) => {
  const [image, setImage] = useState("");
  useEffect(() => {
    if (address) {
      createQRCodeImage(address, { errorCorrectionLevel: "H" })
        .then((b64String) => {
          setImage(b64String);
        }, () => { setImage(""); });
    }
  }, [address])
  return (
    <Modal
      title="Scan QR Code"
      onClose={cancel}
    >
      <Modal.Body>
        <div className="flex justify-center">
          {
            image && <img src={image} alt={address} />
          }
        </div>
      </Modal.Body>
      <Modal.Actions>
        <div className="flex justify-end space-x-3">
          <Button onClick={(): void => { submit(); }}>Close</Button>
        </div>
      </Modal.Actions>
    </Modal>
  );
};

export default createModal(QRCodeModal);
