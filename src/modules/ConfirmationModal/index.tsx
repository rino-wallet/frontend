import React, { ReactChild } from "react";
import { createModal } from "../ModalFactory";
import { Modal } from "../Modal";
import { Button } from "../../components";

type MessageFunc = (close: () => void) => ReactChild;
interface Props {
  submit: () => void;
  cancel: () => void;
  title: string;
  message: ReactChild | MessageFunc;
  buttonText?: string;
}

export const ConfirmationModal: React.FC<Props> = ({
  cancel, submit, title, message, buttonText = "Confirm",
}) => (
  <Modal title={<span className="font-bold theme-text-error">{title}</span>}>
    <Modal.Body>
      <div className="font-bold mb-4"> Are you sure? </div>
      <div className="flex space-x-6">
        {submit ? (
          <div>
            {typeof message === "function" ? message(submit) : message}
          </div>
        ) : null}
      </div>
    </Modal.Body>
    <Modal.Actions>
      <Button
        onClick={cancel}
        name="return-btn"
      >
        return
      </Button>
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

export const showConfirmationModal = createModal(({
  title, message, buttonText, submit, cancel,
}: { title: string; message: ReactChild; buttonText: string | undefined; submit: () => void; cancel: () => void; }) => <ConfirmationModal title={title} message={message} submit={submit} cancel={cancel} buttonText={buttonText} />);
