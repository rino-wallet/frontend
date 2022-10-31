import React, { useEffect } from "react";
import ExchangeForm from "./ExchangeForm";
import { useSelector, useThunkActionCreator } from "../../../../hooks";
import {
  getExchangeRange as getExchangeRangeThunk,
  getExchangeCurrencies as getExchangeCurrenciesThunk,
  getExchangeEstimation as getExchangeEstimationThunk,
  createExchangeOrder as createExchangeOrderThunk,
  selectors as exchangeSelectors,
} from "../../../../store/exchangeSlice";
import {
  selectors as walletSelectors,
} from "../../../../store/walletSlice";
import {
  selectors as subaddressSelectors,
} from "../../../../store/subaddressListSlice";

interface Props {
  walletId: string;
  setActiveTab: (value: number) => void;
  activeTab: number;
}

const ExchangeContainer: React.FC<Props> = ({ walletId, setActiveTab, activeTab }) => {
  const exchangeRange = useSelector(exchangeSelectors.getExchangeRange);
  const getExchangeRange = useThunkActionCreator(getExchangeRangeThunk);
  const getExchangeCurrencies = useThunkActionCreator(getExchangeCurrenciesThunk);
  const currencies = useSelector(exchangeSelectors.getCurrencies);
  const exchangeEstimation = useSelector(exchangeSelectors.getExchangeEstimation);
  const getExchangeEstimation = useThunkActionCreator(getExchangeEstimationThunk);
  const createExchangeOrder = useThunkActionCreator(createExchangeOrderThunk);
  const walletData = useSelector(walletSelectors.getWallet);
  const walletSubAddress = useSelector(subaddressSelectors.getWalletSubAddress);
  useEffect(() => {
    getExchangeCurrencies();
  }, []);
  return (
    <ExchangeForm
      getExchangeRange={getExchangeRange}
      walletSubAddress={walletSubAddress?.address || ""}
      wallet={walletData}
      walletId={walletId}
      getExchangeEstimation={getExchangeEstimation}
      exchangeRange={exchangeRange}
      exchangeEstimation={exchangeEstimation}
      currencies={currencies}
      createExchangeOrder={createExchangeOrder}
      setActiveTab={setActiveTab}
      activeTab={activeTab}
    />
  );
};

export default ExchangeContainer;
