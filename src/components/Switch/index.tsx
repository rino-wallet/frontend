import React, { ReactNode } from "react";
import classNames from "classnames";

type Props = {
  id: string;
  checked?: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  children?: ReactNode;
};

export const Switch: React.FC<Props> = (props) => {
  const { checked = false, id, onChange, children } = props;
  return (
    <label className="switch inline-flex items-center space-x-3 text-sm cursor-pointer">
      <div className="relative inline-block w-8 mr-2 align-middle select-none">
        <input
          type="checkbox"
          checked={checked}
          id={id}
          onChange={onChange}
          className={classNames(
            "top-px right-3.75 checked:right-px duration-200 ease-in absolute block w-4 h-4 rounded-full bg-white appearance-none cursor-pointer",
            {
              "checked": checked,
            }
          )}
        />
        <label
          htmlFor={id}
          className={`block overflow-hidden h-4.5 rounded-full cursor-pointer duration-200 ease-in ${checked ? "control-gradient" : "bg-gray-200"}`}
        />
      </div>
      <span className="text-gray-700 dark:text-white font-normal">
        {children}
      </span>
    </label>
  );
}
