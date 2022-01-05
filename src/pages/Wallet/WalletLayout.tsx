import React, { ReactNode } from "react";
import { useHistory, generatePath, Link } from "react-router-dom";
import { Button, Tabs, Placeholder } from "../../components"
import { Wallet } from "../../types";
import { getWalletColor, piconeroToMonero } from "../../utils";
import routes from "../../router/routes";

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
  const history = useHistory();
  const gradient = getWalletColor(id);
  return (
    <section className="-m-5">
      <div className={`${gradient} h-5`} />
      <header className="bg-custom-pink-100 border border-custom-pink-200 w-full p-5">
        <div className="flex items-start space-x-5 mb-6">
          <div className="flex-shrink-0 mt-1">
            <Button
              name="back-button"
              onClick={(): void => { history.push(routes.wallets); }}
              rounded
            >
              <div className="w-5 h-5 leading-5 text-2xl">&#x3c;</div>
            </Button>
          </div>
          <div className="min-w-0 w-full">
            <div
              data-qa-selector="wallet-name"
              className="text-sm w-full text-secondary uppercase mb-2 h-5 whitespace-nowrap overflow-hidden overflow-ellipsis"
            >
              {wallet ? wallet.name : <div className="w-36"><Placeholder /></div>}
            </div>
            <div className="text-2xl h-5">
              {
                wallet ? (
                  <span>
                    <span data-qa-selector="wallet-balance">{piconeroToMonero(wallet?.balance || 0)}</span>
                    {" "}
                    XMR
                  </span>
                ) : <div className="w-52"><Placeholder /></div>
              }
            </div>
            <div className="text-xs h-3 mt-2 text-secondary">
              {
                wallet ? <span>Unlocked: <span data-qa-selector="wallet-unlocked-balance">{piconeroToMonero(wallet?.unlockedBalance || 0)}</span> XMR</span> : <div className="w-36"><Placeholder /></div>
              }
            </div>
          </div>
        </div>
        <div className="flex justify-between space-x-5">
          <Link className="block flex-1" to={`${generatePath(routes.wallet, { id })}/send`}>
            <Button size={Button.size.MEDIUM} disabled={!wallet?.unlockedBalance} name="button-send" block>Send</Button>
          </Link>
          <Link className="block flex-1" to={`${generatePath(routes.wallet, { id })}/receive`}>
            <Button size={Button.size.MEDIUM} name="button-receive" block>Receive</Button>
          </Link>
        </div>
      </header>
      <Tabs
        tabs={[
          {
            value: 0,
            text: "Transactions",
          },
          // {
          //   value: 1,
          //   text: "Users",
          // },
          {
            value: 2,
            text: "Settings",
          }
        ]}
        activeTab={tabsMap[tab]}
        onChange={(value): void => {
          history.push(`${generatePath(routes.wallet, { id })}/${tabsMap[value]}`);
        }}
      >
        {children}
      </Tabs> 
    </section>
  )
}