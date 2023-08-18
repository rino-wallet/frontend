import React, { FC, ReactChild } from "react";
import { Spinner } from "../Spinner";

interface Props {
  message: ReactChild;
  loading?: boolean;
  isEnterprise?: boolean;
}

export const EmptyList: FC<Props> = ({
  message,
  loading,
  isEnterprise = false,
}) => (
  <div className="flex h-20 justify-center items-center text-center relative">
    {loading
      ? <Spinner stub isEnterprise={isEnterprise} />
      : <span className="theme-text-secondary">{message}</span>}
  </div>
);
