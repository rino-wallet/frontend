import React from "react";
import { Status } from "../../components";

interface Props {
  numConfirmations: number;
}

export const TransactionStatus: React.FC<Props> = ({ numConfirmations }) => {
  return (
    <Status
      variant={numConfirmations > 0 ? Status.variant.GREEN : Status.variant.GRAY}
    >
      {numConfirmations > 0 ? "CONFIRMED" : "UNCONFIRMED"}
    </Status>
  )
}
