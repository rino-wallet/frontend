import React, { ReactNode } from "react";
import classNames from "classnames";
import { UI_SIZE, UI_SIZE_MAP } from "../../constants";
import "./styles.css";

type Props = {
  size: UI_SIZE;
  value?: string;
  name?: string;
  error?: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLSelectElement>) => void;
  children: ReactNode;
};

const SIZE_MAPS: Record<UI_SIZE, string> = {
  [UI_SIZE.BIG]: `pl-3 pr-5 ${UI_SIZE_MAP[UI_SIZE.BIG]}`,
  [UI_SIZE.MEDIUM]: `pl-3 pr-5 ${UI_SIZE_MAP[UI_SIZE.MEDIUM]}`,
  [UI_SIZE.SMALL]: `pl-3 pr-5 ${UI_SIZE_MAP[UI_SIZE.SMALL]}`,
};

export const Select: React.FC<Props> & { size: typeof UI_SIZE; } = (props) => {
  const {
    size,
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
          "select w-full inline-flex rounded border-solid border border-gray-200 placeholder-gray-300 text-gray-900 disabled:opacity-50",
          SIZE_MAPS[size],
        )}
      >
        {children}
      </select>
      {
        error && <div id={`${name}-error`} className="text-error text-xs mt-1">{error}</div>
      }
    </div>
  );
}

Select.size = UI_SIZE;