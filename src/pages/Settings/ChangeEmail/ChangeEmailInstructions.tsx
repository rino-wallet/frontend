import React from "react";
import { useTranslation, Trans } from "react-i18next";
import { Modal } from "../../../modules/index";
import { Button } from "../../../components";

interface Props {
  onClose: () => void;
  email: string;
}

const ChangeEmailInstructions: React.FC<Props> = ({ onClose, email }) => {
  const { t } = useTranslation();
  return (
    <Modal title="Change email" onClose={onClose}>
      <Modal.Body>
        <Trans i18nKey="settings.change-email-instructions-modal.message1">
          <p className="break-all">
            {/* eslint-disable-next-line */}
            We have sent a confirmation email to <span className="font-bold">{{email}}</span>.
          </p>
          <p className="break-all">Please check your inbox and follow instructions in the message we have sent you.</p>
        </Trans>
      </Modal.Body>
      <Modal.Actions>
        <Button
          onClick={onClose}
          name="submit-btn"
          block
        >
          {t("common.ok")}
        </Button>
      </Modal.Actions>
    </Modal>
  );
};

export default ChangeEmailInstructions;
