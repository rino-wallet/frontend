import React from "react";
import { Icon, Tooltip } from "../../components";

const classNames = {
  pending: "bg-orange-100 text-orange-700",
  ready: "bg-green-100 text-green-500",
  paid: "bg-green-100 text-green-500",
};

const label = {
  pending: "Pending",
  ready: "Ready",
  paid: "Rewarded",
};

const tooltip = {
  pending: (
    <div className="w-52">
      <span className="text-orange-700 font-bold">Pending</span>
      {" "}
      status means that user has registered but not completed all the actions to receive the reward.
    </div>
  ),
  ready: (
    <div>
      <span className="text-green-500 font-bold">Ready</span>
      {" "}
      status means that user has registered, and completed all the actions to receive the reward.
    </div>
  ),
  paid: (
    <div>
      <span className="text-green-500 font-bold">Rewarded</span>
      {" "}
      status means that user has redeemed reward.
    </div>
  ),
};

interface Props {
  status: "pending" | "ready" | "paid";
  isPromotion?: boolean;
}

export const RewardStatus = ({ status, isPromotion }: Props) => (
  <div className={`inline-flex items-center py-2 px-6 rounded-medium text-base space-x-1 ${classNames[status]}`}>
    <div>{label[status]}</div>
    {
      !isPromotion && (
        <Tooltip className="h-5" content={tooltip[status]}>
          <Icon name="info" />
        </Tooltip>
      )
    }
  </div>
);
