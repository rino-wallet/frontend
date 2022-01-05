import React, { useState } from "react";
import { format } from "date-fns";
import classNames from "classnames";
import { Transaction } from "../../../types";
import { piconeroToMonero } from "../../../utils";
import { Button, FormatNumber } from "../../../components";
import { TransactionStatus } from "../../../modules/index";
import TransactionItemLayout from "./TransactionItemLayout"
import TransactionDetails from "../TransactionDetails";
import { ReactComponent as CaretIcon } from "./caret.svg";

interface Props {
  transaction: Transaction;
  walletId: string;
}

const TransactionItem: React.FC<Props> = ({ transaction, walletId }) => {
  const [open, setOpen] = useState(false);
  const timestamp = transaction.timestamp ? transaction.timestamp : transaction.createdAt;
  return (
    <div>
      <TransactionItemLayout
        amount={(
          <span
            className={classNames({
              "theme-text-red": transaction.direction === "out",
              "text-green-500": transaction.direction === "in",
            })}
            data-qa-selector="tx-amount"
          >
            {transaction.direction === "out" ? "-" : "+"} <FormatNumber value={piconeroToMonero(transaction.amount)} /> XMR
          </span>
        )}
        action={(
          <Button size={Button.size.SMALL} onClick={(): void => { setOpen((value) => !value); }} name="tx-details-btn">
            <span className={classNames("whitespace-nowrap relative", {"text-transparent": open})}>
              Details {open && <div className="absolute inset-0 flex justify-center items-center"><CaretIcon /></div>}
            </span>
          </Button>
        )}
        timestamp={(
          <span className="theme-text-secondary whitespace-nowrap">
            {format(new Date(timestamp), "dd MMM yyyy HH:mm")}
          </span>
        )}
        status={(
          <TransactionStatus
            numConfirmations={transaction.confirmations}
          />
        )}
      />
      {
        open && <TransactionDetails transaction={transaction} walletId={walletId} />
      }
    </div>
  )
}

export default TransactionItem;
