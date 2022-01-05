import React from "react";
import { Spinner } from "../Spinner";

interface Props {
  message: string;
  loading?: boolean;
}

export const EmptyList: React.FC<Props> = ({ message, loading }) => (
  <div className="flex h-20 justify-center items-center text-center relative">
    {loading ? <Spinner stub /> : <span className="text-secondary">{message}</span>}
  </div>
)
