import React from "react";
import { useSelector, useThunkActionCreator } from "../../../hooks";
import {
  FetchWalletTransactionsResponse,
  FetchWalletTransactionsThunkPayload,
} from "../../../types";
import { selectors as sessionSelectors } from "../../../store/sessionSlice";
import { fetchWalletTransactions as fetchWalletTransactionsThunk, selectors as transactionListSelectors, ITEMS_PER_PAGE } from "../../../store/transactionListSlice";
import { selectors as walletSelectors } from "../../../store/walletSlice";
import Transactions from "./Transactions";
import { WalletLayout } from "../WalletLayout";
import { checkAccessLevel } from "../../../utils";

interface Props {
  walletId: string;
}

const WalletPageContainer: React.FC<Props> = ({ walletId }) => {
  const wallet = useSelector(walletSelectors.getWallet);
  const user = useSelector(sessionSelectors.getUser);
  const transactions = useSelector(transactionListSelectors.getTransactions);
  const loading = useSelector(transactionListSelectors.pendingFetchWalletTransactions);
  const {pages, hasPreviousPage, hasNextPage} = useSelector(transactionListSelectors.getListMetaData);
  const fetchWalletTransactions = useThunkActionCreator<FetchWalletTransactionsResponse, FetchWalletTransactionsThunkPayload>(fetchWalletTransactionsThunk);
  const accessLevel = checkAccessLevel(user, wallet);
  return (
    <WalletLayout viewOnly={accessLevel.isViewOnly()} tab="transactions" id={walletId} wallet={wallet}>
      <Transactions
        itemsPerPage={ITEMS_PER_PAGE}
        walletId={walletId}
        transactions={transactions}
        loading={loading}
        pages={pages}
        hasPreviousPage={hasPreviousPage}
        hasNextPage={hasNextPage}
        fetchWalletTransactions={fetchWalletTransactions}
      />
    </WalletLayout>
  )
}

export default WalletPageContainer;
