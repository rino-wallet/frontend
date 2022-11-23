import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  RemoveWalletAccessPayload,
  RemoveWalletAccessResponse,
  ShareWalletThunkPayload,
  User,
  Wallet,
  WalletMember,
  ListMetadata,
  FetchWalletMembersResponse,
  FetchWalletMembersThunkPayload,
} from "../../../types";
import {
  Button, Icon, WalletRole, PlaceholderController, EmptyList,
} from "../../../components";
import { Pagination, showSuccessModal } from "../../../modules/index";
import WalletMemberLayout from "./WalletMemberLayout";
import WalletMemberPlaceholder from "./WalletMemberPlaceholder";
import showRemoveWalletMemberModal from "./RemoveWalletMemberModal";
import routes from "../../../router/routes";
import { accessLevels } from "../../../constants";
import WalletMemberModal from "./WalletMemberModal";

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

interface Props {
  members: WalletMember[];
  wallet: Wallet;
  user: User;
  accessLevel: AccessLevelInt;
  shareWallet: (data: ShareWalletThunkPayload) => void;
  removeWalletAccess: (data: RemoveWalletAccessPayload) => Promise<RemoveWalletAccessResponse>;
  membersListMetaData: ListMetadata;
  refresh: () => Promise<void>;
  loading: boolean;
  fetchRevokedMembers: (data: FetchWalletMembersThunkPayload) => Promise<FetchWalletMembersResponse>;
  fetchWalletMembers: (data: FetchWalletMembersThunkPayload) => Promise<FetchWalletMembersResponse>;
  showRevokedUsers: boolean;
}

const UserList: React.FC<Props> = ({
  members,
  wallet,
  user,
  accessLevel,
  shareWallet,
  removeWalletAccess,
  membersListMetaData,
  refresh,
  loading,
  fetchRevokedMembers,
  fetchWalletMembers,
  showRevokedUsers,
}) => {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const onPage = (pageNumber: number): void => {
    if (showRevokedUsers) {
      fetchRevokedMembers({ walletId: wallet.id, page: pageNumber });
    } else {
      fetchWalletMembers({ walletId: wallet.id, page: pageNumber });
    }
    setPage(pageNumber);
  };
  useEffect(() => {
    if (showRevokedUsers) {
      fetchRevokedMembers({ walletId: wallet.id, page: 1 });
    } else {
      fetchWalletMembers({ walletId: wallet.id, page: 1 });
    }
  }, [showRevokedUsers]);
  return (
    <div className="pb-5">
      <div className="hidden theme-bg-panel-second md:block">
        <WalletMemberLayout
          role={<span className="text-sm uppercase">Role</span>}
          email={<span className="text-sm uppercase">Email</span>}
          action=""
        />
      </div>
      <PlaceholderController
        placeholder={<WalletMemberPlaceholder />}
        loading={loading}
        numberOfRows={5}
      >
        <div>
          {
            members.map((member, index) => (
              <div key={member.user} className={index % 2 !== 0 ? "theme-bg-panel-second bg-opacity-50 mb-3 last:mb-0" : "mb-3 last:mb-0"}>
                <WalletMemberLayout
                  role={(
                    <div className="flex items-center">
                      <WalletRole role={member.accessLevel} />
                      {" "}
                      {member.user === user.email && <span className="theme-text ml-1">(you)</span>}
                      {!!member.deletedAt && <span className="theme-text ml-1">(revoked)</span>}
                    </div>
                  )}
                  revoked={!!member.deletedAt}
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
                                          {" "}
                                          {wallet.name}
                                          {" "}
                                          was changed for
                                          {" "}
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
                              showRemoveWalletMemberModal({ email: member.user })
                                .then(() => {
                                  removeWalletAccess({ walletId: wallet.id, userId: member.id })
                                    .then(() => {
                                      refresh();
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
          {
            (members.length === 0 && !loading) && <EmptyList message="There are no revoked users." />
          }
          {
            membersListMetaData.pages > 1 && (
              <Pagination
                loading={loading}
                page={page}
                pageCount={membersListMetaData.pages}
                hasNextPage={membersListMetaData.hasNextPage}
                hasPreviousPage={membersListMetaData.hasPreviousPage}
                onChange={onPage}
              />
            )
          }
        </div>
      </PlaceholderController>
    </div>
  );
};

export default UserList;
