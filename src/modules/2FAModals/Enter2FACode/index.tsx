import React, { useEffect, useRef, useState } from "react";
import * as yup from "yup";
import { useFormik } from "formik";
import { createModal } from "promodal";
import {
  BindHotKeys, Input, Button, Label,
} from "../../../components";
import { Modal, FormErrors } from "../../index";

const validationSchema = yup.object().shape({
  code: yup.string().required("This field is required."),
});

interface Props {
  submit: (code: string) => Promise<void>;
  cancel: () => void;
  confirmCancel?: (onConfirm: () => void, onGoBack: () => void) => void;
}
const Enter2FACode: React.FC<Props> = ({ submit, cancel, confirmCancel }) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [hide, setHide] = useState(false);
  const {
    isValid,
    dirty,
    handleSubmit,
    handleChange,
    handleBlur,
    values,
    errors,
    touched,
    isSubmitting,
  } = useFormik({
    validationSchema,
    initialValues: {
      code: "",
      non_field_errors: "",
    },
    onSubmit: (formValues, { setErrors }) => {
      submit(formValues.code)
        .catch(
          (err: any) => {
            setErrors(err);
          },
        );
    },
  });
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  });
  function handleCancel(): void {
    cancel();
  }
  return (
    <BindHotKeys callback={handleSubmit} rejectCallback={handleCancel}>
      <Modal
        title="2FA Confirmation"
        onClose={handleCancel}
        className={hide ? "hidden z-50" : "!z-50"}
      >
        <form onSubmit={handleSubmit}>
          <Modal.Body>
            <p className="mb-6 text-xl">Please confirm your action.</p>
            <p className="mb-6">For security purposes, please enter the code generated by your authentication device.</p>
            <div className="form-field">
              <Label label="Enter your verification code">
                <Input
                  ref={inputRef}
                  type="text"
                  name="code"
                  value={values.code}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className="tracking-widest"
                  maxLength={6}
                  placeholder="XXXXXX"
                  error={touched.code ? errors.code : ""}
                />
              </Label>
            </div>
            <FormErrors errors={errors} />
          </Modal.Body>
          <Modal.Actions>
            <div className="flex justify-end space-x-3">
              <Button
                type="button"
                name="cancel-btn"
                onClick={confirmCancel ? (): void => {
                  setHide(true);
                  confirmCancel(handleCancel, () => setHide(false));
                } : handleCancel}
                block
              >
                Cancel
              </Button>
              <Button
                disabled={!isValid || !dirty || isSubmitting}
                type="submit"
                name="submit-btn"
                loading={isSubmitting}
                block
              >
                Confirm
              </Button>
            </div>
          </Modal.Actions>
        </form>
      </Modal>
    </BindHotKeys>
  );
};

const enter2FACode = createModal(({ confirmCancel, submit, cancel }: Props) => <Enter2FACode confirmCancel={confirmCancel} submit={submit} cancel={cancel} />);

export default enter2FACode;
