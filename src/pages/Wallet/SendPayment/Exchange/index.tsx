import React, { useEffect, useState } from "react";
import ExchangeForm from "./ExchangeForm";
import ExchangeConfirmation from "./ExchangeConfirmation";
import ExchangePayment from "./ExchangePayment";
import { useSelector, useDispatch, useThunkActionCreator } from "../../../../hooks";
import {
  getExchangeRange as getExchangeRangeThunk,
  getExchangeEstimation as getExchangeEstimationThunk,
  createExchangeOrder as createExchangeOrderThunk,
  selectors as exchangeSelectors,
} from "../../../../store/exchangeSlice";
import { selectors as sessionSelectors } from "../../../../store/sessionSlice";
import {
  createTransaction as createTransactionThunk,
  syncMultisig as syncMultisigThunk,
  fetchWalletDetails as fetchWalletDetailsThunk,
  selectors as walletSelectors,
  openWallet as openWalletThunk,
  getOutputs as getOutputsThunk,
  prepareTransaction as prepareTransactionThunk,
  resetPendingTransaction as resetPendingTransactionAction,
} from "../../../../store/walletSlice";
import {
  selectors as subaddressSelectors,
} from "../../../../store/subaddressListSlice";
import { AppDispatch } from "../../../../types";

interface Props {
  walletId: string;
  setActiveTab: (value: number) => void;
  activeTab: number;
}

const ExchangeContainer: React.FC<Props> = ({ walletId, setActiveTab, activeTab }) => {
  const [currentWalletCall, setCurrentWalletCall] = useState<Promise<AppDispatch> | any>(null);
  const dispatch = useDispatch();
  const exchangeRange = useSelector(exchangeSelectors.getExchangeRange);
  const getExchangeRange = useThunkActionCreator(getExchangeRangeThunk);
  const exchangeEstimation = useSelector(exchangeSelectors.getExchangeEstimation);
  const getExchangeEstimation = useThunkActionCreator(getExchangeEstimationThunk);
  const pendingGetExchangeEstimation = useSelector(exchangeSelectors.pendingGetExchangeEstimation);
  const createExchangeOrder = useThunkActionCreator(createExchangeOrderThunk);
  const order = useSelector(exchangeSelectors.getExchangeOrder);
  const walletData = useSelector(walletSelectors.getWallet);
  const user = useSelector(sessionSelectors.getUser);
  const stage = useSelector(walletSelectors.getStage);
  const pendingTransaction = useSelector(walletSelectors.getPendingTransaction);
  const walletSubAddress = useSelector(subaddressSelectors.getWalletSubAddress);
  const fetchWalletDetails = useThunkActionCreator(fetchWalletDetailsThunk);
  const createTransaction = useThunkActionCreator(createTransactionThunk);
  const syncMultisig = useThunkActionCreator(syncMultisigThunk);
  const openWallet = useThunkActionCreator(openWalletThunk);
  const getOutputs = useThunkActionCreator(getOutputsThunk);
  const resetPendingTransaction = (): void => { dispatch(resetPendingTransactionAction()); };
  const prepareTransaction = useThunkActionCreator(prepareTransactionThunk);
  useEffect(() => {
    getExchangeRange({ platform: "changenow", to_currency: "btc" });
  }, []);
  switch (activeTab) {
    case 0: {
      return (
        <ExchangeForm
          walletSubAddress={walletSubAddress?.address || ""}
          wallet={walletData}
          walletId={walletId}
          getExchangeEstimation={getExchangeEstimation}
          exchangeRange={exchangeRange}
          exchangeEstimation={exchangeEstimation}
          pendingGetExchangeEstimation={pendingGetExchangeEstimation}
          createExchangeOrder={createExchangeOrder}
          setActiveTab={setActiveTab}
        />
      );
    }
    case 1: {
      return (
        <div>
          <ExchangeConfirmation
            order={order}
            setActiveTab={setActiveTab}
          />
        </div>
      );
    }
    case 2: {
      return (
        <div>
          <ExchangePayment
            user={user}
            order={order}
            stage={stage}
            pendingTransaction={pendingTransaction}
            walletId={walletId}
            wallet={walletData}
            onEdit={(): void => {
              setActiveTab(0);
              currentWalletCall.abort();
              resetPendingTransaction();
            }}
            openWallet={openWallet}
            getOutputs={getOutputs}
            prepareTransaction={prepareTransaction}
            fetchWalletDetails={fetchWalletDetails}
            createTransaction={createTransaction}
            syncMultisig={syncMultisig}
            setCurrentWalletCall={setCurrentWalletCall}
          />
        </div>
      );
    }
    default: {
      return <div />;
    }
  }
};

export default ExchangeContainer;
