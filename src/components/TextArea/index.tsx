import React, { ReactNode } from "react";
import classNames from "classnames";

type Props = {
  value?: string;
  placeholder?: string;
  name?: string;
  error?: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  children?: ReactNode;
};

export const TextArea: React.FC<Props> = (props) => {
  const {
    value = "",
    name = "",
    placeholder = "",
    error = "",
    onChange,
  } = props;
  return (
    <div>
      <textarea
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        name={name}
        className={classNames(
          "inline-flex text-sm p-2 rounded border-solid border placeholder-gray-300 text-gray-900 disabled:opacity-50",
          {
            "border-gray-200": !error,
            "border-red-300": !!error,
          },
        )}
      />
      {
        error && <div id={`${name}-error`} className="text-error text-xs">{error}</div>
      }
    </div>
  );
}
