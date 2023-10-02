import React, { FC, useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import classNames from "classnames";
import { useLocation, useNavigate } from "react-router-dom";

import { EmptyList, Panel } from "../../../components";
import { Pagination } from "../../../modules/index";
import { AccountActivityListHeader } from "./AccountActivityListHeader";
import AccountActivityItemPlaceholder from "./AccountActivityItemPlaceholder";
import {
  AccountActivity,
  FetchAccountActivityResponse,
  FetchAccountActivityThunkPayload,
} from "../../../types";
import { useAccountType, useQuery } from "../../../hooks";
import AccountActivityItem from "./AccountActivityItem";

type Props = {
  itemsPerPage: number;
  pages: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
  data: AccountActivity[];
  fetch: (data: FetchAccountActivityThunkPayload) => Promise<FetchAccountActivityResponse>;
};

export const AccountActivityList: FC<Props> = ({
  itemsPerPage,
  pages,
  hasPreviousPage,
  hasNextPage,
  data,
  fetch,
}) => {
  const { t } = useTranslation();
  const { isEnterprise } = useAccountType();
  const [loading, setLoading] = useState(true);
  const [isFirstLoading, setIsFirstLoading] = useState(true);
  const query = useQuery();
  const page = parseInt(query.get("page"), 10) || 1;
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    async function asyncFetch() {
      setLoading(true);
      await fetch({ page });
      setTimeout(() => {
        setIsFirstLoading(false);
        setLoading(false);
      }, 300);
    }

    asyncFetch();

    const intervalId = setInterval(() => fetch({ page }), 30000);

    return (): void => clearInterval(intervalId);
  }, [page]);

  const setPage = (p: number): void => {
    setIsFirstLoading(true);
    navigate(`${location.pathname}?page=${p}`);
  };

  return (
    <div>
      <Panel title="">
        <div>
          <div className="hidden theme-bg-panel-second md:block">
            <AccountActivityListHeader />
          </div>

          {(loading && isFirstLoading) ? (
            <div>
              {Array.from({ length: itemsPerPage }, (v, i) => i).map((key, index) => (
                <div
                  key={key}
                  className={
                    classNames(
                      "py-1.5",
                      {
                        "theme-bg-panel-second bg-opacity-50": index % 2 !== 0,
                      },
                    )
                  }
                >
                  <AccountActivityItemPlaceholder key={key} />
                </div>
              ))}
            </div>
          ) : (
            <div>
              {(!data.length && !loading) && (
                <EmptyList
                  message={t("settings.activity.page.empty.list") as string}
                  isEnterprise={isEnterprise}
                />
              )}

              {data.map((item, index) => (
                <div
                  key={item.id}
                  className={classNames(
                    {
                      "theme-bg-panel-second bg-opacity-50": index % 2 !== 0,
                    },
                  )}
                >
                  <AccountActivityItem data={item} />
                </div>
              ))}
            </div>
          )}
        </div>
      </Panel>

      {pages > 1 && (
        <Pagination
          loading={loading}
          page={page}
          pageCount={pages}
          hasNextPage={hasNextPage}
          hasPreviousPage={hasPreviousPage}
          onChange={setPage}
        />
      )}
    </div>
  );
};
