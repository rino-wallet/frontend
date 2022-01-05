import React from "react";
import { useSelector, useThunkActionCreator } from "../../../hooks";
import { shareWallet as shareWalletThunk, selectors } from "../../../store/walletSlice";
import {
  ShareWalletPayload,
  Wallet,
} from "../../../types";
import AddWalletMember from "./AddWalletMember";

interface Props {
  walletId: string;
}

const AddWalletMemberContainer: React.FC<Props> = () => {
  const wallet = useSelector(selectors.getWallet);
  const shareWallet = useThunkActionCreator<string,  { wallet: Wallet, password: string; body: ShareWalletPayload }>(shareWalletThunk);
  return (
    <AddWalletMember wallet={wallet} shareWallet={shareWallet} />
  );
}

export default AddWalletMemberContainer;
