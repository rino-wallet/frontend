import type { Blocker, History, Transition } from "history";
import {
  ContextType, useCallback, useContext, useEffect,
} from "react";
import { Navigator as BaseNavigator, UNSAFE_NavigationContext as NavigationContext } from "react-router-dom";
import { showPreventNavigationModal } from "../modules/index";

interface Navigator extends BaseNavigator {
  block: History["block"];
}

type NavigationContextWithBlock = ContextType<typeof NavigationContext> & { navigator: Navigator };

export function useBlocker(blocker: Blocker, when = true): void {
  const { navigator } = useContext(NavigationContext) as NavigationContextWithBlock;

  useEffect(() => {
    if (!when) {
      return;
    }
    const unblock = navigator.block((tx: Transition) => {
      const autoUnblockingTx = {
        ...tx,
        retry(): void {
          unblock();
          tx.retry();
        },
      };

      blocker(autoUnblockingTx);
    });

    return unblock;
  }, [navigator, blocker, when]);
}

export function usePrompt(title: string, message: string, when = true, onLeave?: () => void): void {
  const blocker = useCallback(async (tx: Transition) => {
    const response = await showPreventNavigationModal({ title, message });
    if (response) {
      if (typeof onLeave === "function") {
        onLeave();
      }
      tx.retry();
    }
  }, []);
  return useBlocker(blocker, when);
}
