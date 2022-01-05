import React, { useEffect } from "react";
import { Route, Routes, generatePath, useParams } from "react-router-dom";
import { useSelector, useDispatch, useThunkActionCreator } from "../../hooks";
import {
  FetchWalletDetailsResponse,
  FetchWalletDetailsPayload,
  WalletMember,
  Wallet,
  User,
  FetchWalletSubaddressThunkPayload,
  FetchSubaddressResponse,
} from "../../types";
import {
  fetchWalletDetails as fetchWalletDetailsThunk,
  fetchWalletSubaddress as fetchWalletSubaddressThunk,
  selectors,
} from "../../store/walletSlice";
import { selectors as sessionSelectors } from "../../store/sessionSlice";
import routes from "../../router/routes";
import { accessLevels } from "../../constants";
import { changeLocation } from "../../store/actions";
import TransactionDetails from "./TransactionDetails";
import Transactions from "./Transactions";
// import Users from "./Users";
import AddWalletMember from "./AddWalletMember";
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

function isUserOwner(user: User, wallet: Wallet): boolean {
  const m = user
  && wallet
  && wallet.members
  .find((member: WalletMember) => [accessLevels.owner.title, accessLevels.admin.title].includes(member.accessLevel) && member.user === user.email);
  return !!m;
}

const WalletPageContainer: React.FC<Props> = () => {
  const { id } = useParams();
  const walletId = id  as string;
  const wallet = useSelector(selectors.getWallet);
  const user = useSelector(sessionSelectors.getUser);
  const fetchWalletDetails = useThunkActionCreator<FetchWalletDetailsResponse, FetchWalletDetailsPayload>(fetchWalletDetailsThunk);
  const fetchWalletSubaddress = useThunkActionCreator<FetchSubaddressResponse, FetchWalletSubaddressThunkPayload>(fetchWalletSubaddressThunk);
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
    (async (): Promise<void> => {
      await fetchWalletDetails({ id: walletId });
      fetchWalletSubaddress({ walletId });
    })();
    return (): void => {
      clearInterval(intervalID);
    }
  }, []);
  const canShare = isUserOwner(user, wallet);
  return (
    <Routes>
      <Route path="transactions" element={<Transactions walletId={walletId} />} />
      <Route path="transactions/:transactionId" element={<TransactionDetails walletId={walletId} />} />
      <Route path="send" element={<SendPayment walletId={walletId} />} />
      <Route path="settings" element={<Settings walletId={walletId} />} />
      <Route path="receive" element={<ReceivePayment walletId={walletId} />} />
      {/* This code was commented out because wallet sahring functionality is temporarily disabled */}
      {/*<Route exact path={`${generatePath(routes.wallet, { id })}/users`}>*/}
      {/*  <Users canShare={canShare} walletId={id} />*/}
      {/*</Route>*/}
      {
        canShare && (
          <Route
            path={`${generatePath(routes.wallet, { id: walletId })}/users/add`}
            element={<AddWalletMember walletId={walletId} />}
          />
        )
      }
    </Routes>
  )
}

export default WalletPageContainer;
