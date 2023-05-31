import React from "react";
import { useTranslation } from "react-i18next";
import { format } from "date-fns";
import ApiKeyItemLayout from "./ApiKeyItemLayout";
import { Button } from "../Button";

interface Props {
  entity: any;
  setSelectedEntity: (entity: any) => void;
  setShowDeleteModal: (show: boolean) => void;
}

const ApiKeyItem: React.FC<Props> = ({
  entity,
  setSelectedEntity,
  setShowDeleteModal,
}) => {
  const { t } = useTranslation();

  const handleDelete = () => {
    setSelectedEntity(entity);
    setShowDeleteModal(true);
  };

  return (
    <div>
      <ApiKeyItemLayout
        name={(
          <span className="text-ellipsis overflow-hidden whitespace-nowrap !block">
            {entity.name}
          </span>
        )}
        action={(
          <Button
            className="block border-none theme-text-red !py-0 pr-0 !my-0"
            type="button"
            onClick={handleDelete}
          >
            {t("settings.api.management.buttons.delete")}
          </Button>
        )}
        createdAt={(
          <span className="text-ellipsis overflow-hidden theme-text-secondary whitespace-nowrap !block">
            {format(new Date(entity.createdAt || ""), "dd MMM yyyy HH:mm")}
          </span>
        )}
        id={(
          <span>
            {entity.id}
          </span>
        )}
        expiry={(
          <span className="text-ellipsis overflow-hidden theme-text-secondary whitespace-nowrap !block">
            {format(new Date(entity.expiresAt || ""), "dd MMM yyyy HH:mm")}
          </span>
        )}
      />
    </div>
  );
};

export default ApiKeyItem;
