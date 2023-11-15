import React, { FC } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

import { AccountActivityList } from "./AccountActivityList";
import { useAccountType, useSelector, useThunkActionCreator } from "../../../hooks";
import {
  fetchAccountActivity as fetchAccountActivityThunk,
  selectors as accountActivitySelectors,
  ITEMS_PER_PAGE,
} from "../../../store/accountActivityListSlice";
import { Button } from "../../../components";
import routes from "../../../router/routes";

const AccountActivityPage: FC = () => {
  const { features } = useAccountType();
  const { t } = useTranslation();
  const accountActivity = useSelector(accountActivitySelectors.getAccountActivity);
  const fetchAccountActivity = useThunkActionCreator(fetchAccountActivityThunk);
  const { pages, hasPreviousPage, hasNextPage } = useSelector(accountActivitySelectors.getListMetaData);
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
            onClick={(): void => navigate(routes.settings)}
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
          {t("settings.activity.page.title")}
        </h1>
      </header>

      <AccountActivityList
        itemsPerPage={ITEMS_PER_PAGE}
        data={accountActivity}
        fetch={fetchAccountActivity}
        pages={pages}
        hasNextPage={hasNextPage}
        hasPreviousPage={hasPreviousPage}
      />
    </div>
  );
};

export default AccountActivityPage;
