import React, { useEffect } from "react";
import {
  Route, Routes, useParams, useNavigate,
} from "react-router-dom";
import { useDispatch, useThunkActionCreator } from "../../../hooks";
import {
  fetchWalletDetails as fetchWalletDetailsThunk,
} from "../../../store/publicWalletSlice";
import { fetchWalletSubaddress as fetchWalletSubaddressThunk } from "../../../store/publicWalletSubaddressListSlice";
import { changeLocation } from "../../../store/actions";
import { TransactionsContainer } from "./Transactions";
import { ReceivePaymentContainer } from "./ReceivePayment";
import routes from "../../../router/routes";

interface Props {
  match: {
    params: {
      id: string;
      tab: "transactions" | "users" | "settings";
    };
  };
}

const PublicWalletPageContainer: React.FC<Props> = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const walletId = id as string;
  const fetchWalletDetails = useThunkActionCreator(fetchWalletDetailsThunk);
  const fetchWalletSubaddress = useThunkActionCreator(fetchWalletSubaddressThunk);
  const dispatch = useDispatch();
  useEffect(() => (): void => {
    dispatch(changeLocation());
  }, []);
  useEffect(() => {
    fetchWalletDetails({ id: walletId })
      .catch(() => {
        navigate(routes.not_found);
      });
    fetchWalletSubaddress({ walletId });
  }, []);
  return (
    <Routes>
      <Route index element={<TransactionsContainer walletId={walletId} />} />
      <Route path="transactions" element={<TransactionsContainer walletId={walletId} />} />
      <Route path="receive" element={<ReceivePaymentContainer walletId={walletId} />} />
    </Routes>
  );
};

export default PublicWalletPageContainer;
