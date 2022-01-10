import React, { ReactNode } from "react";
import { Link } from "react-router-dom";
import { Button, Icon } from "../../components"
import { showPreventNavigationModal } from "../PreventNavigationModal";
import { useSelector, useDispatch } from "../../hooks";
import {
  selectors as sessionSelectors,
  setPreventNavigation as setPreventNavigationAction
} from "../../store/sessionSlice";

interface Props {
  title: ReactNode;
  backButtonRoute?: string;
  goBackCallback?: () => void;
  children?: ReactNode;
}

export const PageTemplate: React.FC<Props> = ({ title, backButtonRoute, children, goBackCallback }) => {
  const preventNavigation = useSelector(sessionSelectors.getPreventNavigation);
  const dispatch = useDispatch();
  const setPreventNavigation = (value: boolean): void => { dispatch(setPreventNavigationAction(value)); };
  return (
    <section>
      <header className="flex items-center mb-8 w-full relative">
        {
          backButtonRoute && (
            <div className="mr-6">
              <Link to={backButtonRoute}>
                <Button
                  size={Button.size.BIG}
                  name="back-button"
                  onClick={(e): void => {
                    if (preventNavigation) {
                      e.preventDefault();
                      showPreventNavigationModal({goBackCallback: () => setPreventNavigation(false), title: "Wallet creation in progress.", message: "If you interrupt the wallet creation process, no wallet is created."});
                    } else if (typeof goBackCallback === "function") {
                      goBackCallback();
                    }
                  }}
                  icon
                >
                  <div className="w-5 h-5 leading-5 text-2xl theme-text-secondary"><Icon name="checvron_left" className="text-sm" /></div>
                </Button>
              </Link>
            </div>
          )
        }
        {
          (typeof goBackCallback === "function") && (
            <div className="mr-6">
              <Button
                size={Button.size.BIG}
                name="back-button"
                onClick={goBackCallback}
                icon
              >
                <div className="w-5 h-5 leading-5 text-2xl theme-text-secondary">&#x3c;</div>
              </Button>
            </div>
          )
        }
        <h1 className="text-4xl font-bold flex-1 font-catamaran min-w-0 overflow-ellipsis overflow-hidden whitespace-nowrap">{title}</h1>
      </header>
      {children}
    </section>
  )
}