import React from "react";
import { useThunkActionCreator } from "../../../hooks";
import {
  changeEmailRequest as changeEmailRequestThunk,
} from "../../../store/changeEmailSlice";
import { ChangeEmailRequestPayload } from "../../../types";
import ChangeEmail from "./ChangeEmail";

interface Props {
  goBackCallback: () => void;
}

const ChangeEmailContainer: React.FC<Props> = ({ goBackCallback }) => {
  const changeEmail = useThunkActionCreator<void, ChangeEmailRequestPayload>(changeEmailRequestThunk);
  return (
    <ChangeEmail onSubmit={changeEmail} goBackCallback={goBackCallback} />
  );
}

export default ChangeEmailContainer;
