import React, { ReactNode } from "react";
import classNames from "classnames";
import "./styles.css";

type Props = {
  value?: string;
  name?: string;
  error?: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLSelectElement>) => void;
  children: ReactNode;
};


export const Select: React.FC<Props> = (props) => {
  const {
    value = "",
    name = "",
    error = "",
    onChange,
    children,
    onBlur = ():void => undefined,
  } = props;
  return (
    <div>
      <select
        name={name}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        className={classNames(
          "select pl-6 pr-8 py-3.75 w-full inline-flex rounded border border-solid text-lg rounded-medium placeholder-gray-400",
        )}
      >
        {children}
      </select>
      {
        error && <div id={`${name}-error`} className="theme-text-error text-xs mt-1">{error}</div>
      }
    </div>
  );
}
