import React, { FC } from "react";
import { useTranslation } from "react-i18next";
import AccountActivityItemLayout from "./AccountActivityItemLayout";

export const AccountActivityListHeader: FC = () => {
  const { t } = useTranslation();

  return (
    <AccountActivityItemLayout
      timestamp={(
        <span>
          {t("settings.activity.page.th.timestamp")}
        </span>
      )}
      action={(
        <span className="text-sm uppercase">
          {t("settings.activity.page.th.action")}
        </span>
      )}
      ipAddress={(
        <span className="text-sm uppercase">
          {t("settings.activity.page.th.ipAddress")}
        </span>
      )}
      country={(
        <span className="text-sm uppercase">
          {t("settings.activity.page.th.country")}
        </span>
      )}
      userAgent={(
        <span className="text-sm uppercase">
          {t("settings.activity.page.th.userAgent")}
        </span>
      )}
    />
  );
};
