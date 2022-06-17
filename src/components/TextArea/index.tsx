import React from "react";
import classNames from "classnames";

type Props = {
  value?: string;
  placeholder?: string;
  name?: string;
  error?: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
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
          "font-lato inline-flex px-6 py-3.75 text-lg rounded rounded-medium placeholder-gray-400 border-solid border appearance-none theme-text",
          {
            "theme-control-border": !error,
            "theme-border-red": !!error,
          },
        )}
      />
      {
        error && <div id={`${name}-error`} className="theme-text-error text-base mt-1">{error}</div>
      }
    </div>
  );
};
