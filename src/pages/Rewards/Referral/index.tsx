import { useTranslation } from "react-i18next";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { User } from "../../../types";
import {
  Panel, Button, Input,
} from "../../../components";
import { RewardPanel } from "../RewardPanel";
import { ReactComponent as WarningIcon } from "./warning-icon.svg";
import { ReactComponent as Step1Icon } from "./step-1-icon.svg";
import { ReactComponent as Step2Icon } from "./step-2-icon.svg";
import { ReactComponent as Step3Icon } from "./step-3-icon.svg";
import { useCopy } from "../../../hooks/useCopy";
import { ReferralList } from "./ReferralList";
import { ReferralItem } from "./ReferralItem";
import { showSupportModal } from "../../../modules/index";
import { useSelector, useThunkActionCreator } from "../../../hooks";
import {
  selectors as rewardSelectors,
  getOwnRefferal as getOwnRefferalThunk,
  claimReferral as claimReferralThunk,
  getOrdersStats as getOrdersStatsThunk,
  getReferralsStats as getReferralsStatsThunk,
} from "../../../store/rewardsSlice";
import {
  selectors as referralListSelectors,
  getReferrals as getReferralsThunk,
} from "../../../store/referralListSlice";
import { getCurrentUser as getCurrentUserThunk } from "../../../store/sessionSlice";
import routes from "../../../router/routes";
import { Pagination } from "../../../modules/Pagination";
import { piconeroToMonero } from "../../../utils";

const REWARD_AMOUNT = 10;
const MIN_TOTAL_AMOUNT = 100000;
const MIN_TOTAL_AMOUNT_VIEW = MIN_TOTAL_AMOUNT / 100;
interface Props {
  user: User;
}

