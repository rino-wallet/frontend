import React, { ReactNode, useState } from "react";
import { generatePath, Link } from "react-router-dom";
import classNames from "classnames";
import { useTranslation } from "react-i18next";
import { piconeroToMonero, getWalletColor } from "../../utils";
import routes from "../../router/routes";
import {
  Button, Placeholder, FormatNumber, Tooltip, Icon, WalletRole,
} from "../../components";
import {
  AccessLevel,
  PublicWallet,
  Wallet,
} from "../../types";
import {
  fetchWalletDetails as fetchPublicWalletDetailsThunk,
} from "../../store/publicWalletSlice";
import {
  useIsMobile, useQuery, useThunkActionCreator, useSelector, useAccountType,
} from "../../hooks";
import { fetchWalletDetails as fetchWalletDetailsThunk } from "../../store/walletSlice";
import { fetchWalletShareRequests as fetchWalletShareRequestsThunk } from "../../store/walletShareRequestListSlice";
import { selectors } from "../../store/sessionSlice";
import { fetchWalletTransactions as fetchWalletTransactionsThunk } from "../../store/transactionListSlice";
import { fetchWalletTransactions as fetchPublicWalletTransactionsThunk } from "../../store/publicWalletTransactionListSlice";
import {
  selectors as pendingTransfersSelectors,
} from "../../store/pendingTransfersSlice";
import { BalanceDetails } from "./WalletPageBalanceDetails";
import { accessLevels } from "../../constants";

const WalletPlaceholder: React.FC = () => (
  <div className="flex-1 min-w-0 text-left">
    <div className="w-1/4 mb-3 mt-3">
      <Placeholder />
    </div>
    <div className="mb-3 w-3/4">
      <Placeholder />
    </div>
  </div>
);

interface Props {
  goBackCallback?: () => void;
  children?: ReactNode;
  wallet: Wallet | PublicWallet | null;
  title?: string;
  id: string;
  loading?: boolean;
  showActions?: boolean;
  viewOnly?: boolean;
  isPublicWallet?: boolean;
  showNameInBox?: boolean;
}

