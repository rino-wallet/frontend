import classNames from "classnames";
import React from "react";

interface Props {
  role?: React.ReactChild;
  email: React.ReactChild;
  action: React.ReactChild;
  revoked?: boolean;
}

const WalletMemberLayout: React.FC<Props> = ({
  role = null, email, action, revoked,
}) => (
  <div className="flex flex-wrap items-center py-3 px-10 leading-none text-gray-500" data-qa-selector="wallet-member">
    {role ? (
      <div className="w-1/2 order-1 md:w-1/5 mb-3 md:mb-0 md:pr-2 md:mb-0">
        {role}
      </div>
    ) : null}
    <div className={classNames("flex-1 order-2 md:w-1/5 md:order-4 md:pl-2 md:mb-0", { "opacity-50": revoked })}>
      {email}
    </div>
    {
      !revoked && (
        <div className="order-2 text-right theme-text-secondary md:order-4 md:pl-2 md:mb-0">
          {action}
        </div>
      )
    }
  </div>
);

export default WalletMemberLayout;
