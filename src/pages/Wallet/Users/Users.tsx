
import React from "react";
import { Link, generatePath } from "react-router-dom";
import { RemoveWalletAccessPayload, RemoveWalletAccessResponse, Wallet } from "../../../types";
import { Button, Spinner } from "../../../components";
import { accessLevels } from "../../../constants";
import routes from "../../../router/routes";

interface Props {
  wallet: Wallet;
  walletId: string;
  loading: boolean;
  canShare: boolean;
  removeWalletAccess: (data: RemoveWalletAccessPayload) => Promise<RemoveWalletAccessResponse>;
}

const Users: React.FC<Props> = ({ wallet, removeWalletAccess, walletId, loading, canShare }) => {
  return (
    <div>
      <div className="flex justify-between items-center space-x-3 p-4 border-b border-gray-200">
        <span className="text-base">Users</span>
        {
          canShare && (
            <div className="font-medium text-base">
              <Link to={`${generatePath(routes.wallet, { id: walletId })}/users/add`}>
                <Button
                  name="add-user-btn"
                  type="button"
                  size={Button.size.MEDIUM}
                >
                  Add User
                </Button>
              </Link>
            </div>
          )
        }
      </div>
      <div className="p-5 h-60 relative">
        {
          loading && <Spinner stub />
        }
        <table className="table-auto text-left w-full">
          <thead>
            <tr>
              <th className="uppercase font-normal text-secondary text-xs py-1">e-mail</th>
              <th className="uppercase font-normal text-secondary text-xs px-1 py-1">role</th>
            </tr>
          </thead>
          <tbody>
            {
              wallet.members.map((member) => {
                return (
                  <tr key={member.user} data-qa-selector="wallet-member">
                    <td className="py-1">{member.user}</td>
                    <td className="px-1 py-1">
                      <span data-qa-selector="access-level">
                        {member.accessLevel}
                      </span>
                      {
                        member.accessLevel !== accessLevels.owner.title && (
                          <button
                            type="button"
                            name={`remove-user-${member.id}`}
                            onClick={async (): Promise<void> => {
                              await removeWalletAccess({ walletId: wallet.id, userId: member.id });
                            }}
                          >
                            <div className="text-xs mx-1">&#10060;</div>
                          </button>
                        )
                      }
                    </td>
                  </tr>
                )
              })
            }
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Users;
