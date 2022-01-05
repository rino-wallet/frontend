import React from "react";
import { useSelector, useThunkActionCreator } from "../../../hooks";
import {
  FetchWalletTransactionsResponse,
  FetchWalletTransactionsThunkPayload,
} from "../../../types";
import { fetchWalletTransactions as fetchWalletTransactionsThunk, selectors as transactionListSelectors } from "../../../store/transactionListSlice";
import { selectors as walletSelectors } from "../../../store/walletSlice";
import Transactions from "./Transactions";
import { WalletLayout } from "../WalletLayout";

interface Props {
  walletId: string;
}

const WalletPageContainer: React.FC<Props> = ({ walletId }) => {
  const wallet = useSelector(walletSelectors.getWallet);
  const transactions = useSelector(transactionListSelectors.getTransactions);
  const loading = useSelector(transactionListSelectors.pendingFetchWalletTransactions);
  const {pages, hasPreviousPage, hasNextPage} = useSelector(transactionListSelectors.getListMetaData);
  const fetchWalletTransactions = useThunkActionCreator<FetchWalletTransactionsResponse, FetchWalletTransactionsThunkPayload>(fetchWalletTransactionsThunk);
  return (
    <WalletLayout tab="transactions" id={walletId} wallet={wallet}>
      <Transactions
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
