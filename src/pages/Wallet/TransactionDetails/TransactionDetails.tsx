import React from "react";
import { useHistory } from "react-router-dom";
import { Transaction } from "../../../types";
import { Button, Placeholder } from "../../../components";
import { piconeroToMonero } from "../../../utils";
import TransactionDetailsContent from "./TansactionDetailsContent";

interface Props {
  transaction?: Transaction;
}

const TransactionDetails: React.FC<Props> = ({ transaction }) => {
  const history = useHistory();
  return (
    <div>
      <div className="flex items-center space-x-3 p-4 border-b border-gray-200">
        <Button
          onClick={(): void => { history.goBack(); }}
          size={Button.size.MEDIUM}
          rounded
        >
          <div className="w-5 h-5 leading-5 text-xl">&#x3c;</div>
        </Button>
        {
          transaction && (
            <div className="font-medium text-base">
              <span data-qa-selector="transaction-amount">{transaction.direction === "out" ? "-" : "+"}{piconeroToMonero(transaction.amount)}</span> XMR
            </div>
          )
        }
      </div>
      <div className="p-5">
        <div className="text-base mb-3">
          Details
        </div>
        {
          transaction ? <TransactionDetailsContent transaction={transaction} />: (
            <div>
              <div className="mb-6"><Placeholder /></div>
              <div className="mb-6"><Placeholder /></div>
              <div className="mb-6"><Placeholder /></div>
              <div className="mb-6"><Placeholder /></div>
              <div className="mb-6"><Placeholder /></div>
              <div className="mb-6"><Placeholder /></div>
            </div>
          )
        }
      </div>
    </div>
  )
}

export default TransactionDetails;
