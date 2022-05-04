import React, { useState, useEffect } from "react";
import { generatePath, Link } from "react-router-dom";
import { HashLink } from "react-router-hash-link";
import { Button, EmptyList, Icon } from "../../components";
import { PageTemplate, WalletCard, Pagination } from "../../modules/index";
import { FetchWalletListThunkPayload, FetchWalletsResponse, Wallet, User, AccessLevel } from "../../types";
import routes from "../../router/routes";

interface Props {
  wallets: Wallet[];
  loading: boolean;
  pages: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
  fetchWallets: (data: FetchWalletListThunkPayload) => Promise<FetchWalletsResponse>;
  user: User;
}

const WalletsPage: React.FC<Props> = ({ wallets, loading, pages, hasPreviousPage, hasNextPage, fetchWallets, user }) => {
  const [page, setPage] = useState<number>(1);
  useEffect(() => {
    if (user?.isKeypairSet) {
      fetchWallets({ page });
    }
  }, [page, user?.isKeypairSet]);
  return <PageTemplate
    title={(
      <div className="flex w-full justify-between items-center">
        <span>My Wallets</span>
        <Link to={routes.newWallet}>
          <Button
            className="md:hidden"
            size={Button.size.BIG}
            variant={Button.variant.GRAY}
            name="create-new-wallet-mobile"
            type="button"
            icon
          >

            <div className="flex items-center"><span className="text-primary leading-1 text-xl">+</span><span></span></div>
          </Button>
          <Button
            className="hidden md:block"
            size={Button.size.BIG}
            variant={Button.variant.GRAY}
            name="create-new-wallet"
            type="button"
          >
            <div className="flex items-center space-x-3">
              <span className="text-sm text-primary leading-none mr-3"><Icon name="plus" /></span>
              Create wallet
            </div>
          </Button>
        </Link>
      </div>
    )}
  >
    {
      (!wallets.length) && (
        <EmptyList
          loading={loading}
          message={(
            <div>
              You don't have any wallets yet. You need to create one - click on the button above, or see <HashLink className="theme-link" smooth to={`${routes.faq}#getting_started_full`}>here</HashLink> for instructions.
            </div>
          )}
        />
      )
    }
    <ul>
      {
        wallets.map((wallet) => (
          <li className="mb-4" key={`wallet-${wallet.id}`}>
            <Link id={`wallet-${wallet.id}`} to={`${generatePath(routes.wallet, { id: wallet.id })}/transactions`}>
              <WalletCard
                name={wallet.name}
                balance={wallet.balance}
                unlocked={wallet.unlockedBalance}
                role={wallet.members.find((member) => member.user === user.email)?.accessLevel as AccessLevel}
              />
            </Link>
          </li>
        ))
      }
    </ul>
    {
      pages > 1 && (
        <Pagination
          loading={loading}
          page={page}
          pageCount={pages}
          hasNextPage={hasNextPage}
          hasPreviousPage={hasPreviousPage}
          onChange={setPage}
        />
      )
    }
  </PageTemplate>
}

export default WalletsPage;
