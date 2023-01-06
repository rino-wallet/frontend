import React, { useEffect, useState } from "react";
import { FormatNumber } from "../../components/FormatNumber";
import { piconeroToMonero } from "../../utils";
import { PublicWallet, Wallet } from "../../types";
import { Tooltip } from "../../components/Tooltip";

interface Props {
  wallet: Wallet | PublicWallet | null;
}

export const BalanceDetails: React.FC<Props> = ({ wallet }) => {
  const [firstTransactionBlocksToGo, setBlocksToGo] = useState(0);

  useEffect(() => {
    if (wallet && wallet.lockedAmounts.length) {
      setBlocksToGo(10 - wallet.lockedAmounts[wallet.lockedAmounts.length - 1].confirmations);
    }
  }, [wallet, wallet?.lockedAmounts]);
  return (
    <Tooltip
      content={(
        <div className="text-xs">
          <ul>
            {
              wallet?.lockedAmounts?.map((lockedAmount) => (
                <li key={lockedAmount.amount}>
                  <FormatNumber value={piconeroToMonero(lockedAmount.amount)} />
                  {" "}
                  XMR
                  {lockedAmount.confirmations === 0 ? "unconfirmed" : "locked"}
                  {" "}
                  (~
                  {(10 - lockedAmount.confirmations) * 2}
                  mins)
                </li>
              ))
            }
          </ul>
        </div>
      )}
      disable={wallet?.lockedAmounts.length === 0}
    >
      <div className="min-w-0">
        <div
          className="text-base items-end md:text-base theme-text-secondary font-bold"
        >
          <span data-qa-selector="wallet-unlocked-balance">
            <FormatNumber
              value={piconeroToMonero(wallet?.unlockedBalance || 0)}
            />
          </span>
          {" "}
          <span>available,</span>
          {" "}
          <span data-qa-selector="wallet-locked-balance">
            <FormatNumber
              value={piconeroToMonero(parseInt(wallet?.balance || "0", 10) - parseInt(wallet?.unlockedBalance || "0", 10))}
            />
          </span>
          {" "}
          {wallet?.lockedAmounts && wallet?.lockedAmounts.length > 0 ? (
            <span>
              {" "}
              more in ~
              {firstTransactionBlocksToGo * 2}
              {" "}
              mins
            </span>
          ) : <span>locked</span>}
        </div>
      </div>
    </Tooltip>
  );
};
