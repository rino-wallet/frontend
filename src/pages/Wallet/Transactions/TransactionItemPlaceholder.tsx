import React from "react";
import { Placeholder } from "../../../components";

const TransactionItemPlaceholder: React.FC = () => {
  return (
    <div className="px-5 py-2 mb-1">
      <div className="flex justify-between items-center mb-2">
        <div className="w-3/5">
          <Placeholder />
        </div>
      </div>
      <div className="flex justify-between items-center">
        <div className="w-3/5">
          <Placeholder />
        </div>
        <div className="w-1/5" />
        <div className="w-1/5">
          <Placeholder />
        </div>
      </div>
    </div>
  )
}

export default TransactionItemPlaceholder;
