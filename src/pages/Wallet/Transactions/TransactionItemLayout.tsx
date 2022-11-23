import React from "react";

interface Props {
  type: React.ReactChild;
  amount: React.ReactChild;
  action: React.ReactChild;
  timestamp: React.ReactChild;
  status: React.ReactChild;
}

const TransactionItemLayout: React.FC<Props> = ({
  type, amount, action, timestamp, status,
}) => (
  <div className="flex flex-wrap items-center py-3 px-10 leading-none" data-qa-selector="transaction">
    <div className="order-1 mb-3 mr-2 md:mr-0 md:w-1/12 md:pr-2 md:mb-0">
      {type}
    </div>
    <div className="w-1/2 order-1 mb-3 flex-1 md:w-3/12 md:pr-2 md:mb-0">
      {amount}
    </div>
    <div className="w-1/2 order-2 text-right mb-3 md:w-2/12 md:order-4 md:pl-2 md:mb-0">
      {action}
    </div>
    <div className="w-1/2 order-3 md:w-4/12 md:px-2 md:order-2">
      {timestamp}
    </div>
    <div className="w-1/2 order-4 flex-1 text-right md:w-2/12 md:order-3 md:text-left md:px-2">
      {status}
    </div>
  </div>
);

export default TransactionItemLayout;
