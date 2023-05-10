import React, {
  useEffect, useState,
} from "react";
import { t } from "i18next";
import classNames from "classnames";
import { useSelector, useRequireApprovers } from "../../hooks";
import { selectors as walletSelectors } from "../../store/walletSlice";
import warningIcon from "./danger.svg";

type Props = {
  className?: string;
};

export const ApprovalsBanner: React.FC<Props> = ({ className }) => {
  const currentWallet = useSelector(walletSelectors.getWallet);
  const [showBanner, setShowBanner] = useState<boolean>(true);

  const requireApprovers = useRequireApprovers();

  useEffect(() => {
    if (requireApprovers) {
      setShowBanner(true);
    }
  }, [currentWallet, requireApprovers]);

  if (requireApprovers && showBanner && currentWallet !== undefined) {
    return (
      <div className={classNames(
        className,
        "items-start flex flex-col gap-2 p-8 theme-bg-banner-yellow theme-border border rounded-big",
      )}
      >
        <img width={35} src={warningIcon} alt="" />
        <p className="font-medium">{t("layout.banner.approvals.title")}</p>
        <div className="flex gap-4">
          <small className="text-secondary">
            {t("layout.banner.approvals.description")}
          </small>
        </div>
      </div>
    );
  }

  return null;
};
