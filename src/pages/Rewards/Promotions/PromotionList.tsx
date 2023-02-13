import React from "react";
import { RewardStatus } from "../RewardStatus";
import { ReactComponent as EmptyListIcon } from "./empty-list-icon.svg";
import { Button, Panel } from "../../../components";
import { Promotion } from "../../../types";
import { showChooseWalletModal } from "../ChooseWalletModal";
import { showSuccessModal } from "../../../modules/index";
import { piconeroToMonero } from "../../../utils";

interface Props {
  promotions: Promotion[],
  claimReward: (payload: { id: string, address: string }) => Promise<void>
  loading?: boolean;
}

export const PromotionList = ({ promotions, claimReward, loading }: Props) => {
  function onRedeem(referral: Promotion) {
    showChooseWalletModal({ asyncCallback: (address: string) => claimReward({ id: referral.id, address }) })
      .then(() => {
        showSuccessModal({
          title: "Reward Redeemed",
          message: "Your reward successfully has been sent to your wallet.",
        });
      });
  }
  return (
    <div>
      <ul className="mb-10">
        {
          promotions.length === 0 && !loading && (
            <div className="flex flex-col items-center theme-text-secondary py-3">
              <div className="text-2xl mb-3">
                <EmptyListIcon />
              </div>
              <div>Your haven’t any promotions yet.</div>
            </div>
          )
        }
        {
          promotions.map((promotion) => (
            <li key={promotion.id} className="mb-5">
              <Panel>
                <div className="flex space-x-8 py-6 px-8">
                  <div>
                    <p className="mb-4 text-2xl font-bold font-lato">
                      XMR
                      {" "}
                      {piconeroToMonero(promotion.amount)}
                    </p>
                    {
                      promotion.status.toLowerCase() === "ready" && !promotion.address ? (
                        <Button
                          className="h-10"
                          size={Button.size.MEDIUM}
                          variant={Button.variant.PRIMARY_LIGHT}
                          onClick={() => { onRedeem(promotion); }}
                        >
                          Redeem
                        </Button>
                      ) : (
                        <RewardStatus status={promotion.status.toLowerCase() as "pending" | "ready" | "paid"} isPromotion />
                      )
                    }
                  </div>
                  <div className="py-1">
                    Exchange more than
                    {" "}
                    {promotion.promotion.threshold / 100}
                    {" "}
                    EUR
                  </div>
                </div>
              </Panel>
            </li>
          ))
        }
      </ul>
    </div>
  );
};
