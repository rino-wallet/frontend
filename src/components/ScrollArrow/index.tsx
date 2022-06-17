import React, { useState, useEffect } from "react";
import classNames from "classnames";
import { ReactComponent as ArrowDown } from "../../assets/arrow-down.svg";

type Props = {
  className?: string;
  hideThreshold?: number;
};

export const ScrollArrow: React.FC<Props> = ({ className, hideThreshold = 100 }) => {
  const [isHidden, setIsHidden] = useState(false);

  const listenToScroll = (): void => {
    const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
    setIsHidden(winScroll > hideThreshold);
  };
  useEffect(() => {
    window.addEventListener("scroll", listenToScroll);
    return (): void => { window.removeEventListener("scroll", listenToScroll); };
  });

  return (
    <div className={classNames("animate-bounce absolute right-12 bottom-0.5", className, { hidden: isHidden })}>
      <ArrowDown />
    </div>
  );
};
