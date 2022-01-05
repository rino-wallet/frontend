import React, { useState } from "react";
import classNames from "classnames";
import { LocalWalletData, NewWalletPDFData } from "../../types";
import { defaultWalletPassword } from "../../constants";
import SecurityTab from "./SecurityTab";
import WalletNameTab from "./WalletNameTab";
import { PageTemplate } from "../../modules/index";
import CreatingWallet from "./CreatingWallet";
import routes from "../../router/routes";

interface Props {
  createMultisigWallet: (data: { name: string }) => Promise<{ userWallet: LocalWalletData, backupWallet: LocalWalletData, walletId: string }>;
  isKeypairSet: boolean;
  stage: string;
  isWalletCreating: boolean;
}

const NewWalletContainer: React.FC<Props> = ({ createMultisigWallet, isKeypairSet, stage, isWalletCreating }) => {
  const [pdfData, setPdfData] = useState<NewWalletPDFData | null>(null)
  const [walletId, setWalletId] = useState<string>("");
  const isWalletCreated = !!pdfData;
  function createNewWallet(name: string): Promise<any> {
    return createMultisigWallet({ name })
      .then((actionResponse) => {
        setWalletId(actionResponse.walletId);
        setPdfData({
          password: defaultWalletPassword,
          walletName: name,
          userWalletKeyHex: actionResponse.userWallet.keyHex,
          userWalletKeyB64: actionResponse.userWallet.base64Key,
          userWalletAddress: actionResponse.userWallet.address,
          backupWalletKeyHex: actionResponse.backupWallet.keyHex,
          backupWalletKeyB64: actionResponse.backupWallet.base64Key,
          backupWalletAddress: actionResponse.backupWallet.address,
        });
        return actionResponse;
      }, (err) => {
        throw(err);
      });
  }
  return (
    <PageTemplate title="New Wallet" backButtonRoute={!isWalletCreated ? routes.wallets : ""}>
      <div className="flex mb-5">
        <div id="wallet-name-tab-title" className={classNames("flex-1 uppercase", { "text-secondary": isWalletCreated })}>1. Wallet Name</div>
        <div id="security-tab-title" className={classNames("flex-1 uppercase", { "text-secondary": !isWalletCreated })}>2. Security</div>
      </div>
      <div>
        {
          pdfData ? (
            <SecurityTab pdfData={pdfData} walletId={walletId} />
          ) : (
            <WalletNameTab isKeypairSet={isKeypairSet} createNewWallet={createNewWallet} />
          )
        }
      </div>
      {
        isWalletCreating && (
          <CreatingWallet stage={stage} />
        )
      }
    </PageTemplate>
  )
}

export default NewWalletContainer;
