import React from "react";
import { createModal } from "promodal";
import { useThunkActionCreator } from "../../../hooks";
import Disable2FA from "./Disable2FA";
import {delete2FA as delete2FaAction} from "../../../store/otpSlice";
import { Delete2FAPayload } from "../../../types";

interface Props {
  submit: () => Promise<void>;
  cancel: () => void;
}

const Disable2FAContainer: React.FC<Props> = ({submit, cancel}) => {
  const delete2FA = useThunkActionCreator<void, Delete2FAPayload>(delete2FaAction);
  return (
    <Disable2FA
      delete2FA={delete2FA}
      submit={submit}
      cancel={cancel}
    />
  )
}

export default createModal(Disable2FAContainer);
