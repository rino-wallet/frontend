import React from "react";
import { format } from "date-fns";
import classNames from "classnames";
import { Transaction } from "../../../types";
import { piconeroToMonero } from "../../../utils";
import { TransactionStatus } from "../../../modules/index";

interface Props {
  transaction: Transaction;
}

const TransactionItem: React.FC<Props> = ({ transaction }) => {
  const timestamp = transaction.timestamp ? transaction.timestamp : transaction.createdAt;
  return (
    <div>
      <div className="flex justify-between items-center text-base mb-1">
        <span
          className={classNames({
            "text-red-500": transaction.direction === "out",
            "text-green-500": transaction.direction === "in",
          })}
        >
          {transaction.direction === "out" ? "-" : "+"} {piconeroToMonero(transaction.amount)} XMR
        </span>
        <span>&#x3e;</span>
      </div>
      <div className="flex justify-between items-center">
        <span className="text-xs">{format(new Date(timestamp), "dd MMM yyyy HH:mm")}</span>
        <TransactionStatus
          numConfirmations={transaction.confirmations}
          direction={transaction.direction}
        />
      </div>
    </div>
  )
}

export default TransactionItem;
