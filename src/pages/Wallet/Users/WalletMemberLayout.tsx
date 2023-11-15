import React, { FC, ReactChild } from "react";
import classNames from "classnames";
import { Icon } from "../../../components";

interface Props {
  role?: ReactChild;
  email: ReactChild;
  action: ReactChild;
  revoked?: boolean;
  is2FAEnabled?: boolean;
  activeApiKeys?: boolean;
}

const WalletMemberLayout: FC<Props> = ({
  role = null,
  email,
  action,
  revoked,
  is2FAEnabled,
  activeApiKeys,
}) => (
  <div
    className="flex flex-wrap items-center py-3 px-10 leading-none text-gray-500"
    data-qa-selector="wallet-member"
  >
    {role && (
      <div className="w-1/2 order-1 md:w-1/5 mb-3 md:mb-0 md:pr-2 md:mb-0">
        {role}
      </div>
    )}

    <div
      className={
        classNames(
          "flex-1 order-2 md:w-1/5 md:order-4 md:pl-2 md:mb-0 flex gap-4",
          { "opacity-50": revoked },
        )
      }
    >
      {email}

      {is2FAEnabled && (
        <Icon name="fa" title="This user has 2FA enabled" />
      )}

      {activeApiKeys && (
        <Icon name="api" title="This user has active API Keys" />
      )}
    </div>

    {!revoked && (
      <div
        className="order-2 text-right theme-text-secondary md:order-4 md:pl-2 md:mb-0"
      >
        {action}
      </div>
    )}
  </div>
);

export default WalletMemberLayout;
