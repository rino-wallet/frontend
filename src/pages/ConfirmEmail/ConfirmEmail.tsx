import React, { useEffect, useState } from "react";
import { useParams, useHistory } from "react-router-dom";
import routes from "../../router/routes";
import sessionApi from "../../api/session";
import { SuccessModal } from "../../modules/index";

const ConfirmEmailPage: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [isFinished, setIsFinished] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  const { userId, token }: { userId: string; token: string } = useParams();
  const { push } = useHistory();
  useEffect(() => {
    sessionApi.confirmEmail({ uid: userId, token }).then(
      () => {
        setLoading(false);
        setIsFinished(true);
      },
      (err) => {
        setLoading(false);
        setErrors(err.data);
      }
    );
  }, [userId, token, push]);
  return (
    <div>
      <h1>Email verification</h1>
      {
        isFinished && (
          <SuccessModal
            title="Account activated"
            message="You have successfully verified the email address."
            goBackCallback={(): void => push(routes.login)}
          />
        )
      }
      <div>
        <p id="error-message" className="text-error">{Object.values(errors)}</p>
        {
          loading && <div>Loading...</div>
        }
      </div>
    </div>
  );
};

export default ConfirmEmailPage;
