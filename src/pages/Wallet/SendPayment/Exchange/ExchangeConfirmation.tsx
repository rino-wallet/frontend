import React from "react";
import Decimal from "decimal.js-light";
import { Button, Icon, Label } from "../../../../components";
import { CountDown } from "./CountDown";
import { TimeOutModal as showTimeOutModal } from "./TimeOutModal";
import { ExchangeDetails } from "./ExchangeDetails";
import { ExchangeOrder } from "../../../../types";
import { piconeroToMonero, satoshiToBTC } from "../../../../utils";

interface Props {
  setActiveTab: (value: number) => void;
  order?: ExchangeOrder;
}

const ExchangeConfirmation: React.FC<Props> = ({ setActiveTab, order }) => {
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
              <div>
                <div className="text-sm uppercase mb-1">amount you send</div>
                <div className="text-2xl font-bold">
                  {piconeroToMonero(order?.paymentAmount || 0)}
                  {" "}
                  {order?.paymentCurrency.toUpperCase()}
                </div>
              </div>
              <div className="text-3xl mx-10 mt-5">
                <Icon name="arrow_right" />
              </div>
              <div>
                <div className="text-sm uppercase mb-1">amount you get</div>
                <div className="text-2xl font-bold">
                  {satoshiToBTC(order?.outgoingAmount || 0)}
                  {" "}
                  {order?.outgoingCurrency.toUpperCase()}
                </div>
              </div>
            </div>
          </Label>
        </div>
        <ExchangeDetails
          rate={new Decimal(satoshiToBTC(order?.outgoingAmount as number)).div(new Decimal(piconeroToMonero(order?.paymentAmount as number))).toNumber()}
          currency={order?.outgoingCurrency || ""}
          destinationAddress={order?.outgoingAddress || ""}
          exchangeID={order?.platformOrderId || ""}
          platform={order?.platform || ""}
        />
        <div className="mt-5">
          <Label label="" inline>
            Please confirm your payment in
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
            onClick={(): void => {
              setActiveTab(0);
            }}
          >
            Edit
          </Button>
          <Button
            type="submit"
            name="submit-btn"
            variant={Button.variant.PRIMARY_LIGHT}
            size={Button.size.BIG}
            onClick={(): void => {
              setActiveTab(2);
            }}
          >
            Confirm Payment
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ExchangeConfirmation;
