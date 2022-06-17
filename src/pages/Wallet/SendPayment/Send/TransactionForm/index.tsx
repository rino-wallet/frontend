import React from "react";
import {
  selectors as walletSelectors,
  openWallet as openWalletThunk,
  getOutputs as getOutputsThunk,
  prepareTransaction as prepareTransactionThunk,
  resetPendingTransaction as resetPendingTransactionAction,
} from "../../../../../store/walletSlice";
import { useDispatch, useSelector, useThunkActionCreator } from "../../../../../hooks";
import TransactionForm from "./TransactionForm";

interface Props {
  walletId: string;
  setActiveTab: (value: number) => void;
}

const TransactionFormContainer: React.FC<Props> = ({ walletId, setActiveTab }) => {
  const walletData = useSelector(walletSelectors.getWallet);
  const dispatch = useDispatch();
  const openWallet = useThunkActionCreator(openWalletThunk);
  const getOutputs = useThunkActionCreator(getOutputsThunk);
  const resetPendingTransaction = (): void => { dispatch(resetPendingTransactionAction()); };
  const prepareTransaction = useThunkActionCreator(prepareTransactionThunk);
  return (
    <TransactionForm
      wallet={walletData}
      walletId={walletId}
      setActiveTab={setActiveTab}
      openWallet={openWallet}
      getOutputs={getOutputs}
      prepareTransaction={prepareTransaction}
      resetPendingTransaction={resetPendingTransaction}
    />
  );
};

export default TransactionFormContainer;
