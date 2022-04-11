
import React from "react";
import { useNavigate } from "react-router-dom";
import {
  RemoveWalletAccessPayload,
  RemoveWalletAccessResponse,
  RequestWalletShareThunkPayload,
  ShareWalletThunkPayload,
  User,
  Wallet,
  WalletShareRequest,
  WalletMember,
} from "../../../types";
import { Panel, Button, Icon } from "../../../components";
import { showSuccessModal } from "../../../modules/index";
import WalletMemberLayout from "./WalletMemberLayout";
import WalletMemberPlaceholder from "./WalletMemberPlaceholder";
import AddWalletShareRequestModal from "./AddWalletShareRequest";
import removeWalletMember from "./RemoveWalletMember"
import routes from "../../../router/routes"
import { accessLevels } from "../../../constants";
import AddWalletMemberModal from "./AddWalletMember";


interface AccessLevelInt {
  isAdmin: () => boolean;
  isOwner: () => boolean;
  isViewOnly: () => boolean;
}


function showDeleteButton(currentUserAccess: AccessLevelInt, currentUser: User, walletMember: WalletMember): boolean {
  switch (walletMember.accessLevel) {
    case accessLevels.viewOnly.title: {
      return currentUserAccess.isAdmin() || currentUserAccess.isOwner() || walletMember.user === currentUser.email;
    }
    case accessLevels.admin.title: {
      return currentUserAccess.isAdmin() || currentUserAccess.isOwner();
    }
    default:
      return false;
  }
}
interface Props {
  wallet: Wallet;
  user: User;
  accessLevel: AccessLevelInt;
  shareWallet: (data: ShareWalletThunkPayload) => void;
  requestWalletShare: (data: RequestWalletShareThunkPayload) => Promise<void>;
  removeWalletAccess: (data: RemoveWalletAccessPayload) => Promise<RemoveWalletAccessResponse>;
  walletShareRequests: WalletShareRequest[];
}

const Users: React.FC<Props> = ({ accessLevel, wallet, user, shareWallet, walletShareRequests, requestWalletShare, removeWalletAccess }) => {
  const navigate = useNavigate();
  const canShare = accessLevel.isAdmin() || accessLevel.isOwner();
  async function onAddUserClick(): Promise<void> {
    AddWalletShareRequestModal({ wallet, is2FaEnabled: user.is2FaEnabled, requestWalletShare })
    .then(async ({ email }: { email: string; password: string; accessLevel: number }) => {
      showSuccessModal({
        goBackCallback: () => { console.log("Share request created."); },
        title: "Invite Sent",
        message: (
          <div>
            <p className="mb-3">We have sent invitation to share access to {wallet.name} to this user:</p>
            <span className="font-bold">{email}</span>
          </div>
        ),
        buttonText: "OK",
      });
    });
  }
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
              wallet?.members.map((member, index) => {
                return (
                  <div key={member.id} className={index % 2 !== 0 ? "theme-bg-panel-second bg-opacity-50" : ""}>
                      <WalletMemberLayout
                        role={member.accessLevel}
                        email={member.user}
                        action={
                        <div>
                          {
                            (showDeleteButton(accessLevel, user, member)) && (
                              <button
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
                                <span className="text-xs"><Icon name="cross" /></span>
                              </button>
                            )
                          }
                        </div>
                        }
                      />
                  </div>
                )
              })
            }
        </div>
        {walletShareRequests.length > 0 ? (
          <div>
            <h2 className="mx-10 my-4 text-xl font-bold flex items-center overflow-ellipsis overflow-hidden whitespace-nowrap">Pending Shares<span className="inline-block w-2 h-2 mr-2 bg-red-600 rounded-full ml-1" /></h2>
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
                      action={<Button
                          name="share-wallet"
                          loading={false}
                          onClick={(): void => {
                            AddWalletMemberModal({ wallet, is2FaEnabled: user.is2FaEnabled, email: shareRequest.email, shareWallet })
                              .then(async ({ email }: { email: string; password: string; accessLevel: number }) => {
                                showSuccessModal({
                                  goBackCallback: () => { console.log("User added."); },
                                  title: "User added",
                                  message: (
                                    <div>
                                      <p className="mb-3">{`User ${email} was added to the wallet.`}</p>
                                    </div>
                                  ),
                                  buttonText: "OK",
                                });
                              });
                          }}
                          variant={Button.variant.PRIMARY}
                          size={Button.size.SMALL}
                        >
                          Share
                        </Button>
                       }
                    />
                  </div>)
                )
              }
            </div>
          </div>
          ) : null }
      </Panel>
    </div>
  );
};

export default Users;
