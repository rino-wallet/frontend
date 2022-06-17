import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import routes from "../../router/routes";
import sessionApi from "../../api/session";
import { SuccessModal } from "../../modules/index";

const AcceptWalletSharePage: React.FC = () => {
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
      <h1>Accept wallet share</h1>
      {
        isFinished && (
          <SuccessModal
            title="Wallet sharing accepted"
            message={(
              <div>
                You have accepted the invitation to the wallet.
                The wallet will only become available after the invite sender has defined a role for you.
              </div>
              )}
            goBackCallback={(): void => navigate(routes.wallets)}
            buttonText="Continue"
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
