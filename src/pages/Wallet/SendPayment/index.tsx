import React, { useEffect } from "react";
import {
  FetchWalletListThunkPayload,
  FetchWalletsResponse,
} from "../../../types";
import { fetchWallets as fetchWalletsAction } from "../../../store/walletListSlice";
import {
  selectors as walletSelectors,
} from "../../../store/walletSlice";
import {useSelector, useThunkActionCreator} from "../../../hooks";
import SendPayment from "./SendPayment";

interface Props {
  walletId: string;
}

const SendPaymentContainer: React.FC<Props> = ({ walletId }) => {
  const walletData = useSelector(walletSelectors.getWallet);
  const fetchWallets = useThunkActionCreator<FetchWalletsResponse, FetchWalletListThunkPayload>(fetchWalletsAction);
  useEffect(() => {
    fetchWallets({ page: 1 });
  }, [])
  return <div>
    <SendPayment
      wallet={walletData}
      walletId={walletId}
    />
  </div>
}

export default SendPaymentContainer;
