import React, { FC, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation, Trans } from "react-i18next";
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
import { useAccountType } from "../../../hooks";

interface AccessLevelInt {
  isAdmin: () => boolean;
  isOwner: () => boolean;
  isViewOnly: () => boolean;
  isApprover: () => boolean;
  isSpender: () => boolean;
}

function showDeleteButton(currentUserAccess: AccessLevelInt, walletMember: WalletMember): boolean {
  switch (walletMember.accessLevel) {
    case accessLevels.viewOnly.value: {
      return currentUserAccess.isAdmin() || currentUserAccess.isOwner();
    }
    case accessLevels.approver.value: {
      return currentUserAccess.isAdmin() || currentUserAccess.isOwner();
    }
    case accessLevels.spender.value: {
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

const UserList: FC<Props> = ({
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
  const { isEnterprise } = useAccountType();
  const { t } = useTranslation();
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
          role={(
            <span className="text-sm uppercase">
              {t("wallet.users.list.th.role")}
            </span>
          )}
          email={(
            <span className="text-sm uppercase">
              {t("wallet.users.list.th.email")}
            </span>
          )}
          action=""
        />
      </div>

      <PlaceholderController
        placeholder={WalletMemberPlaceholder}
        loading={loading}
        numberOfRows={5}
      >
        <div>
          {members.map((member, index) => (
            <div
              key={member.user}
              className={
                index % 2 !== 0
                  ? "theme-bg-panel-second bg-opacity-50 mb-3 last:mb-0"
                  : "mb-3 last:mb-0"
              }
            >
              <WalletMemberLayout
                role={(
                  <div className="flex items-center">
                    <WalletRole role={member.accessLevel} />
                    {" "}
                    {member.user === user.email && (
                    <span className="theme-text ml-1">
                      (
                      {t("wallet.users.list.you")}
                      )
                    </span>
                    )}
                    {!!member.deletedAt && (
                    <span className="theme-text ml-1">
                      (
                      {t("wallet.users.list.revoked")}
                      )
                    </span>
                    )}
                  </div>
                )}
                revoked={!!member.deletedAt}
                email={member.user}
                is2FAEnabled={member.is2FaEnabled}
                activeApiKeys={member.activeApiKeys}
                action={(
                  <div>
                    {![
                      accessLevels.admin.title,
                      accessLevels.owner.title,
                    ].includes(member.accessLevel)
                      && !accessLevel.isViewOnly()
                      && !accessLevel.isApprover()
                      && !accessLevel.isSpender() && (
                      <Button
                        name="share-wallet"
                        loading={false}
                        onClick={(): void => {
                          WalletMemberModal({
                            wallet,
                            member,
                            is2FaEnabled: user.is2FaEnabled,
                            email: member.user,
                            shareWallet,
                            refresh,
                          })
                            .then(async (
                              { email }: {
                                email: string;
                                password: string;
                                accessLevel: number;
                              },
                            ) => {
                              const name = wallet.name;

                              showSuccessModal({
                                goBackCallback: () => {
                                  // eslint-disable-next-line
                                  console.log("User added.");
                                  refresh();
                                },
                                title: t("wallet.users.access.changed"),
                                message: (
                                  <div>
                                    <Trans i18nKey="wallet.users.access.changed.message" className="mb-3">
                                      {/* eslint-disable-next-line */}
                                      Access level to {{ name }} was changed for {{ email }}
                                    </Trans>
                                  </div>
                                ),
                                buttonText: t("common.ok"),
                              });
                            });
                        }}
                        variant={
                          isEnterprise
                            ? Button.variant.ENTERPRISE_LIGHT
                            : Button.variant.PRIMARY_LIGHT
                        }
                        size={Button.size.SMALL}
                      >
                        {t("wallet.users.change.button")}
                      </Button>
                    )}

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
          ))}

          {members.length === 0 && !loading && (
            <EmptyList
              message={t("wallet.users.list.no.users") as string}
              isEnterprise={isEnterprise}
            />
          )}

          {membersListMetaData.pages > 1 && (
            <Pagination
              loading={loading}
              page={page}
              pageCount={membersListMetaData.pages}
              hasNextPage={membersListMetaData.hasNextPage}
              hasPreviousPage={membersListMetaData.hasPreviousPage}
              onChange={onPage}
            />
          )}
        </div>
      </PlaceholderController>
    </div>
  );
};

export default UserList;
