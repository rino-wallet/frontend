import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
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
  const navigate = useNavigate();
  const [errors, setErrors] = useState({});
  const [confirmationString, setConfirmation] = useState("");
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
          Delete Wallet
        </div>
      )}
      onClose={goBackCallback}
    >
      <Modal.Body>
        <h2 className="text-xl mb-5">Are you sure?</h2>
        {
          (balance && balance !== "0") && (
            <p>
              <span className="block mb-2">
                This wallet has
                {" "}
                <span className="font-bold">
                  <span data-qa-selector="wallet-balance">{piconeroToMonero(balance)}</span>
                  {" "}
                  XMR
                </span>
                {" "}
                left.
              </span>
            </p>
          )
        }
        <div className="mt-4">
          A deleted wallet cannot be restored!
        </div>
        <div className="mt-4">
          <p className="mb-3">
            Please confirm deleting the wallet by typing &quot;
            <span className="theme-text-red">permanently delete</span>
            &quot; in the field below.
          </p>
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
          <Button name="delete-wallet-cancel-btn" onClick={goBackCallback}>Cancel</Button>
          <Button
            name="delete-wallet-submit-btn"
            variant={Button.variant.PRIMARY}
            disabled={loading || confirmationString !== controlString}
            onClick={onClickDelete}
            loading={loading}
          >
            Delete Wallet
          </Button>
        </div>
      </Modal.Actions>
    </Modal>
  );
};

export default DeleteWallet;
