import React from "react";
import { createModal } from "promodal";
import { Modal } from "../../../modules/index";
import { Button } from "../../../components";

interface Props {
  submit: () => void;
  cancel: () => void;
  email: string;
}

const RemoveWalletMember: React.FC<Props> = ({ submit, cancel, email }) => (
  <Modal
    showCloseIcon
    title={(
      <div className="theme-text-red">
        Remove User
      </div>
      )}
    onClose={cancel}
  >
    <Modal.Body>
      <h2 className="text-xl font-bold mb-5">Are you sure?</h2>
      <p className="mb-3">
        The user might be able to retain the user key. They can’t use it on RINO anymore, but the security of this wallet can be considered weakened. For maximum safety, we suggest you create a new wallet and move all funds there.
      </p>
      <p>
        Please confirm removing this user:
        <br />
        <span className="font-bold">{email}</span>
      </p>
    </Modal.Body>
    <Modal.Actions>
      <div className="flex justify-end space-x-3">
        <Button name="delete-wallet-cancel-btn" onClick={cancel}>Cancel</Button>
        <Button
          name="delete-wallet-submit-btn"
          variant={Button.variant.PRIMARY}
          onClick={submit}
        >
          Remove User
        </Button>
      </div>
    </Modal.Actions>
  </Modal>
);

export default createModal(RemoveWalletMember);