export const WalletPageTemplate: React.FC<Props> = ({
  children,
  goBackCallback,
  wallet,
  id,
  loading,
  title,
  showActions,
  viewOnly,
  isPublicWallet,
  showNameInBox,
}) => {
  const { t } = useTranslation();
  const { features } = useAccountType();
  const fetchWalletDetails = isPublicWallet ? useThunkActionCreator(fetchPublicWalletDetailsThunk) : useThunkActionCreator(fetchWalletDetailsThunk);
  const fetchWalletTransactions = isPublicWallet ? useThunkActionCreator(fetchPublicWalletTransactionsThunk) : useThunkActionCreator(fetchWalletTransactionsThunk);
  const fetchWalletShareRequests = useThunkActionCreator(fetchWalletShareRequestsThunk);
  const pendingTransfers = useSelector(pendingTransfersSelectors.getEntities);
  const user = useSelector(selectors.getUser);
  const query = useQuery();
  const page = parseInt(query.get("page"), 10) || 1;
  const [isRefreshing, setIsRefreshing] = useState(false);
  const gradient = getWalletColor();
  const isMobile = useIsMobile();
  const userCanCreateTransaction = wallet?.requires2Fa ? user?.is2FaEnabled : true;
  const insufficientBalance = !parseFloat(wallet?.unlockedBalance || "0");
  const sendButtonDisabled = !userCanCreateTransaction || viewOnly;
  const role = isPublicWallet ? null : (wallet as Wallet)?.members?.find((member) => member.user === user.email)?.accessLevel as AccessLevel;
  return (
    <section>
      <header className="flex items-center mb-8 w-full relative hidden md:flex">
        <div className="mr-6">
          {
            typeof goBackCallback === "function" && (
              <Button
                size={Button.size.BIG}
                onClick={goBackCallback}
                name="back-button"
                icon
              >
                <div className="w-5 h-5 leading-5 text-2xl theme-text-secondary">&#x3c;</div>
              </Button>
            )
          }
        </div>
        <h1 className="text-4xl font-bold flex-1 font-catamaran min-w-0 overflow-ellipsis overflow-hidden whitespace-nowrap" data-qa-selector="wallet-name">
          {title || wallet?.name}
          <span>
            {isPublicWallet ? <p className="text-lg font-normal theme-text-secondary">Public read-only view of this wallet.</p> : null}
          </span>
        </h1>
        {
          (showActions && !isPublicWallet) && (
            <div>
              <div className="flex justify-center space-x-5 md:justify-end">
                {
                  sendButtonDisabled ? (
                    <div>
                      <Tooltip
                        content={`
                            ${!userCanCreateTransaction ? "This wallet requires 2FA for spending. " : ""}
                            ${insufficientBalance && !viewOnly ? "Insufficient balance." : ""}
                            ${viewOnly ? "This functionality is not available in read-only wallets." : ""}
                          `}
                      >
                        <Button size={Button.size.BIG} disabled={sendButtonDisabled} name="button-send">
                          <div className="flex space-x-3 items-center">
                            <div>
                              {t("common.send")}
                              {
                                features?.exchange && (
                                  <span className="hidden md:inline">
                                    {" "}
                                    /
                                    {" "}
                                    {t("common.exchange")}
                                  </span>
                                )
                              }
                            </div>
                          </div>
                        </Button>
                      </Tooltip>
                    </div>
                  ) : (
                    <Link to={`${generatePath(routes.wallet, { id })}/send`}>
                      <Button size={Button.size.BIG} name="button-send">
                        <div className="flex space-x-3 items-center">
                          <div>
                            {t("common.send")}
                            {
                                features?.exchange && (
                                  <span className="hidden md:inline">
                                    {" "}
                                    /
                                    {" "}
                                    {t("common.exchange")}
                                  </span>
                                )
                              }
                          </div>
                        </div>
                      </Button>
                    </Link>
                  )
                }
                <Link to={`${generatePath(isPublicWallet ? routes.publicWallet : routes.wallet, { id })}/receive`}>
                  <Button size={Button.size.BIG} name="button-receive">
                    <div className="flex space-x-3 items-center">
                      <span>{t("common.receive")}</span>
                    </div>
                  </Button>
                </Link>
              </div>
            </div>
          )
        }
      </header>
      <div className={classNames("theme-bg-panel theme-border border rounded-large mb-8 md:flex md:items-stretch", gradient.light)}>
        <div className={classNames("-my-px -mx-px flex-shrink-0 w-full h-5 md:w-16 md:h-auto md:rounded-large md:rounded-tr-none", gradient.main)} />
        <div className="flex flex-1 min-w-0 px-5 py-5 items-stretch md:px-10 md:py-8">
          {
            loading ? <WalletPlaceholder /> : (
              <div className="flex flex-col justify-center flex-1 min-w-0 text-left">
                <header className="flex items-center mb-8 w-full relative md:hidden">
                  {
                    typeof goBackCallback === "function" && (
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
                    )
                  }
                  <h1 className="text-4xl font-bold flex-1 font-catamaran min-w-0 overflow-ellipsis overflow-hidden whitespace-nowrap" data-qa-selector="wallet-name-mobile">
                    {title || wallet?.name}
                  </h1>
                </header>
                <div className="items-center justify-between flex">
                  <div className="items-center justify-between md:flex max-w-full grow min-w-0">
                    <div className="lg:flex items-end max-w-full">
                      <div>
                        <div className="leading-none text-base uppercase mb-4" data-qa-selector="wallet-name">
                          <div className="flex items-center">
                            {role && <WalletRole small className="mr-1" role={role} />}
                            {" "}
                            <span className="overflow-hidden whitespace-nowrap overflow-ellipsis">
                              {showNameInBox ? wallet?.name : t("common.balance")}
                            </span>
                          </div>
                        </div>
                        <div className="md:flex items-start flex-col">
                          <div className="whitespace-nowrap text-xl font-bold md:text-3xl mr-3">
                            <span data-qa-selector="wallet-balance">
                              {wallet?.balance ? <FormatNumber value={piconeroToMonero(wallet?.balance || 0)} /> : "0.0"}
                            </span>
                            {" "}
                            XMR
                          </div>
                          {wallet?.unlockedBalance !== wallet?.balance && <BalanceDetails wallet={wallet} />}
                        </div>
                      </div>
                    </div>
                  </div>
                  {
                    pendingTransfers.length > 0 && (
                      <Link to={`${generatePath(routes.wallet, { id })}/approvals`}>
                        <Button className="mr-4 hidden md:block">
                          {pendingTransfers.length}
                          {" "}
                          {t("wallet.pending.transactions", { count: pendingTransfers.length })}
                        </Button>
                      </Link>
                    )
                  }
                  <Button
                    size={Button.size.MEDIUM}
                    onClick={(): void => {
                      setIsRefreshing(true);
                      const requests = [];
                      requests.push(fetchWalletTransactions({ walletId: id, page }));
                      requests.push(fetchWalletDetails({ id }));
                      if (!isPublicWallet) {
                        fetchWalletShareRequests({ walletId: id, page: 1 });
                      }
                      // @ts-ignore
                      Promise.all(requests).finally(() => {
                        setIsRefreshing(false);
                      });
                    }}
                    name="wallet-refresh"
                    className="float-right shrink-0 flex-[0_auto]"
                    icon
                  >
                    <div className={classNames("leading-0 origin-center", { "animate-spin": isRefreshing })}>
                      <Icon name="refresh" />
                    </div>
                  </Button>
                </div>
                {
                  (showActions && !isPublicWallet) && (
                    <div className={`flex space-x-5 mt-8 md:hidden ${sendButtonDisabled ? "pointer-events-none" : ""}`}>
                      <Link className="block w-1/2" to={`${generatePath(routes.wallet, { id })}/send`}>
                        <Button size={Button.size.BIG} disabled={sendButtonDisabled} name="button-send" block={isMobile}>
                          <div className="flex space-x-3 items-center">
                            <div>
                              {t("common.send")}
                              <span className="hidden md:inline">
                                {" "}
                                /
                                {" "}
                                {t("common.exchange")}
                              </span>
                            </div>
                          </div>
                        </Button>
                      </Link>
                      {role !== accessLevels.approver.value
                        ? (
                          <Link className="block w-1/2" to={`${generatePath(routes.wallet, { id })}/receive`}>
                            <Button size={Button.size.BIG} name="button-receive" block={isMobile}>
                              <div className="flex space-x-3 items-center">
                                <div>{t("common.receive")}</div>
                              </div>
                            </Button>
                          </Link>
                        )
                        : (
                          <div className="block w-1/2">
                            <Button disabled size={Button.size.BIG} name="button-receive" block={isMobile}>
                              <div className="flex space-x-3 items-center">
                                <div>{t("common.receive")}</div>
                              </div>
                            </Button>
                          </div>
                        )}
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
  );
};
