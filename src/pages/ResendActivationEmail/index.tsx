import React, { useEffect } from "react";
import ResendActivationEmail from "./ResendActivationEmail";
import sessionApi from "../../api/session";
import { changeLocation } from "../../store/actions";
import { useDispatch } from "../../hooks";

const ResendActivationEmailContainer: React.FC = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    return (): void => {
      dispatch(changeLocation());
    }
  }, [])
  return <ResendActivationEmail onSubmit={(data): Promise<void> => sessionApi.resendActivationEmail(data)} />
}

export default ResendActivationEmailContainer;
