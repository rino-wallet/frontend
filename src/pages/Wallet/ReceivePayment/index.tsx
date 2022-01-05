import React from "react";
import { useSelector, useThunkActionCreator } from "../../../hooks";
import ReceivePayment from "./ReceivePayment";
import { selectors } from "../../../store/walletSlice";
import { Subaddress, CreateSubaddressThunkPayload, FetchSubaddressesThunkPayload, FetchSubaddressResponse } from "../../../types";
import { createSubaddress as createSubaddressThunk, selectors as walletSelectors } from "../../../store/walletSlice";
import { fetchSubaddresses as fetchSubaddressesThunk, selectors as subaddressListSelectors } from "../../../store/subaddressListSlice";

interface Props {
  walletId: string;
}

const ReceivePaymentContainer: React.FC<Props> = ({ walletId }) => {
  const wallet = useSelector(selectors.getWallet);
  const subaddresses = useSelector(subaddressListSelectors.getSubaddresses);
  const createSubaddress = useThunkActionCreator<Subaddress, CreateSubaddressThunkPayload>(createSubaddressThunk);
  const listLoading = useSelector(subaddressListSelectors.pendingFetchSubaddresses);
  const subaddressCreating = useSelector(walletSelectors.pendingCreateSubaddress);
  const walletSubAddress = useSelector(walletSelectors.getWalletSubAddress);
  const {pages, hasPreviousPage, hasNextPage} = useSelector(subaddressListSelectors.getListMetaData);
  const fetchSubaddresses = useThunkActionCreator<FetchSubaddressResponse, FetchSubaddressesThunkPayload>(fetchSubaddressesThunk);
  return (
    <ReceivePayment
      walletId={walletId}
      wallet={wallet}
      listLoading={listLoading}
      subaddressCreating={subaddressCreating}
      subaddresses={subaddresses}
      walletSubAddress={walletSubAddress}
      pages={pages}
      hasPreviousPage={hasPreviousPage}
      hasNextPage={hasNextPage}
      fetchSubaddresses={fetchSubaddresses}
      createSubaddress={createSubaddress}
    />
  )
}

export default ReceivePaymentContainer;
