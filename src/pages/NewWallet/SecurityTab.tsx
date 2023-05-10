import React, { useState } from "react";
import { generatePath, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { NewWalletPDFData } from "../../types";
import {
  Button, Checkbox, Input, Prompt,
} from "../../components";
import { createPDF } from "./createPDF";
import routes from "../../router/routes";
// import { isMobile as isMobileClient } from "../../utils";

interface Props {
  persistWallet: (data: { id: string }) => Promise<void>;
  pdfData: NewWalletPDFData;
  walletId: string;
}

const SecurityTab: React.FC<Props> = ({ persistWallet, pdfData, walletId }) => {
  // const isMobile = isMobileClient();
  const { t } = useTranslation();
  const filename = `RINO ${t("new.wallet.security.title")} - ${pdfData.walletName}`;
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
        setErrorMessage(t("new.wallet.network.error") as string);
      } else {
        setErrorMessage(t("new.wallet.persist.error") as string);
      }
    });
  };
  function createWalletRecoveryDocument(): Promise<void> {
    return createPDF({
      title: t("new.wallet.security.title"),
      filename,
      totalPages: 4,
      downloadFile: true,
    }, pdfData, t)
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
        title={t("new.wallet.prompt.title")}
        message={t("new.wallet.prompt.message")}
      />
      <p className="mb-4 font-normal">
        {t("new.wallet.security.text.row1")}
      </p>
      <p className="mb-4 font-normal">
        {t("new.wallet.security.text.row2")}
      </p>
      <ul className="list-disc">
        <li className="ml-8 mb-4 ">
          <p className="mb-2 font-normal">
            {t("new.wallet.security.text.row3")}
          </p>
        </li>
        <li className="ml-8 mb-8 ">
          <p className="mb-2 font-normal">
            {t("new.wallet.security.text.row4")}
          </p>
        </li>
        <li className="ml-8 mb-8 ">
          <p className="mb-2 font-normal">
            {t("new.wallet.security.text.row5")}
          </p>
        </li>
      </ul>
      <div className="form-field font-size-base mb-12">
        <Checkbox
          name="condition-1"
          checked={infoChecked}
          onChange={(e: React.ChangeEvent<HTMLInputElement>): void | null => (e.target.checked ? setInfoChecked(true) : null)}
        >
          {t("new.wallet.security.checkbox")}
        </Checkbox>
      </div>
      {infoChecked && (
        <div>
          <p className="mb-4 md:text-center">
            {t("new.wallet.security.success.message")}
          </p>
          <div className="md:w-1/2 m-auto">
            <Button
              name="download-pdf"
              type="button"
              onClick={(): void => {
                createWalletRecoveryDocument();
              }}
              block
            >
              {t("new.wallet.security.download.button")}
            </Button>
          </div>
        </div>
      )}
      {pdfDownloaded && (
        <div>
          <div className="mt-10">
            <p className="mb-4 md:text-center">{t("new.wallet.security.enter.code")}</p>
            <div className="md:flex md:space-x-4 justify-center">
              <div className="mb-4">
                <Input
                  type="text"
                  name="confirmation_check"
                  placeholder=""
                  value={confirmationCheckInputValue}
                  onChange={(e): void => setConfirmationCheckInputValue(e.target.value)}
                  error={codeIsWrong ? t("new.wallet.security.enter.code.error") as string : ""}
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
                  {t("new.wallet.security.done.button")}
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
