import React, { ReactChild } from "react";
import { createModal } from "promodal";
import { Modal } from "../Modal";
import { Button, Check } from "../../components";

type MessageFunc = (close: () => void) => ReactChild;
interface Props {
  goBackCallback: () => void;
  title: string;
  message: ReactChild | MessageFunc;
  buttonText?: string;
}

export const SuccessModal: React.FC<Props> = ({ goBackCallback, title, message, buttonText = "OK" }) => {
  return (
    <Modal title={title}>
      <Modal.Body>
        <div className="flex space-x-6">
          <div className="flex justify-center">
            <Check size={48} />
          </div>
          <div>
            {typeof message === "function" ? message(goBackCallback) : message}
          </div>
        </div>
      </Modal.Body>
      <Modal.Actions>
        <Button
          onClick={goBackCallback}
          name="submit-btn"
        >
          {buttonText}
        </Button>
      </Modal.Actions>
    </Modal>
  );
};

export const showSuccessModal = createModal(({ title, message, submit, buttonText }: { title: string; message: ReactChild; submit: () => void; buttonText: string | undefined; }) => {
  return <SuccessModal title={title} message={message} goBackCallback={submit} buttonText={buttonText}/>
});