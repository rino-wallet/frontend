import React, { useEffect } from "react";
import { User } from "../../../types";
import { RewardPanel } from "../RewardPanel";
import { useSelector, useThunkActionCreator } from "../../../hooks";
import {
  selectors as rewardSelectors,
  claimPromotion as claimPromotionThunk,
  addPromotion as addPromotionThunk,
  getPromotionsStats as getPromotionsStatsThunk,
} from "../../../store/rewardsSlice";
import {
  selectors as promotionListSelectors,
  getPromotions as getPromotionsThunk,
} from "../../../store/promotionListSlice";
import { PromotionForm } from "./PromotionForm";
import { PromotionList } from "./PromotionList";
import { Pagination } from "../../../modules/index";
import { piconeroToMonero } from "../../../utils";

interface Props {
  user: User;
}

const PromotionsPage: React.FC<Props> = () => {
  const listMetaData = useSelector(promotionListSelectors.getListMetaData);
  const promotions = useSelector(promotionListSelectors.getEntities);
  const pendingGetPromotions = useSelector(promotionListSelectors.pendingGetPromotions);
  const promotionsStats = useSelector(rewardSelectors.getPromotionsStats);
  const getPromotionsStats = useThunkActionCreator(getPromotionsStatsThunk);
  const getPromotions = useThunkActionCreator(getPromotionsThunk);
  const addPromotion = useThunkActionCreator(addPromotionThunk);
  const claimPromotion = useThunkActionCreator(claimPromotionThunk);
  async function onClaimPromotion(payload: { id: string, address: string }) {
    return claimPromotion(payload).then(() => {
      setTimeout(() => {
        getPromotionsStats();
        getPromotions({ page: 1 });
      }, 1000); // We need this timeout to wait untill promotion status changed
    });
  }
  async function onAddPromotion(payload: { code: string }) {
    return addPromotion(payload).then(() => {
      getPromotions({ page: 1 }); // We need this timeout to wait untill promotion status changed
    });
  }
  useEffect(() => {
    getPromotionsStats();
    getPromotions({ page: 1 });
  }, []);
  const canAddNewPromotion = (promotions.filter((promotion) => ["pending", "ready"].includes(promotion.status.toLowerCase()))).length === 0;
  return (
    <div className="font-catamaran">
      <RewardPanel amount={piconeroToMonero(promotionsStats)} />
      <section className="my-8">
        <h2 className="text-2xl font-bold mb-6 flex items-center">
          Earn More with promotion code rewards!
        </h2>
        <div className="mb-10">
          <p>Check our promo codes to see what works best for you.</p>
          <p>
            For more info check our FAQ page:
            {" "}
            <a className="text-primary font-bold" href="https://rino.io/rewards/promotions">rino.io/rewards/promotions</a>
          </p>
        </div>
      </section>
      <section className="py-8">
        <h2 className="text-2xl font-bold flex items-center mb-4">
          Your promotion code
        </h2>
        <PromotionForm disabled={!canAddNewPromotion} onSubmit={onAddPromotion} />
      </section>
      <section className="py-8">
        <h2 className="flex space-x-3 items-center">
          <span className="text-2xl font-bold flex items-center mb-4">Promotions</span>
        </h2>
        <PromotionList promotions={promotions} claimReward={onClaimPromotion} loading={pendingGetPromotions} />
        {
          listMetaData.pages > 1 && (
            <Pagination
              loading={pendingGetPromotions}
              page={listMetaData.page || 1}
              pageCount={listMetaData.pages}
              hasNextPage={listMetaData.hasNextPage}
              hasPreviousPage={listMetaData.hasPreviousPage}
              onChange={(page: number) => { getPromotions({ page }); }}
            />
          )
        }
      </section>
    </div>
  );
};

export default PromotionsPage;
