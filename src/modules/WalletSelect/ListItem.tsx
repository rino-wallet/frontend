import React from "react";
import { Wallet } from "../../types";
import { piconeroToMonero } from "../../utils";

interface Props {
  wallet: Wallet;
  onClick: (id: string) => void;
}

export const ListItem: React.FC<Props> = ({
  wallet,
  onClick,
}) => {
  function onClickHandler(): void {
    onClick(wallet.id);
  }
  return (
    <button type="button" onClick={onClickHandler} className="flex justify-between w-full px-3 py-2 items-center">
      <div className="whitespace-nowrap overflow-hidden overflow-ellipsis">{wallet.name}</div>
      <div className="theme-text-secondary text-xs whitespace-nowrap">
        {piconeroToMonero(wallet.balance)}
        {" "}
        XMR
      </div>
    </button>
  );
};
