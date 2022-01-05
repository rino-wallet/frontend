import React from "react";
import { useSelector } from "../../../hooks/useSelector";
import { updateWalletDetails as updateWalletDetailsThunk, selectors } from "../../../store/walletSlice";
import { WalletLayout } from "../WalletLayout";
import Settings from "./Settings";
import { UpdateWalletDetailsPayload, UpdateWalletDetailsResponse } from "../../../types";
import { useThunkActionCreator } from "../../../hooks";

interface Props {
  walletId: string;
}

const SettingsContainer: React.FC<Props> = ({ walletId }) => {
  const wallet = useSelector(selectors.getWallet);
  const updateWalletDetails = useThunkActionCreator<UpdateWalletDetailsResponse, UpdateWalletDetailsPayload>(updateWalletDetailsThunk);
  return (
    <WalletLayout tab="settings" wallet={wallet} id={walletId}>
      <Settings walletId={walletId} wallet={wallet} updateWalletDetails={updateWalletDetails} />
    </WalletLayout>
  )
}

export default SettingsContainer;
