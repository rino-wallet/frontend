import React, { FC, ReactChild } from "react";

interface Props {
  timestamp: ReactChild;
  author: ReactChild;
  action: ReactChild;
  ipAddress: ReactChild;
  country: ReactChild;
  userAgent: ReactChild;
}

const WalletActivityItemLayout: FC<Props> = ({
  timestamp, author, action, ipAddress, country, userAgent,
}) => (
  <div
    className="flex md:items-center py-3 px-10 flex-wrap"
    data-qa-selector="account-activity"
  >
    <div className="w-1/2 md:w-2/12 md:pr-1 order-2 md:order-1 text-right md:text-left">
      {timestamp}
    </div>

    <div
      className="w-1/2 md:w-2/12 md:px-1 order-1 md:order-2 md:font-normal font-bold"
    >
      {action}
    </div>

    <div className="w-full md:w-2/12 md:px-1 order-3">
      {author}
    </div>

    <div className="w-full md:w-2/12 md:px-1 md:text-center order-4">
      {ipAddress}
    </div>

    <div className="w-full md:w-2/12 md:px-1 md:text-center order-5">
      {country}
    </div>

    <div className="w-full md:w-2/12 md:px-1 order-6">
      {userAgent}
    </div>
  </div>
);

export default WalletActivityItemLayout;
