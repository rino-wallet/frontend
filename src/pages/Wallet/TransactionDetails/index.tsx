import React from "react";
import { format } from "date-fns";
import Decimal from "decimal.js-light";
import { Transaction } from "../../../types";
import { Copy, Label, FormatNumber } from "../../../components";
import { piconeroToMonero, satoshiToBTC } from "../../../utils";
import TransactionMemo from "./TransactionMemo";
import "./styles.css";
import { ExchangeDetails } from "../SendPayment/Exchange/ExchangeDetails";

interface Props {
  transaction?: Transaction;
  walletId: string;
  isPublicWallet?: boolean;
}

const TransactionDetailsContent: React.FC<Props> = ({ transaction, walletId, isPublicWallet }) => {
  const destAddresses = (transaction?.destinations || []).map((dest) => dest.address) || [];
  const timestamp = transaction?.timestamp ? transaction?.timestamp : transaction?.createdAt;
  const loading = !transaction;
  return (
    <div className="px-10 pt-3 pb-7 transaction-details bg-cover md:bg-auto">
      <div className="mb-8 md:mb-0">
        <Label
          inline
          loading={loading}
          label="Transaction time"
          labelClassName="md:text-right"
          valueClassName=""
        >
          {
            timestamp && (
              <span data-qa-selector="transaction-timestamp">
                {format(new Date(timestamp || ""), "dd MMM yyyy HH:mm")}
              </span>
            )
          }
        </Label>
      </div>
      {
        transaction?.direction === "out" && (
          <div className="mb-8 md:mb-0">
            <Label
              inline
              loading={loading}
              label="Network Fee"
              labelClassName="md:text-right"
              valueClassName=""
            >
              <div data-qa-selector="transaction-network-fee">
                <FormatNumber value={piconeroToMonero(transaction?.fee || 0)} />
                {" "}
                XMR
              </div>
            </Label>
          </div>
        )
      }
      <div className="mb-8 md:mb-0">
        <Label
          inline
          loading={loading}
          label={transaction?.direction === "out" ? "Destination address" : "Receiving address"}
          labelClassName="md:text-right"
          valueClassName=""
        >
          {destAddresses.length ? destAddresses.map((address, index) => (
            <Copy key={address} value={address}>
              <span data-qa-selector={`transaction-address-${index}`} key={address} className="break-words">
                {address}
              </span>
            </Copy>
          )) : "This wallet"}
        </Label>
      </div>
      <div className="mb-8 md:mb-0">
        <Label
          inline
          loading={loading}
          label="Number of confirmations"
          labelClassName="md:text-right"
          valueClassName=""
        >
          <div data-qa-selector="transaction-confirmations">{transaction?.confirmations}</div>
        </Label>
      </div>
      <div className="mb-8 md:mb-0">
        <Label
          inline
          loading={loading}
          label="Transaction id"
          labelClassName="md:text-right"
          valueClassName=""
        >
          {
            transaction && (
              <Copy value={transaction.id}>
                <span data-qa-selector={`transaction-id = ${transaction?.id}`} className="break-words">
                  {transaction?.id}
                </span>
              </Copy>
            )
          }
        </Label>
      </div>
      {
        (transaction && !isPublicWallet) && <TransactionMemo walletId={walletId} transactionId={transaction.id} memo={transaction.memo} />
      }
      {
          transaction?.order && (
            <div className="mb-8 md:mb-0">
              <Label label="" inline>
                <h3 className="text-2xl mb-3 font-bold">Exchange information:</h3>
              </Label>
              <ExchangeDetails
                platform={transaction?.order.platform}
                rate={new Decimal(satoshiToBTC(transaction?.order?.outgoingAmount as number)).div(new Decimal(piconeroToMonero(transaction?.order?.paymentAmount as number))).toNumber()}
                currency={transaction?.order.outgoingCurrency}
                destinationAddress={transaction?.order.outgoingAddress}
                exchangeID={transaction?.order.platformOrderId}
                outgoingTxid={transaction?.order.outgoingTxid}
              />
            </div>
          )
        }
    </div>
  );
};

export default TransactionDetailsContent;
