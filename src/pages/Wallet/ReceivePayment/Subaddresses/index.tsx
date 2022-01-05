import React from "react";
import { useSelector, useThunkActionCreator } from "../../../../hooks";
import { CreateSubaddressThunkPayload, FetchSubaddressesThunkPayload, FetchSubaddressResponse, Subaddress } from "../../../../types";
import { createSubaddress as createSubaddressThunk, selectors as walletSelectors } from "../../../../store/walletSlice";
import { fetchSubaddresses as fetchSubaddressesThunk, selectors as subaddressListSelectors } from "../../../../store/subaddressListSlice";
import { Subaddresses } from "./Subaddresses";

interface Props {
  walletId: string;
}

const SubaddressesContainer: React.FC<Props> = ({ walletId }) => {
  const subaddresses = useSelector(subaddressListSelectors.getSubaddresses);
  const listLoading = useSelector(subaddressListSelectors.pendingFetchSubaddresses);
  const subaddressCreating = useSelector(walletSelectors.pendingCreateSubaddress);
  const {pages, hasPreviousPage, hasNextPage} = useSelector(subaddressListSelectors.getListMetaData);
  const fetchSubaddresses = useThunkActionCreator<FetchSubaddressResponse, FetchSubaddressesThunkPayload>(fetchSubaddressesThunk);
  const createSubaddress = useThunkActionCreator<Subaddress, CreateSubaddressThunkPayload>(createSubaddressThunk);
  return (
    <Subaddresses
      walletId={walletId}
      listLoading={listLoading}
      subaddressCreating={subaddressCreating}
      subaddresses={subaddresses}
      pages={pages}
      hasPreviousPage={hasPreviousPage}
      hasNextPage={hasNextPage}
      fetchSubaddresses={fetchSubaddresses}
      createSubaddress={createSubaddress}
    />
  )
}

export default SubaddressesContainer;
