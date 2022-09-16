import { useSelector } from ".";
import { selectors } from "../store/sessionSlice";
import { ExtraFeatures } from "../types";
import { accountType } from "../constants";

export function useAccountType(): {
  isConsumer: boolean;
  isEnterprise: boolean;
  isProsumer: boolean;
  features: ExtraFeatures;
} {
  const user = useSelector(selectors.getUser);
  return {
    isConsumer: user?.accountType === accountType.CONSUMER,
    isEnterprise: user?.accountType === accountType.ENTERPRISE || window?.location?.search.includes("business=true"),
    isProsumer: user?.accountType === accountType.PROSUMER,
    features: user?.extraFeatures,
  };
}
