import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { createModal } from "../../../../modules/ModalFactory";
import { Modal } from "../../../../modules/index";
import { Button, BindHotKeys } from "../../../../components";

interface Props {
  submit: () => Promise<void>;
  cancel: () => void;
  recheckRequest: () => Promise<void>;
}

const TimeOutModalComponent: React.FC<Props> = ({ recheckRequest, cancel, submit }) => {
  const { t } = useTranslation();
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
      <Modal title={t("wallet.send.exchange.timed.out")} onClose={cancel}>
        <Modal.Body>
          {isLoading && <p>{t("common.loading")}</p>}
          <p>
            {t("wallet.send.recheck.exchange")}
          </p>
        </Modal.Body>
        <Modal.Actions>
          <Button
            type="button"
            name="cancel-btn"
            onClick={cancel}
          >
            {t("common.edit")}
          </Button>
        </Modal.Actions>
      </Modal>
    </BindHotKeys>
  );
};

export const TimeOutModal = createModal(TimeOutModalComponent);
