import React from "react";

interface Props {
  role?: React.ReactChild;
  email: React.ReactChild;
  action: React.ReactChild;
}

const WalletMemberLayout: React.FC<Props > = ({ role= null, email, action }) => {
  return (
    <div className="flex flex-wrap items-center py-3 px-10 leading-none text-gray-500" data-qa-selector="transaction">
      {role ? (
        <div className="w-1/2 order-1 mb-3 md:w-1/5 md:pr-2 md:mb-0">
          {role}
        </div>
      ) : null
      }
      <div className="flex-1 order-2 mb-3 md:w-1/5 md:order-4 md:pl-2 md:mb-0">
        {email}
      </div>
      <div className="order-2 mb-3 text-right theme-text-secondary md:order-4 md:pl-2 md:mb-0">
        {action}
      </div>
    </div>
  )
}

export default WalletMemberLayout;
