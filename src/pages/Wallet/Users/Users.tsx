import React, { useEffect, useState } from "react";
import { generatePath, useNavigate } from "react-router-dom";
import {
  RemoveWalletAccessPayload,
  RemoveWalletAccessResponse,
  RequestWalletShareThunkPayload,
  ShareWalletThunkPayload,
  User,
  Wallet,
  WalletShareRequest,
  WalletMember,
  FetchWalletShareRequestsThunkPayload,
  FetchWalletShareRequestsResponse,
} from "../../../types";
import {
  Panel, Button, Icon, WalletRole,
} from "../../../components";
import { Pagination, showSuccessModal } from "../../../modules/index";
import WalletMemberLayout from "./WalletMemberLayout";
import WalletMemberPlaceholder from "./WalletMemberPlaceholder";
import AddWalletShareRequestModal from "./AddWalletShareRequest";
import removeWalletMember from "./RemoveWalletMember";
import routes from "../../../router/routes";
import { accessLevels } from "../../../constants";
import WalletMemberModal from "./WalletMember";

interface AccessLevelInt {
  isAdmin: () => boolean;
  isOwner: () => boolean;
  isViewOnly: () => boolean;
}

function showDeleteButton(currentUserAccess: AccessLevelInt, walletMember: WalletMember): boolean {
  switch (walletMember.accessLevel) {
    case accessLevels.viewOnly.value: {
      return currentUserAccess.isAdmin() || currentUserAccess.isOwner();
    }
    case accessLevels.admin.value: {
      return currentUserAccess.isAdmin() || currentUserAccess.isOwner();
    }
    default:
      return false;
  }
}
interface ListMetadata {
  pages: number,
  hasPreviousPage: boolean,
  hasNextPage: boolean,
}

interface Props {
  wallet: Wallet;
  user: User;
  accessLevel: AccessLevelInt;
  shareWallet: (data: ShareWalletThunkPayload) => void;
  requestWalletShare: (data: RequestWalletShareThunkPayload) => Promise<void>;
  removeWalletAccess: (data: RemoveWalletAccessPayload) => Promise<RemoveWalletAccessResponse>;
  walletShareRequests: WalletShareRequest[];
  shareRequestListMetaData: ListMetadata;
  fetchWalletShareRequests: (data: FetchWalletShareRequestsThunkPayload) => Promise<FetchWalletShareRequestsResponse>
  finalizeShareId?: string;
  loading: boolean;
  refresh: () => Promise<void>;
}

const Users: React.FC<Props> = ({
  accessLevel, wallet, user, shareWallet, walletShareRequests, shareRequestListMetaData, requestWalletShare, fetchWalletShareRequests, finalizeShareId = null, removeWalletAccess, refresh, loading,
}) => {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const canShare = accessLevel.isAdmin() || accessLevel.isOwner();
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
    AddWalletShareRequestModal({ wallet, is2FaEnabled: user.is2FaEnabled, requestWalletShare })
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

  const changePage = (pageNumber: number): void => {
    fetchWalletShareRequests({ walletId: wallet.id, page: pageNumber });
    setPage(pageNumber);
  };
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
          <div className="flex w-full items-center justify-between">
            <span>Users</span>
            {
              canShare && <Button onClick={onAddUserClick}>Add User</Button>
            }
          </div>
        )}
      >
        <div className="pb-5">
          <div className="hidden theme-bg-panel-second md:block">
            <WalletMemberLayout
              role={<span className="text-sm uppercase">Role</span>}
              email={<span className="text-sm uppercase">Email</span>}
              action=""
            />
          </div>
          {
            !wallet?.members.length && (
              <WalletMemberPlaceholder />
            )
          }
          {
            wallet?.members.map((member, index) => (
              <div key={member.id} className={index % 2 !== 0 ? "theme-bg-panel-second bg-opacity-50" : ""}>
                <WalletMemberLayout
                  role={(
                    <div className="flex items-center">
                      <WalletRole role={member.accessLevel} />
                      {" "}
                      {member.user === user.email && <span className="theme-text ml-1">(you)</span>}
                    </div>
                  )}
                  email={member.user}
                  action={(
                    <div>
                      {
                        ![accessLevels.admin.title, accessLevels.owner.title].includes(member.accessLevel) && !accessLevel.isViewOnly() ? (
                          <Button
                            name="share-wallet"
                            loading={false}
                            onClick={(): void => {
                              WalletMemberModal({
                                wallet, member, is2FaEnabled: user.is2FaEnabled, email: member.user, shareWallet,
                              })
                                .then(async ({ email }: { email: string; password: string; accessLevel: number }) => {
                                  showSuccessModal({
                                    goBackCallback: () => {
                                      // eslint-disable-next-line
                                      console.log("User added.");
                                      refresh();
                                    },
                                    title: "Wallet access changed.",
                                    message: (
                                      <div>
                                        <p className="mb-3">
                                          Access level to
                                          {wallet.name}
                                          {" "}
                                          was changed for
                                          {email}
                                          .
                                        </p>
                                      </div>
                                    ),
                                    buttonText: "OK",
                                  });
                                });
                            }}
                            variant={Button.variant.PRIMARY}
                            size={Button.size.SMALL}
                          >
                            Change
                          </Button>
                        ) : null
                      }
                      {
                        (showDeleteButton(accessLevel, member)) && (
                          <button
                            type="button"
                            onClick={(): void => {
                              removeWalletMember({ email: member.user })
                                .then(() => {
                                  removeWalletAccess({ walletId: wallet.id, userId: member.id })
                                    .then(() => {
                                      if (member.user === user.email) {
                                        navigate(routes.wallets);
                                      }
                                    });
                                });
                            }}
                          >
                            <span className="text-xs ml-4"><Icon name="cross" /></span>
                          </button>
                        )
                      }
                    </div>
                  )}
                />
              </div>
            ))
          }
        </div>
        {walletShareRequests.length > 0 ? (
          <div>
            <h2 className="mx-10 my-4 text-xl font-bold flex items-center overflow-ellipsis overflow-hidden whitespace-nowrap">
              Pending Shares
              <span className="inline-block w-2 h-2 mr-2 bg-red-600 rounded-full ml-1" />
            </h2>
            <div className="pb-5">
              <div className="hidden theme-bg-panel-second md:block">
                <WalletMemberLayout
                  email={<span className="text-sm uppercase">Email</span>}
                  action=""
                />
              </div>
              {
                walletShareRequests.map((shareRequest, index) => (
                  <div key={shareRequest.id} className={index % 2 !== 0 ? "theme-bg-panel-second bg-opacity-50" : ""}>
                    <WalletMemberLayout
                      email={shareRequest.email}
                      action={(
                        <Button
                          name="share-wallet"
                          loading={false}
                          onClick={(): void => showWalletShareRequestModal(shareRequest)}
                          variant={Button.variant.PRIMARY}
                          size={Button.size.SMALL}
                        >
                          Share
                        </Button>
                      )}
                    />
                  </div>
                ))
              }
              {
                shareRequestListMetaData.pages > 1 && (
                  <Pagination
                    loading={loading}
                    page={page}
                    pageCount={shareRequestListMetaData.pages}
                    hasNextPage={shareRequestListMetaData.hasNextPage}
                    hasPreviousPage={shareRequestListMetaData.hasPreviousPage}
                    onChange={changePage}
                  />
                )
              }
            </div>
          </div>
        ) : null}
      </Panel>
    </div>
  );
};

export default Users;
