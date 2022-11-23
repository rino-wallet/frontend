import React from "react";
import { Button, Copy, Icon } from "../../../components";
import { Subaddress } from "../../../types";
import { EditLabelForm } from "./EditLabelForm";
import showQRCodeModal from "./QRCodeModal";
import { ValidateButton } from "./ValidateButton";

interface Props {
  subaddress: Subaddress;
  walletId: string;
  validateAddress: (subaddress: Subaddress, required: boolean) => Promise<void>;
}

export const SubaddressItem: React.FC<Props> = ({ subaddress, walletId, validateAddress }) => (
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
        <EditLabelForm
          short
          className="align-bottom"
          id={walletId}
          address={subaddress?.address || ""}
          label={subaddress?.label || ""}
        />
        {
            !subaddress?.label && (
            <span className="theme-text-secondary">
              {" "}
              {subaddress.index}
              {" "}
            </span>
            )
          }
        {subaddress.isUsed ? <span className="theme-text-secondary font-bold"> (Used)</span> : null}
        <span className="align-bottom">:</span>
        {" "}
        <span className="align-bottom">{subaddress.address}</span>
      </Copy>
    </div>
    <div className="ml-6" data-qa-selector="validate_btn">
      <ValidateButton subaddress={subaddress} validateAddress={validateAddress} />
    </div>
  </div>
);
