import React from "react";
import { useTranslation } from "react-i18next";
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
}) => {
  const { t } = useTranslation();
  return (
    <div data-qa-selector="exchange-details">
      {
        platform && (
          <Label labelClassName="md:text-right" label={t("wallet.exchange.platform")} inline>
            <ChangeNowLogo style={{ width: "110px" }} />
          </Label>
        )
      }
      {
        rate && (
          <Label labelClassName="md:text-right" label={t("wallet.exchange.rate")} inline>
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
          <Label labelClassName="md:text-right" label={t("wallet.dest.btc.txid")} inline>
            {outgoingTxid}
          </Label>
        )
      }
      {
        exchangeID && (
          <Label labelClassName="md:text-right" label={t("wallet.exchange.id")} inline>
            <Copy value={exchangeID}>{exchangeID}</Copy>
          </Label>
        )
      }
      {
        destinationAddress && (
          <Label labelClassName="text-right" label={t("wallet.transaction.dest.address")} inline>
            <span className="theme-text-secondary break-all text-sm">{destinationAddress}</span>
          </Label>
        )
      }
    </div>
  );
};
