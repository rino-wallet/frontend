import { useMemo } from "react";
import { useSelector } from ".";
import { selectors as walletSelectors } from "../store/walletSlice";

export const useRequireApprovers = () => {
  const currentWallet = useSelector(walletSelectors.getWallet);

  const requireApprovers: boolean | undefined = useMemo(() => {
    const accessLevels = ["Admin", "Spender", "Approver"];
    const numberOfApprovers = currentWallet?.members.filter((member) => accessLevels.includes(member.accessLevel)).length;
    return currentWallet?.minApprovals > numberOfApprovers;
  }, [currentWallet]);

  return requireApprovers;
};
