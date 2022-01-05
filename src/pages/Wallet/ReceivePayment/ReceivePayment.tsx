import React from "react";
import QRCode from "qrcode.react";
import { generatePath } from "react-router-dom";
import { PageTemplate } from "../../../modules/index";
import { Button, CopyIcon } from "../../../components";
import { useCopy } from "../../../hooks";
import routes from "../../../router/routes";
import Subaddresses from "./Subaddresses";

interface Props {
  address: string;
  walletId: string;
}

const ReceivePayment: React.FC<Props> = ({
  address,
  walletId,
}) => {
  const {successFlag, copyToClipboard} = useCopy();
  return (
    <PageTemplate title="Receive" backButtonRoute={`${generatePath(routes.wallet, { id: walletId })}/transactions`}>
      <div>
        <div className="flex justify-center mb-6" data-qa-selector="address-qr-code">
          <QRCode
            id="qr-code"
            value={address}
            size={202}
            level="H"
            includeMargin
          />
        </div>
        <div className="rounded border-solid border border-gray-200 p-3 text-sm bg-gray-50 mb-4 h-16">
          <div className="flex items-center space-x-3">
            <div className="min-w-0 break-words" data-qa-selector="receive-address">{address}</div>
            <div className="flex-shrink-0">
              <Button
                name="copy-address-btn"
                size={Button.size.SMALL}
                variant={successFlag ? Button.variant.GREEN : Button.variant.GRAY}
                onClick={(): void => { copyToClipboard(address); }}
                rounded
              >
                <CopyIcon size={12} />
              </Button>
            </div>
          </div>
        </div>
        <div>
          <Subaddresses walletId={walletId} />
        </div>
      </div>
    </PageTemplate>
  )
}

export default ReceivePayment;
