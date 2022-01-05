import React, { useEffect, useState } from "react";
import { generatePath, Link } from "react-router-dom";
import { FetchWalletTransactionsResponse, FetchWalletTransactionsThunkPayload, Transaction } from "../../../types";
import routes from "../../../router/routes";
import TransactionItem from "./TransactionItem";
import TransactionItemPlaceholder from "./TransactionItemPlaceholder";
import { EmptyList } from "../../../components";
import { Pagination } from "../../../modules/index";

interface Props {
  walletId: string;
  transactions: Transaction[];
  loading: boolean;
  pages: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
  fetchWalletTransactions: (data: FetchWalletTransactionsThunkPayload) => Promise<FetchWalletTransactionsResponse>
}

const Transactions: React.FC<Props> = ({ transactions, walletId, loading, pages, hasPreviousPage, hasNextPage, fetchWalletTransactions }) => {
  const [page, setPage] = useState<number>(1);
  useEffect(() => {
    fetchWalletTransactions({ walletId, page });
  }, [page]);
  return (
    <div>
      {
        loading ? (
          <div>
            <TransactionItemPlaceholder />
            <TransactionItemPlaceholder />
            <TransactionItemPlaceholder />
            <TransactionItemPlaceholder />
            <TransactionItemPlaceholder />
            <TransactionItemPlaceholder />
          </div>
        ) : (
          <div>
            {
              (!transactions.length && !loading) && (
                <EmptyList message="No transactions yet." />
              )
            }
            {
              transactions.map((transaction ) => {
                return (
                  <Link
                    to={`${generatePath(routes.wallet, { id: walletId })}/transactions/${transaction.id}`}
                    key={transaction.id}
                    id={`transaction-${transaction.id}`}
                    className="block px-5 py-2 mb-1"
                  >
                    <TransactionItem transaction={transaction} />
                  </Link>
                )
              })
            }
            {
              pages > 0 && (
                <Pagination
                  loading={loading}
                  page={page}
                  hasNextPage={hasNextPage}
                  hasPreviousPage={hasPreviousPage}
                  onChange={setPage}
                />
              )
            }
          </div>
        )
      }
    </div>
  )
}

export default Transactions;
