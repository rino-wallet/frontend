import React from "react";
import Decimal from "decimal.js-light";
import { FormatNumber, Loading } from "../../../../../components";
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
    <CreatingTransactionStage
      address={address}
      priority={priority}
      stage={stage}
      fee={<FormatNumber value={fee} />}
      total={fee ? <FormatNumber value={new Decimal(amount).plus(fee).toString()} /> : <Loading />}
      loading
    />
  </div>
);

export default CreatingTransaction;
