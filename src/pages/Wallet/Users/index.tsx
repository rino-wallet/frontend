import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useSelector, useThunkActionCreator } from "../../../hooks";
import {
  removeWalletAccess as removeWalletAccessThunk,
  shareWallet as shareWalletThunk,
  requestWalletShare as requestWalletShareThunk,
  fetchRemovedUsers as fetchRemovedUsersThunk,
  selectors,
} from "../../../store/walletSlice";
import { selectors as sessionSelectors } from "../../../store/sessionSlice";
import {
  fetchWalletShareRequests as fetchWalletShareRequestsThunk,
  selectors as walletShareRequestsSelectors,
} from "../../../store/walletShareRequestListSlice";
import Users from "./Users";
import { WalletLayout } from "../WalletLayout";
import { checkAccessLevel } from "../../../utils";
import { ShareWalletThunkPayload } from "../../../types";

interface Props {
  walletId: string;
  refresh: () => Promise<void>;
}

const UsersContainer: React.FC<Props> = ({ walletId, refresh }) => {
  const { shareId } = useParams();
  const wallet = useSelector(selectors.getWallet);
  const revokedUser = useSelector(selectors.getRevokedUsers);
  const user = useSelector(sessionSelectors.getUser);
  const loading = useSelector(walletShareRequestsSelectors.pendingFetchWalletShareRequests);
  const walletShareRequests = useSelector(walletShareRequestsSelectors.getWalletShareRequests);
  const shareRequestListMetaData = useSelector(walletShareRequestsSelectors.getListMetaData);
  const fetchWalletShareRequests = useThunkActionCreator(fetchWalletShareRequestsThunk);
  const fetchRemovedUsers = useThunkActionCreator(fetchRemovedUsersThunk);
  const accessLevel = checkAccessLevel(user, wallet);
  const shareWallet = useThunkActionCreator(shareWalletThunk);
  const shareWalletAndRefresh = (data: ShareWalletThunkPayload): Promise<void> => shareWallet(data).then(() => {
    fetchWalletShareRequests({ walletId, page: 1 });
  });
  const requestWalletShare = useThunkActionCreator(requestWalletShareThunk);
  const removeWalletAccess = useThunkActionCreator(removeWalletAccessThunk);
  useEffect(() => {
    fetchRemovedUsers({ walletId });
  }, []);
  return (
    <WalletLayout viewOnly={accessLevel.isViewOnly()} tab="users" wallet={wallet} id={walletId}>
      {
        wallet ? (
          <Users
            revokedUsers={revokedUser}
            accessLevel={accessLevel}
            wallet={wallet}
            user={user}
            finalizeShareId={shareId}
            removeWalletAccess={removeWalletAccess}
            requestWalletShare={requestWalletShare}
            walletShareRequests={walletShareRequests}
            shareWallet={shareWalletAndRefresh}
            loading={loading}
            refresh={refresh}
            shareRequestListMetaData={shareRequestListMetaData}
            fetchWalletShareRequests={fetchWalletShareRequests}
          />
        ) : null
      }
    </WalletLayout>
  );
};

export default UsersContainer;
