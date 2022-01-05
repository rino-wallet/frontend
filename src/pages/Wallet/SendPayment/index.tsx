import React, { useEffect } from "react";
import {
  FetchWalletDetailsPayload,
  FetchWalletDetailsResponse,
  FetchWalletListThunkPayload,
  FetchWalletsResponse,
  GetOutputsPayload,
  LocalWalletData,
  Wallet,
} from "../../../types";
import { fetchWallets as fetchWalletsAction } from "../../../store/walletListSlice";
import { openWallet as openWalletThunk, getOutputs as getOutputsThunk, createTransaction as createTransactionThunk, fetchWalletDetails as fetchWalletDetailsThunk, selectors as walletSelectors  } from "../../../store/walletSlice";
import { useSelector, useThunkActionCreator } from "../../../hooks";
import SendPayment from "./SendPayment";

interface Props {
  walletId: string;
}

const SendPaymentContainer: React.FC<Props> = ({ walletId }) => {
  const wallet = useSelector(walletSelectors.getWallet);
  const fetchWallets = useThunkActionCreator<FetchWalletsResponse, FetchWalletListThunkPayload>(fetchWalletsAction);
  const fetchWalletDetails = useThunkActionCreator<FetchWalletDetailsResponse, FetchWalletDetailsPayload>(fetchWalletDetailsThunk);
  const openWallet = useThunkActionCreator<LocalWalletData,  { wallet: Wallet, password: string }>(openWalletThunk);
  const getOutputs = useThunkActionCreator<LocalWalletData | undefined, GetOutputsPayload>(getOutputsThunk);
  const createTransaction = useThunkActionCreator(createTransactionThunk);
  useEffect(() => {
    fetchWallets({ page: 1 });
  }, [])
  return <div>
    <SendPayment
      wallet={wallet}
      walletId={walletId}
      openWallet={openWallet}
      fetchWalletDetails={fetchWalletDetails}
      getOutputs={getOutputs}
      createTransaction={createTransaction}
    />
  </div>
}

export default SendPaymentContainer;
