import React, {MouseEvent, ReactNode} from "react";
import {showPreventNavigationModal} from "../PreventNavigationModal";
import { useDispatch, useSelector} from "../../hooks";
import {
  selectors as sessionSelectors,
  setPreventNavigation as setPreventNavigationAction
} from "../../store/sessionSlice";
import classNames from "classnames";
interface Props {
  className?: string;
  content: ReactNode | string;
}

export const PreventAction: React.FC<Props> = ({ className = "", children, content }) => {
  const dispatch = useDispatch();
  const preventNavigation = useSelector(sessionSelectors.getPreventNavigation);
  const setPreventNavigation = (value: boolean): void => { dispatch(setPreventNavigationAction(value)); };
  const onClick = (e: MouseEvent): void => {
    if(preventNavigation) {
      e.preventDefault();
      showPreventNavigationModal({goBackCallback: () => setPreventNavigation(false), title: "Wallet creation in progress.", message: "If you interrupt the wallet creation process, no wallet is created."});
    }
  }
  if(preventNavigation) {
    return (
      <div onClick={onClick} className={classNames(className, "inline cursor-pointer")}>{content}</div>
    );
  } else {
    return <div className="inline">{children}</div>
  }
};
