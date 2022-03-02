import React from "react";
import { Status, Tooltip } from "../../components";

const Wrapper: React.FC<{ isLocked: boolean; blocksToUnlock: number }> = ({ children, isLocked, blocksToUnlock }) => {
  return isLocked ? (
    <Tooltip content={(
      <div className="text-sm">
        Confirmed, but funds cannot be used yet. {blocksToUnlock} blocks to unlock, which takes usually {2 * blocksToUnlock} minutes.
      </div>
    )}>
      {children}
    </Tooltip>
  ) : <div>{children}</div>
}
interface Props {
  numConfirmations: number;
}

export const TransactionStatus: React.FC<Props> = ({ numConfirmations }) => {
  const isUnconfirmed = numConfirmations === 0;
  const isLocked = numConfirmations > 0 && numConfirmations < 10;
  const isConfirmed = numConfirmations > 9;
  const blocksToUnlock = 10 - numConfirmations;
  return (
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
  )
}
