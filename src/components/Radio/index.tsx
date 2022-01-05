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
    <label className="inline-flex items-center text-base">
      <input checked={checked} type="radio" value={value} className="h-5 w-5" onChange={onChange} />
      <span className="ml-2 theme-text">
        {children}
      </span>
    </label>
  );
}
