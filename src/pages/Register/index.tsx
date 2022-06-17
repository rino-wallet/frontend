import React, { useEffect } from "react";
import { signUp as signUpAction } from "../../store/sessionSlice";
import Register from "./Register";
import { useDispatch, useThunkActionCreator } from "../../hooks";
import { changeLocation } from "../../store/actions";

const RegisterPageContainer: React.FC = () => {
  const signUp = useThunkActionCreator(signUpAction);
  const dispatch = useDispatch();
  useEffect(() => (): void => {
    dispatch(changeLocation());
  }, []);
  return <Register signUp={signUp} />;
};

export default RegisterPageContainer;
