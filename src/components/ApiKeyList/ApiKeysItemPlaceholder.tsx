import React from "react";
import { Placeholder } from "..";
import ApiKeyItemLayout from "./ApiKeyItemLayout";

const TransactionItemPlaceholder: React.FC = () => (
  <ApiKeyItemLayout
    name={(
      <div className="w-1/2 inline-block">
        <Placeholder />
      </div>
      )}
    action={(
      <div className="w-1/2 inline-block">
        <Placeholder />
      </div>
      )}
    createdAt={(
      <div className="w-full inline-block">
        <Placeholder />
      </div>
      )}
    expiry={(
      <div className="w-full inline-block">
        <Placeholder />
      </div>
      )}
    id={(
      <div className="w-full inline-block">
        <Placeholder />
      </div>
      )}
  />
);

export default TransactionItemPlaceholder;
