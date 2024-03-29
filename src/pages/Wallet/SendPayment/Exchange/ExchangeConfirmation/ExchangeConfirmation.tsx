import React, { FC } from "react";
import Decimal from "decimal.js-light";
import { useTranslation } from "react-i18next";
import { Button, Icon, Label } from "../../../../../components";
import { CountDown } from "../CountDown";
import { TimeOutModal as showTimeOutModal } from "../TimeOutModal";
import { ExchangeDetails } from "../ExchangeDetails";
import { ExchangeCurrencies, ExchangeOrder } from "../../../../../types";
import { piconeroToMonero, convertAtomicAmount } from "../../../../../utils";
import { useAccountType } from "../../../../../hooks";

interface Props {
  setActiveTab: (value: number) => void;
  order?: ExchangeOrder;
  onEdit: () => void;
}

const ExchangeConfirmation: FC<Props> = ({ setActiveTab, onEdit, order }) => {
  const { t } = useTranslation();
  const { isEnterprise } = useAccountType();

  async function onRecheck(): Promise<void> {
    await showTimeOutModal({
      recheckRequest: () => new Promise((r) => { setTimeout(r, 1000); }),
    })
      .then(() => {
        // eslint-disable-next-line
        console.log("Recheck");
      }, () => {
        setActiveTab(0);
      });
  }

  return (
    <div>
      <div className="m-auto md:w-3/4">
        <div className="form-field">
          <Label label="" inline>
            <div className="flex whitespace-nowrap">
              <div data-qa-selector="amount-you-send">
                <div className="text-sm uppercase mb-1">{t("wallet.send.amount.you.send")}</div>
                <div className="text-2xl font-bold">
                  {piconeroToMonero(order?.paymentAmount || 0)}
                  {" "}
                  {order?.paymentCurrency.toUpperCase()}
                </div>
              </div>
              <div className="text-3xl mx-10 mt-5">
                <Icon name="arrow_right" />
              </div>
              <div data-qa-selector="amount-you-get">
                <div className="text-sm uppercase mb-1">{t("wallet.send.amount.you.get")}</div>
                <div className="text-2xl font-bold">
                  {convertAtomicAmount(order?.outgoingAmount || 0, order?.outgoingCurrency as ExchangeCurrencies)}
                  {" "}
                  {order?.outgoingCurrency.toUpperCase()}
                </div>
              </div>
            </div>
          </Label>
        </div>
        <ExchangeDetails
          rate={new Decimal(convertAtomicAmount(order?.outgoingAmount as number, order?.outgoingCurrency as ExchangeCurrencies)).div(new Decimal(piconeroToMonero(order?.paymentAmount as number))).toNumber()}
          currency={order?.outgoingCurrency || ""}
          destinationAddress={order?.outgoingAddress || ""}
          exchangeID={order?.platformOrderId || ""}
          platform={order?.platform || ""}
        />
        <div className="mt-5" data-qa-selector="confirmation-timer">
          <Label label="" inline>
            {t("wallet.send.please.confirm.payment")}
            {" "}
            <span className="text-red-600">
              <CountDown
                timeout={Math.floor((new Date(order?.expiresAt as string).getTime() - Date.now()) / 1000)}
                callback={onRecheck}
              />
            </span>
          </Label>
        </div>
        <div className="form-field mt-10 flex space-x-3 flex justify-end">
          <Button
            variant={Button.variant.GRAY}
            size={Button.size.BIG}
            name="cancel-btn"
            onClick={onEdit}
          >
            {t("wallet.send.edit")}
          </Button>
          <Button
            type="submit"
            name="submit-btn"
            variant={
              isEnterprise
                ? Button.variant.ENTERPRISE_LIGHT
                : Button.variant.PRIMARY_LIGHT
            }
            size={Button.size.BIG}
            onClick={(): void => {
              setActiveTab(2);
            }}
          >
            {t("wallet.send.confirm.payment")}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ExchangeConfirmation;
