import React, { FC } from "react";
import { format } from "date-fns";
import { useTranslation } from "react-i18next";
import UAParser from "ua-parser-js";

import { AccountActivity } from "../../../types";
import AccountActivityItemLayout from "./AccountActivityItemLayout";

interface Props {
  data: AccountActivity;
}

const AccountActivityItem: FC<Props> = ({ data }) => {
  const { t } = useTranslation();
  const parser = new UAParser();
  const { browser, os } = parser.setUA(data.userAgent).getResult();

  return (
    <div className="text-base">
      <AccountActivityItemLayout
        timestamp={(
          <div className="theme-text-secondary whitespace-nowrap leading-4.5">
            {format(new Date(data.timestamp), "dd MMM yyyy HH:mm")}
          </div>
        )}
        action={(
          <span className="theme-text-secondary">
            {t(`common.activity.action.${data.action}`)}
          </span>
        )}
        ipAddress={(
          <span className="theme-text-secondary whitespace-nowrap leading-4.5">
            <span className="theme-text-secondary inline md:hidden font-bold">
              {t("settings.activity.page.th.ipAddress")}
              :
              &nbsp;
            </span>
            {data.ipAddress}
          </span>
        )}
        country={(
          <span className="theme-text-secondary whitespace-nowrap">
            <span className="inline md:hidden font-bold">
              {t("settings.activity.page.th.country")}
              :
              &nbsp;
            </span>
            {data.countryCode || t("common.not_available_short")}
          </span>
        )}
        userAgent={(
          <span className="theme-text-secondary">
            {browser.name}
            &nbsp;
            {browser.version}
            &nbsp;
            -
            &nbsp;
            {os.name}
            &nbsp;
            {os.version}
          </span>
        )}
      />
    </div>
  );
};

export default AccountActivityItem;
