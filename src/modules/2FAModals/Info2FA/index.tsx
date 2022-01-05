import React from "react";
import { createModal } from "promodal";
import { useSelector } from "../../../hooks";
import Info2FA from "./Info2FA";
import {selectors} from "../../../store/otpSlice";

interface Props {
  submit: () => Promise<void>;
  cancel: () => void;
}

const Info2FAContainer: React.FC<Props> = ({submit, cancel}) => {
  const secretKey = useSelector(selectors.getSecretKey);
  return (
    <Info2FA
      submit={submit}
      cancel={cancel}
      secretKey={secretKey}
    />
  )
}

export default createModal(Info2FAContainer);
