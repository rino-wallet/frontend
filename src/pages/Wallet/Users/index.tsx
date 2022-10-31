import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { useSelector, useThunkActionCreator } from "../../../hooks";
import {
  removeWalletAccess as removeWalletAccessThunk,
  shareWallet as shareWalletThunk,
  requestWalletShare as requestWalletShareThunk,
  selectors,
} from "../../../store/walletSlice";
import {
  fetchRevokedMembers as fetchRevokedMembersThunk,
  fetchWalletMembers as fetchWalletMembersThunk,
  selectors as walletMembersSelector,
} from "../../../store/walletMembersListSlice";
import { selectors as sessionSelectors } from "../../../store/sessionSlice";
import {
  fetchWalletShareRequests as fetchWalletShareRequestsThunk,
  selectors as walletShareRequestsSelectors,
} from "../../../store/walletShareRequestListSlice";
import Users from "./Users";
import { WalletLayout } from "../WalletLayout";
import { checkAccessLevel } from "../../../utils";
import { ShareWalletThunkPayload } from "../../../types";
import UserList from "./UserList";

interface Props {
  walletId: string;
  refresh: () => Promise<void>;
}

const UsersContainer: React.FC<Props> = ({ walletId, refresh }) => {
  const [showRevokedUsers, setShowRevokedUsers] = useState(false);
  const { shareId } = useParams();
  const wallet = useSelector(selectors.getWallet);
  const members = useSelector(walletMembersSelector.getEntities);
  const pendingFetchWalletMembers = useSelector(walletMembersSelector.pendingFetchWalletMembers);
  const pendingFetchRevokedMembers = useSelector(walletMembersSelector.pendingFetchRevokedMembers);
  const membersListMetaData = useSelector(walletMembersSelector.getListMetaData);
  const user = useSelector(sessionSelectors.getUser);
  const loadingShareRequests = useSelector(walletShareRequestsSelectors.pendingFetchWalletShareRequests);
  const walletShareRequests = useSelector(walletShareRequestsSelectors.getWalletShareRequests);
  const shareRequestListMetaData = useSelector(walletShareRequestsSelectors.getListMetaData);
  const fetchWalletShareRequests = useThunkActionCreator(fetchWalletShareRequestsThunk);
  const fetchRevokedUsers = useThunkActionCreator(fetchRevokedMembersThunk);
  const fetchWalletUsers = useThunkActionCreator(fetchWalletMembersThunk);
  const accessLevel = checkAccessLevel(user, wallet);
  const shareWallet = useThunkActionCreator(shareWalletThunk);
  const shareWalletAndRefresh = (data: ShareWalletThunkPayload): Promise<void> => shareWallet(data).then(() => {
    fetchWalletShareRequests({ walletId, page: 1 });
  });
  const requestWalletShare = useThunkActionCreator(requestWalletShareThunk);
  const removeWalletAccess = useThunkActionCreator(removeWalletAccessThunk);
  return (
    <WalletLayout viewOnly={accessLevel.isViewOnly()} tab="users" wallet={wallet} id={walletId}>
      {
        wallet ? (
          <Users
            accessLevel={accessLevel}
            wallet={wallet}
            user={user}
            finalizeShareId={shareId}
            requestWalletShare={requestWalletShare}
            walletShareRequests={walletShareRequests}
            shareWallet={shareWalletAndRefresh}
            refresh={refresh}
            shareRequestListMetaData={shareRequestListMetaData}
            fetchWalletShareRequests={fetchWalletShareRequests}
            loadingShareRequests={loadingShareRequests}
            showRevokedUsers={showRevokedUsers}
            setShowRevokedUsers={setShowRevokedUsers}
          >
            <UserList
              members={members}
              wallet={wallet}
              user={user}
              accessLevel={accessLevel}
              shareWallet={shareWalletAndRefresh}
              removeWalletAccess={removeWalletAccess}
              membersListMetaData={membersListMetaData}
              refresh={refresh}
              loading={pendingFetchWalletMembers || pendingFetchRevokedMembers}
              fetchRevokedMembers={fetchRevokedUsers}
              fetchWalletMembers={fetchWalletUsers}
              showRevokedUsers={showRevokedUsers}
            />

          </Users>
        ) : null
      }
    </WalletLayout>
  );
};

export default UsersContainer;
