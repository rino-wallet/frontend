import React, { FC } from "react";
import { useTranslation } from "react-i18next";
import { generatePath, useNavigate } from "react-router-dom";

import { WalletActivityList } from "./WalletActivityList";
import { useAccountType, useSelector, useThunkActionCreator } from "../../../hooks";
import { selectors as walletSelectors } from "../../../store/walletSlice";
import {
  fetchWalletActivity as fetchWalletActivityThunk,
  selectors as walletActivitySelectors,
  ITEMS_PER_PAGE,
} from "../../../store/walletActivityListSlice";
import { Button } from "../../../components";
import routes from "../../../router/routes";

type Props = {
  walletId: string;
};

const WalletActivityPage: FC<Props> = ({ walletId }) => {
  const { features } = useAccountType();
  const { t } = useTranslation();
  const currentWallet = useSelector(walletSelectors.getWallet);
  const walletActivity = useSelector(walletActivitySelectors.getWalletActivity);
  const fetchWalletActivity = useThunkActionCreator(fetchWalletActivityThunk);
  const { pages, hasPreviousPage, hasNextPage } = useSelector(walletActivitySelectors.getListMetaData);
  const navigate = useNavigate();

  if (features && !features.activityLogs) {
    navigate(routes.not_found);
  }

  return (
    <div>
      <header className="flex items-center mb-8 w-full relative hidden md:flex">
        <div className="mr-6">
          <Button
            size={Button.size.BIG}
            onClick={
              (): void => navigate(
                generatePath(routes.walletSettings, { id: walletId }),
              )
            }
            name="back-button"
            icon
          >
            <div className="w-5 h-5 leading-5 text-2xl theme-text-secondary">
              &#x3c;
            </div>
          </Button>
        </div>

        <h1
          className="text-4xl font-bold flex-1 font-catamaran min-w-0 overflow-ellipsis overflow-hidden whitespace-nowrap"
        >
          {`"${currentWallet?.name}" `}
          {t("wallet.settings.activity.page.title")}
        </h1>
      </header>

      <WalletActivityList
        itemsPerPage={ITEMS_PER_PAGE}
        walletId={walletId}
        data={walletActivity}
        fetch={fetchWalletActivity}
        pages={pages}
        hasNextPage={hasNextPage}
        hasPreviousPage={hasPreviousPage}
      />
    </div>
  );
};

export default WalletActivityPage;
