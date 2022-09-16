import React, { useEffect, useState } from "react";
import ExchangePayment from "./ExchangePayment";
import { useSelector, useDispatch, useThunkActionCreator } from "../../../../../hooks";
import {
  getExchangeRange as getExchangeRangeThunk,
  selectors as exchangeSelectors,
} from "../../../../../store/exchangeSlice";
import { selectors as sessionSelectors } from "../../../../../store/sessionSlice";
import {
  createTransaction as createTransactionThunk,
  syncMultisig as syncMultisigThunk,
  fetchWalletDetails as fetchWalletDetailsThunk,
  selectors as walletSelectors,
  openWallet as openWalletThunk,
  getOutputs as getOutputsThunk,
  prepareTransaction as prepareTransactionThunk,
  resetPendingTransaction as resetPendingTransactionAction,
  pollCreateTransactionTask as pollCreateTransactionTaskThunk,
} from "../../../../../store/walletSlice";
import { AppDispatch } from "../../../../../types";

interface Props {
  walletId: string;
  onEdit: () => void;
}

const ExchangeContainer: React.FC<Props> = ({ walletId, onEdit }) => {
  const [currentWalletCall, setCurrentWalletCall] = useState<Promise<AppDispatch> | any>(null);
  const dispatch = useDispatch();
  const getExchangeRange = useThunkActionCreator(getExchangeRangeThunk);
  const order = useSelector(exchangeSelectors.getExchangeOrder);
  const walletData = useSelector(walletSelectors.getWallet);
  const user = useSelector(sessionSelectors.getUser);
  const stage = useSelector(walletSelectors.getStage);
  const pendingTransaction = useSelector(walletSelectors.getPendingTransaction);
  const fetchWalletDetails = useThunkActionCreator(fetchWalletDetailsThunk);
  const createTransaction = useThunkActionCreator(createTransactionThunk);
  const pollCreateTransactionTask = useThunkActionCreator(pollCreateTransactionTaskThunk);
  const syncMultisig = useThunkActionCreator(syncMultisigThunk);
  const openWallet = useThunkActionCreator(openWalletThunk);
  const getOutputs = useThunkActionCreator(getOutputsThunk);
  const resetPendingTransaction = (): void => { dispatch(resetPendingTransactionAction()); };
  const prepareTransaction = useThunkActionCreator(prepareTransactionThunk);
  useEffect(() => {
    getExchangeRange({ platform: "changenow", to_currency: "btc" });
  }, []);
  return (
    <ExchangePayment
      user={user}
      order={order}
      stage={stage}
      pendingTransaction={pendingTransaction}
      walletId={walletId}
      wallet={walletData}
      onEdit={(): void => {
        if (currentWalletCall) {
          currentWalletCall.abort();
        }
        resetPendingTransaction();
        onEdit();
      }}
      openWallet={openWallet}
      getOutputs={getOutputs}
      prepareTransaction={prepareTransaction}
      fetchWalletDetails={fetchWalletDetails}
      createTransaction={createTransaction}
      pollCreateTransactionTask={pollCreateTransactionTask}
      syncMultisig={syncMultisig}
      setCurrentWalletCall={setCurrentWalletCall}
    />
  );
};

export default ExchangeContainer;
