import React from "react";
import { createModal } from "promodal";
import { useSelector, useThunkActionCreator } from "../../../hooks";
import Enable2FA from "./Enable2FA";
import { create2FA as create2FaAction, enable2FA as enable2FaAction, selectors } from "../../../store/otpSlice";
import { Create2FAResponse, Enable2FAPayload, Enable2FAResponse } from "../../../types";

interface Props {
  submit: () => Promise<void>;
  cancel: () => void;
}

const Enable2FAContainer: React.FC<Props> = ({ submit, cancel }) => {
  const create2FA = useThunkActionCreator<Create2FAResponse, void>(create2FaAction);
  const enable2FA = useThunkActionCreator<Enable2FAResponse, Enable2FAPayload>(enable2FaAction);
  const provisioningUri = useSelector(selectors.getProvisioningUri);
  const secretKey = useSelector(selectors.getSecretKey);
  return (
    <Enable2FA
      submit={submit}
      cancel={cancel}
      provisioningUri={provisioningUri}
      secretKey={secretKey}
      create2FA={create2FA}
      enable2FA={enable2FA}
    />
  );
};

export default createModal(Enable2FAContainer);
