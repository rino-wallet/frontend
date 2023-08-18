import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Wallet,
  WalletShareRequest,
  FetchWalletShareRequestsThunkPayload,
  FetchWalletShareRequestsResponse,
} from "../../../types";
import { Button } from "../../../components";
import { Pagination } from "../../../modules/index";
import WalletMemberLayout from "./WalletMemberLayout";
import { useAccountType } from "../../../hooks";

interface ListMetadata {
  pages: number,
  hasPreviousPage: boolean,
  hasNextPage: boolean,
}

interface Props {
  wallet: Wallet;
  walletShareRequests: WalletShareRequest[];
  shareRequestListMetaData: ListMetadata;
  fetchWalletShareRequests: (data: FetchWalletShareRequestsThunkPayload) => Promise<FetchWalletShareRequestsResponse>
  showWalletShareRequestModal: (data: any) => any
  loading: boolean;
}

const ShareRequests: React.FC<Props> = ({
  wallet,
  walletShareRequests,
  shareRequestListMetaData,
  fetchWalletShareRequests,
  showWalletShareRequestModal,
  loading,
}) => {
  const { t } = useTranslation();
  const [shareRequestPage, setShareRequestPage] = useState(1);
  const { isEnterprise } = useAccountType();

  const changePage = (pageNumber: number): void => {
    fetchWalletShareRequests({ walletId: wallet.id, page: pageNumber });
    setShareRequestPage(pageNumber);
  };

  return walletShareRequests.length > 0 ? (
    <div>
      <h2 className="mx-10 my-4 text-xl font-bold flex items-center overflow-ellipsis overflow-hidden whitespace-nowrap">
        {t("wallet.users.pending.shares")}
        <span className="inline-block w-2 h-2 mr-2 bg-red-600 rounded-full ml-1" />
      </h2>

      <div className="pb-5">
        <div className="hidden theme-bg-panel-second md:block">
          <WalletMemberLayout
            email={
              <span className="text-sm uppercase">{t("common.email")}</span>
            }
            action=""
          />
        </div>
        {walletShareRequests.map((shareRequest, index) => (
          <div
            key={shareRequest.id}
            className={
              index % 2 !== 0 ? "theme-bg-panel-second bg-opacity-50" : ""
            }
          >
            <WalletMemberLayout
              email={shareRequest.email}
              action={(
                <Button
                  name="share-wallet"
                  loading={false}
                  onClick={
                    (): void => showWalletShareRequestModal(shareRequest)
                  }
                  variant={
                    isEnterprise
                      ? Button.variant.ENTERPRISE_LIGHT
                      : Button.variant.PRIMARY
                  }
                  size={Button.size.SMALL}
                >
                  {t("wallet.users.share.btn")}
                </Button>
              )}
            />
          </div>
        ))}

        {shareRequestListMetaData.pages > 1 && (
          <Pagination
            loading={loading}
            page={shareRequestPage}
            pageCount={shareRequestListMetaData.pages}
            hasNextPage={shareRequestListMetaData.hasNextPage}
            hasPreviousPage={shareRequestListMetaData.hasPreviousPage}
            onChange={changePage}
          />
        )}
      </div>
    </div>
  ) : null;
};

export default ShareRequests;
