import React, { ReactNode } from "react";
import { useNavigate, generatePath } from "react-router-dom";
import { Tabs } from "../../components"
import { Wallet } from "../../types";
import routes from "../../router/routes";
import { WalletPageTemplate } from "./WalletPageTemplate";

interface Props {
  wallet: Wallet | null;
  id: string;
  tab: "transactions" | "users" | "settings";
  children?: ReactNode;
}

// eslint-disable-next-line
enum tabsMap {
  transactions,
  users,
  settings,
}

export const WalletLayout: React.FC<Props> = ({ wallet, children, tab, id }) => {
  const navigate = useNavigate();
  return (
    <WalletPageTemplate
      wallet={wallet}
      id={id}
      goBackCallback={(): void => { navigate(routes.wallets); }}
      showActions
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
            {
              value: 2,
              text: "Settings",
            }
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
  )
}