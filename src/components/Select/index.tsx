import React, { ReactNode } from "react";
import classNames from "classnames";
import "./styles.css";

// eslint-disable-next-line
export enum UI_SIZE {
  BIG,
  MEDIUM,
  SMALL,
}

type Props = {
  value?: string;
  name?: string;
  size?: UI_SIZE;
  error?: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLSelectElement>) => void;
  children: ReactNode;
};

const SIZE_MAPS: Record<UI_SIZE, string> = {
  [UI_SIZE.BIG]: "px-10 py-4.25 text-lg rounded-big",
  [UI_SIZE.MEDIUM]: "px-8 py-3.75 text-base rounded-medium",
  [UI_SIZE.SMALL]: "pl-6 pr-8 py-3.75 text-sm rounded-small",
};


export const Select: React.FC<Props> & { size: typeof UI_SIZE; } = (props) => {
  const {
    value = "",
    name = "",
    error = "",
    size = UI_SIZE.MEDIUM,
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
          "select w-full inline-flex border border-solid text-lg placeholder-gray-400",
          SIZE_MAPS[size],
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

Select.size = UI_SIZE;
