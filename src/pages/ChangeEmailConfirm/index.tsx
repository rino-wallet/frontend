import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

import {
  useAccountType,
  useDispatch, useSelector,
  useThunkActionCreator,
} from "../../hooks";
import {
  confirmEmailChanging as confirmEmailChangingThunk,
  selectors,
} from "../../store/changeEmailSlice";
import { getCurrentUser as getCurrentUserAction } from "../../store/sessionSlice";
import { changeLocation } from "../../store/actions";
import { SuccessModal } from "../../modules/index";
import { Spinner } from "../../components";
import routes from "../../router/routes";

const ChangeEmailConfirmPageContainer: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { token } = useParams();
  const authToken = useSelector((state) => state.session.token);
  const succeeded = useSelector(selectors.getSucceeded);
  const loading = useSelector(selectors.pendingConfirmEmailChanging);
  const error = useSelector(selectors.getError);
  const confirmEmailChanging = useThunkActionCreator(confirmEmailChangingThunk);
  const getCurrentUser = useThunkActionCreator(getCurrentUserAction);
  const dispatch = useDispatch();
  const { isEnterprise } = useAccountType();

  useEffect(() => (): void => {
    dispatch(changeLocation());
  }, []);

  useEffect(() => {
    confirmEmailChanging(({ token: token as string }))
      .finally(() => {
        if (authToken) getCurrentUser();
      });
  }, []);

  return (
    <div>
      {loading && <Spinner stub isEnterprise={isEnterprise} />}
      {succeeded && (
        <SuccessModal
          title={t("auth.email.address.updated") as string}
          message="We have successfully updated your email address."
          goBackCallback={(): void => navigate(routes.settings)}
        />
      )}

      {error && (
        <div className="theme-text-error">
          {Object.values(error)}
        </div>
      )}
    </div>
  );
};

export default ChangeEmailConfirmPageContainer;
