import { useTranslation } from "react-i18next";
import React from "react";
import {
  generatePath, useParams, useNavigate,
} from "react-router-dom";
import { Tabs } from "../../components";
import routes from "../../router/routes";
import { useSelector } from "../../hooks";
import { PageTemplate } from "../../modules/index";
import {
  selectors as sessionSelectors,
} from "../../store/sessionSlice";
import Referral from "./Referral";
import Promotions from "./Promotions";

const tabs = ["referrals", "promotions"];

const RewardsPageContainer: React.FC = () => {
  const { type } = useParams();
  const navigate = useNavigate();
  const user = useSelector(sessionSelectors.getUser);
  const { t } = useTranslation();
  return (
    <PageTemplate title={t("rewards.title")}>
      <Tabs
        activeTab={tabs.indexOf(type as string)}
        onChange={(index) => { navigate(generatePath(routes.rewards, { type: tabs[index] })); }}
        tabs={[
          {
            value: 0,
            text: t("rewards.tabs.referrals"),
          },
          {
            value: 1,
            text: t("rewards.tabs.promotions"),
          },
        ]}
      />
      {
        type === "referrals" && (
          <Referral user={user} />
        )
      }
      {
        type === "promotions" && (
          <Promotions user={user} />
        )
      }
    </PageTemplate>
  );
};

export default RewardsPageContainer;
