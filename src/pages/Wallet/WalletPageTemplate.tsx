import React, { ReactNode, useState } from "react";
import { generatePath, Link } from "react-router-dom";
import classNames from "classnames";
import { piconeroToMonero, getWalletColor } from "../../utils";
import routes from "../../router/routes";
import { Button, Placeholder, FormatNumber, Tooltip, Icon } from "../../components"
import {
  FetchWalletDetailsPayload,
  FetchWalletDetailsResponse,
  FetchWalletTransactionsResponse, FetchWalletTransactionsThunkPayload,
  Wallet
} from "../../types";
import { useIsMobile, useQuery, useThunkActionCreator, useSelector } from "../../hooks";
import { ReactComponent as IconUp } from "./arrow-up.svg";
import { ReactComponent as IconDown } from "../../assets/arrow-down.svg";
import { fetchWalletDetails as fetchWalletDetailsThunk } from "../../store/walletSlice";
import { selectors } from "../../store/sessionSlice";
import { fetchWalletTransactions as fetchWalletTransactionsThunk } from "../../store/transactionListSlice";

const WalletPlaceholder: React.FC = () => (
  <div className="flex-1 min-w-0 text-left">
    <div className="w-1/4 mb-3 mt-3">
      <Placeholder />
    </div>
    <div className="mb-3 w-3/4">
      <Placeholder />
    </div>
  </div>
)

interface Props {
  goBackCallback?: () => void;
  children?: ReactNode;
  wallet: Wallet | null;
  title?: string;
  id: string;
  loading?: boolean;
  showActions?: boolean;
}

