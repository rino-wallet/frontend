import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { useNavigate, useLocation } from "react-router-dom";
import { ApiKey } from "../../types";
import { ITEMS_PER_PAGE as itemsPerPage, selectors as apiKeysSelectors } from "../../store/apiKeysSlice";
import ApiKeyItem from "./ApiKeyItem";
import ApiKeysItemPlaceholder from "./ApiKeysItemPlaceholder";
import { EmptyList } from "../EmptyList";
import ApiKeyItemLayout from "./ApiKeyItemLayout";
import { useAccountType, useQuery } from "../../hooks";
import { Pagination } from "../../modules/Pagination";
import DeleteApiModal from "../DeleteModal/DeleteModal";
import { Button } from "../Button";
import CreateNewApi from "../../pages/Settings/CreateApiModal/CreateApiModal";

interface Props {
  fetchApiKeysData: () => void;
}

const ApiKeysList: React.FC<Props> = ({ fetchApiKeysData }) => {
  const { t } = useTranslation();

  const navigate = useNavigate();
  const apiKeys = useSelector(apiKeysSelectors.getEntities);
  const apiKeyListMetadata = useSelector(apiKeysSelectors.getListMetaData);
  const [isFirstLoading, setIsFirstLoading] = useState(false);
  const [listLoading, setListLoading] = useState(false);
  const query = useQuery();
  const page = parseInt(query.get("api_keys"), 10) || 1;
  const location = useLocation();

  const [selectedEntity, setSelectedEntity] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showApiModal, setShowApiModal] = useState(false);
  const { isEnterprise } = useAccountType();

  async function refetchApiKeysData() {
    await fetchApiKeysData();
    setIsFirstLoading(false);
    setListLoading(false);
  }

  const handleCloseModal = () => {
    setSelectedEntity(null);
    setShowDeleteModal(false);
  };

  useEffect(() => {
    setIsFirstLoading(true);
    setListLoading(true);
    refetchApiKeysData();
  }, []);

  function setPage(p: number): void {
    setIsFirstLoading(true);
    navigate(`${location.pathname}?api_keys=${p}`);
  }

  if (isFirstLoading && listLoading) {
    return (
      <div>
        {Array.from({ length: itemsPerPage }, (v, i) => i).map((key, index) => (
          <div
            className={index % 2 !== 0 ? "theme-bg-panel-second bg-opacity-50 py-1.5" : "py-1.5"}
            key={key}
          >
            <ApiKeysItemPlaceholder key={key} />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between mb-4 items-center">
        <p className="font-bold text-2xl">{t("settings.api.management.title")}</p>
        <Button
          className="block w-auto mb-3 sm:w-auto sm:mb-0"
          name="new-api-btn"
          type="button"
          onClick={(): void => setShowApiModal(true)}
        >
          {t("settings.api.management.buttons.new.api")}
        </Button>
      </div>
      <div className="hidden theme-bg-panel-second lg:block rounded-md mb-6">
        <ApiKeyItemLayout
          name={(<span className="text-sm uppercase">{t("settings.api.management.table.tabs.name")}</span>)}
          id={(<span className="text-sm uppercase">{t("settings.api.management.table.tabs.id")}</span>)}
          createdAt={(<span className="text-sm uppercase">{t("settings.api.management.table.tabs.created.at")}</span>)}
          expiry={(<span className="text-sm uppercase">{t("settings.api.management.table.tabs.expiry")}</span>)}
          action={(<span className="text-sm uppercase">{t("settings.api.management.table.tabs.action")}</span>)}
        />
      </div>
      {apiKeys.length
        ? (
          <>
            <div>
              {apiKeys?.map((entity: ApiKey) => (
                <div key={entity.id}>
                  <ApiKeyItem entity={entity} setSelectedEntity={setSelectedEntity} setShowDeleteModal={setShowDeleteModal} />
                </div>
              ))}
            </div>
            {apiKeyListMetadata.pages > 1 && (
            <Pagination
              loading={listLoading}
              page={page}
              pageCount={apiKeyListMetadata.pages}
              hasNextPage={apiKeyListMetadata.hasNextPage}
              hasPreviousPage={apiKeyListMetadata.hasPreviousPage}
              onChange={setPage}
            />
            )}
          </>
        )
        : (
          <EmptyList
            message={t("settings.api.management.no.api.keys") as string}
            isEnterprise={isEnterprise}
          />
        )}

      {showDeleteModal && (
        <DeleteApiModal
          modalTitle={t("settings.api.management.modals.delete.title")}
          message={t("settings.api.management.modals.delete.text")}
          goBackCallback={handleCloseModal}
          selectedEntity={selectedEntity}
          setShowDeleteModal={setShowDeleteModal}
          onDelete={refetchApiKeysData}
        />
      )}

      {showApiModal && <CreateNewApi onCreateCallback={refetchApiKeysData} goBackCallback={(): void => { setShowApiModal(false); }} />}
    </div>
  );
};

export default ApiKeysList;
