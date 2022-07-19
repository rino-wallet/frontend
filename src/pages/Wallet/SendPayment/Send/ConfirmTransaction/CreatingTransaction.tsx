import React from "react";
import { FormatNumber, Prompt } from "../../../../../components";
import CreatingTransactionStage from "./CreatingTransactionStage";

interface Props {
  amount: string;
  address: string;
  priority: string;
  stage: string;
  fee: string;
}

const CreatingTransaction: React.FC<Props> = ({
  amount, address, priority, fee, stage,
}) => (
  <div
    data-qa-selector="creating-transaction"
    className="inset-0 z-10 flex justify-center items-center"
  >
    <Prompt
      when
      title="Transaction creation in progress."
      message="If you interrupt the transaction creation process, no transaction is created."
    />
    <CreatingTransactionStage
      amount={(
        <span>
          <FormatNumber value={amount} />
          {" "}
          XMR
        </span>
)}
      address={address}
      priority={priority}
      stage={stage}
      fee={<FormatNumber value={fee} />}
      loading
    />
  </div>
);

export default CreatingTransaction;
