import React, { ReactNode } from "react";
import { useNavigate, generatePath } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Tabs } from "../../components";
import { PublicWallet, Wallet } from "../../types";
import routes from "../../router/routes";
import { WalletPageTemplate } from "./WalletPageTemplate";
import { useAccountType, useSelector, useRequireApprovers } from "../../hooks";
import {
  selectors,
} from "../../store/walletShareRequestListSlice";
import {
  selectors as pendingTransfersSelectors,
} from "../../store/pendingTransfersSlice";
import { checkAccessLevel } from "../../utils";
import { selectors as sessionSelectors } from "../../store/sessionSlice";
import { selectors as walletSelectors } from "../../store/walletSlice";
import { IconName } from "../../components/Icon";
import { ApprovalsBanner } from "../../components/ApprovalsBanner";

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
  const { t } = useTranslation();
  const currentWallet = useSelector(walletSelectors.getWallet);
  const pendingTransfers = useSelector(pendingTransfersSelectors.getEntities);
  const navigate = useNavigate();
  const walletShareRequests = useSelector(selectors.getWalletShareRequests);
  const user = useSelector(sessionSelectors.getUser);
  const accessLevel = checkAccessLevel(user, currentWallet);
  const { features } = useAccountType();
  const requireApprovers = useRequireApprovers();

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
        <ApprovalsBanner className="mb-12" />
        <Tabs
          tabs={[
            {
              value: 0,
              text: t("wallet.tab.transactions"),
            },
            ...(features?.approvals ? [{
              value: 3,
              text: t("wallet.tab.approvals"),
              notification: pendingTransfers.length,
            }] : []),
            {
              value: 1,
              text: t("wallet.tab.users"),
              notification: walletShareRequests.length,
            },
            ...(!viewOnly ? [{
              value: 2,
              text: t("wallet.tab.settings"),
              icon: requireApprovers ? "info" as IconName : undefined,
            }] : []),
          ]}
          activeTab={tabsMap[tab]}
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
