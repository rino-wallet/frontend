import React from "react";
import { Placeholder } from "../../../components";
import TransactionItemLayout from "./TransactionItemLayout";

const TransactionItemPlaceholder: React.FC = () => (
  <TransactionItemLayout
    type={(
      <div className="w-1/2 inline-block">
        <Placeholder />
      </div>
      )}
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
    status={(
      <div className="w-1/2 inline-block">
        <Placeholder />
      </div>
      )}
  />
);

export default TransactionItemPlaceholder;
