import React, { useEffect, useRef, useState } from "react";
import * as yup from "yup";
import { useFormik } from "formik";
import QRCode from "qrcode";
import {
  BindHotKeys, Input, Button, Spinner, Label,
} from "../../../components";
import { Modal, FormErrors } from "../../index";
import {
  Create2FAResponse, Enable2FAPayload, Enable2FAResponse, UseThunkActionCreator,
} from "../../../types";

const validationSchema = yup.object().shape({
  code: yup.string().required("This field is required."),
});

interface Props {
  submit: () => Promise<void>;
  cancel: () => void;
  create2FA: () => UseThunkActionCreator<Create2FAResponse>;
  enable2FA: (data: Enable2FAPayload) => UseThunkActionCreator<Enable2FAResponse>;
  provisioningUri: string;
  secretKey: string;
}

const Enable2FA: React.FC<Props> = ({
  submit, cancel, create2FA, enable2FA, provisioningUri, secretKey,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [qrcode, setQrcode] = useState("");
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    create2FA().finally(() => {
      setLoading(false);
    });
  }, []);
  useEffect(() => {
    QRCode.toDataURL(provisioningUri, (err: any, string: string) => {
      setQrcode(string);
    });
  }, [setQrcode, provisioningUri]);
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
      detail: "",
    },
    onSubmit: (formValues, { setErrors }) => enable2FA({ code: formValues.code }).then(
      () => {
        submit();
      },
      (err: any) => {
        // eslint-disable-next-line
        console.log(err);
        setErrors(err);
      },
    ),
  });
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  });
  return (
    <BindHotKeys callback={handleSubmit} rejectCallback={cancel}>
      <Modal
        title="2FA Setup"
        onClose={cancel}
      >
        <form onSubmit={handleSubmit}>
          <Modal.Body>
            <p className="mb-6">
              <b>Step 1.</b>
              {" "}
              You will need a mobile app to set up Two-factor Authentication,
              such as: Google Authenticator, Authy, Duo Mobile.
            </p>
            <p className="mb-3">
              <b>Step 2.</b>
              {" "}
              Scan the QR code with your app or enter the secret key manually:
              <span className="theme-text-primary" data-qa-selector="secret-key">{secretKey}</span>
            </p>
            <div className="mb-3 relative flex justify-center">
              {loading ? (
                <Spinner stub />
              ) : (
                <img className="w-32 h-32" src={qrcode} alt="qrcode" />
              )}
            </div>
            <p className="mb-6">
              <b>Step 3.</b>
              {" "}
              Enter the 6-digit code generated by your app:
            </p>
            <div className="form-field tracking-wide">
              <Label label="Authentication code">
                <div className="w-3/4">
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
                </div>
              </Label>
            </div>
            <FormErrors errors={errors} />
          </Modal.Body>
          <Modal.Actions>
            <div className="flex justify-end space-x-3">
              <Button
                type="button"
                name="cancel-btn"
                onClick={cancel}
              >
                Cancel
              </Button>
              <Button
                disabled={!isValid || !dirty || isSubmitting}
                type="submit"
                name="submit-btn"
                loading={isSubmitting}
              >
                Verify
              </Button>
            </div>
          </Modal.Actions>
        </form>
      </Modal>
    </BindHotKeys>
  );
};

export default Enable2FA;
