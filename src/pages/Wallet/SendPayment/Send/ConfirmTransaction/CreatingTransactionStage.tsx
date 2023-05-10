import React from "react";
import { useTranslation } from "react-i18next";
import { Spinner, Label } from "../../../../../components";

interface Props {
  address: React.ReactChild;
  memo?: React.ReactChild;
  priority: React.ReactChild;
  stage: React.ReactChild;
  fee: React.ReactChild;
  total: React.ReactChild;
  loading?: boolean
}

const CreatingTransactionStage: React.FC<Props> = ({
  address, memo, priority, fee, stage, loading, total,
}) => {
  const { t } = useTranslation();
  return (
    <div className="m-auto p-5">
      {
        loading && (
          <div className="md:flex md:space-x-6">
            <div className="mb-2 text-sm theme-text uppercase font-catamaran leading-none md:mt-6 md:w-1/4 hidden md:block">
              <Spinner size={85} />
            </div>
            <div className="md:w-3/4">
              <div className="flex items-center text-2xl mb-3 font-bold theme-text-error mb-8">
                {t("wallet.send.hold.on")}
                <div className="md:hidden ml-3"><Spinner size={18} /></div>
              </div>
              <div className="mb-4 text-l font-bold h-12" data-qa-selector="creating-wallet-step">
                {t(stage as string)}
                ...
              </div>
              <div className="text-base mb-10">
                {t("wallet.send.transaction.time")}
                {" "}
                <br />
                <span className="font-bold">{t("wallet.send.dont.close.window")}</span>
              </div>
            </div>
          </div>
        )
      }
      <div className="mb-4 md:mb-0">
        <Label labelClassName="md:text-right" label="" inline>
          <div className="text-2xl font-bold mb-4">{t("wallet.send.transaction.details")}</div>
        </Label>
      </div>
      <div className="mb-4 md:mb-0">
        <Label labelClassName="md:text-right" label={<span className="text-base">{t("wallet.send.total.amount")}</span>} inline>
          <span
            className="break-all"
            data-qa-selector="transaction-total"
          >
            {total}
          </span>
        </Label>
      </div>
      <div className="mb-4 md:mb-0">
        <Label labelClassName="md:text-right" label={t("wallet.send.including.fee")} inline>
          <span
            className="break-all"
            data-qa-selector="transaction-fee"
          >
            {fee}
          </span>
        </Label>
      </div>
      <div className="mb-4 md:mb-0">
        <Label labelClassName="md:text-right whitespace-nowrap" label={t("wallet.send.destination.address")} inline>
          <span
            className="theme-text-primary break-all text-base"
            data-qa-selector="transaction-dest-address"
          >
            {address}
          </span>
        </Label>
      </div>
      {
        memo && (
          <div className="mb-4 md:mb-0">
            <Label labelClassName="md:text-right" label={t("wallet.send.internal.memo")} inline>
              <span
                className="theme-text-primary break-all"
                data-qa-selector="transaction-memo"
              >
                {memo}
              </span>
            </Label>
          </div>
        )
      }
      <div className="mb-4 md:mb-0">
        <Label labelClassName="md:text-right" label={t("wallet.send.priority.label")} inline>
          <span
            className="break-all"
            data-qa-selector="transaction-priority"
          >
            {priority}
          </span>
        </Label>
      </div>
    </div>
  );
};

export default CreatingTransactionStage;
