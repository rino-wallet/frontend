import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import routes from "../../router/routes";
import sessionApi from "../../api/session";
import { SuccessModal } from "../../modules/index";

const AcceptWalletSharePage: React.FC = () => {
  const { t } = useTranslation();
  const [isFinished, setIsFinished] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  const { walletId, shareId } = useParams();
  const navigate = useNavigate();
  useEffect(() => {
    sessionApi.acceptWalletShare({ walletId: walletId as string, shareId: shareId as string }).then(
      () => {
        setIsFinished(true);
      },
      (err) => {
        setErrors(err.data);
      },
    );
  }, [walletId, shareId]);
  return (
    <div>
      <h1>{t("wallet.users.accept.wallet.share")}</h1>
      {
        isFinished && (
          <SuccessModal
            title={t("wallet.users.wallet.sharing.accepted.title")}
            message={(
              <div>
                {t("wallet.users.wallet.sharing.accepted.message")}
              </div>
              )}
            goBackCallback={(): void => navigate(routes.wallets)}
            buttonText={t("common.continue") as string}
          />
        )
      }
      <div>
        <p id="error-message" className="theme-text-error">{Object.values(errors)}</p>
      </div>
    </div>
  );
};

export default AcceptWalletSharePage;
