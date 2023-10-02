import React, {
  FC,
  ChangeEvent,
  FocusEvent,
  useState,
  useEffect,
} from "react";
import { useTranslation } from "react-i18next";

import { Input } from "../Input";
import { Icon } from "../Icon";
import Modal from "../Modal";
import { Button } from "../Button";
import Loading from "../Loading";
import { QRCodeScanner } from "../../utils/scanQR";

type Props = {
  name: string;
  value: string;
  error?: string;
  placeholder?: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onBlur: (e: FocusEvent<HTMLInputElement, Element>) => void;
  onScanAddress: (address: string) => void;
};

export const AddressField: FC<Props> = ({
  name,
  value,
  error,
  placeholder,
  onChange,
  onBlur,
  onScanAddress,
}) => {
  const { t } = useTranslation();
  const [showModal, setShowModal] = useState(false);
  const [loadingCamera, setLoadingCamera] = useState(true);
  const showScanQR = true;
  const scanAddress = async () => setShowModal(true);
  const [qrCodeScanner] = useState(new QRCodeScanner());

  useEffect(() => {
    if (showModal) {
      setLoadingCamera(true);
      (async () => {
        await qrCodeScanner.init(name);
        setLoadingCamera(false);

        const decodedText = await qrCodeScanner.start();
        onScanAddress(decodedText);
        setShowModal(false);
      })();
    } else if (qrCodeScanner) {
      qrCodeScanner.stop();
    }
  }, [showModal]);

  return (
    <>
      <Input
        autoComplete="off"
        type="text"
        name={name}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        placeholder={placeholder}
        error={error || ""}
        postfix={showScanQR
          ? (
            <button
              className="flex items-center z-10 mr-4"
              type="button"
              data-cy="show-hide-password-btn"
              onClick={scanAddress}
            >
              <Icon name="qrcode" />
            </button>
          ) : (undefined)}
      />

      {showModal && (
        <Modal title="Scan Address">
          <Modal.Body>
            <div className="flex flex-col items-center">
              <div id={name} className="w-full h-full" />
              {loadingCamera && (<Loading />)}
            </div>
          </Modal.Body>

          <Modal.Actions>
            <Button
              variant={Button.variant.GRAY}
              size={Button.size.BIG}
              name="cancel-btn"
              onClick={(): void => setShowModal(false)}
            >
              {t("common.cancel")}
            </Button>
          </Modal.Actions>
        </Modal>
      )}
    </>
  );
};
