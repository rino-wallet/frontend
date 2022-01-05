import React, { useEffect } from "react";
import { signUp as signUpAction } from "../../store/sessionSlice";
import Register from "./Register";
import { SignUpPayload, SignUpResponse } from "../../types";
import { useDispatch, useThunkActionCreator } from "../../hooks";
import { navigate } from "../../store/actions";

const RegisterPageContainer: React.FC = () => {
  const signUp = useThunkActionCreator<SignUpResponse, SignUpPayload>(signUpAction);
  const dispatch = useDispatch();
  useEffect(() => {
    return (): void => {
      dispatch(navigate());
    }
  }, [])
  return <Register signUp={signUp} />
}

export default RegisterPageContainer;
