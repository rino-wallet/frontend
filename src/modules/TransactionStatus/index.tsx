import React from "react";
import { Status } from "../../components";
import { Direction } from "../../types";

interface Props {
  numConfirmations: number;
  direction: Direction;
}

const statusLabel: {[key: string]: string} = {
  "in": "Received",
  "out": "Sent",
}

export const TransactionStatus: React.FC<Props> = ({ numConfirmations, direction }) => {
  return (
    <Status
      variant={numConfirmations > 0 ? Status.variant.GREEN : Status.variant.GRAY}
    >
      {numConfirmations > 0 ? statusLabel[direction] : "Pending"}
    </Status>
  )
}
