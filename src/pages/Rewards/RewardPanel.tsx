import { useTranslation } from "react-i18next";
import React, { ReactNode } from "react";
import { Panel } from "../../components";
import { ReactComponent as RewardIcon } from "./reward-icon.svg";

interface Props {
  amount: string | number;
  children?: ReactNode;
}

export const RewardPanel = ({ amount, children }: Props) => {
  const { t } = useTranslation();
  return (
    <Panel className="mt-10 mb-14">
      <div className="flex items-center py-6 px-8">
        <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center">
          <RewardIcon />
        </div>
        <div className="flex-1 pl-6">
          <div className="theme-text-secondary text-base mb-2">{t("rewards.rewards.card.total.rewards.text")}</div>
          <div>
            <span className="text-4xl font-bold font-lato">
              {amount}
              {" "}
              XMR
            </span>
          </div>
        </div>
        {children}
      </div>
    </Panel>
  );
};
