import React, {useEffect, useState} from "react";
import { format } from "date-fns";
import { LocalWalletData, NewWalletPDFData } from "../../types";
import SecurityTab from "./SecurityTab";
import WalletNameTab from "./WalletNameTab";
import { PageTemplate } from "../../modules/index";
import { Tabs } from "../../components";
import routes from "../../router/routes";

function isSupported(): boolean {
  const ua = navigator.userAgent;
  if(/Android/i.test(ua) && /Chrome/i.test(ua)) {
    return false;
  }
  return true;
}
interface Props {
  createMultisigWallet: (data: { name: string }) => Promise<{ userWallet: LocalWalletData; backupWallet: LocalWalletData; walletId: string; walletPassword: string }>;
  persistWallet: (data: { id: string }) => Promise<void>;
  isKeypairSet: boolean;
  stage: string;
  username: string;
  isWalletCreating: boolean;
  setPreventNavigation: (value: boolean) => void;
}

const NewWalletContainer: React.FC<Props> = ({ createMultisigWallet, username, persistWallet, isKeypairSet, stage, isWalletCreating, setPreventNavigation }) => {
  const showWarning = !isSupported();
  const [pdfData, setPdfData] = useState<NewWalletPDFData | null>(null)
  const [walletId, setWalletId] = useState<string>("");
  const isWalletCreated = !!pdfData;
  useEffect(() => {
    return (): void => {
      setPreventNavigation(false);
    };
  }, []);
  function createNewWallet(name: string): Promise<any> {
    setPreventNavigation(true);
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
        setPreventNavigation(false);
        throw(err);
      });
  }
  return (
    <PageTemplate title={isWalletCreated ? `New Wallet: ${pdfData?.walletName}` : "New Wallet"} backButtonRoute={!isWalletCreated ? routes.wallets : ""}>
      <div className="w-full">
        {
          showWarning && (
            <div className="border-2 theme-border-error theme-text-error theme-bg-panel rounded-xl p-5 mb-5 text-center">
              Your browser is not supported, yet, but we are working on it.
              We recommend using a desktop computer to create a wallet,
              or switching to another browser on your device (Firefox has a higher chance of working).
            </div>
          )
        }
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
  )
}

export default NewWalletContainer;
