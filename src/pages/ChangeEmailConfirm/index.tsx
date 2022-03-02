import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector, useThunkActionCreator } from "../../hooks";
import {
  confirmEmailChanging as confirmEmailChangingThunk,
} from "../../store/changeEmailSlice";
import { getCurrentUser as getCurrentUserAction } from "../../store/sessionSlice";
import { selectors } from "../../store/changeEmailSlice";
import { ChangeEmailConfirmPayload, UserResponse } from "../../types";
import { changeLocation } from "../../store/actions";
import { SuccessModal } from "../../modules/index";
import { Spinner } from "../../components";
import routes from "../../router/routes";

const ChangeEmailConfirmPageContainer: React.FC = () => {
  const navigate = useNavigate();
  const { token } = useParams();
  const authToken = useSelector(state => state.session.token);
  const succeeded = useSelector(selectors.getSucceeded);
  const loading = useSelector(selectors.pendingConfirmEmailChanging);
  const error = useSelector(selectors.getError);
  const confirmEmailChanging = useThunkActionCreator<void, ChangeEmailConfirmPayload>(confirmEmailChangingThunk);
  const getCurrentUser = useThunkActionCreator<UserResponse, void>(getCurrentUserAction);
  const dispatch = useDispatch();
  useEffect(() => {
    return (): void => {
      dispatch(changeLocation());
    }
  }, [])
  useEffect(() => {
    confirmEmailChanging(({ token: token as string }))
    .finally(() => {
      if (authToken) getCurrentUser()
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
          message="We have successfully updated your email address."
          goBackCallback={(): void => navigate(routes.profile)}
        />
      )
    }
    {
      error && (
        <div className="theme-text-error">    
          {Object.values(error)}
        </div>
      )
    }
  </div>
}

export default ChangeEmailConfirmPageContainer;
