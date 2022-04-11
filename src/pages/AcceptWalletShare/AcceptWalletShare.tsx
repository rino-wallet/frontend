import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import routes from "../../router/routes";
import sessionApi from "../../api/session";
import { SuccessModal } from "../../modules/index";

const AcceptWalletSharePage: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [isFinished, setIsFinished] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  const { walletId, shareId } = useParams();
  const navigate = useNavigate();
  useEffect(() => {
    sessionApi.acceptWalletShare({ walletId: walletId as string, shareId: shareId as string }).then(
      () => {
        setLoading(false);
        setIsFinished(true);
      },
      (err) => {
        setLoading(false);
        setErrors(err.data);
      }
    );
  }, [walletId, shareId]);
  return (
    <div>
      <h1>Accept wallet share</h1>
      {
        isFinished && (
          <SuccessModal
            title="Wallet sharing accepted."
            message="you have successfully accepted wallet sharing."
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

export default AcceptWalletSharePage;
