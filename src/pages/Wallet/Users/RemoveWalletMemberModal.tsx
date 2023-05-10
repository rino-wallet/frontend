import React from "react";
import { useTranslation } from "react-i18next";
import { createModal } from "../../../modules/ModalFactory";
import { Modal } from "../../../modules/index";
import { Button } from "../../../components";

interface Props {
  submit: () => void;
  cancel: () => void;
  email: string;
}

const RemoveWalletMemberModal: React.FC<Props> = ({ submit, cancel, email }) => {
  const { t } = useTranslation();
  return (
    <Modal
      showCloseIcon
      title={(
        <div className="theme-text-red">
          {t("wallet.users.remove.modal.remove.user")}
        </div>
      )}
      className="!z-10"
      onClose={cancel}
    >
      <Modal.Body>
        <h2 className="text-xl font-bold mb-5">{t("wallet.users.remove.modal.sure")}</h2>
        <p className="mb-3">
          {t("wallet.users.remove.modal.message")}
        </p>
        <p>
          {t("wallet.users.remove.modal.please.confirm")}
          <br />
          <span className="font-bold">{email}</span>
        </p>
      </Modal.Body>
      <Modal.Actions>
        <div className="flex justify-end space-x-3">
          <Button name="delete-wallet-cancel-btn" onClick={cancel}>{t("common.cancel")}</Button>
          <Button
            name="delete-wallet-submit-btn"
            variant={Button.variant.PRIMARY}
            onClick={submit}
          >
            {t("wallet.users.remove.modal.remove.user")}
          </Button>
        </div>
      </Modal.Actions>
    </Modal>
  );
};

export default createModal(RemoveWalletMemberModal);
