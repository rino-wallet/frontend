import React from "react";
import { useSelector, useThunkActionCreator } from "../../../hooks";
import {
  RemoveWalletAccessPayload,
  RemoveWalletAccessResponse,
} from "../../../types";
import { removeWalletAccess as removeWalletAccessThunk, selectors } from "../../../store/walletSlice";
import Users from "./Users";
import { WalletLayout } from "../WalletLayout";

interface Props {
  walletId: string;
  canShare: boolean;
}

const UsersContainer: React.FC<Props> = ({ walletId, canShare }) => {
  const wallet = useSelector(selectors.getWallet);
  const loading = useSelector(selectors.pendingRemoveWalletAccess);
  const removeWalletAccess = useThunkActionCreator<RemoveWalletAccessResponse, RemoveWalletAccessPayload>(removeWalletAccessThunk);
  return (
    <WalletLayout tab="users" wallet={wallet} id={walletId}>
      {
        wallet ? (
          <Users
            canShare={canShare}
            loading={loading}
            wallet={wallet}
            walletId={walletId}
            removeWalletAccess={removeWalletAccess}
          />
        ) : null
      }
    </WalletLayout>
  );
}

export default UsersContainer;
