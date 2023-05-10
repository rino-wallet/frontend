import React, { useState } from "react";
import { format } from "date-fns";
import { useTranslation } from "react-i18next";
import { LocalWalletData, NewWalletPDFData, PersistWalletThunkPayload } from "../../types";
import SecurityTab from "./SecurityTab";
import WalletNameTab from "./WalletNameTab";
import { PageTemplate } from "../../modules/index";
import { Tabs } from "../../components";
import routes from "../../router/routes";

interface Props {
  onLeavePage: () => void;
  createMultisigWallet: (data: { name: string }) => Promise<{ userWallet: LocalWalletData; backupWallet: LocalWalletData; walletId: string; walletPassword: string }>;
  persistWallet: (data: PersistWalletThunkPayload) => Promise<void>;
  isKeypairSet: boolean;
  stage: string;
  username: string;
  isWalletCreating: boolean;
}

const NewWalletContainer: React.FC<Props> = ({
  onLeavePage, createMultisigWallet, username, persistWallet, isKeypairSet, stage, isWalletCreating,
}) => {
  const { t } = useTranslation();
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
    <PageTemplate title={isWalletCreated ? `${t("new.wallet.title")}: ${pdfData?.walletName}` : t("new.wallet.title")} backButtonRoute={!isWalletCreated ? routes.wallets : ""}>
      <div className="w-full">
        <div className="flex mb-5 m-auto">
          <Tabs
            tabs={[
              {
                value: 0,
                text: (
                  <div className="text-center">
                    <div className="text-2xl font-bold normal-case">{t("new.wallet.tab.create")}</div>
                  </div>
                ),
              },
              {
                value: 1,
                text: (
                  <div className="text-center">
                    <div className="text-2xl font-bold normal-case">{t("new.wallet.tab.download")}</div>
                  </div>
                ),
              },
            ]}
            activeTab={isWalletCreated ? 1 : 0}
          >
            <div className="w-full p-10 m-auto">
              {
                pdfData ? (
                  <SecurityTab
                    pdfData={pdfData}
                    walletId={walletId}
                    persistWallet={persistWallet}
                  />
                ) : (
                  <WalletNameTab
                    onLeavePage={onLeavePage}
                    isKeypairSet={isKeypairSet}
                    createNewWallet={createNewWallet}
                    isWalletCreating={isWalletCreating}
                    stage={stage}
                  />
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
