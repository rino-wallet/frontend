import React, { useEffect } from "react";
import { useThunkActionCreator, useDispatch } from "../../hooks";
import { SignInResponse, SignInPayload } from "../../types";
import { signIn as signInAction, setPassword as setPasswordAction } from "../../store/sessionSlice";
import Login from "./Login";
import { navigate } from "../../store/actions";

interface Props {
  history: {
    push: (path: string) => void;
  };
}

const LoginPageContainer: React.FC<Props> = ({ history: { push } }) => {
  const dispatch = useDispatch();
  const signIn = useThunkActionCreator<SignInResponse, SignInPayload>(signInAction);
  const setPassword = (password: string): void => { dispatch(setPasswordAction(password)); };
  useEffect(() => {
    return (): void => {
      dispatch(navigate());
    }
  }, [])
  return <Login login={signIn} setPassword={setPassword} push={push} />
}

export default LoginPageContainer;
