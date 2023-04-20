import React from "react";

interface Props {
  amount: React.ReactChild;
  action: React.ReactChild;
  timestamp: React.ReactChild;
  submitedBy: React.ReactChild;
  status?: React.ReactChild;
}

const TransactionItemLayout: React.FC<Props> = ({
  amount, action, timestamp, submitedBy, status,
}) => (
  <div className="flex flex-wrap items-center py-3 px-10 leading-none" data-qa-selector="transaction">
    <div className="w-1/2 order-1 mb-3 lg:w-1/6 lg:pr-2 lg:mb-0">
      {amount}
    </div>
    <div className={`${status ? "order-5" : "order-4"} mt-4 lg:mt-0 text-right w-full mb-3 lg:w-1/4 flex-1 lg:mb-0`}>
      {action}
    </div>
    <div className={`w-1/2 ${status ? "flex-1" : "flex-none"} order-3 lg:w-1/5 lg:px-2 lg:order-2`}>
      {timestamp}
    </div>
    <div className="w-1/2 text-right lg:text-left order-2 lg:w-1/4 lg:px-2 lg:order-3">
      {submitedBy}
    </div>
    {status
      && (
      <div className="w-1/2 text-left order-2 lg:order-4 lg:w-1/5">
        {status}
      </div>
      )}
  </div>
);

export default TransactionItemLayout;
