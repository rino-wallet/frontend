import React, { ReactNode } from "react";
import classNames from "classnames";
import { Placeholder } from "../Placeholder";

type Props = {
  label?: ReactNode | string;
  subtitle?: string;
  children?: ReactNode;
  loading?: boolean;
  inline?: boolean;
  isFormField?: boolean;
  labelClassName?: string;
  valueClassName?: string;
};

export const Label: React.FC<Props> = (props) => {
  const {
    label = "", subtitle = "", labelClassName, valueClassName, loading, inline, children, isFormField,
  } = props;
  return (
    <div className={classNames({ "mb-4 md:flex md:space-x-6": inline, "items-baseline": inline && !isFormField, "items-start": inline && isFormField })}>
      <div className={classNames(
        "mb-2 text-sm theme-text uppercase font-catamaran leading-1 flex-shrink-0",
        labelClassName,
        {
          "md:w-1/4 ": inline,
          "md:mt-5": inline && isFormField,
        },
      )}
      >
        {label}
        <br />
        {subtitle ? (
          <span className="theme-text-secondary">
            (
            {subtitle}
            )
          </span>
        ) : null}
      </div>
      {loading
        ? <div className={classNames("mt-2 md:mt-4", { "md:w-3/4": inline })}><Placeholder /></div>
        : <div className={classNames(valueClassName, { "md:w-3/4 leading-1": inline })}>{children}</div>}
    </div>
  );
};
