import React from "react";
import { Modal } from "../../../modules/index";
import { Button } from "../../../components";

interface Props {
  onClose: () => void;
  email: string;
}

const ChangeEmailInstructions: React.FC<Props> = ({ onClose, email }) => {
  return (
    <Modal title="Change email" onClose={onClose}>
      <Modal.Body>
        <div className="break-all">
          <p>We have sent a confirmation email to <span className="font-bold">{email}</span>.</p>
          <p>Please check your inbox and follow instructions in the message we have sent you.</p>
        </div>
      </Modal.Body>
      <Modal.Actions>
        <Button
          onClick={onClose}
          name="submit-btn"
          block
        >
          OK
          </Button>
      </Modal.Actions>
    </Modal>
  );
};

export default ChangeEmailInstructions;
