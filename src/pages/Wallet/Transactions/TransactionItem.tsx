import React, { useState } from "react";
import { format } from "date-fns";
import classNames from "classnames";
import { Transaction } from "../../../types";
import { piconeroToMonero } from "../../../utils";
import {
  Button, FormatNumber, Icon, Tooltip,
} from "../../../components";
import { TransactionStatus } from "../../../modules/index";
import TransactionItemLayout from "./TransactionItemLayout";
import TransactionDetails from "../TransactionDetails";

interface Props {
  transaction: Transaction;
  walletId: string;
  isPublicWallet?: boolean;
}

const TransactionItem: React.FC<Props> = ({ transaction, walletId, isPublicWallet }) => {
  const [open, setOpen] = useState(false);
  const timestamp = transaction.timestamp ? transaction.timestamp : transaction.createdAt;
  return (
    <div>
      <TransactionItemLayout
        type={transaction.order
          ? <div className="text-purple-500"><Icon name="refresh" /></div>
          // eslint-disable-next-line
          : (transaction.direction === "in" ? <div className="text-green-400"><Icon name="get" /></div> : <div className="text-blue-400"><Icon name="send" /></div>)}
        amount={(
          <span
            className={classNames({
              "theme-text-red": transaction.direction === "out" && !transaction.txToSelf,
              "text-green-500": transaction.direction === "in" && !transaction.txToSelf,
              "theme-text-secondary": transaction.txToSelf,
            })}
            data-qa-selector="tx-amount"
          >
            {
              transaction.txToSelf ? (
                <div>
                  <Tooltip content={<div className="p-1">Transaction sent back to the same wallet.</div>}>
                    <div>
                      <span className="text-xl">&#8635;</span>
                      {" "}
                      0
                    </div>
                  </Tooltip>
                </div>
              ) : (
                <div>
                  {transaction.direction === "out" ? "-" : "+"}
                  {" "}
                  <FormatNumber value={piconeroToMonero(transaction.amount)} />
                  {" "}
                  XMR
                </div>
              )
            }
          </span>
        )}
        action={(
          <Button size={Button.size.SMALL} onClick={(): void => { setOpen((value) => !value); }} name="tx-details-btn">
            <span className={classNames("whitespace-nowrap relative", { "text-transparent": open })}>
              Details
              {" "}
              {open && <div className="absolute inset-0 flex justify-center items-center text-black"><Icon name="checvron_up" /></div>}
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
            order={transaction.order}
            numConfirmations={transaction.confirmations}
          />
        )}
      />
      {
        open && <TransactionDetails isPublicWallet={isPublicWallet} transaction={transaction} walletId={walletId} />
      }
    </div>
  );
};

export default TransactionItem;
