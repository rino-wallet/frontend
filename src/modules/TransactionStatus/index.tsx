import React from "react";
import { useTranslation, Trans } from "react-i18next";
import { Status, Tooltip } from "../../components";
import { orderStatuses } from "../../constants";
import { ExchangeOrder, PendingTransfer, Wallet } from "../../types";

const orderStatusVariants = {
  [orderStatuses.PENDING_PAYMENT]: Status.variant.YELLOW,
  [orderStatuses.PENDING_EXECUTION]: Status.variant.BLUE,
  [orderStatuses.COMPLETE]: Status.variant.GREEN,
  [orderStatuses.FAILED]: Status.variant.RED,
  [orderStatuses.CANCELED]: Status.variant.GRAY,
};

const Wrapper: React.FC<{ isLocked: boolean; blocksToUnlock: number }> = ({ children, isLocked, blocksToUnlock }) => {
  const time = 2 * blocksToUnlock;
  return (isLocked ? (
    <Tooltip content={(
      <Trans i18nKey="wallet.confirmed.tooltip" className="text-sm">
        Confirmed, but funds cannot be used yet.
        {" "}
        {{ blocksToUnlock }}
        {" "}
        blocks to unlock, which takes usually
        {" "}
        {{ time }}
        {" "}
        minutes.
      </Trans>
    )}
    >
      {children}
    </Tooltip>
  ) : <div>{children}</div>);
};

interface Props {
  numConfirmations: number;
  order?: ExchangeOrder;
}

export const TransactionStatus: React.FC<Props> = ({ numConfirmations, order }) => {
  const { t } = useTranslation();
  const isUnconfirmed = numConfirmations === 0;
  const isLocked = numConfirmations > 0 && numConfirmations < 10;
  const isConfirmed = numConfirmations > 9;
  const blocksToUnlock = 10 - numConfirmations;
  return order ? (
    <Status
      variant={orderStatusVariants[order.status]}
    >
      {order.status}
    </Status>
  ) : (
    <Wrapper isLocked={isLocked} blocksToUnlock={blocksToUnlock}>
      <Status
        variant={numConfirmations > 0 ? Status.variant.GREEN : Status.variant.GRAY}
      >
        {
          isUnconfirmed && <span className="uppercase">{t("wallet.transaction.status.unconfirmed")}</span>
        }
        {
          isLocked && (
            <span className="uppercase">
              {t("wallet.transaction.status.locked")}
              {" "}
              (
              {blocksToUnlock}
              )
            </span>
          )
        }
        {
          isConfirmed && <span className="uppercase">{t("wallet.transaction.status.confirmed")}</span>
        }
      </Status>
    </Wrapper>
  );
};

interface ApprovedTransactionProps {
  transaction: PendingTransfer;
  wallet: Wallet;
}

const TRANSACTION_STATUS = {
  PENDING: { value: 10, variant: Status.variant.YELLOW },
  CANCELED: { value: 20, variant: Status.variant.GRAY },
  REJECTED: { value: 30, variant: Status.variant.RED },
  TIMED_OUT: { value: 40, variant: Status.variant.RED },
  COMPLETED: { value: 50, variant: Status.variant.GREEN },
} as const;

export const ApprovedTransactionStatus: React.FC<ApprovedTransactionProps> = ({
  transaction,
  wallet,
}) => {
  const status = transaction.status;
  let statusText = "";
  let variant = Status.variant.RED;

  switch (status) {
    case TRANSACTION_STATUS.PENDING.value:
      statusText = `PENDING ${transaction.approvals.length}/${wallet.minApprovals}`;
      variant = TRANSACTION_STATUS.PENDING.variant;
      break;
    case TRANSACTION_STATUS.CANCELED.value:
      statusText = "CANCELED";
      variant = TRANSACTION_STATUS.CANCELED.variant;
      break;
    case TRANSACTION_STATUS.REJECTED.value:
      statusText = "REJECTED";
      variant = TRANSACTION_STATUS.REJECTED.variant;
      break;
    case TRANSACTION_STATUS.COMPLETED.value:
      statusText = "COMPLETE";
      variant = TRANSACTION_STATUS.COMPLETED.variant;
      break;
    case TRANSACTION_STATUS.TIMED_OUT.value:
      statusText = "TIMED OUT";
      variant = TRANSACTION_STATUS.TIMED_OUT.variant;
      break;
    default:
      break;
  }

  return (
    <Status variant={variant}>
      {statusText}
    </Status>
  );
};
