import React from "react";
import { createModal } from "promodal";
import { BindHotKeys, Label, Button } from "../../../components";
import { Modal } from "../../../modules/index";

interface Props {
  submit: () => Promise<void>;
  cancel: () => void;
  address: string;
  amount: string;
  memo: string;
  priority: string;
}
const PaymentConfirmation: React.FC<Props> = ({
  submit,
  cancel,
  address,
  amount,
  memo,
  priority,
}) => {
  return (
    <BindHotKeys callback={submit} rejectCallback={cancel}>
      <Modal
        title="Payment Confirmation"
      >
        <div>
          <p className="mb-3">
            Check details:
          </p>
          <div className="form-field">
            <Label label="amount">
              <span data-qa-selector="transaction-amount">{amount}</span> XMR
            </Label>
          </div>
          <div className="form-field">
            <Label label="address">
              <span className="text-orange-500 break-all" data-qa-selector="transaction-dest-address">
                {address}
              </span>
            </Label>
          </div>
          <div className="form-field">
            <Label label="memo">
              <span data-qa-selector="transaction-memo">{memo}</span>
            </Label>
          </div>
          <div className="form-field">
            <Label label="priority">
              <span data-qa-selector="transaction-priority">{priority}</span>
            </Label>
          </div>
          <div className="flex justify-end space-x-3">
            <Button onClick={cancel}>Edit</Button>
            <Button onClick={submit}>Confirm Payment</Button>
          </div>
        </div>
      </Modal>
    </BindHotKeys>
  );
};

export default createModal(PaymentConfirmation);
