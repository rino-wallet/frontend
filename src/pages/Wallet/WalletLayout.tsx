import React, { ReactNode } from "react";
import { useNavigate, generatePath } from "react-router-dom";
import { Tabs } from "../../components";
import { PublicWallet, Wallet } from "../../types";
import routes from "../../router/routes";
import { WalletPageTemplate } from "./WalletPageTemplate";
import { useAccountType, useSelector } from "../../hooks";
import {
  selectors,
} from "../../store/walletShareRequestListSlice";
import { checkAccessLevel } from "../../utils";
import { selectors as sessionSelectors } from "../../store/sessionSlice";
import { selectors as walletSelectors } from "../../store/walletSlice";

interface Props {
  wallet: Wallet | PublicWallet | null;
  id: string;
  tab: "transactions" | "approvals" | "users" | "settings";
  children?: ReactNode;
  viewOnly?: boolean;
  isPublicWallet?: boolean;
}

// eslint-disable-next-line
enum tabsMap {
  transactions,
  users,
  settings,
  approvals
}

export const WalletLayout: React.FC<Props> = ({
  wallet, children, tab, id, viewOnly, isPublicWallet,
}) => {
  const currentWallet = useSelector(walletSelectors.getWallet);
  const navigate = useNavigate();
  const walletShareRequests = useSelector(selectors.getWalletShareRequests);
  const user = useSelector(sessionSelectors.getUser);
  const accessLevel = checkAccessLevel(user, currentWallet);
  const { features } = useAccountType();
  return (
    <WalletPageTemplate
      wallet={wallet}
      viewOnly={viewOnly || accessLevel.isApprover()}
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
            ...(features?.approvals && currentWallet?.minApprovals > 0 ? [{
              value: 3,
              text: "Approvals",
            }] : []),
            {
              value: 1,
              text: "Users",
            },
            ...(!viewOnly ? [{
              value: 2,
              text: "Settings",
            }] : []),
          ]}
          activeTab={tabsMap[tab]}
          tabsWithNotification={walletShareRequests.length > 0 ? [tabsMap.users] : []}
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
  );
};
