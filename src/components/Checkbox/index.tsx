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
    <label className="inline-flex items-center space-x-3 text-sm cursor-pointer">
      <input
        name={name}
        checked={checked}
        onChange={onChange}
        type="checkbox"
        className={classNames(
          "form-tick appearance-none bg-white bg-check h-6 w-6 border border-gray-200 rounded-sm cursor-pointer checked:border-transparent",
          {
            "checked": checked,
          }
        )}
      />
      <span className="text-gray-700 dark:text-white font-normal">
        {children}
      </span>
    </label>
  );
}
