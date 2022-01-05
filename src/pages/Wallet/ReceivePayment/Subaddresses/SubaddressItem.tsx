import React from "react";
import QRCode from "qrcode.react";
import { Subaddress } from "../../../../types";

interface Props {
  subaddress: Subaddress;
}

export const SubaddressItem: React.FC<Props> = ({ subaddress }) => {
  return (
    <div className="flex">
      <QRCode
        id="qr-code"
        value={subaddress.address}
        size={80}
        level="H"
        includeMargin
      />
      <div className="ml-3 break-all">
        {subaddress.address}
      </div>
    </div>
  )
}