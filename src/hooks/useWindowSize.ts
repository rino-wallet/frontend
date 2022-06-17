import { useState, useEffect } from "react";
import { WindowSize } from "../types";

export function useWindowSize(): WindowSize {
  const [windowSize, setWindowSize] = useState<WindowSize>({
    width: undefined,
    height: undefined,
  });
  useEffect(() => {
    function handleResize(): void {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    }
    window.addEventListener("resize", handleResize);
    handleResize();
    return (): void => window.removeEventListener("resize", handleResize);
  }, []);
  return windowSize;
}
