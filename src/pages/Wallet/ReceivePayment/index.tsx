import React from "react";
import { useSelector, useThunkActionCreator } from "../../../hooks";
import ReceivePayment from "./ReceivePayment";
import { selectors } from "../../../store/walletSlice";
import { FetchSubaddressesThunkPayload, FetchSubaddressResponse } from "../../../types";
import { openWallet as openWalletThunk } from "../../../store/walletSlice";
import {  createSubaddress as createSubaddressThunk, fetchSubaddresses as fetchSubaddressesThunk, selectors as subaddressListSelectors, validateSubAddress as validateSubAddressThunk } from "../../../store/subaddressListSlice";

interface Props {
  walletId: string;
}

const ReceivePaymentContainer: React.FC<Props> = ({ walletId }) => {
  const wallet = useSelector(selectors.getWallet);
  const subaddresses = useSelector(subaddressListSelectors.getSubaddresses);
  const createSubaddress = useThunkActionCreator(createSubaddressThunk);
  const openWallet = useThunkActionCreator(openWalletThunk);
  const validateSubAddress = useThunkActionCreator(validateSubAddressThunk);
  const listLoading = useSelector(subaddressListSelectors.pendingFetchSubaddresses);
  const subaddressCreating = useSelector(subaddressListSelectors.pendingCreateSubaddress);
  const walletSubAddress = useSelector(subaddressListSelectors.getWalletSubAddress);
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
      openWallet={openWallet}
      validateSubAddress={validateSubAddress}
    />
  )
}

export default ReceivePaymentContainer;
