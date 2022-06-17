import React from "react";
import { useThunkActionCreator } from "../../../hooks";
import {
  changePassword as changePasswordThunk,
  getCurrentUser as getCurrentUserThunk,
} from "../../../store/sessionSlice";
import ChangePassword from "./ChangePassword";

interface Props {
  goBackCallback: () => void;
}

const ChangePasswordContainer: React.FC<Props> = ({ goBackCallback }) => {
  const changePassword = useThunkActionCreator(changePasswordThunk);
  const getCurrentUser = useThunkActionCreator(getCurrentUserThunk);
  return (
    <ChangePassword
      updateUser={getCurrentUser}
      onSubmit={changePassword}
      goBackCallback={goBackCallback}
    />
  );
};

export default ChangePasswordContainer;
