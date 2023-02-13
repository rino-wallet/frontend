import React, { useState, useEffect, SyntheticEvent } from "react";
import { generatePath, Link } from "react-router-dom";
import { EmptyList } from "../../components";
import { WalletCard } from "../WalletCard";
import { Pagination } from "../Pagination";
import {
  FetchWalletListThunkPayload, FetchWalletsResponse, Wallet, User, AccessLevel,
} from "../../types";
import routes from "../../router/routes";
import { useAccountType } from "../../hooks";

interface Props {
  wallets: Wallet[];
  loading: boolean;
  pages: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
  fetchWallets: (data: FetchWalletListThunkPayload) => Promise<FetchWalletsResponse>;
  onItemClick?: (e: SyntheticEvent, item: Wallet) => void;
  user: User;
  lightItems?: boolean;
}

export const WalletList: React.FC<Props> = ({
  wallets, loading, pages, hasPreviousPage, hasNextPage, user, fetchWallets, onItemClick = () => { }, lightItems = false,
}) => {
  const { isEnterprise } = useAccountType();
  const links = isEnterprise ? routes.static.enterprise : routes.static.consumer;
  const [page, setPage] = useState<number>(1);
  useEffect(() => {
    function fetchList(): void {
      if (user?.isKeypairSet) {
        fetchWallets({ page });
      }
    }
    fetchList();
    const interval = setInterval(fetchList, 30000);
    return () => {
      clearInterval(interval);
    };
  }, [page, user?.isKeypairSet]);
  return (
    <div>
      {
        (!wallets.length) && (
          <EmptyList
            loading={loading}
            message={(
              <div>
                You don&apos;t have any wallets yet. You need to create one - click on the button above, or see
                {" "}
                <a className="theme-link" href={`${links.faq}#getting_started_full`}>here</a>
                {" "}
                for instructions.
              </div>
            )}
          />
        )
      }
      <ul>
        {
          wallets.map((wallet) => (
            <li className="mb-4" key={`wallet-${wallet.id}`}>
              <Link onClick={(e: SyntheticEvent) => onItemClick(e, wallet)} id={`wallet-${wallet.id}`} to={`${generatePath(routes.wallet, { id: wallet.id })}/transactions`}>
                <WalletCard
                  name={wallet.name}
                  balance={wallet.balance}
                  unlocked={wallet.unlockedBalance}
                  role={wallet.members.find((member) => member.user === user.email)?.accessLevel as AccessLevel}
                  variant={lightItems ? WalletCard.variant.LIGHT : WalletCard.variant.DEFAULT}
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
    </div>
  );
};