export const WalletPageTemplate: React.FC<Props> = ({
  children,
  goBackCallback,
  wallet,
  id,
  loading,
  title,
  showActions,
}) => {
  const fetchWalletDetails = useThunkActionCreator<FetchWalletDetailsResponse, FetchWalletDetailsPayload>(fetchWalletDetailsThunk);
  const fetchWalletTransactions = useThunkActionCreator<FetchWalletTransactionsResponse, FetchWalletTransactionsThunkPayload>(fetchWalletTransactionsThunk);
  const user = useSelector(selectors.getUser);
  const query = useQuery();
  const page = parseInt(query.get("page")) || 1;
  const [isRefreshing, setIsRefreshing] = useState(false);
  const gradient = getWalletColor();
  const isMobile = useIsMobile();
  const userCanCreateTransaction = wallet?.requires2Fa ? user?.is2FaEnabled : true;
  const insufficientBalance = !parseFloat(wallet?.unlockedBalance || "0");
  const sendButtonDisabled = !userCanCreateTransaction || insufficientBalance;
  return (
    <section>
      <header className="flex items-center mb-8 w-full relative hidden md:flex">
        <div className="mr-6">
          <Button
            size={Button.size.BIG}
            onClick={goBackCallback}
            name="back-button"
            icon
          >
            <div className="w-5 h-5 leading-5 text-2xl theme-text-secondary">&#x3c;</div>
          </Button>
        </div>
        <h1 className="text-4xl font-bold flex-1 font-catamaran min-w-0 overflow-ellipsis overflow-hidden whitespace-nowrap" data-qa-selector="wallet-name">
          {title || wallet?.name}
        </h1>
        {
          showActions && (
            <div>
              <div className="flex justify-center space-x-5 md:justify-end">
                {
                  sendButtonDisabled ? (
                    <div>
                      <Tooltip
                          content={`
                            ${!userCanCreateTransaction ? "This wallet requires 2FA for spending. " : ""}
                            ${insufficientBalance ? "Insufficient balance." : ""}
                          `}
                        >
                          <Button size={Button.size.BIG} disabled={sendButtonDisabled} name="button-send">
                            <div className="flex space-x-3 items-center"><IconUp /> <span>Send</span></div>
                          </Button>
                        </Tooltip>
                    </div>
                  ) : (
                    <Link to={`${generatePath(routes.wallet, { id })}/send`}>
                      <Button size={Button.size.BIG} name="button-send">
                        <div className="flex space-x-3 items-center"><IconUp /> <span>Send</span></div>
                      </Button>
                    </Link>
                  )
                }
                <Link to={`${generatePath(routes.wallet, { id })}/receive`}>
                  <Button size={Button.size.BIG} name="button-receive">
                    <div className="flex space-x-3 items-center">
                      <IconDown /> <span>Receive</span></div>
                  </Button>
                </Link>   
              </div>
            </div>
          )
        }
      </header>
      <div className={classNames("theme-bg-panel theme-border border rounded-3xl rounded-tl-none rounded-tr-none mb-8 md:flex md:items-stretch", gradient.light)}>
        <div className={classNames("-my-px -mx-px flex-shrink-0 w-full h-5 md:w-16 md:h-auto md:rounded-3xl md:rounded-tl-none", gradient.main)} />
        <div className="flex flex-1 min-w-0 px-5 py-5 items-stretch md:px-10 md:py-10">
          {
            loading ? <WalletPlaceholder /> : (
              <div className="flex flex-col justify-center flex-1 min-w-0 text-left">
                <header className="flex items-center mb-8 w-full relative md:hidden">
                  <div className="mr-6">
                    <Button
                      size={Button.size.MEDIUM}
                      onClick={goBackCallback}
                      name="back-button"
                      icon
                    >
                      <div className="w-5 h-5 leading-5 text-2xl theme-text-secondary">&#x3c;</div>
                    </Button>
                  </div>
                  <h1 className="text-4xl font-bold flex-1 font-catamaran min-w-0 overflow-ellipsis overflow-hidden whitespace-nowrap" data-qa-selector="wallet-name-mobile">
                    {title || wallet?.name}
                  </h1>
                </header>
                <div className="items-end justify-between flex">
                  <div className="items-end justify-between md:flex">
                    <div>
                    <div className="leading-none text-base uppercase whitespace-nowrap overflow-hidden overflow-ellipsis mb-4" data-qa-selector="wallet-name">
                      Balance
                    </div>
                      <div className="whitespace-nowrap text-xl font-bold md:text-3xl mr-1">
                        <span data-qa-selector="wallet-balance">
                          <FormatNumber value={piconeroToMonero(wallet?.balance || 0)} />
                        </span> XMR
                      </div>
                    </div>
                    {wallet?.unlockedBalance !== wallet?.balance ? (<div className="min-w-0" title="Unlocked">
                      <div
                        className="text-base whitespace-nowrap overflow-ellipsis overflow-hidden theme-text-secondary md:text-2xl">
                        (
                          
                          <span data-qa-selector="wallet-unlocked-balance"><FormatNumber value={piconeroToMonero(wallet?.unlockedBalance || 0)} /></span>
                          {" "}
                          <span>unlocked,</span>
                          {" "}
                          <span data-qa-selector="wallet-locked-balance"><FormatNumber value={piconeroToMonero(parseInt(wallet?.balance || "0") - parseInt(wallet?.unlockedBalance || "0"))} /></span>
                          {" "}
                          <span>locked</span>
                        )
                      </div>
                    </div>) : null
                    }
                  </div>
                  <Button
                      size={Button.size.MEDIUM}
                      onClick={(): void => {
                        setIsRefreshing(true);
                        fetchWalletTransactions({ walletId: id, page });
                        fetchWalletDetails({ id }).then((): void => { setTimeout((): void => setIsRefreshing(false), 300) });
                      }}
                      name="wallet-refresh"
                      className="float-right"
                      icon
                    >
                      <div className={classNames({ "animate-spin": isRefreshing })}>
                        <Icon name="refresh" />
                      </div>
                  </Button>
                </div>
                {
                  showActions && (
                    <div className="flex space-x-5 mt-8 md:hidden">
                      <Link className="block w-1/2" to={`${generatePath(routes.wallet, { id })}/send`}>
                        <Button size={Button.size.BIG} disabled={!wallet?.unlockedBalance} name="button-send" block={isMobile}>
                          <div className="flex space-x-3 items-center"><IconUp /> <span>Send</span></div>
                        </Button>
                      </Link>
                      <Link className="block w-1/2" to={`${generatePath(routes.wallet, { id })}/receive`}>
                        <Button size={Button.size.BIG} name="button-receive" block={isMobile}>
                          <div className="flex space-x-3 items-center"><IconDown /> <span>Receive</span></div>
                        </Button>
                      </Link>     
                    </div>
                  )
                }
              </div>
            )
          }
        </div>
      </div>
      {children}
    </section>
  )
}