const ReferralPage: React.FC<Props> = ({
  user,
}) => {
  const [loading, setLoading] = useState(true);
  const { copyToClipboard } = useCopy();
  const listMetaData = useSelector(referralListSelectors.getListMetaData);
  const userTotalAmount = useSelector(rewardSelectors.getUserTotal);
  const referrals = useSelector(referralListSelectors.getEntities);
  const ownReferral = useSelector(rewardSelectors.getOwnReferral);
  const referralStats = useSelector(rewardSelectors.getReferralsStats);
  const getReferralsStats = useThunkActionCreator(getReferralsStatsThunk);
  const getReferrals = useThunkActionCreator(getReferralsThunk);
  const getOwnRefferal = useThunkActionCreator(getOwnRefferalThunk);
  const claimReward = useThunkActionCreator(claimReferralThunk);
  const getOrdersStats = useThunkActionCreator(getOrdersStatsThunk);
  const getCurrentUser = useThunkActionCreator(getCurrentUserThunk);
  const { t } = useTranslation();
  useEffect(() => {
    Promise.all([
      getReferrals({ page: 1 }),
      getOwnRefferal(),
      getOrdersStats(),
      getReferralsStats(),
      getCurrentUser(),
    ]).finally(() => {
      setLoading(false);
    });
  }, []);
  async function onClaimRewards(data: { id: string; address: string }) {
    await claimReward(data);
    setTimeout(() => {
      getReferrals({ page: listMetaData.page as number });
      getOwnRefferal();
      getReferralsStats();
    }, 1000); // We need this timeout to wait untill promotion status changed
  }
  return (
    <div className="font-catamaran">
      <RewardPanel amount={piconeroToMonero(referralStats)} />
      <section className="my-8">
        <h2 className="text-2xl font-bold mb-6 flex items-center">
          {t("rewards.referrals.invite.friend.text", { REWARD_AMOUNT })}
        </h2>
        <div className="mb-10">
          <p className="mb-4">
            {t("rewards.referrals.rewards.proccess.description", { MIN_TOTAL_AMOUNT_VIEW, REWARD_AMOUNT })}
          </p>
          <div className="grid md:grid-cols-3 gap-10">
            <div className="text-center">
              <div className="w-14 h-14 bg-white rounded-full inline-flex items-center justify-center mb-3">
                <Step1Icon />
              </div>
              <div className="text-lg font-bold mb-3">{t("rewards.referrals.first.step.title")}</div>
              <div>
                {t("rewards.referrals.first.step.description")}
              </div>
            </div>
            <div className="text-center">
              <div className="w-14 h-14 bg-white rounded-full inline-flex items-center justify-center mb-3">
                <Step2Icon />
              </div>
              <div className="text-lg font-bold mb-3">{t("rewards.referrals.second.step.title")}</div>
              <div>
                {t("rewards.referrals.second.step.description", { MIN_TOTAL_AMOUNT_VIEW })}
              </div>
            </div>
            <div className="text-center">
              <div className="w-14 h-14 bg-white rounded-full inline-flex items-center justify-center mb-3">
                <Step3Icon />
              </div>
              <div className="text-lg font-bold mb-3">{t("rewards.referrals.third.step.title")}</div>
              <div>
                {t("rewards.referrals.third.step.description", { REWARD_AMOUNT })}
              </div>
            </div>
          </div>
        </div>
      </section>
      {
        !loading && (
          <div>
            <section>
              {
                userTotalAmount < MIN_TOTAL_AMOUNT && (
                  <div className="mb-10">
                    <Panel className="mb-5">
                      <div className="flex items-center py-3 px-4">
                        <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center">
                          <WarningIcon />
                        </div>
                        <div className="flex-1 pl-6 font-bold">
                          {t("rewards.referrals.warning.text", { MIN_TOTAL_AMOUNT_VIEW })}
                        </div>
                      </div>
                    </Panel>
                    <div className="flex items-center">
                      <div className="flex-1">
                        <div className="theme-text-secondary text-base">{t("rewards.referrals.your.exchange.volume")}</div>
                        <div className="font-bold text-2xl">
                          €
                          {userTotalAmount / 100}
                        </div>
                      </div>
                      <Link to={routes.wallets}>
                        <Button variant={Button.variant.PRIMARY_LIGHT}>{t("rewards.referrals.buttons.start.converting")}</Button>
                      </Link>
                    </div>
                  </div>
                )
              }
            </section>
            <section className="py-8">
              <h2 className="text-2xl font-bold flex items-center mb-4">
                {t("rewards.referrals.code")}
              </h2>
              <div className="flex space-x-3">
                <div className="w-full">
                  <Input type="text" value={user?.referralCode || ""} onChange={() => { }} disabled />
                </div>
                <Button
                  disabled={!user?.referralCode}
                  variant={Button.variant.PRIMARY_LIGHT}
                  onClick={() => copyToClipboard(user?.referralCode || "")}
                >
                  {t("rewards.referrals.buttons.copy")}
                </Button>
              </div>
            </section>
            {
              ownReferral && (
                <section className="py-8">
                  <h2 className="text-2xl font-bold flex items-center mb-4">
                    {t("rewards.referrals.your.referral")}
                  </h2>
                  <div className="flex space-x-3">
                    <ReferralItem claimReward={onClaimRewards} referral={ownReferral} isOwnRefferal />
                  </div>
                </section>
              )
            }
            <section className="py-8">
              <h2 className="flex space-x-3 items-center">
                <span className="text-2xl font-bold flex items-center mb-4">{t("rewards.referrals.invited.friends")}</span>
                <span className="theme-text-secondary">
                  {listMetaData.count}
                  /
                  {user.referralMax}
                </span>
              </h2>
              <ReferralList claimReward={onClaimRewards} referrals={referrals} />
              {
                listMetaData.pages > 1 && (
                  <Pagination
                    loading={loading}
                    page={listMetaData.page || 1}
                    pageCount={listMetaData.pages}
                    hasNextPage={listMetaData.hasNextPage}
                    hasPreviousPage={listMetaData.hasPreviousPage}
                    onChange={(page: number) => { getReferrals({ page }); }}
                  />
                )
              }
              <div className="flex justify-between space-x-3 items-center mt-10">
                <div className="theme-text-secondary min-w-0">
                  {t("rewards.referrals.contact.us.text")}
                </div>
                <div>
                  <Button variant={Button.variant.PRIMARY_LIGHT} onClick={showSupportModal}>
                    <span className="whitespace-nowrap">{t("rewards.referrals.buttons.contact.us")}</span>
                  </Button>
                </div>
              </div>
            </section>
          </div>
        )
      }
    </div>
  );
};

export default ReferralPage;
