import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FetchWalletTransactionsResponse, FetchWalletTransactionsThunkPayload, Transaction } from "../../../types";
import { useQuery } from "../../../hooks";
import TransactionItem from "./TransactionItem";
import TransactionItemPlaceholder from "./TransactionItemPlaceholder";
import TransactionItemLayout from "./TransactionItemLayout";
import { EmptyList, Panel } from "../../../components";
import { Pagination } from "../../../modules/index";

interface Props {
  itemsPerPage: number;
  walletId: string;
  transactions: Transaction[];
  pages: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
  fetchWalletTransactions: (data: FetchWalletTransactionsThunkPayload) => Promise<FetchWalletTransactionsResponse>
  isPublicWallet?: boolean;
}

const Transactions: React.FC<Props> = ({
  itemsPerPage,
  transactions,
  walletId,
  pages,
  hasPreviousPage,
  hasNextPage,
  fetchWalletTransactions,
  isPublicWallet,
}) => {
  const [listLoading, setListLoading] = useState(true);
  const [isFirstLoading, setIsFirstLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  const query = useQuery();
  const page = parseInt(query.get("page"), 10) || 1;
  useEffect(() => {
    async function asyncFetchWalletTransactions() {
      setListLoading(true);
      await fetchWalletTransactions({ walletId, page });
      setTimeout(() => {
        setIsFirstLoading(false);
        setListLoading(false);
      }, 300);
    }
    asyncFetchWalletTransactions();
    let intervalId: any;
    if (!isPublicWallet) {
      intervalId = setInterval(() => fetchWalletTransactions({ walletId, page }), 30000);
    }
    return (): void => clearInterval(intervalId);
  }, [page]);
  function setPage(p: number): void {
    setIsFirstLoading(true);
    navigate(`${location.pathname}?page=${p}`);
  }
  return (
    <div>
      <Panel title="Transaction list">
        <div>
          <div className="hidden theme-bg-panel-second md:block">
            <TransactionItemLayout
              type={(<span className="text-sm uppercase">Type</span>)}
              amount={(<span className="text-sm uppercase">Amount</span>)}
              timestamp={(<span className="text-sm uppercase">Date</span>)}
              status={(<span className="text-sm uppercase">Status</span>)}
              action={(<span className="text-sm uppercase" />)}
            />
          </div>
          {
            (listLoading && isFirstLoading) ? (
              <div>
                {
                  Array.from({ length: itemsPerPage }, (v, i) => i).map((key, index) => (
                    <div className={index % 2 !== 0 ? "theme-bg-panel-second bg-opacity-50 py-1.5" : "py-1.5"} key={key}>
                      <TransactionItemPlaceholder key={key} />
                    </div>
                  ))
                }
              </div>
            ) : (
              <div>
                {
                  (!transactions.length && !listLoading) && (
                    <EmptyList message="No transactions yet." />
                  )
                }
                {
                    transactions.map((transaction, index) => (
                      <div key={transaction.id} className={index % 2 !== 0 ? "theme-bg-panel-second bg-opacity-50" : ""}>
                        <TransactionItem isPublicWallet={isPublicWallet} walletId={walletId} transaction={transaction} />
                      </div>
                    ))
                  }
              </div>
            )
          }
        </div>
      </Panel>
      {
        pages > 1 && (
          <Pagination
            loading={listLoading}
            page={page}
            pageCount={pages}
            hasNextPage={hasNextPage}
            hasPreviousPage={hasPreviousPage}
            onChange={setPage}
          />
        )
      }
    </div>
  );
};

export default Transactions;
