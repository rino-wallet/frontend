import React, { useEffect } from "react";
import { useParams, useHistory } from "react-router-dom";
import { useDispatch, useSelector, useThunkActionCreator } from "../../hooks";
import {
  confirmEmailChanging as confirmEmailChangingThunk,
} from "../../store/changeEmailSlice";
import { getCurrentUser as getCurrentUserAction } from "../../store/sessionSlice";
import { selectors } from "../../store/changeEmailSlice";
import { ChangeEmailConfirmPayload, UserResponse } from "../../types";
import { navigate } from "../../store/actions";
import { SuccessModal } from "../../modules/index";
import { Spinner } from "../../components";
import routes from "../../router/routes";

const ChangeEmailConfirmPageContainer: React.FC = () => {
  const { push } = useHistory();
  const { token }: { token: string } = useParams();
  const succeeded = useSelector(selectors.getSucceeded);
  const loading = useSelector(selectors.pendingConfirmEmailChanging);
  const error = useSelector(selectors.getError);
  const confirmEmailChanging = useThunkActionCreator<void, ChangeEmailConfirmPayload>(confirmEmailChangingThunk);
  const getCurrentUser = useThunkActionCreator<UserResponse, void>(getCurrentUserAction);
  const dispatch = useDispatch();
  useEffect(() => {
    return (): void => {
      dispatch(navigate());
    }
  }, [])
  useEffect(() => {
    confirmEmailChanging(({ token }))
    .finally(() => {
      getCurrentUser();
    });
  }, []);
  return <div>
    {
      loading && <Spinner stub />
    }
    {
      succeeded && (
        <SuccessModal
          title="Email Address Updated"
          message="We successfully updated your email address."
          goBackCallback={(): void => push(routes.profile)}
        />
      )
    }
    {
      error && (
        <div className="text-error">    
          {Object.values(error)}
        </div>
      )
    }
  </div>
}

export default ChangeEmailConfirmPageContainer;
