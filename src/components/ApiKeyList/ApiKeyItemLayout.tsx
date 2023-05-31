import React from "react";

interface Props {
  name: React.ReactChild;
  id: React.ReactChild;
  expiry: React.ReactChild;
  createdAt: React.ReactChild;
  action?: React.ReactChild;
}

const ApiKeyItemLayout: React.FC<Props> = ({
  name, action, expiry, createdAt, id,
}) => (
  <div className="flex flex-wrap md:flex-nowrap items-center py-3 px-2 leading-none" data-qa-selector="transaction">
    <div className="w-1/2 md:w-1/3 order-1 mb-3 lg:w-1/5 lg:pr-2 md:mb-0">
      {name}
    </div>
    <div className="mt-4 lg:mt-0 text-right w-full mb-4 lg:w-1/4 flex-1 lg:mb-0 order-5">
      {action}
    </div>
    <div className="order-2 lg:w-1/5 w-1/3 lg:px-2">
      {id}
    </div>
    <div className="w-1/2 text-left lg:text-left order-2 lg:w-1/4 lg:px-2 lg:order-3">
      {createdAt}
    </div>
    <div className="w-1/2 text-left order-2 lg:w-1/4 lg:px-2 lg:order-3">
      {expiry}
    </div>
  </div>
);

export default ApiKeyItemLayout;
