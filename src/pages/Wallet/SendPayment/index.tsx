import React, { useEffect } from "react";
import { fetchWallets as fetchWalletsAction } from "../../../store/walletListSlice";
import {
  selectors as walletSelectors,
} from "../../../store/walletSlice";
import { useSelector, useThunkActionCreator } from "../../../hooks";
import SendPayment from "./SendPayment";

interface Props {
  walletId: string;
  isExchange: boolean;
}

const SendPaymentContainer: React.FC<Props> = ({ walletId, isExchange }) => {
  const walletData = useSelector(walletSelectors.getWallet);
  const fetchWallets = useThunkActionCreator(fetchWalletsAction);
  useEffect(() => {
    fetchWallets({ page: 1 });
  }, []);
  return (
    <div>
      <SendPayment
        isExchange={isExchange}
        wallet={walletData}
        walletId={walletId}
      />
    </div>
  );
};

export default SendPaymentContainer;
