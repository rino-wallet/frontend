
import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { Modal, FormErrors } from "../../../modules/index";
import { Button } from "../../../components";
import { piconeroToMonero } from "../../../utils";
import { DeleteWalletResponse } from "../../../types";
import routes from "../../../router/routes";

interface Props {
  deleteWallet: () => Promise<DeleteWalletResponse>;
  goBackCallback?: () => void;
  balance?: string;
  loading: boolean;
}

const DeleteWallet: React.FC<Props> = ({ deleteWallet, goBackCallback, balance, loading }) => {
  const { push } = useHistory();
  const [errors, setErrors] = useState({});
  async function onClickDelete(): Promise<void> {
    try {
      await deleteWallet();
      push(routes.wallets);
    } catch(err) {
      if (err) {
        setErrors(err);
      }
    }
  }
  return (
    <Modal
      title="Delete Wallet"
      goBackCallback={goBackCallback}
    >
      <div>
        <h2 className="text-xl mb-5">Are you sure?</h2>
        {
          (balance && balance !== "0") ? (
            <p>
              <span className="block mb-2">
                This wallet has <span className="font-bold"><span data-qa-selector="wallet-balance">{piconeroToMonero(balance)}</span> XMR</span> left.
              </span>
              Are you sure you want to delete it?
              A deleted wallet cannot be restored!
            </p>
          ) : (
            <p>
              <span className="block mb-2">This operation cannot be undone.</span>
              Please confirm deleting the wallet.
            </p>
          )
        }
        <div className="mt-4">
          <FormErrors errors={errors} />
        </div>
        <div className="flex justify-between space-x-3 mt-10">
          <Button name="cancel-btn" onClick={goBackCallback} block>Cancel</Button>
          <Button
            name="submit-btn"
            variant={Button.variant.RED}
            disabled={loading}
            block
            onClick={onClickDelete}
            loading={loading}
          >
            Delete Wallet
          </Button>
        </div>
      </div>
    </Modal>
  )
};

export default DeleteWallet;
