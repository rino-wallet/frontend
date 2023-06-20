import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation, Trans } from "react-i18next";
import { Modal, FormErrors } from "../../../modules/index";
import { Button, Input } from "../../../components";
import { piconeroToMonero } from "../../../utils";
import { DeleteWalletResponse } from "../../../types";
import routes from "../../../router/routes";

interface Props {
  deleteWallet: () => Promise<DeleteWalletResponse>;
  goBackCallback?: () => void;
  balance?: string;
  loading: boolean;
}

const controlString = "permanently delete";

const DeleteWallet: React.FC<Props> = ({
  deleteWallet, goBackCallback, balance, loading,
}) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [errors, setErrors] = useState({});
  const [confirmationString, setConfirmation] = useState("");
  const walletBalance = piconeroToMonero(Number(balance));
  async function onClickDelete(): Promise<void> {
    try {
      await deleteWallet();
      navigate(routes.wallets);
    } catch (err: any) {
      if (err) {
        setErrors(err);
      }
    }
  }
  return (
    <Modal
      title={(
        <div className="theme-text-red">
          {t("wallet.deletemodal.delete.wallet")}
        </div>
      )}
      onClose={goBackCallback}
    >
      <Modal.Body>
        <h2 className="text-xl mb-5">{t("wallet.deletemodal.sure")}</h2>
        {
          (balance && balance !== "0") && (
            <p>
              <Trans i18nKey="wallet.deletemodal.balance.message" className="block mb-2">
                This wallet has
                {" "}
                <span className="font-bold">
                  <span data-qa-selector="wallet-balance">{{ walletBalance }}</span>
                  {" "}
                  XMR
                </span>
                {" "}
                left.
              </Trans>
            </p>
          )
        }
        <div className="mt-4">
          {t("wallet.deletemodal.warning")}
        </div>
        <div className="mt-4">
          <div className="mb-3">
            <Trans i18nKey="wallet.deletemodal.confirm.message">
              Please confirm deleting the wallet by typing &quot;
              <span className="theme-text-red">permanently delete</span>
              &quot; in the field below.
            </Trans>
          </div>
          <Input
            type="text"
            name="confirmation"
            value={confirmationString}
            onChange={(e): void => { setConfirmation(e.target.value); }}
          />
        </div>
        <div className="mt-4">
          <FormErrors errors={errors} />
        </div>
      </Modal.Body>
      <Modal.Actions>
        <div className="flex justify-end space-x-3">
          <Button name="delete-wallet-cancel-btn" onClick={goBackCallback}>{t("common.cancel")}</Button>
          <Button
            name="delete-wallet-submit-btn"
            variant={Button.variant.PRIMARY}
            disabled={loading || confirmationString !== controlString}
            onClick={onClickDelete}
            loading={loading}
          >
            {t("wallet.deletemodal.delete.wallet")}
          </Button>
        </div>
      </Modal.Actions>
    </Modal>
  );
};

export default DeleteWallet;
