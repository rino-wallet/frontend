import React from "react";
import { useSelector, useThunkActionCreator } from "../../../hooks";
import { deleteWallet as deleteWalletThunk, selectors } from "../../../store/walletSlice";
import {
  DeleteWalletPayload,
  DeleteWalletResponse,
} from "../../../types";
import DeleteWallet from "./DeleteWallet";

interface Props {
  walletId: string;
  goBackCallback?: () => void;
}

const DeleteWalletContainer: React.FC<Props> = ({ walletId, goBackCallback }) => {
  const wallet = useSelector(selectors.getWallet);
  const loading = useSelector(selectors.pendingDeleteWallet);
  const deleteWallet = useThunkActionCreator<DeleteWalletResponse,  DeleteWalletPayload>(deleteWalletThunk);
  return (
    <DeleteWallet
      deleteWallet={(): Promise<DeleteWalletResponse> => deleteWallet({ id: walletId })}
      balance={wallet?.balance || ""}
      goBackCallback={goBackCallback}
      loading={loading}
    />
  );
}

export default DeleteWalletContainer;
