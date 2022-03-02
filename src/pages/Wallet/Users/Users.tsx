
import React from "react";
import { useNavigate } from "react-router-dom";
import { RemoveWalletAccessPayload, RemoveWalletAccessResponse, ShareWalletThunkPayload, User, Wallet } from "../../../types";
import { Panel, Button, Icon } from "../../../components";
import { showSuccessModal } from "../../../modules/index";
import WalletMemberLayout from "./WalletMemberLayout";
import WalletMemberPlaceholder from "./WalletMemberPlaceholder";
import addWalletMemberModal from "./AddWalletMember";
import removeWalletMember from "./RemoveWalletMember"
import routes from "../../../router/routes"

interface Props {
  wallet: Wallet;
  user: User;
  canShare: boolean;
  shareWallet: (data: ShareWalletThunkPayload) => Promise<void>;
  removeWalletAccess: (data: RemoveWalletAccessPayload) => Promise<RemoveWalletAccessResponse>;
}

const Users: React.FC<Props> = ({ canShare, wallet, user, shareWallet, removeWalletAccess }) => {
  const navigate = useNavigate();
  async function onAddUserClick(): Promise<void> {
    addWalletMemberModal({ wallet, is2FaEnabled: user.is2FaEnabled, shareWallet })
    .then(async ({ email }: { email: string; password: string; accessLevel: number }) => {
      showSuccessModal({
        goBackCallback: () => { console.log("User added."); },
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
                    action={member.accessLevel !== "Owner" ? (
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
                    ) : <div />} />
                </div>
              )
            })
          }
      </div>
    </Panel>
  );
};

export default Users;
