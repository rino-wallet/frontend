import React from "react";
import { Spinner, Label } from "../../../components";

interface Props {
  amount: string;
  address: string;
}

const CreatingTransaction: React.FC<Props> = ({ amount, address }) => {
  return (
    <div
      data-qa-selector="creating-transaction"
      className="fixed w-full h-full bg-white inset-0 z-10 flex justify-center items-center"
    >
      <div className="w-screen max-w-sm m-auto p-5">
        <div className="text-xl mb-3">Hold on!</div>
        <div className="text-base mb-3">Creating transaction takes time - up to a couple of minutes.</div>
        <div className="text-base mb-6">Please do not close the window now.</div>
        <div className="text-base font-bold mb-3">Transaction In Progress:</div>
        <div className="form-field">
          <Label label="amount">
            <span
              data-qa-selector="transaction-amount"
            >
              {amount}
            </span> XMR
          </Label>
        </div>
        <div className="form-field">
          <Label label="destination address">
            <span
              className="text-orange-500 break-all"
              data-qa-selector="transaction-dest-address"
            >
              {address}
            </span>
          </Label>
        </div>
        <div className="flex justify-center my-16">
          <Spinner size={85} />
        </div>
      </div>
    </div>
  )
}

export default CreatingTransaction;
