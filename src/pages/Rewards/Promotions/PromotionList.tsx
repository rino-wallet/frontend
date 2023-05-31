import { useTranslation } from "react-i18next";
import React from "react";
import { ReactComponent as EmptyListIcon } from "./empty-list-icon.svg";
import { Promotion } from "../../../types";
import { showChooseWalletModal } from "../ChooseWalletModal";
import { showSuccessModal } from "../../../modules/index";
import { PromotionItem } from "./PromotionItem";

interface Props {
  promotions: Promotion[],
  claimReward: (payload: { id: string, address: string }) => Promise<void>
  loading?: boolean;
}

export const PromotionList = ({ promotions, claimReward, loading }: Props) => {
  const { t } = useTranslation();
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
              <div>{t("rewards.promotions.no.promotions")}</div>
            </div>
          )
        }
        {
          promotions.map((promotion, index) => (
            <li key={promotion.id} className="mb-5">
              <PromotionItem promotion={promotion} isLastAdded={index === 0} onRedeem={onRedeem} />
            </li>
          ))
        }
      </ul>
    </div>
  );
};
