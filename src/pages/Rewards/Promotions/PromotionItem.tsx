import { useTranslation } from "react-i18next";
import React from "react";
import cn from "classnames";
import { RewardStatus } from "../RewardStatus";
import { Button, Panel } from "../../../components";
import { PROMOTION_STATUS } from "../../../constants";
import { Promotion, PromotionStatuses } from "../../../types";
import { piconeroToMonero } from "../../../utils";
import { ReactComponent as TickCircleGreen } from "./tick-circle-green.svg";
import { ReactComponent as TickCircle } from "./tick-circle.svg";
import { ReactComponent as RewardIcon } from "./gift.svg";

interface Props {
  promotion: Promotion,
  isLastAdded?: boolean,
  onRedeem: (promotion: Promotion) => void;
}

export const PromotionItem = ({ promotion, isLastAdded, onRedeem }: Props) => {
  const { t } = useTranslation();
  return (
    <Panel className="relative">
      {
        !isLastAdded && (
          <div className="absolute w-full h-full bg-gray-100 opacity-50" />
        )
      }
      <div className="grid grid-cols-3 gap-4 py-6 px-8">
        <div>
          <div className="font-bold text-2xl mb-2">
            {promotion.promotion.name}
          </div>
          <p className={cn("text-lg font-bold font-lato mb-3 flex", {
            "text-[#FF9D00]": isLastAdded,
          })}
          >
            <RewardIcon />
            <span className="ml-1">{piconeroToMonero(promotion.amount)}</span>
            <span>XMR</span>
          </p>
          {

            promotion.status.toLowerCase() === PROMOTION_STATUS.READY && !promotion.claimed ? (
              <Button
                className="h-10"
                size={Button.size.MEDIUM}
                variant={Button.variant.PRIMARY_LIGHT}
                onClick={() => { onRedeem(promotion); }}
              >
                {t("rewards.promotions.redeem.button")}
              </Button>
            ) : (
              <RewardStatus status={promotion.status.toLowerCase() as PromotionStatuses} isPromotion />
            )
          }
        </div>
        <div className="col-span-2">
          <div className="flex items-center mb-2">
            {
              isLastAdded ? (
                [PROMOTION_STATUS.READY, PROMOTION_STATUS.PAID].includes(promotion.status.toLowerCase()) ? <TickCircleGreen /> : <TickCircle />
              ) : <TickCircle />
            }
            <p className="pl-2">
              {t("rewards.promotions.exchange.threshold", { threshold: promotion.promotion.threshold / 100 })}
            </p>
          </div>
          <div className="flex items-center">
            {
              isLastAdded ? (
                [PROMOTION_STATUS.PAID].includes(promotion.status.toLowerCase()) ? <TickCircleGreen /> : <TickCircle />
              ) : <TickCircle />
            }
            <p className="pl-2">
              {t("rewards.promotions.redeem.reward", { reward: promotion.promotion.reward / 100 })}
            </p>
          </div>
        </div>
      </div>
    </Panel>
  );
};
