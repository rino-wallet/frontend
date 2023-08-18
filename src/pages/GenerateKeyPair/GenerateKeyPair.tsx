import React, { FC, useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useTranslation, Trans } from "react-i18next";
import { SetUpKeyPairThunkPayload, SetUpKeyPairResponse, User } from "../../types";
import { Spinner, Button, Checkbox } from "../../components";
import routes from "../../router/routes";
import { generateUserKeyPairInfo } from "../../utils";
import { PageTemplate } from "../../modules/index";
import { createPDF } from "./createPDF";
import { useAccountType } from "../../hooks";

interface Props {
  setupKeyPair: (payload: SetUpKeyPairThunkPayload) => Promise<SetUpKeyPairResponse>;
  user: User;
  password: string;
  setPassword: (password: string) => void;
}

const RenderSuccess: FC<{ recoveryKey: string, username: string }> = ({
  recoveryKey,
  username,
}) => {
  const { t } = useTranslation();
  const [errorMessage, setErrorMessage] = useState("");
  const [infoChecked, setInfoChecked] = useState(false);
  const [pdfDownloaded, setPdfDownloaded] = useState(false);
  const { isEnterprise } = useAccountType();

  function createAndDownloadPdf(): void {
    createPDF({
      totalPages: 1,
      filename: "RINO Account Recovery Document.pdf",
      title: t("account.pdf.title"),
    }, { recoveryKey, username }, t)
      .then(() => setPdfDownloaded(true))
      .catch((error: any) => {
        setErrorMessage(error.message);
      });
  }

  useEffect(() => {
    function handlePopState(): void {
      // eslint-disable-next-line
      alert("ACCOUNT RECOVERY SECRET pdf will be downloaded automatically.");
      createAndDownloadPdf();
    }
    if (!pdfDownloaded) {
      window.addEventListener("popstate", handlePopState);
    }
    return (): void => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, [pdfDownloaded]);

  return (
    <PageTemplate title={t("keypair.page.title")}>
      <div className="w-full">
        <div className="flex mb-5 m-auto">
          <div className="w-full p-10 m-auto">
            <p className="mb-4 font-normal">
              {t("keypair.instruction.row1")}
            </p>
            <p className="mb-4 font-normal">
              {t("keypair.instruction.row2")}
            </p>
            <ol className="list-disc">
              <li className="ml-8 mb-4 ">
                <Trans i18nKey="keypair.instruction.row3" className="mb-4 font-normal">
                  This document is the
                  {" "}
                  <b>only</b>
                  {" "}
                  way to recover your account if you lose or forget your password.
                </Trans>
              </li>
              <li className="ml-8 mb-4 ">
                <p className="mb-4 font-normal">
                  {t("keypair.instruction.row4")}
                </p>
              </li>
              <li className="ml-8 mb-4 ">
                <p className="mb-4 font-normal">
                  {t("keypair.instruction.row5")}
                </p>
              </li>
            </ol>

            <div className="form-field font-size-base mb-12">
              <Checkbox
                name="condition-1"
                checked={infoChecked}
                onChange={(e: React.ChangeEvent<HTMLInputElement>): void | null => (e.target.checked ? setInfoChecked(true) : null)}
              >
                {t("keypair.checkbox.label")}
              </Checkbox>
            </div>

            {
              infoChecked ? (
                <div className="text-center">
                  <p className="mb-4 font-normal">
                    {t("keypair.success.message")}
                  </p>
                  <Button
                    name="download-pdf"
                    type="button"
                    className="mt-4"
                    disabled={!infoChecked}
                    onClick={createAndDownloadPdf}
                  >
                    {t("keypair.download.pdf")}
                  </Button>
                </div>
              ) : null
            }

            {
              (pdfDownloaded && infoChecked) ? (
                <Link to={routes.wallets}>
                  <Button
                    className="float-right mt-4"
                    name="submit-btn"
                    type="button"
                    variant={
                      isEnterprise
                        ? Button.variant.ENTERPRISE_LIGHT
                        : Button.variant.PRIMARY_LIGHT
                    }
                  >
                    {t("keypair.done")}
                  </Button>
                </Link>
              ) : null
            }

            {
              errorMessage && (
                <div className="text-error mb-8">
                  {errorMessage}
                </div>
              )
            }
          </div>
        </div>
      </div>
    </PageTemplate>
  );
};

const RenderPending: FC<{ error: string }> = ({ error }) => {
  const { isEnterprise } = useAccountType();

  return (
    <PageTemplate title="Download and Store Account Recovery Document">
      <Trans i18nKey="keypair.pending.message" className="mb-10">
        <p className="mb-4">
          We are creating your Account Recovery Document. It only takes a few seconds.
        </p>
        <p>
          Please do not close the browser window now, or we would need to start over the next time you log in.
        </p>
      </Trans>

      {error ? <div className="theme-text-error">{error}</div> : (
        <div className="flex justify-center mb-8">
          <Spinner size={85} isEnterprise={isEnterprise} />
        </div>
      )}
    </PageTemplate>
  );
};

const GenerateKeyPairPage: FC<Props> = ({
  setupKeyPair, user, password, setPassword,
}) => {
  const navigate = useNavigate();
  const [recoveryKey, setRecoveryKey] = useState("");
  const [errors, setErrors] = useState("");
  const keysSet = user && user.isKeypairSet;

  async function generateKeypairAndSubmit(): Promise<void> {
    const keypairData = await generateUserKeyPairInfo(user?.username, password);
    setRecoveryKey(Buffer.from(keypairData.recoveryKey).toString("hex"));
    try {
      await setupKeyPair(keypairData);
      keypairData.clean();
    } catch (err: any) {
      if (typeof err === "object"
        && !Array.isArray(err)
        && err !== null) {
        setErrors(Object.values(err).join(" "));
      }
    }
  }

  useEffect(() => {
    if (!password) {
      navigate(routes.wallets);
    }
    if (!keysSet) {
      if (user) {
        generateKeypairAndSubmit();
      }
    }
  }, [password]);

  useEffect(() => (): void => {
    setPassword("");
  }, []);

  return (
    <div className="mt-14">
      {keysSet
        ? <RenderSuccess recoveryKey={recoveryKey} username={user?.username} />
        : <RenderPending error={errors} />}
    </div>
  );
};

export default GenerateKeyPairPage;
