import React from "react";
import { useSelector } from "../../../hooks";
import ReceivePayment from "./ReceivePayment";
import { selectors } from "../../../store/walletSlice";

interface Props {
  walletId: string;
}

const ReceivePaymentContainer: React.FC<Props> = ({ walletId }) => {
  const wallet = useSelector(selectors.getWallet);
  return (
    <ReceivePayment
      address={wallet?.address || ""}
      walletId={walletId}
    />
  )
}

export default ReceivePaymentContainer;
