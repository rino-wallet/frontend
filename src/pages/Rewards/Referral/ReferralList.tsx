import React from "react";
import { ReactComponent as EmptyListIcon } from "./empty-list-icon.svg";
import { Button } from "../../../components";
import { Referral } from "../../../types";
import { showSupportModal } from "../../../modules/index";
import { ReferralItem } from "./ReferralItem";

interface Props {
  referrals: Referral[],
  claimReward: (payload: { id: string, address: string }) => Promise<void>
  loading?: boolean;
}

export const ReferralList = ({ referrals, claimReward, loading }: Props) => (
  <div>
    <ul className="mb-10">
      {
        referrals.length === 0 && !loading && (
        <div className="flex flex-col items-center theme-text-secondary py-3">
          <div className="text-2xl mb-3">
            <EmptyListIcon />
          </div>
          <div>Your haven’t invited any friends yet.</div>
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
    <div className="flex justify-between space-x-3 items-center">
      <div className="theme-text-secondary min-w-0">
        If you want to invite more than 10 friends contact us.
      </div>
      <div>
        <Button variant={Button.variant.PRIMARY_LIGHT} onClick={showSupportModal}>
          <span className="whitespace-nowrap">Contact us</span>
        </Button>
      </div>
    </div>
  </div>
);
