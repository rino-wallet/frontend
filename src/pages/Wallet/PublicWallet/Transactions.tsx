import React from "react";
import { useSelector, useThunkActionCreator } from "../../../hooks";
import { fetchWalletTransactions as fetchWalletTransactionsThunk, selectors as transactionListSelectors, ITEMS_PER_PAGE } from "../../../store/publicWalletTransactionListSlice";
import { selectors as walletSelectors } from "../../../store/publicWalletSlice";
import Transactions from "../Transactions/Transactions";
import { WalletPageTemplate } from "../WalletPageTemplate";

interface Props {
  walletId: string;
}

export const TransactionsContainer: React.FC<Props> = ({ walletId }) => {
  const wallet = useSelector(walletSelectors.getWallet);
  const transactions = useSelector(transactionListSelectors.getTransactions);
  const { pages, hasPreviousPage, hasNextPage } = useSelector(transactionListSelectors.getListMetaData);
  const fetchWalletTransactions = useThunkActionCreator(fetchWalletTransactionsThunk);

  return (
    <WalletPageTemplate
      wallet={wallet}
      id={walletId}
      showActions
      isPublicWallet
      viewOnly
    >
      <Transactions
        itemsPerPage={ITEMS_PER_PAGE}
        walletId={walletId}
        transactions={transactions}
        pages={pages}
        hasPreviousPage={hasPreviousPage}
        hasNextPage={hasNextPage}
        fetchWalletTransactions={fetchWalletTransactions}
        isPublicWallet
      />
    </WalletPageTemplate>
  );
};
