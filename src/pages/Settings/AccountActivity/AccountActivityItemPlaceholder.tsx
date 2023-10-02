import React, { FC } from "react";

import { Placeholder } from "../../../components";
import AccountActivityItemLayout from "./AccountActivityItemLayout";

const AccountActivityItemPlaceholder: FC = () => {
  const placeholder = (
    <div className="w-1/2 inline-block">
      <Placeholder />
    </div>
  );

  return (
    <AccountActivityItemLayout
      timestamp={placeholder}
      action={placeholder}
      ipAddress={placeholder}
      country={placeholder}
      userAgent={placeholder}
    />
  );
};

export default AccountActivityItemPlaceholder;
