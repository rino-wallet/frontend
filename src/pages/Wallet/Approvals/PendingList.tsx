import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  FetchPendingTranfersResponse, FetchPendingTransfersThunkPayload, PendingTransfer, ListMetadata,
} from "../../../types";
import { useQuery } from "../../../hooks";
import ApprovalTransactionItem from "./ApprovalTransactionItem";
import TransactionItemPlaceholder from "./ApprovalTransactionItemPlaceholder";
import TransactionItemLayout from "./ApprovalTransactionItemLayout";
import { EmptyList, Panel } from "../../../components";
import { Pagination } from "../../../modules/index";

interface Props {
  itemsPerPage: number;
  walletId: string;
  entities: PendingTransfer[],
  listMetaData: ListMetadata,
  fetchFunc: (data: FetchPendingTransfersThunkPayload) => Promise<FetchPendingTranfersResponse>,
  callback: (data: FetchPendingTransfersThunkPayload) => Promise<FetchPendingTranfersResponse>,
  isPublicWallet?: boolean;
}

const PendingList: React.FC<Props> = ({
  itemsPerPage,
  walletId,
  entities,
  listMetaData,
  fetchFunc,
  callback,
  isPublicWallet,
}) => {
  const [listLoading, setListLoading] = useState(true);
  const [isFirstLoading, setIsFirstLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  const query = useQuery();
  const page = parseInt(query.get("page_pending"), 10) || 1;

  async function refetchPendingTransfers() {
    await fetchFunc({ walletId, page });
    await callback({ walletId, page });
  }

  useEffect(() => {
    async function asyncFetchWalletTransactions() {
      setListLoading(true);
      await fetchFunc({ walletId, page });
      setTimeout(() => {
        setIsFirstLoading(false);
        setListLoading(false);
      }, 300);
    }
    asyncFetchWalletTransactions();
    let intervalId: any;
    if (!isPublicWallet) {
      intervalId = setInterval(() => {
        fetchFunc({ walletId, page });
      }, 30000);
    }
    return (): void => clearInterval(intervalId);
  }, [page]);
  function setPage(p: number): void {
    setIsFirstLoading(true);
    navigate(`${location.pathname}?page_pending=${p}`);
  }
  return (
    <Panel title="Pending Approvals" className="border-none">
      <div>
        <div className="hidden theme-bg-panel-second md:block">
          <TransactionItemLayout
            amount={(<span className="text-sm uppercase">Amount</span>)}
            timestamp={(<span className="text-sm uppercase">Date</span>)}
            submitedBy={(<span className="text-sm uppercase">Submited By</span>)}
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
                  (!entities?.length && !listLoading) && (
                    <EmptyList message="No pending transfers yet." />
                  )
              }
              {
                  entities?.map((transaction, index) => (
                    <div key={transaction.id} className={index % 2 !== 0 ? "theme-bg-panel-second bg-opacity-50" : ""}>
                      <ApprovalTransactionItem updateTransfers={refetchPendingTransfers} walletId={walletId} transaction={transaction} />
                    </div>
                  ))
                }
            </div>
          )
        }
      </div>
      {
        listMetaData.pages > 1 && (
          <Pagination
            loading={listLoading}
            page={page}
            pageCount={listMetaData.pages}
            hasNextPage={listMetaData.hasNextPage}
            hasPreviousPage={listMetaData.hasPreviousPage}
            onChange={setPage}
          />
        )
      }
    </Panel>
  );
};

export default PendingList;
