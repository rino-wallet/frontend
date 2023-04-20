import React from "react";
import { Placeholder } from "../../../components";
import TransactionItemLayout from "./ApprovalTransactionItemLayout";

const TransactionItemPlaceholder: React.FC = () => (
  <TransactionItemLayout
    amount={(
      <div className="w-1/2 inline-block">
        <Placeholder />
      </div>
      )}
    action={(
      <div className="w-1/2 inline-block">
        <Placeholder />
      </div>
      )}
    timestamp={(
      <div className="w-full inline-block">
        <Placeholder />
      </div>
      )}
    submitedBy={(
      <div className="w-full inline-block">
        <Placeholder />
      </div>
      )}
    status={(
      <div className="w-full inline-block">
        <Placeholder />
      </div>
      )}
  />
);

export default TransactionItemPlaceholder;
