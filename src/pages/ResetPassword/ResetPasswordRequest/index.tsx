import React, { useEffect } from "react";
import ResetPasswordRequest from "./ResetPasswordRequest";
import sessionApi from "../../../api/session";
import { changeLocation } from "../../../store/actions";
import { useDispatch } from "../../../hooks";

const ResetPasswordRequestContainer: React.FC = () => {
  const dispatch = useDispatch();
  useEffect(() => (): void => {
    dispatch(changeLocation());
  }, []);
  return <ResetPasswordRequest onSubmit={(data): Promise<void> => sessionApi.resetPasswordRequest(data)} />;
};

export default ResetPasswordRequestContainer;
