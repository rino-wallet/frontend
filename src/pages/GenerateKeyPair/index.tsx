import React, { useEffect } from "react";
import { useThunkActionCreator, useSelector, useDispatch } from "../../hooks";
import { SetUpKeyPairPayload, SetUpKeyPairResponse } from "../../types";
import { setupKeyPair as setupKeyPairThunk, selectors as sessionSelectors } from "../../store/sessionSlice";
import GenerateKeyPair from "./GenerateKeyPair";
import { navigate } from "../../store/actions";

const GenerateKeyPairContainer: React.FC = () => {
  const setupKeyPair = useThunkActionCreator<SetUpKeyPairResponse, SetUpKeyPairPayload>(setupKeyPairThunk);
  const user = useSelector(sessionSelectors.getUser);
  const password = useSelector(sessionSelectors.getPassword);
  const dispatch = useDispatch();
  useEffect(() => {
    return (): void => {
      dispatch(navigate());
    }
  }, []);
  return <GenerateKeyPair setupKeyPair={setupKeyPair} user={user} password={password} />
}

export default GenerateKeyPairContainer;
