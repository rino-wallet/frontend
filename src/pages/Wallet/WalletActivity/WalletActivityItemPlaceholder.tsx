import React, { FC } from "react";

import { Placeholder } from "../../../components";
import WalletActivityItemLayout from "./WalletActivityItemLayout";

const WalletActivityItemPlaceholder: FC = () => {
  const placeholder = (
    <div className="w-1/2 inline-block">
      <Placeholder />
    </div>
  );

  return (
    <WalletActivityItemLayout
      timestamp={placeholder}
      action={placeholder}
      author={placeholder}
      ipAddress={placeholder}
      country={placeholder}
      userAgent={placeholder}
    />
  );
};

export default WalletActivityItemPlaceholder;
