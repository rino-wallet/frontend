import React, { useEffect, useState } from "react";
import { Button } from "../../../../components";
import { Pagination } from "../../../../modules/index";
import { Subaddress, FetchSubaddressesThunkPayload, FetchSubaddressResponse, CreateSubaddressThunkPayload } from "../../../../types";
import { SubaddressItem } from "./SubaddressItem";

interface Props {
  walletId: string;
  listLoading: boolean;
  subaddressCreating: boolean;
  subaddresses: Subaddress[];
  pages: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
  fetchSubaddresses: (payload: FetchSubaddressesThunkPayload) => Promise<FetchSubaddressResponse>;
  createSubaddress: (payload: CreateSubaddressThunkPayload) => Promise<Subaddress>;
}

export const Subaddresses: React.FC<Props> = ({
  walletId,
  listLoading,
  subaddressCreating,
  subaddresses,
  pages,
  hasPreviousPage,
  hasNextPage,
  createSubaddress,
  fetchSubaddresses,
}) => {
  const [page, setPage] = useState<number>(1);
  useEffect(() => {
    fetchSubaddresses({ walletId, page });
  }, [page]);
  return (
    <div>
      <div className="mb-5">
        <Button
          size={Button.size.MEDIUM}
          name="create-new-address-btn"
          onClick={(): void => {
            createSubaddress({ walletId })
            .then(() => {
              if (page === 1) {
                fetchSubaddresses({ walletId, page: 1 });
              }
            })
          }}
          disabled={subaddressCreating}
          loading={subaddressCreating}
          block
        >
          Generate New Address
        </Button>
      </div>
      <div className="border-b border-gray-200 mb-4 -mx-5"></div>
      <h3 className="text-base font-medium mb-3">Generated Addresses</h3>
      <ul>
        {
          subaddresses.map((subaddress) => (
            <li key={subaddress.address} className="mb-3">
              <SubaddressItem subaddress={subaddress} />
            </li>
          ))
        }
      </ul>
      {
        pages > 0 && (
          <Pagination
            loading={listLoading}
            page={page}
            hasNextPage={hasNextPage}
            hasPreviousPage={hasPreviousPage}
            onChange={setPage}
          />
        )
      }
    </div>
  );
}