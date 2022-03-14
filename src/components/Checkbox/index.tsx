import React, { ReactNode } from "react";
import classNames from "classnames";
import "./styles.css";

type Props = {
  checked?: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  children?: ReactNode;
  name?: string;
  disabled?: boolean;
};

export const Checkbox: React.FC<Props> = (props) => {
  const { checked = false, onChange, children, name = "", disabled = false } = props;
  return (
    <label className={classNames(
      "inline-flex items-center space-x-3 cursor-pointer",
      { "theme-text-secondary": disabled },
    )}>
      <input
        name={name}
        checked={checked}
        onChange={onChange}
        type="checkbox"
        disabled={disabled}
        className={classNames(
          "form-tick appearance-none bg-white bg-check h-8 w-8 border border-solid theme-control-border rounded cursor-pointer checked:border-transparent flex-shrink-0",
          {
            "checked theme-control-primary-gradient-light": checked,
          }
        )}
      />
      <span className="font-normal">
        {children}
      </span>
    </label>
  );
}
