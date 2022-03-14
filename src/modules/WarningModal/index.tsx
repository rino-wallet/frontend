import React, { ReactChild } from "react";
import { createModal } from "promodal";
import { Modal } from "../Modal";
import { Button } from "../../components";

interface Props {
  submit: () => void;
  cancel: () => void;
  title: string;
  message: ReactChild;
  buttonText?: string;
}

export const WarningModal: React.FC<Props> = ({ submit, title, message, buttonText = "Proceed" }) => {
  return (
    <Modal title={<span className="font-bold theme-text-error">{title}</span>}>
      <Modal.Body>
        <div className="flex space-x-6">
          {message}
        </div>
      </Modal.Body>
      <Modal.Actions>
        <Button
          variant={Button.variant.PRIMARY}
          onClick={submit}
          type="submit"
          name="submit-btn"
        >
          {buttonText}
        </Button>
      </Modal.Actions>
    </Modal>
  );
};

export const showWarningModal = createModal(({ title, message, buttonText, submit, cancel }: { title: string; message: ReactChild; buttonText: string | undefined; submit: () => void; cancel: () => void; }) => {
  return <WarningModal title={title} message={message} submit={submit} cancel={cancel} buttonText={buttonText}/>
});