import React, { useEffect } from "react";
import { FetchWalletListThunkPayload, FetchWalletsResponse } from "../../types";
import { fetchWallets as fetchWalletsAction, selectors as walletListSelectors } from "../../store/walletListSlice";
import { useDispatch, useSelector, useThunkActionCreator } from "../../hooks";
import Wallets from "./Wallets";
import { navigate } from "../../store/actions";

const WalletsPageContainer: React.FC = () => {
  const wallets = useSelector(walletListSelectors.getWallets);
  const { pages, hasPreviousPage, hasNextPage } = useSelector(walletListSelectors.getListMetaData);
  const loading = useSelector(walletListSelectors.pendingFetchWallets);
  const fetchWallets = useThunkActionCreator<FetchWalletsResponse, FetchWalletListThunkPayload>(fetchWalletsAction);
  const dispatch = useDispatch();
  useEffect(() => {
    fetchWallets({ page: 1 });
    return (): void => {
      dispatch(navigate());
    }
  }, [])
  return <div>
    <Wallets
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
