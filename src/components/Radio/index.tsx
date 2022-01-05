import React, { ReactNode } from "react";
import "./styles.css";

type Props = {
  value: string;
  checked: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  children?: ReactNode;
};

export const Radio: React.FC<Props> = (props) => {
  const { value, checked, onChange, children } = props;
  return (
    <label className="inline-flex items-center text-sm">
      <input checked={checked} type="radio" value={value} className="h-4 w-4" onChange={onChange} />
      <span className="ml-2 text-gray-900">
        {children}
      </span>
    </label>
  );
}
