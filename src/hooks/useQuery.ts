import {
  useLocation,
} from "react-router-dom";

export function useQuery(): any {
  return new URLSearchParams(useLocation().search);
}
