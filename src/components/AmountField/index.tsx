import React from "react";
import { UI_SIZE } from "../../constants";
import { Input } from "../Input";

const RE_NUMBER = /^[+-]?((\.\d+)|(\d+(\.\d+)?))$/;
const RE_INCOMPLETE_NUMBER = /^([+-]|\.0*|[+-]\.0*|[+-]?\d+\.)?$/;


interface Props {
  size?: UI_SIZE;
  value?: string;
  name?: string;
  placeholder?: string;
  error?: string;
  decimalsLimit?: number;
  disabled?: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
}

export const AmountField: React.FC<Props> = ({
  value,
  onChange,
  onBlur,
  decimalsLimit = 12,
  placeholder,
  name,
  error,
  disabled,
}) => {
  return (
    <div>
      <Input
        type="text"
        name={name}
        value={value}
        onChange={(e): void => {
          const val = e.target.value;
          // only numbers allowed
          if (!RE_NUMBER.test(val) && !RE_INCOMPLETE_NUMBER.test(val)) {
            return;
          }
          // limit decimal
          if (val.slice(val.indexOf(".") + 1).length > decimalsLimit) {
            return;
          }
          onChange(e);
        }}
        onBlur={onBlur}
        placeholder={placeholder}
        error={error}
        disabled={disabled}
      />
    </div>
  );
};
