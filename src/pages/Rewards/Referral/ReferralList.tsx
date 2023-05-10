import { useTranslation } from "react-i18next";
import React from "react";
import { ReactComponent as EmptyListIcon } from "./empty-list-icon.svg";
import { Referral } from "../../../types";
import { ReferralItem } from "./ReferralItem";

interface Props {
  referrals: Referral[],
  claimReward: (payload: { id: string, address: string }) => Promise<void>
  loading?: boolean;
}

export const ReferralList = ({ referrals, claimReward, loading }: Props) => {
  const { t } = useTranslation();
  return (
    <div>
      <ul className="">
        {
        referrals.length === 0 && !loading && (
        <div className="flex flex-col items-center theme-text-secondary py-3">
          <div className="text-2xl mb-3">
            <EmptyListIcon />
          </div>
          <div>{t("rewards.referrals.no.invited.friends")}</div>
        </div>
        )
        }
        {
          referrals.map((referral) => (
            <li key={referral.id} className="mb-5">
              <ReferralItem referral={referral} claimReward={claimReward} />
            </li>
          ))
        }
      </ul>
    </div>
  );
};
