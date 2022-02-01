import React from "react";
import { Placeholder } from "../../../components";
import WalletMemberLayout from "./WalletMemberLayout"

const WalletMemberPlaceholder: React.FC = () => {
  return (
    <WalletMemberLayout
      role={(
        <div className="w-1/2 inline-block">
          <Placeholder />
        </div>
      )}
      email={(
        <div className="w-1/2 inline-block">
          <Placeholder />
        </div>
      )}
      action={(
        <div className="w-1/2 inline-block">
          <Placeholder />
        </div>
      )}
    />
  )
}

export default WalletMemberPlaceholder;
