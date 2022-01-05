import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import routes from "../../router/routes";
import sessionApi from "../../api/session";
import { SuccessModal } from "../../modules/index";

const ConfirmEmailPage: React.FC = () => {
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
      }
    );
  }, [userId, token]);
  return (
    <div>
      <h1>Email verification</h1>
      {
        isFinished && (
          <SuccessModal
            title="Account activated"
            message="You have successfully verified your email address."
            goBackCallback={(): void => navigate(routes.login)}
            buttonText={"Continue"}
          />
        )
      }
      <div>
        <p id="error-message" className="theme-text-error">{Object.values(errors)}</p>
        {
          loading && <div>Loading...</div>
        }
      </div>
    </div>
  );
};

export default ConfirmEmailPage;
