import React from "react";
import { RewardStatus } from "../RewardStatus";
import { Button } from "../../../components";
import { Referral } from "../../../types";
import { showChooseWalletModal } from "../ChooseWalletModal";
import { showSuccessModal } from "../../../modules/index";

interface Props {
  referral: Referral,
  isOwnRefferal?: boolean,
  claimReward: (payload: { id: string, address: string }) => Promise<void>,
}

export const ReferralItem = ({ referral, isOwnRefferal, claimReward }: Props) => {
  const isReady = isOwnRefferal ? referral.refereeStatus.toLowerCase() === "ready" : referral.referrerStatus.toLowerCase() === "ready";
  const isClaimed = isOwnRefferal ? referral.refereeClaimed : referral.referrerClaimed;
  const canRedeem = isReady && !isClaimed;
  function onRedeem() {
    showChooseWalletModal({ asyncCallback: (address: string) => claimReward({ id: referral.id, address }) })
      .then(() => {
        showSuccessModal({
          title: "Reward Redeemed",
          message: "Your reward successfully has been sent to your wallet.",
        });
      });
  }
  return (
    <div className="flex w-full justify-between items-center space-x-4">
      <div className="text-base theme-text-secondary text-ellipsis overflow-hidden min-w-0">
        {
          isOwnRefferal ? (
            <div>
              To receive your reward you need to convert a minimum of €
              {referral.threshold / 100}
              {" "}
              XMR to any in crypto in the RINO Wallet.
            </div>
          ) : <div>{referral.referee}</div>
        }
      </div>
      <div>
        {
          canRedeem ? (
            <Button
              className="h-10"
              size={Button.size.MEDIUM}
              variant={Button.variant.PRIMARY_LIGHT}
              onClick={onRedeem}
            >
              Redeem
            </Button>
          ) : (
            <RewardStatus
              status={(isOwnRefferal ? referral.referrerStatus : referral.refereeStatus).toLowerCase() as "pending" | "ready" | "paid"}
            />
          )
        }
      </div>
    </div>
  );
};
