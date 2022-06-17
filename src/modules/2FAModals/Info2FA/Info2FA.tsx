import React, { useState } from "react";
import {
  BindHotKeys, Button, Checkbox, Label,
} from "../../../components";
import { Modal, CopyArea } from "../../index";

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
        onClose={cancel}
      >
        <Modal.Body>
          <div>
            <p className="mb-6 text-xl font-bold">Your account is now secure.</p>
            <p className="mb-6">
              <span className="theme-text-red font-bold">Important:</span>
              {" "}
              Save your 16-digit
              secret key, for example by writing it down on paper, and store it
              safely. You will need it in the case you lose access to your phone.
              Without your phone or the 16-digit secret key you will be locked
              out of your account!
            </p>
            <div className="form-field">
              <Label label="16-Digit secret key:">
                <CopyArea value={secretKey} qaSelector="code">
                  {secretKey}
                </CopyArea>
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
        </Modal.Body>
        <Modal.Actions>
          <Button
            type="button"
            name="submit-btn"
            disabled={!checked}
            onClick={(): void => {
              submit();
            }}
          >
            OK
          </Button>
        </Modal.Actions>
      </Modal>
    </BindHotKeys>
  );
};

export default Info2FA;
