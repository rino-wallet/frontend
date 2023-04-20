import React from "react";
import { useSelector, useThunkActionCreator } from "../../../hooks";
import { selectors as sessionSelectors } from "../../../store/sessionSlice";
import { selectors as walletSelectors } from "../../../store/walletSlice";
import { WalletLayout } from "../WalletLayout";
import { checkAccessLevel } from "../../../utils";
import PendingList from "./PendingList";
import HistoryList from "./HistoryList";
import {
  fetchEntities as fetchPendingTransfersThunk,
  selectors as pendingTransfersSelectors,
  ITEMS_PER_PAGE as PENDING_ITEMS_PER_PAGE,
} from "../../../store/pendingTransfersSlice";
import {
  fetchEntities as fetchPendingTransfersHistoryThunk,
  selectors as historyTransfersSelectors,
  ITEMS_PER_PAGE as HISTORY_ITEMS_PER_PAGE,
} from "../../../store/historyTransfersSlice";

interface Props {
  walletId: string;
}

const WalletPageContainer: React.FC<Props> = ({ walletId }) => {
  const wallet = useSelector(walletSelectors.getWallet);
  const user = useSelector(sessionSelectors.getUser);
  const accessLevel = checkAccessLevel(user, wallet);
  const pendingTransfersHistory = useSelector(historyTransfersSelectors.getEntities);
  const pendingTransfers = useSelector(pendingTransfersSelectors.getEntities);
  const pendingTransfersListMetaData = useSelector(pendingTransfersSelectors.getListMetaData);
  const historyTransfersListMetaData = useSelector(historyTransfersSelectors.getListMetaData);
  const fetchPendingTransfersHistory = useThunkActionCreator(fetchPendingTransfersHistoryThunk);
  const fetchPendingTransfers = useThunkActionCreator(fetchPendingTransfersThunk);
  return (
    <WalletLayout viewOnly={accessLevel.isViewOnly()} tab="approvals" id={walletId} wallet={wallet}>
      <div className="theme-bg-panel border-solid border theme-border rounded-medium">
        <PendingList
          itemsPerPage={PENDING_ITEMS_PER_PAGE}
          walletId={walletId}
          entities={pendingTransfers}
          listMetaData={pendingTransfersListMetaData}
          fetchFunc={fetchPendingTransfers}
          callback={fetchPendingTransfersHistory}
        />
        <HistoryList
          itemsPerPage={HISTORY_ITEMS_PER_PAGE}
          walletId={walletId}
          entities={pendingTransfersHistory}
          listMetaData={historyTransfersListMetaData}
          fetchFunc={fetchPendingTransfersHistory}
        />
      </div>
    </WalletLayout>
  );
};

export default WalletPageContainer;
