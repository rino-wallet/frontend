import React from "react";

interface Props {
  amount: React.ReactChild;
  action: React.ReactChild;
  timestamp: React.ReactChild;
  status: React.ReactChild;
}

const TransactionItemLayout: React.FC<Props> = ({ amount, action, timestamp, status }) => {
  return (
    <div className="flex flex-wrap items-center py-3 px-10 leading-none" data-qa-selector="transaction">
      <div className="w-1/2 order-1 mb-3 md:w-1/5 md:pr-2 md:mb-0">
        {amount}
      </div>
      <div className="w-1/2 order-2 text-right mb-3 md:w-1/5 md:order-4 md:pl-2 md:mb-0">
        {action}
      </div>
      <div className="w-1/2 order-3 md:w-2/5 md:px-2 md:order-2">
        {timestamp}
      </div>
      <div className="w-1/2 order-4 text-right md:w-1/5 md:order-3 md:text-left md:px-2">
        {status}
      </div>
    </div>
  )
}

export default TransactionItemLayout;
