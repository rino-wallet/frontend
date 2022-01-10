import React from "react";
import { Button, Copy, Icon } from "../../../components";
import { Subaddress } from "../../../types";
import showQRCodeModal from "./QRCodeModal";

interface Props {
  subaddress: Subaddress;
}

export const SubaddressItem: React.FC<Props> = ({ subaddress }) => {
  return (
    <div className="flex">
      <Button
        variant={Button.variant.GRAY}
        size={Button.size.MEDIUM}
        onClick={(): void => {
          showQRCodeModal({ address: subaddress.address });
        }}
      >
        <Icon name="qrcode" />
      </Button>
      <div className="ml-6 break-all">
        <Copy value={subaddress.address}>
          <span className="theme-text-secondary">{subaddress.index} :</span> {subaddress.address}{subaddress.isUsed ? (<span className="theme-text-primary font-bold"> (Used)</span>) : null}
        </Copy>
      </div>
    </div>
  )
}