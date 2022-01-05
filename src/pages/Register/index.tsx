import React, { useEffect } from "react";
import { signUp as signUpAction } from "../../store/sessionSlice";
import Register from "./Register";
import { SignUpThunkPayload, SignUpResponse } from "../../types";
import { useDispatch, useThunkActionCreator } from "../../hooks";
import { changeLocation } from "../../store/actions";

const RegisterPageContainer: React.FC = () => {
  const signUp = useThunkActionCreator<SignUpResponse, SignUpThunkPayload>(signUpAction);
  const dispatch = useDispatch();
  useEffect(() => {
    return (): void => {
      dispatch(changeLocation());
    }
  }, [])
  return <Register signUp={signUp} />
}

export default RegisterPageContainer;
