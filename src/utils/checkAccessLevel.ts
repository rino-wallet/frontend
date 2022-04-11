import { accessLevels } from "../constants";
import { User, WalletMember, Wallet } from "../types";

export function checkAccessLevel(user: User | null, wallet: Wallet): {
  isAdmin: () => boolean;
  isOwner: () => boolean;
  isViewOnly: () => boolean;
} {
  const walletMember = user
    && wallet?.members.find((member: WalletMember) => member.user === user.email);
  return {
    isAdmin: (): boolean => {
      return walletMember?.accessLevel === accessLevels.admin.title;
    },
    isOwner: (): boolean => {
      return walletMember?.accessLevel === accessLevels.owner.title;
    },
    isViewOnly: (): boolean => {
      return walletMember?.accessLevel === accessLevels.viewOnly.title;
    },
  }
}
