import React, { useEffect } from "react";
import ResetPasswordConfirm from "./ResetPasswordConfirm";
import sessionApi from "../../../api/session";
import { FetchBackupPrivateKeyPayload, FetchBackupPrivateKeyResponse } from "../../../types";
import { useDispatch } from "react-redux";
import { navigate } from "../../../store/actions";

const ResetPasswordConfirmContainer: React.FC = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    return (): void => {
      dispatch(navigate());
    }
  }, [])
  return <ResetPasswordConfirm
    fetchBackupPrivateKey={(data: FetchBackupPrivateKeyPayload): Promise<FetchBackupPrivateKeyResponse> => sessionApi.fetchBackupPrivateKey(data)}
    onSubmit={(data): Promise<void> => sessionApi.resetPasswordConfirm(data)}
  />
}

export default ResetPasswordConfirmContainer;
