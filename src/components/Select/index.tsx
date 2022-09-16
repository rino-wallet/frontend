import React, { ReactNode } from "react";
import classNames from "classnames";
import { Icon, IconName } from "../Icon";
import "./styles.css";

// eslint-disable-next-line
export enum UI_SIZE {
  BIG,
  MEDIUM,
  SMALL,
}

type Props = {
  embeded?: boolean;
  value?: string;
  name?: string;
  size?: UI_SIZE;
  error?: string;
  icon?: IconName;
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
    embeded = false,
    value = "",
    name = "",
    error = "",
    icon = "",
    size = UI_SIZE.MEDIUM,
    onChange,
    children,
    onBlur = ():void => undefined,
  } = props;
  return (
    <div className={icon ? "relative" : ""}>
      {
        icon && (
          <div className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-600 flex items-center">
            <Icon name={icon} />
          </div>
        )
      }
      <select
        name={name}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        className={classNames(
          "select w-full inline-flex text-lg placeholder-gray-400",
          SIZE_MAPS[size],
          {
            "bg-transparent": embeded,
            "border border-solid": !embeded,
            "pl-12": icon,
          },
        )}
      >
        {children}
      </select>
      {
        error && <div id={`${name}-error`} className="theme-text-error text-xs mt-1">{error}</div>
      }
    </div>
  );
};

Select.size = UI_SIZE;
