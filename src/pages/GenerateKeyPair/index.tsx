import React, { useEffect } from "react";
import { useThunkActionCreator, useSelector, useDispatch } from "../../hooks";
import { setupKeyPair as setupKeyPairThunk, selectors as sessionSelectors, setPassword as setPasswordAction } from "../../store/sessionSlice";
import GenerateKeyPair from "./GenerateKeyPair";
import { changeLocation } from "../../store/actions";

const GenerateKeyPairContainer: React.FC = () => {
  const dispatch = useDispatch();
  const setupKeyPair = useThunkActionCreator(setupKeyPairThunk);
  const setPassword = (password: string): void => { dispatch(setPasswordAction(password)); };
  const user = useSelector(sessionSelectors.getUser);
  const password = useSelector(sessionSelectors.getPassword);
  useEffect(() => (): void => {
    dispatch(changeLocation());
  }, []);
  return (
    <GenerateKeyPair
      setupKeyPair={setupKeyPair}
      user={user}
      password={password}
      setPassword={setPassword}
    />
  );
};

export default GenerateKeyPairContainer;
