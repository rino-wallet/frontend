import React from "react";
import { Label, Copy } from "../../../../components";
import { ReactComponent as ChangeNowLogo } from "./change-now.svg";

interface Props {
  rate: number;
  currency: string;
  exchangeID: string;
  destinationAddress: string;
  outgoingTxid?: string;
  platform?: string;
}

export const ExchangeDetails: React.FC<Props> = ({
  rate,
  currency,
  exchangeID,
  destinationAddress,
  outgoingTxid,
  platform,
}) => (
  <div>
    {
        platform && (
        <Label labelClassName="md:text-right" label="Exchange platform" inline>
          <ChangeNowLogo style={{ width: "110px" }} />
        </Label>
        )
      }
    {
        rate && (
        <Label labelClassName="md:text-right" label="Exchange rate" inline>
          <div>
            1 XMR =
            {" "}
            <span className="text-green-400">{rate}</span>
            {" "}
            {currency.toUpperCase()}
          </div>
        </Label>
        )
      }
    {
        !!outgoingTxid && (
        <Label labelClassName="md:text-right" label="Destination BTC Tx ID" inline>
            {outgoingTxid}
        </Label>
        )
      }
    {
        exchangeID && (
        <Label labelClassName="md:text-right" label="exchange ID" inline>
          <Copy value={exchangeID}>{exchangeID}</Copy>
        </Label>
        )
      }
    {
        destinationAddress && (
          <Label labelClassName="text-right" label="destination address" inline>
            <span className="theme-text-secondary break-all text-sm">{destinationAddress}</span>
          </Label>
        )
      }
  </div>
);
