import React, { FC } from "react";
import { format } from "date-fns";
import Decimal from "decimal.js-light";
import { useTranslation } from "react-i18next";

import { PendingTransfer, Transaction } from "../../../types";
import { Copy, Label, FormatNumber } from "../../../components";
import { piconeroToMonero, convertAtomicAmount } from "../../../utils";
import TransactionMemo from "./TransactionMemo";
import "./styles.css";
import { ExchangeDetails } from "../SendPayment/Exchange/ExchangeDetails";

function truncateLongString(string: string) {
  return `${string.slice(0, 10)}...${string.slice(-6)}`;
}

interface Props {
  transaction?: Transaction;
  walletId: string;
  isPublicWallet?: boolean;
  pendingTransfer?: PendingTransfer;
}

const TransactionDetailsContent: FC<Props> = ({
  transaction, walletId, isPublicWallet, pendingTransfer,
}) => {
  const { t } = useTranslation();
  const loading = !transaction && !pendingTransfer;

  const timestamp = transaction?.timestamp
    ? transaction?.timestamp
    : transaction?.createdAt;

  const confirmations = typeof transaction?.confirmations === "number"
    && transaction?.confirmations > 100
    ? "100+"
    : transaction?.confirmations;

  return (!pendingTransfer ? (
    <div className="px-10 pt-3 pb-7 transaction-details bg-cover md:bg-auto">
      <div className="mb-8 md:mb-0">
        <Label
          inline
          loading={loading}
          label={t("wallet.transaction.time")}
          labelClassName="md:text-right"
          valueClassName=""
        >
          {timestamp && (
            <span data-qa-selector="transaction-timestamp">
              {format(new Date(timestamp || ""), "dd MMM yyyy HH:mm")}
            </span>
          )}
        </Label>
      </div>

      {transaction?.direction === "out" && (
        <div className="mb-8 md:mb-0">
          <Label
            inline
            loading={loading}
            label={t("wallet.transaction.networkfee")}
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
      )}

      <div className="mb-8 md:mb-0">
        <Label
          inline
          loading={loading}
          label={
            transaction?.direction === "out"
              ? t("wallet.transaction.dest.address")
              : t("wallet.transaction.receiving.address")
          }
          labelClassName="md:text-right"
          valueClassName="whitespace-nowrap"
        >
          {transaction?.destinations?.length
            ? (transaction?.destinations || []).map((destAddress, index) => (
              <div key={`${destAddress}`} className="flex">
                <Copy key={destAddress.address} value={destAddress.address}>
                  <div className="whitespace-nowrap flex min-w-0">
                    {destAddress.addressLabel && (
                      <div
                        data-qa-selector="address-label"
                        className="font-bold min-w-0 text-ellipsis overflow-hidden mr-1"
                      >
                        {destAddress.addressLabel}
                        :
                      </div>
                    )}

                    <div
                      data-qa-selector={`transaction-address-${index}`}
                      key={destAddress.address}
                      className="break-words"
                    >
                      {truncateLongString(destAddress.address)}
                    </div>
                  </div>
                </Copy>
              </div>
            )) : "This wallet"}
        </Label>
      </div>

      <div className="mb-8 md:mb-0">
        <Label
          inline
          loading={loading}
          label={t("wallet.transaction.number.confirmations")}
          labelClassName="md:text-right"
          valueClassName=""
        >
          <div data-qa-selector="transaction-confirmations">
            {confirmations}
          </div>
        </Label>
      </div>

      <div className="mb-8 md:mb-0">
        <Label
          inline
          loading={loading}
          label={t("wallet.transaction.txid")}
          labelClassName="md:text-right"
          valueClassName=""
        >
          {transaction && (
            <Copy value={transaction.id}>
              <span
                data-qa-selector={`transaction-id = ${transaction?.id}`}
                className="break-words"
              >
                {truncateLongString(transaction?.id)}
              </span>
            </Copy>
          )}
        </Label>
      </div>

      {isPublicWallet && transaction && transaction.memo !== undefined && (
        <div className="mb-8 md:mb-0">
          <Label
            inline
            label={t("wallet.transaction.internal.memo")}
            labelClassName="md:text-right"
            valueClassName=""
          >
            <div data-qa-selector="transaction-memo">
              {transaction.memo || "-"}
            </div>
          </Label>
        </div>
      )}

      {!isPublicWallet && transaction && (
        <TransactionMemo
          walletId={walletId}
          transactionId={transaction.id}
          memo={transaction.memo}
        />
      )}

      {transaction?.order && (
        <div className="mb-8 md:mb-0">
          <Label label="" inline>
            <h3 className="text-2xl mb-3 font-bold">
              {t("wallet.transaction.exchangeinfo")}
            </h3>
          </Label>

          <ExchangeDetails
            platform={transaction?.order.platform}
            rate={
              new Decimal(
                convertAtomicAmount(
                  transaction?.order?.outgoingAmount as number,
                  transaction?.order.outgoingCurrency,
                ),
              ).div(
                new Decimal(
                  piconeroToMonero(
                    transaction?.order?.paymentAmount as number,
                  ),
                ),
              ).toNumber()
            }
            currency={transaction?.order.outgoingCurrency}
            destinationAddress={transaction?.order.outgoingAddress}
            exchangeID={transaction?.order.platformOrderId}
            outgoingTxid={transaction?.order.outgoingTxid}
          />
        </div>
      )}
    </div>
  ) : (
    <div className="px-10 pt-3 pb-7 transaction-details bg-cover md:bg-auto">
      <div className="mb-8 md:mb-0">
        <Label
          inline
          loading={loading}
          label="Destination address"
          labelClassName="md:text-right"
          valueClassName="whitespace-nowrap"
        >
          <div className="flex">
            <Copy key={pendingTransfer.address} value={pendingTransfer.address}>
              <div className="w-full whitespace-normal">
                &nbsp;
                <div
                  data-qa-selector="transaction-address"
                  className="!break-all w-full"
                >
                  {pendingTransfer?.address}
                </div>
              </div>
            </Copy>
          </div>
        </Label>
      </div>

      {pendingTransfer.approvals.length > 0
        ? (
          <div className="mb-8 md:mb-0">
            <Label
              inline
              loading={loading}
              label="Approved By"
              labelClassName="md:text-right"
              valueClassName=""
            >
              {pendingTransfer?.approvals.map((transfer, index) => (
                <span key={transfer.user}>
                  {transfer.user}
                  &nbsp;
                  {`(${format(
                    new Date(transfer?.createdAt || ""),
                    "dd MMM yyyy HH:mm",
                  )})`}
                  {index !== pendingTransfer.approvals.length - 1 ? ", " : ""}
                </span>
              ))}
            </Label>
          </div>
        ) : (
          <Label
            inline
            loading={loading}
            label="Approved By"
            labelClassName="md:text-right"
            valueClassName=""
          >
            {t("wallet.transaction.noapprovals")}
          </Label>
        )}

      {pendingTransfer.rejectedBy && (
        <div className="mb-8 md:mb-0">
          <Label
            inline
            loading={loading}
            label="Rejected By"
            labelClassName="md:text-right"
            valueClassName=""
          >
            {pendingTransfer.rejectedBy}
          </Label>
        </div>
      )}

      {pendingTransfer?.memo
        ? (
          <div className="mb-8 md:mb-0">
            <Label
              inline
              loading={loading}
              label="Memo"
              labelClassName="md:text-right"
              valueClassName=""
            >
              {pendingTransfer.memo}
            </Label>
          </div>
        ) : (
          <Label
            inline
            loading={loading}
            label="Memo"
            labelClassName="md:text-right"
            valueClassName=""
          >
            {t("wallet.transaction.nomemo")}
          </Label>
        )}
    </div>
  ));
};

export default TransactionDetailsContent;
