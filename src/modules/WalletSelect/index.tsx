import React, { useState } from "react";
import { Wallet } from "../../types";
import { WalletCard } from "../WalletCard";
import { ListItem } from "./ListItem";

interface Props {
  value: string;
  wallets: Wallet[];
  name?: string;
  onChange: (id: string) => void;
}

export const WalletSelect: React.FC<Props> = ({
  value,
  wallets,
  name="",
  onChange,
}) => {
  const [open, setOpen] = useState(false);
  const activeWallet = wallets.find((w) => w.id === value);
  function onClickHandler(id: string): void {
    onChange(id);
    setOpen(false);
  }
  const options = wallets.filter((w) => w.id !== value);
  return (
    <div>
      <button name={name} type="button" className="w-full" onClick={(): void => setOpen(!open)}>
        <WalletCard
          balance={activeWallet?.balance || ""}
          unlocked={activeWallet?.unlockedBalance || ""}
          name={activeWallet?.name || ""}
        />
      </button>
      {
        open && (
          <div
            data-qa-selector="wallet-selector-list"
            className="theme-bg-panel rounded border-solid border border-gray-200"
          >
            {
              options.length === 0 && <div className="theme-text-secondary">No wallets</div>
            }
            {
              options.map((wallet) => {
                return (
                  <ListItem
                    key={wallet.id}
                    wallet={wallet}
                    onClick={onClickHandler}
                  />
                )
              })
            }
          </div>
        )
      }
    </div>
  )
}