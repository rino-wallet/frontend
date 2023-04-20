import React, { useEffect } from "react";
import { generatePath, useNavigate } from "react-router-dom";
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
        title: "User added",
        message: (
          <div>
            <p className="mb-3">{`User ${email} was added to the wallet.`}</p>
          </div>
        ),
        buttonText: "OK",
      });
      await refresh();
      if (finalizeShareId) {
        navigate(`${generatePath(routes.wallet, { id: wallet.id })}/users`);
      }
    });
  async function onAddUserClick(): Promise<void> {
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
          title: "Invite Sent",
          message: (
            <div>
              <p className="mb-3">
                We have sent an invitation to share access to
                {" "}
                {wallet.name}
                {" "}
                to this user:
              </p>
              <span className="font-bold">{email}</span>
            </div>
          ),
          buttonText: "OK",
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
              <div className="flex-1">Users</div>
              <div className="absolute mt-3 md:mt-0 md:static">
                <Switch
                  id="show-revoked-users"
                  checked={showRevokedUsers}
                  onChange={() => { setShowRevokedUsers(!showRevokedUsers); }}
                >
                  <span className="text-base">Show revoked users</span>
                </Switch>
              </div>
            </div>
            {
              canShare && <Button onClick={onAddUserClick}>Add User</Button>
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
