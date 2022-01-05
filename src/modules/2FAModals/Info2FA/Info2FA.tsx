import React, { useState } from "react";
import { BindHotKeys, Input, Button, Checkbox, Label } from "../../../components";
import { Modal } from "../../../modules/index";

interface Props {
  submit: () => Promise<void>;
  cancel: () => void;
  secretKey: string;
}
const Info2FA: React.FC<Props> = ({ submit, cancel, secretKey }) => {
  const [checked, setChecked] = useState(false);
  return (
    <BindHotKeys callback={submit} rejectCallback={cancel}>
      <Modal
        title="2FA Setup"
      >
        <div>
          <div>
            <p className="mb-6 text-xl">Your account is now secure.</p>
            <p className="mb-6 text-sm">
              <span className="text-primary">IMPORTANT:</span> Save your 16-digit
              secret key, for example by writing it down on paper, and store it
              safely. You will need it in the case you lose access to your phone.
              Without your phone or the 16-digit secret key you will be locked
              out of your account!
            </p>
            <div className="form-field">
              <Label label="16-Digit secret key:">
                <Input
                  type="text"
                  name="code"
                  disabled
                  value={secretKey}
                  onChange={(): void => undefined}
                  className="text-lg tracking-widest"
                  placeholder="AUTHENTICATION CODE"
                />
              </Label>
            </div>
            <Checkbox
              checked={checked}
              name="saved"
              onChange={(e: React.ChangeEvent<HTMLInputElement>): void => {
                setChecked(e.target.checked);
              }}
            >
              I saved the 16-Digit secret key
            </Checkbox>
          </div>
          <div className="mt-8">
            <Button
              type="button"
              name="submit-btn"
              disabled={!checked}
              onClick={(): void => {
                submit();
              }}
              block
            >
              OK
            </Button>
          </div>
        </div>
      </Modal>
    </BindHotKeys>
  );
};

export default Info2FA;
