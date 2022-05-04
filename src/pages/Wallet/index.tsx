import React, { useEffect } from "react";
import { Route, Routes, useParams, useNavigate } from "react-router-dom";
import { useDispatch, useThunkActionCreator } from "../../hooks";
import {
  FetchWalletDetailsResponse,
  FetchWalletDetailsPayload,
  FetchWalletSubaddressThunkPayload,
  FetchSubaddressResponse,
  FetchWalletShareRequestsThunkPayload,
  FetchWalletShareRequestsResponse,
} from "../../types";
import {
  fetchWalletDetails as fetchWalletDetailsThunk,
} from "../../store/walletSlice";
import { fetchWalletSubaddress as fetchWalletSubaddressThunk } from "../../store/subaddressListSlice";
import { fetchWalletShareRequests as fetchWalletShareRequestsThunk } from "../../store/walletShareRequestListSlice";
import routes from "../../router/routes";
import { changeLocation } from "../../store/actions";
import TransactionDetails from "./TransactionDetails";
import Transactions from "./Transactions";
import Users from "./Users";
import SendPayment from "./SendPayment";
import ReceivePayment from "./ReceivePayment";
import Settings from "./Settings";

interface Props {
  match: {
    params: {
      id: string;
      tab: "transactions" | "users" | "settings";
    };
  };
}

const WalletPageContainer: React.FC<Props> = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const walletId = id  as string;
  const fetchWalletDetails = useThunkActionCreator<FetchWalletDetailsResponse, FetchWalletDetailsPayload>(fetchWalletDetailsThunk);
  const fetchWalletSubaddress = useThunkActionCreator<FetchSubaddressResponse, FetchWalletSubaddressThunkPayload>(fetchWalletSubaddressThunk);
  const fetchWalletShareRequests = useThunkActionCreator<FetchWalletShareRequestsResponse, FetchWalletShareRequestsThunkPayload>(fetchWalletShareRequestsThunk);
  const refresh = async (): Promise<void> => {
    await fetchWalletDetails({ id: walletId })
      .catch(() => {
        navigate(routes.not_found);
      });
    fetchWalletSubaddress({ walletId });
    fetchWalletShareRequests({ walletId, page: 1 });
  }

  const dispatch = useDispatch();
  useEffect(() => {
    return (): void => {
      dispatch(changeLocation());
    }
  }, []);
  useEffect(() => {
    const intervalID = setInterval(() => {
      fetchWalletDetails({ id: walletId });
    }, 30000);
    refresh();
    return (): void => {
      clearInterval(intervalID);
    }
  }, []);
  return (
    <Routes>
      <Route path="transactions" element={<Transactions walletId={walletId} />} />
      <Route path="transactions/:transactionId" element={<TransactionDetails walletId={walletId} />} />
      <Route path="send" element={<SendPayment walletId={walletId} />} />
      <Route path="settings" element={<Settings walletId={walletId} />} />
      <Route path="receive" element={<ReceivePayment walletId={walletId} />} />
      <Route path="users" element={<Users walletId={walletId} refresh={refresh} />} />
      <Route path="users/:shareId/finalize-share/" element={<Users walletId={walletId} refresh={refresh} />} />
    </Routes>
  )
}

export default WalletPageContainer;
