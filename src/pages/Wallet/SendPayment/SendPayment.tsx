import React, {useEffect, useState} from "react";
import { useNavigate, generatePath } from "react-router-dom";
import { Tabs, Check } from "../../../components";
import { Wallet } from "../../../types";
import routes from "../../../router/routes";
import { WalletPageTemplate } from "../WalletPageTemplate";
import TransactionForm from "./TransactionForm";
import walletInstance from "../../../wallet";

interface Props {
  wallet: Wallet | null;
  walletId: string;
}

const SendPayment: React.FC<Props> = ({
  wallet,
  walletId,
}) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(0);
  useEffect(() => {
    return () => {
      walletInstance.closeWallet();
    }
  }, []);
  return (
    <WalletPageTemplate
      title={`Send funds from ${wallet?.name}`}
      goBackCallback={(): void => { navigate(`${generatePath(routes.wallet, { id: walletId })}/transactions`); }}
      id={walletId}
      wallet={wallet}
    >
      <div className="w-full">
        <div className="flex mb-5 m-auto md:mx-12">
          <Tabs
            tabs={[
              {
                value: 0,
                text: (
                  <div className="text-center flex">
                    <div className="mr-4">{activeTab == 1 ? <Check size={24} />: null}</div>
                    <div className="text-2xl font-bold normal-case">1. Set the details</div>
                  </div>
                ),
              },
              {
                value: 1,
                text: (
                  <div className="text-center">
                    <div className="text-2xl font-bold normal-case">2. Payment confirmation</div>
                  </div>
                ),
              },
            ]}
            activeTab={activeTab}
          >
            <div className="w-full p-10 m-auto">
              <TransactionForm setActiveTab={setActiveTab} walletId={walletId} />
            </div>
          </Tabs>
        </div>
      </div>
    </WalletPageTemplate>
  )
}

export default SendPayment;
