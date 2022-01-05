import React from "react";
import classNames from "classnames";
import { UI_SIZE, UI_SIZE_MAP } from "../../constants";

type InputType = "email" | "text" | "password";

type Props = {
  size?: UI_SIZE;
  type: InputType,
  value?: string;
  name?: string;
  placeholder?: string;
  error?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  disabled?: boolean;
  className?: string;
  maxLength?: number;
};

const SIZE_MAPS: Record<UI_SIZE, string> = {
  [UI_SIZE.BIG]: `px-3 ${UI_SIZE_MAP[UI_SIZE.BIG]}`,
  [UI_SIZE.MEDIUM]: `px-3 ${UI_SIZE_MAP[UI_SIZE.MEDIUM]}`,
  [UI_SIZE.SMALL]: `px-3 ${UI_SIZE_MAP[UI_SIZE.SMALL]}`,
};

export const Input: React.FC<Props> & { size: typeof UI_SIZE; } = (props) => {
  const {
    size = UI_SIZE.BIG,
    type,
    value = "",
    name = "",
    placeholder = "",
    error = "",
    className = "",
    maxLength,
    onChange,
    onBlur = ():void => undefined,
    disabled = false,
  } = props;
  return (
    <div>
      <input
        type={type}
        value={value}
        name={name}
        onChange={onChange}
        onBlur={onBlur}
        placeholder={placeholder}
        maxLength={maxLength}
        className={classNames(
          className,
          "w-full inline-flex rounded border-solid border placeholder-gray-300 text-gray-900 disabled:opacity-50",
          SIZE_MAPS[size],
          {
            "border-gray-200": !error,
            "border-red-300": !!error,
          }
        )}
        disabled={disabled}
      />
      {
        error && <div id={`${name}-error`} className="text-error text-xs mt-1">{error}</div>
      }
    </div>
  );
}

Input.size = UI_SIZE;