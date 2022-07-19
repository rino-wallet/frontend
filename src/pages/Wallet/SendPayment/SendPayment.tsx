import React, { useEffect, useState } from "react";
import classNames from "classnames";
import { useNavigate, generatePath } from "react-router-dom";
import {
  Tabs, Check, Icon, Label,
} from "../../../components";
import { ReactComponent as IconUp } from "../arrow-up.svg";
import { Wallet } from "../../../types";
import routes from "../../../router/routes";
import { WalletPageTemplate } from "../WalletPageTemplate";
import TransactionForm from "./Send/TransactionForm";
import walletInstance from "../../../wallet";
import Exchange from "./Exchange";

interface Props {
  wallet: Wallet | null;
  walletId: string;
}

const SendPayment: React.FC<Props> = ({
  wallet,
  walletId,
}) => {
  const navigate = useNavigate();
  const [isExchange, setIsExchange] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  useEffect(() => () => {
    walletInstance.closeWallet();
  }, []);
  return (
    <WalletPageTemplate
      showNameInBox
      title="Send Payment"
      goBackCallback={(): void => { navigate(`${generatePath(routes.wallet, { id: walletId })}/transactions`); }}
      id={walletId}
      wallet={wallet}
    >
      <div className="w-full">
        <div className="flex mb-5 m-auto md:mx-12">
          <Tabs
            tabs={isExchange ? ([
              {
                value: 0,
                text: (
                  <div className="text-center flex">
                    <div className="mr-4">{activeTab > 0 ? <Check size={24} /> : null}</div>
                    <div>
                      <div className="font-lato text-sm text-center md:text-left mb-1">Step 1/3</div>
                      <div className="text-2xl font-bold normal-case">
                        Details
                      </div>
                    </div>
                  </div>
                ),
              },
              {
                value: 1,
                text: (
                  <div className="text-center flex">
                    <div className="mr-4">{activeTab > 1 ? <Check size={24} /> : null}</div>
                    <div>
                      <div className="font-lato text-sm text-center md:text-left mb-1">Step 2/3</div>
                      <div className="text-2xl font-bold normal-case">Confirmation</div>
                    </div>
                  </div>
                ),
              },
              {
                value: 2,
                text: (
                  <div className="text-center">
                    <div>
                      <div className="font-lato text-sm text-center md:text-left mb-1">Step 3/3</div>
                      <div className="text-2xl font-bold normal-case">Payment</div>
                    </div>
                  </div>
                ),
              },
            ]) : ([
              {
                value: 0,
                text: (
                  <div className="text-center flex">
                    <div className="mr-4">{activeTab === 1 ? <Check size={24} /> : null}</div>
                    <div>
                      <div className="font-lato text-sm text-center md:text-left mb-1">Step 1/2</div>
                      <div className="text-2xl font-bold normal-case">Set the details</div>
                    </div>

                  </div>
                ),
              },
              {
                value: 1,
                text: (
                  <div className="text-center">
                    <div>
                      <div className="font-lato text-sm text-center md:text-left mb-1">Step 2/2</div>
                      <div className="text-2xl font-bold normal-case">Payment confirmation</div>
                    </div>
                  </div>
                ),
              },
            ])}
            activeTab={activeTab}
          >
            <div className="w-full p-5 md:p-10 m-auto">
              {
                activeTab === 0 && (
                  <div className="mb-10 md:mb-8 m-auto md:w-3/4">
                    <Label label="" inline>
                      <div className="text-center md:text-left">
                        <div className="whitespace-nowrap text-sm py-2 border rounded-full bg-white theme-text theme-control-border inline">
                          <button
                            type="button"
                            name="send-btn"
                            className={classNames("w-1/2 text-sm px-5 md:px-10 py-2 rounded-full theme-text inline-block cursor-pointer", { "theme-control-primary-gradient-light text-white border-transparent": !isExchange })}
                            onClick={(): void => setIsExchange(false)}
                          >
                            <IconUp className={classNames("inline-block h-3.5 w-3.5 fill-black mr-1", { "fill-white": !isExchange })} />
                            {" "}
                            SEND
                          </button>
                          <button
                            type="button"
                            name="exchange-btn"
                            className={classNames("w-1/2 text-sm px-5 md:px-10 py-2 rounded-full theme-text inline-block cursor-pointer", { "theme-control-primary-gradient-light text-white border-transparent": isExchange })}
                            onClick={(): void => setIsExchange(true)}
                          >
                            <Icon name="refresh" className={classNames("inline-block h-3.5 w-3.5 fill-black mr-1", { "fill-white": isExchange })} />
                            {" "}
                            EXCHANGE
                          </button>
                        </div>
                      </div>
                    </Label>
                  </div>
                )
              }
              {
                isExchange ? (
                  <div>
                    {
                      (process.env.REACT_APP_ENABLE_API_MOCKS === "true" || process.env.REACT_APP_ENV === "production") ? (
                        <Exchange activeTab={activeTab} setActiveTab={setActiveTab} walletId={walletId} />
                      ) : (
                        <div className="m-auto md:w-3/4">
                          <Label label="" inline>
                            <div className="mt-10 theme-text-secondary">Feature is enabled on mainnet, only.</div>
                          </Label>
                        </div>
                      )
                    }
                  </div>
                ) : (
                  <TransactionForm setActiveTab={setActiveTab} walletId={walletId} />
                )
              }
            </div>
          </Tabs>
        </div>
      </div>
    </WalletPageTemplate>
  );
};

export default SendPayment;
