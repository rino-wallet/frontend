import React from "react";
import { format } from "date-fns";
import { Transaction } from "../../../types";
import { Copy, Label } from "../../../components";
import { TransactionStatus } from "../../../modules/index";
import { piconeroToMonero } from "../../../utils";

interface Props {
  transaction: Transaction;
}

const TransactionDetailsContent: React.FC<Props> = ({ transaction }) => {
  const destAddresses = (transaction.destinations || []).map(dest => dest.address) || [];
  const timestamp = transaction.timestamp ? transaction.timestamp : transaction.createdAt;
  return (
    <div>
      <div className="mb-3">
        <Label label={(
          <div className="flex justify-between items-center">
            Transaction time
            <div data-qa-selector="transaction-status">
              <TransactionStatus
                numConfirmations={transaction.confirmations}
                direction={transaction.direction}
              />
            </div>
        </div>
        )}>
          <span data-qa-selector="transaction-timestamp">{format(new Date(timestamp), "dd MMM yyyy HH:mm")}</span>
        </Label>
      </div>
      <div className="mb-3">
        <Label label="Destination address">
            <span className="text-orange-500">
              {destAddresses.length ? destAddresses.map((address, index) => (
                <Copy key={address} value={address}>
                  <span data-qa-selector={`transaction-address-${index}`} key={address} className="break-words">
                    {address}
                  </span>
                </Copy>
              )) : "This wallet"}
            </span>
        </Label>
      </div>
      <div className="mb-3">
        <Label label="Transaction id">
          <Copy value={transaction.id}>
            <span data-qa-selector={"transaction-id = "+transaction.id} className="break-words">
              {transaction.id}
            </span>
          </Copy>
        </Label>
      </div>
      {
        transaction.fee && <div className="mb-3">
          <Label label="Fee">
            <div data-qa-selector="transaction-confirmations">{piconeroToMonero(transaction.fee)}</div>
          </Label>
        </div>
      }
      <div className="mb-3">
        <Label label="Number of confirmations">
          <div data-qa-selector="transaction-confirmations">{transaction.confirmations}</div>
        </Label>
      </div>
      {
        transaction.memo && <div className="mb-3">
          <Label label="Memo">
            <div data-qa-selector="transaction-memo">{transaction.memo}</div>
          </Label>
        </div>
      }
    </div>
  )
}

export default TransactionDetailsContent;
