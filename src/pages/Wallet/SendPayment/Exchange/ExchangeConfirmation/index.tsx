import React from "react";
import { useSelector } from "../../../../../hooks";
import { selectors as exchangeSelectors } from "../../../../../store/exchangeSlice";
import ExchangeConfirmation from "./ExchangeConfirmation";

interface Props {
  setActiveTab: (value: number) => void;
  onEdit: () => void;
}

const ExchangeContainer: React.FC<Props> = ({ setActiveTab, onEdit }) => {
  const order = useSelector(exchangeSelectors.getExchangeOrder);
  return (
    <ExchangeConfirmation
      order={order}
      setActiveTab={setActiveTab}
      onEdit={onEdit}
    />
  );
};

export default ExchangeContainer;
