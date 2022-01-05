import React, { ReactChild } from "react";
import { createModal } from "promodal";
import { Modal } from "../Modal";
import { Button } from "../../components";
import { Warning } from "../../components/Warning";
import {useDispatch} from "../../hooks";
import {setPreventNavigation as setPreventNavigationAction} from "../../store/sessionSlice";

type MessageFunc = (close: () => void) => ReactChild;
interface Props {
  goBackCallback: () => void;
  title: string;
  message: ReactChild | MessageFunc;
}

export const PreventNavigationModal: React.FC<Props> = ({ goBackCallback, title, message }) => {
  const dispatch = useDispatch();
  const setPreventNavigation = (value: boolean): void => { dispatch(setPreventNavigationAction(value)); };
  return (
    <Modal title={title}>
      <Modal.Body>
        <div className="flex space-x-6">
          <div className="flex justify-center">
            <Warning size={48} />
          </div>
          <div>
            {typeof message === "function" ? message(goBackCallback) : message}
          </div>
        </div>
      </Modal.Body>
      <Modal.Actions>
        <Button
          onClick={(): void => { setPreventNavigation(false); goBackCallback() }}
          name="submit-btn"
        >
          OK
        </Button>
      </Modal.Actions>
    </Modal>
  );
};

export const showPreventNavigationModal = createModal(({ title, message, submit }: { title: string; message: ReactChild; submit: () => void; }) => {
  return <PreventNavigationModal title={title} message={message} goBackCallback={submit} />
});