import { createContext, useContext } from "react";
import { WindowSize } from "../types";

const IsMobileContext = createContext<null | WindowSize>(null);

export const IsMobileProvider = IsMobileContext.Provider;

export function useIsMobile(): boolean {
  const size = useContext(IsMobileContext);
  if (size === null) {
    throw new Error("Size be null, please add a context provider");
  }
  return (size.width || 0) < 768;
}
