import React, { FC } from "react";
import { useTranslation } from "react-i18next";
import WalletActivityItemLayout from "./WalletActivityItemLayout";

export const WalletActivityListHeader: FC = () => {
  const { t } = useTranslation();

  return (
    <WalletActivityItemLayout
      timestamp={(
        <span>
          {t("wallet.settings.activity.page.th.timestamp")}
        </span>
      )}
      action={(
        <span className="text-sm uppercase">
          {t("wallet.settings.activity.page.th.action")}
        </span>
      )}
      author={(
        <span className="text-sm uppercase">
          {t("wallet.settings.activity.page.th.author")}
        </span>
      )}
      ipAddress={(
        <span className="text-sm uppercase">
          {t("wallet.settings.activity.page.th.ipAddress")}
        </span>
      )}
      country={(
        <span className="text-sm uppercase">
          {t("wallet.settings.activity.page.th.country")}
        </span>
      )}
      userAgent={(
        <span className="text-sm uppercase">
          {t("wallet.settings.activity.page.th.userAgent")}
        </span>
      )}
    />
  );
};
