import React, { useState } from "react";
import { format } from "date-fns";
import classNames from "classnames";
import { PendingTransfer, PendingTransferApprovalPayload } from "../../../types";
import { piconeroToMonero } from "../../../utils";
import {
  Button, FormatNumber, Icon,
} from "../../../components";
import TransactionItemLayout from "./ApprovalTransactionItemLayout";
import TransactionDetails from "../TransactionDetails";
import { useSelector } from "../../../hooks";
import { selectors as walletSelectors } from "../../../store/walletSlice";
import walletsApi from "../../../api/wallets";
import { selectors as sessionSelectors } from "../../../store/sessionSlice";

interface Props {
  transaction: PendingTransfer;
  walletId: string;
  updateTransfers?: () => void;
}

const TransactionItem: React.FC<Props> = ({
  transaction, walletId, updateTransfers,
}) => {
  const [open, setOpen] = useState(false);
  const timestamp = transaction.createdAt;
  const currentWallet = useSelector(walletSelectors.getWallet);
  const user = useSelector(sessionSelectors.getUser);

  const handleApprove = async () => {
    const data: PendingTransferApprovalPayload = {
      walletId,
      transactionId: transaction.id,
    };

    return walletsApi.approvePendingTransfer(data)
      .then(() => {
        if (typeof updateTransfers === "function") {
          updateTransfers();
        }
      });
  };

  const handleReject = async () => {
    const data: PendingTransferApprovalPayload = {
      walletId,
      transactionId: transaction.id,
    };

    return walletsApi.rejectPendingTransfer(data)
      .then(() => {
        if (typeof updateTransfers === "function") {
          updateTransfers();
        }
      });
  };

  const handleCancel = async () => {
    const data: PendingTransferApprovalPayload = {
      walletId,
      transactionId: transaction.id,
    };

    return walletsApi.cancelPendingTransfer(data)
      .then(() => {
        if (typeof updateTransfers === "function") {
          updateTransfers();
        }
      });
  };

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
            {transaction?.creator !== user.email
              ? (
                <>
                  <Button onClick={handleReject} size={Button.size.SMALL} name="tx-reject-btn" variant={Button.variant.BRIGHT_RED} className="w-full">
                    <span className="whitespace-nowrap relative">
                      Reject
                      {" "}
                    </span>
                  </Button>
                  <Button onClick={handleApprove} size={Button.size.SMALL} name="tx-approve-btn" variant={Button.variant.INDIGO} className="w-full">
                    <span className="whitespace-nowrap relative">
                      Approve
                      {" "}
                      {transaction.approvals.length || 0}
                      /
                      {currentWallet.minApprovals}
                      {" "}
                    </span>
                  </Button>
                </>
              )
              : (
                <Button onClick={handleCancel} size={Button.size.SMALL} name="tx-reject-btn" variant={Button.variant.BRIGHT_RED} className="w-full">
                  <span className="whitespace-nowrap relative">
                    Cancel
                    {" "}
                  </span>
                </Button>
              )}
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
      />
      {
        open && <TransactionDetails pendingTransfer={transaction} walletId={walletId} />
      }
    </div>
  );
};

export default TransactionItem;
