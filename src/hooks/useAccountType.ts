import { useSelector } from ".";
import { selectors } from "../store/sessionSlice";
import { ExtraFeatures } from "../types";
import { accountType } from "../constants";

export function useAccountType(): {
  isAuthenticated: boolean;
  isConsumer: boolean;
  isEnterprise: boolean;
  isProsumer: boolean;
  features: ExtraFeatures;
} {
  const user = useSelector(selectors.getUser);
  const token = useSelector(selectors.getToken);
  const enterpriseSession = sessionStorage.getItem("enterprice") === "true";
  return {
    isAuthenticated: !!token,
    isConsumer: user?.accountType === accountType.CONSUMER,
    isEnterprise: user?.accountType === accountType.ENTERPRISE || (!user && enterpriseSession),
    isProsumer: user?.accountType === accountType.PROSUMER,
    features: user?.extraFeatures,
  };
}
