import React from "react";
// import { useSelector, useThunkActionCreator } from "../../../hooks";
// import { selectors } from "../../../store/walletSlice";
// import {
//   ShareWalletPayload,
//   Wallet,
// } from "../../../types";
// import AddWalletMember from "./AddWalletMember";

interface Props {
  walletId: string;
}

const AddWalletMemberContainer: React.FC<Props> = () => {
  // This code was commented out because wallet shahring functionality is temporarily disabled

  // const wallet = useSelector(selectors.getWallet);
  // const shareWallet = useThunkActionCreator<string,  { wallet: Wallet, loginPassword: string; body: ShareWalletPayload }>(shareWalletThunk);
  return (
    // <AddWalletMember wallet={wallet} shareWallet={shareWallet} />
    null
  );
}

export default AddWalletMemberContainer;
