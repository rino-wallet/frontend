import React from "react";
import { FormikErrors } from "formik";
import { selectors as sessionSelectors } from "../../../../../store/sessionSlice";
import {
  createTransaction as createTransactionThunk,
  syncMultisig as syncMultisigThunk,
  fetchWalletDetails as fetchWalletDetailsThunk,
  pollCreateTransactionTask as pollCreateTransactionTaskThunk,
  selectors as walletSelectors,
} from "../../../../../store/walletSlice";
import { useSelector, useThunkActionCreator } from "../../../../../hooks";
import ConfirmTransaction from "./ConfirmTransaction";

interface Props {
  loading: boolean;
  walletId: string;
  errors: FormikErrors<{ address: string; amount: string; password: string; message: string; memo: string; priority: string; non_field_errors: string; }>;
  onEdit: (values: any) => void;
  transactionData: {
    address: string;
    amount: string;
    memo?: string;
    priority?: string;
    fee?: number | undefined;
  }
}

const ConfirmTransactionContainer: React.FC<Props> = ({
  walletId, onEdit, transactionData, errors, loading,
}) => {
  const walletData = useSelector(walletSelectors.getWallet);
  const user = useSelector(sessionSelectors.getUser);
  const stage = useSelector(walletSelectors.getStage);
  const pendingTransaction = useSelector(walletSelectors.getPendingTransaction);
  const fetchWalletDetails = useThunkActionCreator(fetchWalletDetailsThunk);
  const pollCreateTransactionTask = useThunkActionCreator(pollCreateTransactionTaskThunk);
  const createTransaction = useThunkActionCreator(createTransactionThunk);
  const syncMultisig = useThunkActionCreator(syncMultisigThunk);
  return (
    <ConfirmTransaction
      loading={loading}
      wallet={walletData}
      walletId={walletId}
      stage={stage}
      pendingTransaction={pendingTransaction}
      fetchWalletDetails={fetchWalletDetails}
      pollCreateTransactionTask={pollCreateTransactionTask}
      createTransaction={createTransaction}
      syncMultisig={syncMultisig}
      transactionData={transactionData}
      is2FaEnabled={user?.is2FaEnabled}
      onEdit={onEdit}
      errors={errors}
    />
  );
};

export default ConfirmTransactionContainer;
