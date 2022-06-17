import React from "react";
import { useSelector, useThunkActionCreator } from "../../../hooks";
import {
  changeEmailRequest as changeEmailRequestThunk,
} from "../../../store/changeEmailSlice";
import {
  selectors as sessionSelectors,
} from "../../../store/sessionSlice";
import ChangeEmail from "./ChangeEmail";

interface Props {
  goBackCallback: () => void;
}

const ChangeEmailContainer: React.FC<Props> = ({ goBackCallback }) => {
  const changeEmail = useThunkActionCreator(changeEmailRequestThunk);
  const user = useSelector(sessionSelectors.getUser);
  return (
    <ChangeEmail
      username={user?.username}
      onSubmit={changeEmail}
      goBackCallback={goBackCallback}
    />
  );
};

export default ChangeEmailContainer;
