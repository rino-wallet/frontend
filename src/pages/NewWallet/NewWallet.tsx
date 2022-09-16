import React, { useState } from "react";
import { format } from "date-fns";
import { LocalWalletData, NewWalletPDFData, PersistWalletThunkPayload } from "../../types";
import SecurityTab from "./SecurityTab";
import WalletNameTab from "./WalletNameTab";
import { PageTemplate } from "../../modules/index";
import { Tabs } from "../../components";
import routes from "../../router/routes";

interface Props {
  createMultisigWallet: (data: { name: string }) => Promise<{ userWallet: LocalWalletData; backupWallet: LocalWalletData; walletId: string; walletPassword: string }>;
  persistWallet: (data: PersistWalletThunkPayload) => Promise<void>;
  isKeypairSet: boolean;
  stage: string;
  username: string;
  isWalletCreating: boolean;
}

const NewWalletContainer: React.FC<Props> = ({
  createMultisigWallet, username, persistWallet, isKeypairSet, stage, isWalletCreating,
}) => {
  const [pdfData, setPdfData] = useState<NewWalletPDFData | null>(null);
  const [walletId, setWalletId] = useState<string>("");
  const isWalletCreated = !!pdfData;
  function createNewWallet(name: string): Promise<any> {
    return createMultisigWallet({ name })
      .then((actionResponse) => {
        setWalletId(actionResponse.walletId);
        setPdfData({
          username,
          password: actionResponse.walletPassword,
          address: actionResponse.userWallet.address,
          walletName: name,
          userWalletSeed: actionResponse.userWallet.multisigSeed,
          backupWalletSeed: actionResponse.backupWallet.multisigSeed,
          checkString: Math.floor(100000 + Math.random() * 900000).toString(),
          date: format(new Date(), "yyyy-MM-dd"),
        });
        return actionResponse;
      }, (err) => {
        throw (err);
      });
  }
  return (
    <PageTemplate title={isWalletCreated ? `New Wallet: ${pdfData?.walletName}` : "New Wallet"} backButtonRoute={!isWalletCreated ? routes.wallets : ""}>
      <div className="w-full">
        <div className="flex mb-5 m-auto">
          <Tabs
            tabs={[
              {
                value: 0,
                text: (
                  <div className="text-center">
                    <div className="text-2xl font-bold normal-case">1. Create Wallet</div>
                  </div>
                ),
              },
              {
                value: 1,
                text: (
                  <div className="text-center">
                    <div className="text-2xl font-bold normal-case">2. Download and Store Wallet Recovery Document</div>
                  </div>
                ),
              },
            ]}
            activeTab={isWalletCreated ? 1 : 0}
          >
            <div className="w-full p-10 m-auto">
              {
                pdfData ? (
                  <SecurityTab pdfData={pdfData} walletId={walletId} persistWallet={persistWallet} />
                ) : (
                  <WalletNameTab isKeypairSet={isKeypairSet} createNewWallet={createNewWallet} isWalletCreating={isWalletCreating} stage={stage} />
                )
              }
            </div>
          </Tabs>
        </div>
      </div>
    </PageTemplate>
  );
};

export default NewWalletContainer;
