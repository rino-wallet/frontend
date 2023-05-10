import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import routes from "../../router/routes";
import sessionApi from "../../api/session";
import { SuccessModal } from "../../modules/index";

const ConfirmEmailPage: React.FC = () => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [isFinished, setIsFinished] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  const { userId, token } = useParams();
  const navigate = useNavigate();
  useEffect(() => {
    sessionApi.confirmEmail({ uid: userId as string, token: token as string }).then(
      () => {
        setLoading(false);
        setIsFinished(true);
      },
      (err) => {
        setLoading(false);
        setErrors(err.data);
      },
    );
  }, [userId, token]);
  return (
    <div>
      <h1>{t("auth.email.verification")}</h1>
      {
        isFinished && (
          <SuccessModal
            title={t("auth.account.activated.title")}
            message={t("auth.account.activated.message") as string}
            goBackCallback={(): void => navigate(routes.login)}
            buttonText={t("common.continue") as string}
          />
        )
      }
      <div>
        <p id="error-message" className="theme-text-error">{Object.values(errors)}</p>
        {
          loading && <div>{t("common.loading")}</div>
        }
      </div>
    </div>
  );
};

export default ConfirmEmailPage;
