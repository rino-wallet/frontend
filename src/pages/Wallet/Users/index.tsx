import React from "react";
import { useSelector, useThunkActionCreator } from "../../../hooks";
import { removeWalletAccess as removeWalletAccessThunk,  shareWallet as shareWalletThunk, requestWalletShare as requestWalletShareThunk, selectors } from "../../../store/walletSlice";
import { selectors as sessionSelectors } from "../../../store/sessionSlice";
import { fetchWalletShareRequests as fetchWalletShareRequestsThunk, selectors as walletShareSelectors } from "../../../store/walletShareRequestListSlice";
import Users from "./Users";
import { WalletLayout } from "../WalletLayout";
import { checkAccessLevel } from "../../../utils";
import { ShareWalletThunkPayload } from "../../../types";

interface Props {
  walletId: string;
}

const UsersContainer: React.FC<Props> = ({ walletId }) => {
  const wallet = useSelector(selectors.getWallet);
  const user = useSelector(sessionSelectors.getUser);
  const walletShareRequests = useSelector(walletShareSelectors.getWalletShareRequests)
  const getWalletShareRequests = useThunkActionCreator(fetchWalletShareRequestsThunk)
  const accessLevel = checkAccessLevel(user, wallet);
  const shareWallet = useThunkActionCreator(shareWalletThunk);
  const shareWalletAndRefresh = (data: ShareWalletThunkPayload): void => {
    shareWallet(data).then(() => {
      getWalletShareRequests({walletId, page: 1});
    });
  }
  const requestWalletShare = useThunkActionCreator(requestWalletShareThunk)
  const removeWalletAccess = useThunkActionCreator(removeWalletAccessThunk);
  return (
    <WalletLayout viewOnly={accessLevel.isViewOnly()} tab="users" wallet={wallet} id={walletId}>
      {
        wallet ? (
          <Users
            accessLevel={accessLevel}
            wallet={wallet}
            user={user}
            removeWalletAccess={removeWalletAccess}
            requestWalletShare={requestWalletShare}
            walletShareRequests={walletShareRequests}
            shareWallet={shareWalletAndRefresh}
          />
        ) : null
      }
    </WalletLayout>
  );
}

export default UsersContainer;
