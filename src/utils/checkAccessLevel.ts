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
    isAdmin: (): boolean => walletMember?.accessLevel === accessLevels.admin.value,
    isOwner: (): boolean => walletMember?.accessLevel === accessLevels.owner.value,
    isViewOnly: (): boolean => walletMember?.accessLevel === accessLevels.viewOnly.value,
  };
}
