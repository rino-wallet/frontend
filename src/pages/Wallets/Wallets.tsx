import React from "react";
import { Link } from "react-router-dom";
import { Button, Icon } from "../../components";
import { PageTemplate, WalletList } from "../../modules/index";
import {
  FetchWalletListThunkPayload, FetchWalletsResponse, Wallet, User,
} from "../../types";
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

const WalletsPage: React.FC<Props> = ({
  wallets, loading, pages, hasPreviousPage, hasNextPage, fetchWallets, user,
}) => (
  <PageTemplate
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

            <div className="flex items-center">
              <span className="text-primary leading-1 text-xl">+</span>
              <span />
            </div>
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
              Add wallet
            </div>
          </Button>
        </Link>
      </div>
      )}
  >
    <WalletList
      user={user}
      loading={loading}
      wallets={wallets}
      pages={pages}
      hasPreviousPage={hasPreviousPage}
      hasNextPage={hasNextPage}
      fetchWallets={fetchWallets}
    />
  </PageTemplate>
);

export default WalletsPage;
