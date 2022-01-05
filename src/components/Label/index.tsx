import React, { ReactNode } from "react";
import classNames from "classnames";
import { Placeholder } from "../Placeholder";

type Props = {
  label?: ReactNode | string;
  subtitle?: string;
  children?: ReactNode;
  loading?: boolean;
  inline?: boolean;
  labelClassName?: string;
  valueClassName?: string;
};

export const Label: React.FC<Props> = (props) => {
  const { label = "", subtitle="", labelClassName, valueClassName, loading, inline, children } = props;
  return (
    <div className={classNames({ "md:flex md:space-x-6": inline })}>
      <div className={classNames("mb-2 text-sm theme-text uppercase font-catamaran leading-none flex-shrink-0", labelClassName, { "md:mt-6 md:w-1/4": inline })}>
        {label}<br/>
        {subtitle ? <span className="theme-text-secondary">({subtitle})</span> : null}
      </div>
      {loading
        ? <div className={classNames("mt-4", { "md:w-3/4": inline })}><Placeholder /></div>
        : <div className={classNames(valueClassName, { "md:w-3/4 mt-4": inline })}>{children}</div>
      }
    </div>
  );
}
