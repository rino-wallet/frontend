import React, { useState } from "react";
import { createModal } from "promodal";
import { Modal } from "../../../../modules/index";
import { Button, BindHotKeys } from "../../../../components";

interface Props {
  submit: () => Promise<void>;
  cancel: () => void;
  recheckRequest: () => Promise<void>;
}

const TimeOutModalComponent: React.FC<Props> = ({ recheckRequest, cancel, submit }) => {
  const [isLoading, setIsLoading] = useState(false);
  async function onRecheck(): Promise<void> {
    setIsLoading(true);
    try {
      await recheckRequest();
      submit();
    } catch (error) {
      setIsLoading(false);
      // eslint-disable-next-line
      alert(JSON.stringify(error));
    }
  }
  return (
    <BindHotKeys callback={onRecheck} rejectCallback={cancel}>
      <Modal title="Exchange timed out" onClose={cancel}>
        <Modal.Body>
          {isLoading && <p>Loading...</p>}
          <p>
            Please recheck your exchange. Exchange rate may differ.
          </p>
        </Modal.Body>
        <Modal.Actions>
          <Button
            type="button"
            name="cancel-btn"
            onClick={cancel}
          >
            Edit
          </Button>
        </Modal.Actions>
      </Modal>
    </BindHotKeys>
  );
};

export const TimeOutModal = createModal(TimeOutModalComponent);
