import React, { useEffect } from "react";
import { Switch, Route, generatePath } from "react-router-dom";
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
import { navigate } from "../../store/actions";
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

const WalletPageContainer: React.FC<Props> = ({ match: { params: { id  } } }) => {
  const wallet = useSelector(selectors.getWallet);
  const user = useSelector(sessionSelectors.getUser);
  const fetchWalletDetails = useThunkActionCreator<FetchWalletDetailsResponse, FetchWalletDetailsPayload>(fetchWalletDetailsThunk);
  const fetchWalletSubaddress = useThunkActionCreator<FetchSubaddressResponse, FetchWalletSubaddressThunkPayload>(fetchWalletSubaddressThunk);
  const dispatch = useDispatch();
  useEffect(() => {
    return (): void => {
      dispatch(navigate());
    }
  }, []);
  useEffect(() => {
    (async (): Promise<void> => {
      await fetchWalletDetails({ id });
      fetchWalletSubaddress({ walletId: id });
    })();
  }, []);
  const canShare = isUserOwner(user, wallet);
  return (
    <Switch>
      <Route exact path={`${generatePath(routes.wallet, { id })}/transactions`}>
        <Transactions walletId={id} />
      </Route>
      <Route path={`${generatePath(routes.wallet, { id })}/transactions/:transactionId`}>
        <TransactionDetails walletId={id} />
      </Route>
      <Route exact path={`${generatePath(routes.wallet, { id })}/send`}>
        <SendPayment walletId={id} />
      </Route>
      <Route exact path={`${generatePath(routes.wallet, { id })}/settings`}>
        <Settings walletId={id} />
      </Route>
      <Route exact path={`${generatePath(routes.wallet, { id })}/receive`}>
        <ReceivePayment walletId={id} />
      </Route>
      {/*<Route exact path={`${generatePath(routes.wallet, { id })}/users`}>*/}
      {/*  <Users canShare={canShare} walletId={id} />*/}
      {/*</Route>*/}
      {
        canShare && (
          <>
            <Route path={`${generatePath(routes.wallet, { id })}/users/add`}>
              <AddWalletMember walletId={id} />
            </Route>
          </>
        )
      }
      <Route exact path={`${generatePath(routes.wallet, { id })}/receive`}>
        <div>receive</div>
      </Route>
    </Switch>
  )
}

export default WalletPageContainer;
