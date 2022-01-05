import React, { ReactChild } from "react";
import { createModal } from "promodal";
import { Modal } from "../Modal";
import { Button, Check } from "../../components";

type MessageFunc = (close: () => void) => ReactChild;
interface Props {
  goBackCallback: () => void;
  title: string;
  message: ReactChild | MessageFunc;
}

export const SuccessModal: React.FC<Props> = ({ goBackCallback, title, message }) => {
  return (
    <Modal title={title}>
      <div>
        <div>
          {typeof message === "function" ? message(goBackCallback) : message}
        </div>
        <div className="flex justify-center my-20">
          <Check size={85} />
        </div>
        <div>
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

export const showSuccessModal = createModal(({ title, message, submit }: { title: string; message: ReactChild; submit: () => void; }) => {
  return <SuccessModal title={title} message={message} goBackCallback={submit} /> 
});