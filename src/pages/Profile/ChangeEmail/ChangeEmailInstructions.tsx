import React from "react";
import { Modal } from "../../../modules/index";
import { Button } from "../../../components";

interface Props {
  goBackCallback: () => void;
  email: string;
}

const ChangeEmailInstructions: React.FC<Props> = ({ goBackCallback, email }) => {
  return (
    <Modal title="Change Email" goBackCallback={goBackCallback}>
      <div className="break-all">
        <p>We have sent a confirmation email to <span className="font-bold">{email}</span>.</p>
        <p>Please check your inbox and follow instructions in the message we have sent you.</p>
        <div className="mt-10 px-10">
          <Button
            onClick={goBackCallback}
            name="submit-btn"
            block
          >
            OK
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default ChangeEmailInstructions;
