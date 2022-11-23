import React, {
  ReactNode, useEffect, useRef,
} from "react";
import * as yup from "yup";
import { useFormik } from "formik";
import { createModal } from "promodal";
import {
  BindHotKeys, Input, Button, Label,
} from "../../components";
import { Modal, FormErrors } from "../index";

const validationSchema = yup.object().shape({
  password: yup.string().required("This field is required."),
});

interface Props {
  submit: (password: string) => void;
  callback: (password: string) => Promise<void>;
  cancel: () => void;
  title?: ReactNode;
  text?: ReactNode;
}

const EnterPasswordModal: React.FC<Props> = ({
  submit, callback, cancel, title, text,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
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
      password: "",
      non_field_errors: "",
    },
    onSubmit: (formValues, { setErrors }) => {
      if (typeof callback === "function") {
        return callback(formValues.password)
          .then(() => { submit(formValues.password); })
          .catch(
            (err: any) => {
              setErrors(err);
            },
          );
      }
      return submit(formValues.password);
    },
  });
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  });
  return (
    <BindHotKeys callback={handleSubmit} rejectCallback={cancel}>
      <Modal
        title={title}
        onClose={cancel}
        className="z-50"
      >
        <form onSubmit={handleSubmit}>
          <Modal.Body>
            {
              text && (
                <div className="form-field">
                  {text}
                </div>
              )
            }
            <div className="form-field">
              <Label label="Enter your account password">
                <Input
                  ref={inputRef}
                  type="password"
                  name="password"
                  value={values.password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.password ? errors.password : ""}
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
                onClick={(): void => cancel()}
                block
              >
                Cancel
              </Button>
              <Button
                disabled={!isValid || !dirty || isSubmitting}
                type="submit"
                name="submit-btn"
                variant={Button.variant.PRIMARY_LIGHT}
                loading={isSubmitting}
                block
              >
                Continue
              </Button>
            </div>
          </Modal.Actions>
        </form>
      </Modal>
    </BindHotKeys>
  );
};

const enterPasswordModal = createModal(({
  submit,
  cancel,
  callback,
  title = "Enter your account password",
  text = "",
}: Props) => (
  <EnterPasswordModal
    callback={callback}
    submit={submit}
    cancel={cancel}
    title={title}
    text={text}
  />
));

export { enterPasswordModal };
