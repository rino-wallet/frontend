import React from "react";
import { Status, Tooltip } from "../../components";
import { orderStatuses } from "../../constants";
import { ExchangeOrder } from "../../types";

const orderStatusVariants = {
  [orderStatuses.PENDING_PAYMENT]: Status.variant.YELLOW,
  [orderStatuses.PENDING_EXECUTION]: Status.variant.BLUE,
  [orderStatuses.COMPLETE]: Status.variant.GREEN,
  [orderStatuses.FAILED]: Status.variant.RED,
};

const Wrapper: React.FC<{ isLocked: boolean; blocksToUnlock: number }> = ({ children, isLocked, blocksToUnlock }) => (isLocked ? (
  <Tooltip content={(
    <div className="text-sm">
      Confirmed, but funds cannot be used yet.
      {" "}
      {blocksToUnlock}
      {" "}
      blocks to unlock, which takes usually
      {" "}
      {2 * blocksToUnlock}
      {" "}
      minutes.
    </div>
    )}
  >
    {children}
  </Tooltip>
) : <div>{children}</div>);

interface Props {
  numConfirmations: number;
  order?: ExchangeOrder;
}

export const TransactionStatus: React.FC<Props> = ({ numConfirmations, order }) => {
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
          isUnconfirmed && "UNCONFIRMED"
        }
        {
          isLocked && (
            `LOCKED (${blocksToUnlock})`
          )
        }
        {
          isConfirmed && "CONFIRMED"
        }
      </Status>
    </Wrapper>
  );
};
