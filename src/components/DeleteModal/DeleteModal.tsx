import React from "react";
import { useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";
import { Modal } from "../../modules/index";
import { Button } from "../Button";
import { deleteEntity } from "../../store/apiKeysSlice";

interface Props {
  selectedEntity: any;
  modalTitle: string;
  message: string;
  goBackCallback: () => void;
  setShowDeleteModal: (show: boolean) => void;
  onDelete: () => {};
}

const DeleteApiModal: React.FC<Props> = ({
  selectedEntity,
  modalTitle,
  message,
  goBackCallback,
  setShowDeleteModal,
  onDelete,
}) => {
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const handleDelete = async () => {
    await dispatch(deleteEntity(selectedEntity.id));
    setShowDeleteModal(false);
    onDelete();
  };

  return (
    <Modal title={modalTitle} onClose={goBackCallback}>
      <Modal.Body>
        <p>
          {message}
          {" "}
          {selectedEntity && (
            <span className="theme-text-primary">{selectedEntity.name}</span>
          )}
        </p>
      </Modal.Body>
      <Modal.Actions>
        <div className="flex justify-end space-x-3 whitespace-nowrap">
          <Button type="button" name="cancel-btn" onClick={goBackCallback}>
            {t("common.cancel")}
          </Button>
          <Button
            type="button"
            name="submit-btn"
            variant={Button.variant.PRIMARY}
            onClick={handleDelete}
          >
            {t("settings.api.management.buttons.remove.api")}
          </Button>
        </div>
      </Modal.Actions>
    </Modal>
  );
};

export default DeleteApiModal;
