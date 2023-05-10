import React, { useEffect } from "react";
import { generatePath, useNavigate } from "react-router-dom";
import { useTranslation, Trans } from "react-i18next";
import {
  FetchWalletShareRequestsResponse,
  FetchWalletShareRequestsThunkPayload,
  ListMetadata,
  RequestWalletShareThunkPayload,
  ShareWalletThunkPayload,
  User,
  Wallet,
  WalletShareRequest,
} from "../../../types";
import {
  Panel, Button, Switch,
} from "../../../components";
import { showSuccessModal } from "../../../modules/index";
import AddWalletShareRequestModal from "./AddWalletShareRequest";
import routes from "../../../router/routes";
import WalletMemberModal from "./WalletMemberModal";
import ShareRequests from "./ShareRquests";
import { useAccountType } from "../../../hooks";

interface AccessLevelInt {
  isAdmin: () => boolean;
  isOwner: () => boolean;
  isViewOnly: () => boolean;
}

interface Props {
  accessLevel: AccessLevelInt;
  wallet: Wallet;
  user: User;
  shareWallet: (data: ShareWalletThunkPayload) => void;
  walletShareRequests: WalletShareRequest[];
  requestWalletShare: (data: RequestWalletShareThunkPayload) => Promise<void>;
  finalizeShareId?: string;
  refresh: () => Promise<void>;
  shareRequestListMetaData: ListMetadata;
  fetchWalletShareRequests: (data: FetchWalletShareRequestsThunkPayload) => Promise<FetchWalletShareRequestsResponse>
  loadingShareRequests: boolean;
  showRevokedUsers: boolean;
  setShowRevokedUsers: (value: boolean) => void;
}

const Users: React.FC<Props> = ({
  accessLevel,
  wallet,
  user,
  shareWallet,
  walletShareRequests,
  requestWalletShare,
  finalizeShareId = null,
  refresh,
  children,
  shareRequestListMetaData,
  fetchWalletShareRequests,
  loadingShareRequests,
  showRevokedUsers,
  setShowRevokedUsers,

}) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const canShare = accessLevel.isAdmin() || accessLevel.isOwner();
  const { isEnterprise } = useAccountType();
  const showWalletShareRequestModal = (shareRequest: WalletShareRequest): void => WalletMemberModal({
    wallet, is2FaEnabled: user.is2FaEnabled, email: shareRequest.email, shareWallet,
  })
    .then(async ({ email }: { email: string; password: string; accessLevel: number }) => {
      showSuccessModal({
        // eslint-disable-next-line
        goBackCallback: () => { console.log("User added."); },
        title: t("wallet.users.user.added.modal.title"),
        message: (
          <div>
            <Trans i18nKey="wallet.users.user.added.modal.message" className="mb-3">
              {/* eslint-disable-next-line */}
              User {{ email }} was added to the wallet.
            </Trans>
          </div>
        ),
        buttonText: t("common.ok"),
      });
      await refresh();
      if (finalizeShareId) {
        navigate(`${generatePath(routes.wallet, { id: wallet.id })}/users`);
      }
    });
  async function onAddUserClick(): Promise<void> {
    const walletName = wallet.name;
    AddWalletShareRequestModal({
      wallet, is2FaEnabled: user.is2FaEnabled, isEnterprise, requestWalletShare,
    })
      .then(async ({ email }: { email: string; password: string; accessLevel: number }) => {
        showSuccessModal({
          goBackCallback: () => {
            // eslint-disable-next-line
            console.log("Share request created.");
            refresh();
          },
          title: t("wallet.users.invite.sent.modal.title"),
          message: (
            <div>
              <Trans i18nKey="wallet.users.invite.sent.modal.message" className="mb-3">
                {/* eslint-disable-next-line */}
                We have sent an invitation to share access to {{ walletName }} to this user:
              </Trans>
              {" "}
              <span className="font-bold">{email}</span>
            </div>
          ),
          buttonText: t("common.ok"),
        });
      });
  }
  useEffect(() => {
    if (finalizeShareId) {
      const shareRequest = walletShareRequests.find((request) => request.id === finalizeShareId);
      if (shareRequest) {
        showWalletShareRequestModal(shareRequest);
      }
    }
  }, [walletShareRequests]);
  return (
    <div>
      <Panel
        title={(
          <div className="flex w-full items-center justify-between mb-6 md:mb-0">
            <div className="md:flex flex-1 items-center mr-6">
              <div className="flex-1">{t("wallet.users.title")}</div>
              <div className="absolute mt-3 md:mt-0 md:static">
                <Switch
                  id="show-revoked-users"
                  checked={showRevokedUsers}
                  onChange={() => { setShowRevokedUsers(!showRevokedUsers); }}
                >
                  <span className="text-base">{t("wallet.users.show.revoked")}</span>
                </Switch>
              </div>
            </div>
            {
              canShare && <Button onClick={onAddUserClick}>{t("wallet.users.add")}</Button>
            }
          </div>
        )}
      >
        {children}
        <ShareRequests
          wallet={wallet}
          walletShareRequests={walletShareRequests}
          shareRequestListMetaData={shareRequestListMetaData}
          fetchWalletShareRequests={fetchWalletShareRequests}
          showWalletShareRequestModal={showWalletShareRequestModal}
          loading={loadingShareRequests}
        />
      </Panel>
    </div>
  );
};

export default Users;
