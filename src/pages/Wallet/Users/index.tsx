import React from "react";
import { useSelector, useThunkActionCreator } from "../../../hooks";
import { removeWalletAccess as removeWalletAccessThunk, shareWallet as shareWalletThunk, selectors } from "../../../store/walletSlice";
import { selectors as sessionSelectors } from "../../../store/sessionSlice";
import Users from "./Users";
import { WalletLayout } from "../WalletLayout";

interface Props {
  walletId: string;
  canShare: boolean;
}

const UsersContainer: React.FC<Props> = ({ walletId, canShare }) => {
  const wallet = useSelector(selectors.getWallet);
  const user = useSelector(sessionSelectors.getUser);
  const shareWallet = useThunkActionCreator(shareWalletThunk);
  const removeWalletAccess = useThunkActionCreator(removeWalletAccessThunk);
  return (
    <WalletLayout tab="users" wallet={wallet} id={walletId}>
      {
        wallet ? (
          <Users
            canShare={canShare}
            wallet={wallet}
            user={user}
            removeWalletAccess={removeWalletAccess}
            shareWallet={shareWallet}
          />
        ) : null
      }
    </WalletLayout>
  );
}

export default UsersContainer;
