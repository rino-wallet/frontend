import React, { useEffect, useRef } from "react";
import Mousetrap from "mousetrap";

/* eslint-disable @typescript-eslint/no-explicit-any */
interface Props {
  callback: (value?: any) => void;
  rejectCallback: (value?: any) => void;
  moustrap?: {
    bind: (key: string, callback: (value?: any) => void) => void;
    unbind: (key: string) => void;
  };
}

const BindHotKeys: React.FC<Props> = ({
  callback,
  rejectCallback,
  moustrap,
  children,
}) => {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const moustrapInstance = moustrap || new Mousetrap();
    moustrapInstance.bind("enter", callback);
    moustrapInstance.bind("esc", rejectCallback);
    if (ref.current) {
      ref.current.focus();
    }
    return (): void => {
      moustrapInstance.unbind("enter");
      moustrapInstance.unbind("esc");
    };
  }, [moustrap, callback, rejectCallback]);
  return <div ref={ref}>{children}</div>;
};

export default BindHotKeys;
