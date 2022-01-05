import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useSelector, useDispatch, useThunkActionCreator } from "../../../hooks";
import {
  FetchTransactionDetailsResponse,
  FetchTransactionDetailsPayload,
} from "../../../types";
import { fetchTransactionDetails as fetchTransactionDetailsThunk, reset, selectors as transactionDetailsSelectors } from "../../../store/transactionDetailsSlice";
import { selectors as walletSelectors } from "../../../store/walletSlice";
import TransactionDetails from "./TransactionDetails";
import { WalletLayout } from "../WalletLayout";

interface Props {
  walletId: string;
}

const TransactionDetailsContainer: React.FC<Props> = ({ walletId }) => {
  const { transactionId } = useParams<{ transactionId: string }>();
  const wallet = useSelector(walletSelectors.getWallet);
  const transaction = useSelector(transactionDetailsSelectors.getTransaction);
  const fetchTransactionDetails = useThunkActionCreator<FetchTransactionDetailsResponse, FetchTransactionDetailsPayload>(fetchTransactionDetailsThunk);
  const dispatch = useDispatch();
  useEffect(() => {
    (async (): Promise<void> => {
      await fetchTransactionDetails({ walletId, transactionId });
    })();
    return (): void => {
      dispatch(reset())
    }
  }, []);
  return (
    <WalletLayout tab="transactions" wallet={wallet} id={walletId} >
      <TransactionDetails transaction={transaction} />
    </WalletLayout>
  );
}

export default TransactionDetailsContainer;
