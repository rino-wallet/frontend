import React, { ReactNode } from "react";

type Props = {
  label?: ReactNode | string;
  children?: ReactNode;
};

export const Label: React.FC<Props> = (props) => {
  const { label = "", children } = props;
  return (
    <div>
      <div className="text-xxs mb-1 text-gray-400 uppercase">{label}</div>
      {children}
    </div>
  );
}
