import React from "react";
import { useSelector, useThunkActionCreator } from "../../../hooks";
import ReceivePayment from "../ReceivePayment/ReceivePayment";
import { selectors } from "../../../store/publicWalletSlice";
import { fetchSubaddresses as fetchSubaddressesThunk, selectors as subaddressListSelectors } from "../../../store/publicWalletSubaddressListSlice";

interface Props {
  walletId: string;
}

export const ReceivePaymentContainer: React.FC<Props> = ({ walletId }) => {
  const wallet = useSelector(selectors.getWallet);
  const subaddresses = useSelector(subaddressListSelectors.getSubaddresses);
  const listLoading = useSelector(subaddressListSelectors.pendingFetchSubaddresses);
  const walletSubAddress = useSelector(subaddressListSelectors.getWalletSubAddress);
  const { pages, hasPreviousPage, hasNextPage } = useSelector(subaddressListSelectors.getListMetaData);
  const fetchSubaddresses = useThunkActionCreator(fetchSubaddressesThunk);
  return (
    <ReceivePayment
      walletId={walletId}
      wallet={wallet}
      listLoading={listLoading}
      subaddressCreating={false}
      subaddresses={subaddresses}
      walletSubAddress={walletSubAddress}
      pages={pages}
      hasPreviousPage={hasPreviousPage}
      hasNextPage={hasNextPage}
      viewOnly
      fetchSubaddresses={fetchSubaddresses}
      isPublicWallet
    />
  );
};
