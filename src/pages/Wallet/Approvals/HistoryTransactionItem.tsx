import React, { useState } from "react";
import { format } from "date-fns";
import classNames from "classnames";
import { PendingTransfer } from "../../../types";
import { piconeroToMonero } from "../../../utils";
import {
  Button, FormatNumber, Icon,
} from "../../../components";
import TransactionItemLayout from "./ApprovalTransactionItemLayout";
import { ApprovedTransactionStatus } from "../../../modules/TransactionStatus";
import { useSelector } from "../../../hooks";
import TransactionDetails from "../TransactionDetails";
import { selectors as walletSelectors } from "../../../store/walletSlice";

interface Props {
  transaction: PendingTransfer;
  walletId: string;
}

const HistoryTransactionItem: React.FC<Props> = ({
  transaction, walletId,
}) => {
  const [open, setOpen] = useState(false);
  const timestamp = transaction.createdAt;
  const currentWallet = useSelector(walletSelectors.getWallet);

  return (
    <div>
      <TransactionItemLayout
        amount={(
          <span>
            <FormatNumber value={piconeroToMonero(transaction.amount)} />
            {" "}
            XMR
          </span>
        )}
        action={(
          <div className="flex gap-4">
            <Button size={Button.size.SMALL} onClick={(): void => { setOpen((value) => !value); }} name="tx-details-btn" className="w-full">
              <span className={classNames("whitespace-nowrap relative", { "text-transparent": open })}>
                Details
                {" "}
                {open && <div className="absolute inset-0 flex justify-center items-center text-black"><Icon name="checvron_up" /></div>}
              </span>
            </Button>
          </div>
        )}
        timestamp={(
          <span className="text-ellipsis overflow-hidden theme-text-secondary whitespace-nowrap">
            {format(new Date(timestamp), "dd MMM yyyy HH:mm")}
          </span>
        )}
        submitedBy={(
          <span className="text-ellipsis overflow-hidden theme-text-secondary whitespace-nowrap !block !w-full">
            {transaction.creator}
          </span>
        )}
        status={(
          <ApprovedTransactionStatus
            transaction={transaction}
            wallet={currentWallet}
          />
        )}
      />
      {
        open && <TransactionDetails walletId={walletId} pendingTransfer={transaction} />
      }
    </div>
  );
};

export default HistoryTransactionItem;
