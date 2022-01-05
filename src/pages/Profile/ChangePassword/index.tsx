import React from "react";
import { useThunkActionCreator, useSelector } from "../../../hooks";
import { ChangePasswordPayload } from "../../../types";
import {
  changePassword as changePasswordThunk,
  selectors as sessionSelectors,
} from "../../../store/sessionSlice";
import ChangePassword from "./ChangePassword";

interface Props {
  goBackCallback: () => void;
}

const ChangePasswordContainer: React.FC<Props> = ({ goBackCallback }) => {
  const user = useSelector(sessionSelectors.getUser);
  const changePassword = useThunkActionCreator<void, ChangePasswordPayload>(changePasswordThunk);
  return (
    <ChangePassword
      onSubmit={changePassword}
      encPrivateKey={user.encPrivateKey}
      goBackCallback={goBackCallback}
    />
  );
}

export default ChangePasswordContainer;
