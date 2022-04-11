import React, { ReactNode } from "react";
import { useNavigate, generatePath } from "react-router-dom";
import { Tabs } from "../../components"
import { PublicWallet, Wallet } from "../../types";
import routes from "../../router/routes";
import { WalletPageTemplate } from "./WalletPageTemplate";
import { useSelector } from "../../hooks";
import {
  selectors,
} from "../../store/walletShareRequestListSlice";

interface Props {
  wallet: Wallet | PublicWallet | null;
  id: string;
  tab: "transactions" | "users" | "settings";
  children?: ReactNode;
  viewOnly?: boolean;
  isPublicWallet?: boolean;
  pendingShareRequestExist?: boolean;
}

// eslint-disable-next-line
enum tabsMap {
  transactions,
  users,
  settings,
}

export const WalletLayout: React.FC<Props> = ({ wallet, children, tab, id, viewOnly, isPublicWallet }) => {
  const navigate = useNavigate();
  const walletShareRequests = useSelector(selectors.getWalletShareRequests);
  return (
    <WalletPageTemplate
      wallet={wallet}
      viewOnly={viewOnly}
      id={id}
      goBackCallback={(): void => { navigate(routes.wallets); }}
      showActions
      isPublicWallet={isPublicWallet}
    >
      <div>
        <Tabs
          tabs={[
            {
              value: 0,
              text: "Transactions",
            },
            {
              value: 1,
              text: "Users",
            },
            ...(!viewOnly ? [{
              value: 2,
              text: "Settings",
            }]: [])
          ]}
          activeTab={tabsMap[tab]}
          tabsWithNotification={walletShareRequests.length > 0 ? [tabsMap["users"]] : []}
          onChange={(value): void => {
            navigate(`${generatePath(routes.wallet, { id })}/${tabsMap[value]}`);
          }}
        >
          <div className="mt-6">
            {children}
          </div>
        </Tabs> 
      </div>
    </WalletPageTemplate>
  )
}