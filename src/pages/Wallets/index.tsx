import React, { useEffect } from "react";
import { FetchWalletListThunkPayload, FetchWalletsResponse } from "../../types";
import { fetchWallets as fetchWalletsAction, selectors as walletListSelectors } from "../../store/walletListSlice";
import { selectors as sessionSelectors } from "../../store/sessionSlice";
import { useDispatch, useSelector, useThunkActionCreator } from "../../hooks";
import Wallets from "./Wallets";
import { changeLocation } from "../../store/actions";

const WalletsPageContainer: React.FC = () => {
  const wallets = useSelector(walletListSelectors.getWallets);
  const { pages, hasPreviousPage, hasNextPage } = useSelector(walletListSelectors.getListMetaData);
  const loading = useSelector(walletListSelectors.pendingFetchWallets);
  const user = useSelector(sessionSelectors.getUser);
  const fetchWallets = useThunkActionCreator<FetchWalletsResponse, FetchWalletListThunkPayload>(fetchWalletsAction);
  const dispatch = useDispatch();
  useEffect(() => {
    return (): void => {
      dispatch(changeLocation());
    }
  }, [])
  return <div>
    <Wallets
      isKeypairSet={user?.isKeypairSet}
      loading={loading}
      wallets={wallets}
      pages={pages}
      hasPreviousPage={hasPreviousPage}
      hasNextPage={hasNextPage}
      fetchWallets={fetchWallets}
    />
  </div>
}

export default WalletsPageContainer;
