import React, { useEffect } from "react";
import ResetPasswordConfirm from "./ResetPasswordConfirm";
import { changeLocation } from "../../../store/actions";
import { useThunkActionCreator, useDispatch } from "../../../hooks";
import {
  resetPasswordConfirm as resetPasswordConfirmThunk
} from "../../../store/sessionSlice";

const ResetPasswordConfirmContainer: React.FC = () => {
  const dispatch = useDispatch();
  const resetPasswordConfirm = useThunkActionCreator(resetPasswordConfirmThunk);
  useEffect(() => {
    return (): void => {
      dispatch(changeLocation());
    }
  }, [])
  return <ResetPasswordConfirm
    onSubmit={resetPasswordConfirm}
  />
}

export default ResetPasswordConfirmContainer;
