import React from "react";
import { useTranslation } from "react-i18next";
import { Button, Copy, Icon } from "../../../components";
import { Subaddress } from "../../../types";
import { EditLabelForm } from "./EditLabelForm";
import showQRCodeModal from "./QRCodeModal";
import { ValidateButton } from "./ValidateButton";

interface Props {
  subaddress: Subaddress;
  walletId: string;
  validateAddress: (subaddress: Subaddress, mode: "new" | "first" | "prompt") => Promise<void>;
  isPublicWallet?: boolean;
}

export const SubaddressItem: React.FC<Props> = ({
  subaddress,
  walletId,
  validateAddress,
  isPublicWallet,
}) => {
  const { t } = useTranslation();

  return (
    <div className="flex items-start" data-qa-selector="subaddress-item">
      <Button
        variant={Button.variant.GRAY}
        size={Button.size.MEDIUM}
        onClick={(): void => {
          showQRCodeModal({ address: subaddress.address });
        }}
      >
        <Icon name="qrcode" />
      </Button>

      <div className="ml-6 break-all min-w-0">
        <Copy value={subaddress.address}>
          {!isPublicWallet && (
            <EditLabelForm
              short
              className="align-bottom"
              id={walletId}
              address={subaddress?.address || ""}
              label={subaddress?.label || ""}
            />
          )}

          {!subaddress?.label && (
            <span className="theme-text-secondary">
              {" "}
              {subaddress.index}
              {" "}
            </span>
          )}

          {subaddress.isUsed ? (
            <span className="theme-text-secondary font-bold">
              {" "}
              (
              {t("wallet.receive.used")}
              )
            </span>
          ) : null}

          <span className="align-bottom">:</span>
          {" "}
          <span className="align-bottom">{subaddress.address}</span>
        </Copy>
      </div>

      {!isPublicWallet && (
        <div className="ml-6" data-qa-selector="validate_btn">
          <ValidateButton
            subaddress={subaddress}
            validateAddress={validateAddress}
          />
        </div>
      )}
    </div>
  );
};
