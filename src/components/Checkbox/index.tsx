import React, { ReactNode } from "react";
import classNames from "classnames";
import "./styles.css";

type Props = {
  checked?: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  children?: ReactNode;
  name?: string;
};

export const Checkbox: React.FC<Props> = (props) => {
  const { checked = false, onChange, children, name = "" } = props;
  return (
    <label className="inline-flex items-center space-x-3 cursor-pointer">
      <input
        name={name}
        checked={checked}
        onChange={onChange}
        type="checkbox"
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
