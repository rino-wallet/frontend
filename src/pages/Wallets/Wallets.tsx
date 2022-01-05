import React, { useState, useEffect } from "react";
import { generatePath, Link } from "react-router-dom";
import { Button, EmptyList } from "../../components";
import { PageTemplate, WalletCard, Pagination } from "../../modules/index";
import { FetchWalletListThunkPayload, FetchWalletsResponse, Wallet } from "../../types";
import routes from "../../router/routes";

interface Props {
  wallets: Wallet[];
  loading: boolean;
  pages: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
  fetchWallets: (data: FetchWalletListThunkPayload) => Promise<FetchWalletsResponse>;
}

const WalletsPage: React.FC<Props> = ({ wallets, loading, pages, hasPreviousPage, hasNextPage, fetchWallets }) => {
  const [page, setPage] = useState<number>(1);
  useEffect(() => {
    fetchWallets({ page });
  }, [page]);
  return <PageTemplate
    title={(
      <div className="flex w-full justify-between items-center">
        <span>My Wallets</span>
        <Link to={routes.newWallet}>
          <Button
            name="create-new-wallet"
            type="button"
            rounded
          >
            <div className="w-5 h-5 leading-5 text-2xl">+</div>
          </Button>
        </Link>
      </div>
    )}
  >
    {
      (!wallets.length) && (
        <EmptyList loading={loading} message="No wallets yet." />
      )
    }
    <ul>
      {
        wallets.map((wallet) => (
          <li className="mb-4" key={`wallet-${wallet.id}`}>
            <Link id={`wallet-${wallet.id}`} to={`${generatePath(routes.wallet, { id: wallet.id })}/transactions`}>
              <WalletCard id={wallet.id} name={wallet.name} balance={wallet.balance} showArrow />
            </Link>
          </li>
        ))
      }
    </ul>
    {
      pages > 0 && (
        <Pagination
          loading={loading}
          page={page}
          hasNextPage={hasNextPage}
          hasPreviousPage={hasPreviousPage}
          onChange={setPage}
        />
      )
    }
  </PageTemplate>
}

export default WalletsPage;
