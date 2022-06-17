import React, { useState } from "react";
import { generatePath, useNavigate } from "react-router-dom";
import { NewWalletPDFData } from "../../types";
import {
  Button, Checkbox, Input, Prompt,
} from "../../components";
import { createPDF } from "./createPDF";
import routes from "../../router/routes";
import { isMobile as isMobileClient } from "../../utils";

interface Props {
  persistWallet: (data: { id: string }) => Promise<void>;
  pdfData: NewWalletPDFData;
  walletId: string;
}

const SecurityTab: React.FC<Props> = ({ persistWallet, pdfData, walletId }) => {
  const isMobile = isMobileClient();
  const filename = `RINO Wallet Recovery Document - ${pdfData.walletName}`;
  const [errorMessage, setErrorMessage] = useState("");
  const [infoChecked, setInfoChecked] = useState(false);
  const [pdfDownloaded, setPdfDownloaded] = useState(false);
  const [confirmationCheckInputValue, setConfirmationCheckInputValue] = useState("");
  const codeIsWrong = !!confirmationCheckInputValue && confirmationCheckInputValue !== pdfData.checkString;
  const navigate = useNavigate();
  const onWalletFinish = (): void => {
    persistWallet({ id: walletId }).then(
      () => navigate(`${generatePath(routes.wallet, { id: walletId })}/transactions`),
    ).catch((err: any) => {
      if (err?.status === "network_error") {
        setErrorMessage("Failed to save your wallet, probably a network error. Please try to create a new wallet.");
      } else {
        setErrorMessage("Could not persist wallet.");
      }
    });
  };
  function createWalletRecoveryDocument({ downloadFile }: { downloadFile?: boolean }): Promise<void> {
    return createPDF({
      title: "Wallet Recovery Document",
      filename,
      totalPages: 4,
      downloadFile,
    }, pdfData)
      .then(() => {
        setPdfDownloaded(true);
      })
      .catch((error: any) => {
        setErrorMessage(error.message);
      });
  }
  return (
    <div id="security-tab-content">
      <Prompt
        when={confirmationCheckInputValue !== pdfData.checkString}
        title="Wallet creation in progress."
        message="If you interrupt the wallet creation process, no wallet is created."
      />
      <p className="mb-4 font-normal">
        Your RINO wallet will not be added to your account unless you
        download and store your Wallet Recovery Document.
      </p>
      <p className="mb-4 font-normal">
        IMPORTANT - Read and understand the following points before continuing.
      </p>
      <ul className="list-disc">
        <li className="ml-8 mb-4 ">
          <p className="mb-2 font-normal">
            This document is what gives you access to your wallet funds independently
            of RINO if for any reason you cannot or choose not to use the RINO service.
          </p>
        </li>
        <li className="ml-8 mb-8 ">
          <p className="mb-2 font-normal">
            This document should be stored in a safe place (ideally printed and kept offline)
            that only you can access.
          </p>
        </li>
        <li className="ml-8 mb-8 ">
          <p className="mb-2 font-normal">
            Anyone who views this document can access your funds.
          </p>
        </li>
      </ul>
      <div className="form-field font-size-base mb-12">
        <Checkbox
          name="condition-1"
          checked={infoChecked}
          onChange={(e: React.ChangeEvent<HTMLInputElement>): void | null => (e.target.checked ? setInfoChecked(true) : null)}
        >
          I understand the above three points. Please go ahead and generate my Wallet Recovery Document.
        </Checkbox>
      </div>
      {infoChecked && (
        <div>
          <p className="mb-4 md:text-center">
            Success! Your Wallet Recovery Document has now been generated
            (This all happened in your browser. RINO has no access to the
            information in this document).
          </p>
          <div className="md:w-1/2 m-auto">
            <Button
              name="download-pdf"
              type="button"
              onClick={(): void => {
                createWalletRecoveryDocument({ downloadFile: !isMobile });
              }}
              block
            >
              DOWNLOAD WALLET RECOVERY DOCUMENT
            </Button>
          </div>
        </div>
      )}
      {pdfDownloaded && (
        <div>
          <div className="mt-10">
            <p className="mb-4 md:text-center">Enter the 6-digits confirmation number at the top of your PDF file to confirm you got it:</p>
            <div className="md:flex md:space-x-4 justify-center">
              <div className="mb-4">
                <Input
                  type="text"
                  name="confirmation_check"
                  placeholder=""
                  value={confirmationCheckInputValue}
                  onChange={(e): void => setConfirmationCheckInputValue(e.target.value)}
                  error={codeIsWrong ? "Code does not match." : ""}
                />
              </div>
              <div>
                <Button
                  name="string-check-button"
                  type="button"
                  className="mb-4 float-right"
                  variant={Button.variant.PRIMARY_LIGHT}
                  disabled={confirmationCheckInputValue.length !== 6 || codeIsWrong}
                  onClick={onWalletFinish}
                  block
                >
                  DONE - I HAVE PROPERLY STORED MY WALLET RECOVERY DOCUMENT
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
      {
        errorMessage && (
          <div className="text-error mb-8">
            {errorMessage}
          </div>
        )
      }
    </div>
  );
};

export default SecurityTab;
