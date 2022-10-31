import React, { useEffect } from "react";
import { Navigate } from "react-router-dom";
import { useThunkActionCreator, useSelector, useDispatch } from "../../hooks";
import {
  signIn as signInAction, setPassword as setPasswordAction, setSigningPublicKey as setSigningPublicKeyAction, getCurrentUser as getCurrentUserAction,
} from "../../store/sessionSlice";
import Login from "./Login";
import { changeLocation } from "../../store/actions";
import routes from "../../router/routes";

const LoginPageContainer: React.FC = () => {
  const dispatch = useDispatch();
  const token = useSelector((state) => state.session.token);
  const signIn = useThunkActionCreator(signInAction);
  const getCurrentUser = useThunkActionCreator(getCurrentUserAction);
  const setPassword = (password: string): void => { dispatch(setPasswordAction(password)); };
  const setSigningPublicKey = (key: string): void => { dispatch(setSigningPublicKeyAction(key)); };
  useEffect(() => (): void => {
    dispatch(changeLocation());
  }, []);
  return token
    ? <Navigate to={routes.wallets} />
    : (
      <Login
        setSigningPublicKey={setSigningPublicKey}
        login={signIn}
        setPassword={setPassword}
        getCurrentUser={getCurrentUser}
      />
    );
};

export default LoginPageContainer;
