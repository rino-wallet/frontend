import React, { useImperativeHandle, RefObject, useRef } from "react";
import { createModal } from "../ModalFactory";
import { Modal } from "../Modal";
import { Button } from "../../components";
import { Warning } from "../../components/Warning";
import { useAccountType } from "../../hooks";

interface Props {
  title: string;
  message: string;
  cancel: (value: boolean) => void;
  submit: (value: boolean) => void;
}

export type CloseHandle = {
  closeModal: () => void;
};

export const PreventNavigationModal = React.forwardRef<CloseHandle, Props>(({
  cancel, submit, title, message,
}, ref: any) => {
  const { isEnterprise } = useAccountType();

  useImperativeHandle(ref, () => ({
    closeModal(): void {
      cancel(false);
    },
  }));

  return (
    <Modal title={title}>
      <Modal.Body>
        <div ref={ref} className="flex space-x-6">
          <div className="flex justify-center">
            <Warning size={48} />
          </div>
          <div>
            {message}
          </div>
        </div>
      </Modal.Body>

      <Modal.Actions>
        <Button
          onClick={(): void => { cancel(false); }}
          name="cancel-btn"
        >
          Stay Here
        </Button>

        <Button
          onClick={(): void => { submit(true); }}
          name="submit-btn"
          variant={
            isEnterprise
              ? Button.variant.ENTERPRISE_LIGHT
              : Button.variant.PRIMARY
          }
        >
          Leave
        </Button>
      </Modal.Actions>
    </Modal>
  );
});

// export const showPreventNavigationModal = createModal(PreventNavigationModal);

export const showPreventNavigationModal = createModal(({
  title, message, cancel, submit,
}: { title: string; message: string; cancel: any; submit: any; }) => {
  const ref = useRef();
  if (ref?.current) {
    // @ts-ignore
    ref?.current?.closeModal();
  }
  return <PreventNavigationModal title={title} message={message} cancel={cancel} submit={submit} ref={ref as unknown as RefObject<CloseHandle>} />;
});
