import React, { useState } from "react";
import { useFormik } from "formik";
import * as yup from "yup";
import { Link } from "react-router-dom";
import { ChangePasswordPayload } from "../../../types";
import { FormErrors, Modal, SuccessModal } from "../../../modules/index";
import { Button, Label, Input } from "../../../components";
import { deriveUserKeys, reencrypPrivateKey, passwordValidationSchema } from "../../../utils";
import routes from "../../../router/routes";

const validationSchema = yup.object().shape({
  new_password: passwordValidationSchema,
  current_password: yup.string().required("This field is required."),
  re_new_password: yup
    .string()
    .required("This field is required.")
    .oneOf([yup.ref("new_password")], "Passwords must match."),
});

interface Props {
  onSubmit: (data: ChangePasswordPayload) => Promise<void>;
  goBackCallback: () => void;
  encPrivateKey: string;
}

const ChangePassword: React.FC<Props> = ({ onSubmit, goBackCallback, encPrivateKey }) => {
  const [submited, setSubmited] = useState(false);
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
      new_password: "",
      re_new_password: "",
      current_password: "",
      non_field_errors: "",
    },
    onSubmit: async (formValues, { setErrors }) => {
      try {
        const { authKey: authKeyOld, encryptionKey: encryptionKeyOld } = await deriveUserKeys(formValues.current_password);
        const { authKey: authKeyNew, privateKeyEK, signature } = await reencrypPrivateKey(encPrivateKey, encryptionKeyOld, formValues.new_password);
        await onSubmit({
          current_password: authKeyOld,
          new_password: authKeyNew,
          re_new_password: authKeyNew,
          enc_private_key: privateKeyEK,
          signature,
        });
        setSubmited(true);
      } catch (err) {
        if (err.decryptKey) {
          setErrors({ current_password: "Incorrect password." });
        } else {
          setErrors(err);
        }
      }
    },
  });
  return submited ? (
    <SuccessModal
      goBackCallback={goBackCallback}
      title="Password Updated"
      message="You have successfully updated your account password."
    />
  ) : (
    <Modal title="Change password" goBackCallback={goBackCallback}>
      <form onSubmit={handleSubmit}>
        <div className="form-field">
          <Label label="Current Account Password">
            <Input
              type="password"
              name="current_password"
              value={values.current_password}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Current Account Password"
              error={touched.current_password && errors.current_password || ""}
            />
          </Label>
        </div>
        <div className="mb-1">
          <Label label="New Account Password">
            <Input
              type="password"
              name="new_password"
              value={values.new_password}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="New Account Password"
              error={touched.new_password && errors.new_password || ""}
            />
          </Label>
          <div className="mt-3">
            <Input
              type="password"
              name="re_new_password"
              value={values.re_new_password}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Confirm New Password"
              error={touched.re_new_password && errors.re_new_password || ""}
            />
          </div>
        </div>
        <div className="form-field">
          <Link
            className="link"
            id="forgot-password"
            to={routes.resetPasswordRequest}
          >
            I Forgot My Password
          </Link>
        </div>
        <FormErrors errors={errors} />
        <div className="flex form-field justify-end space-x-3 mt-10 whitespace-nowrap">
          <Button
            disabled={isSubmitting}
            type="button"
            name="cancel-btn"
            onClick={goBackCallback}
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
            Update Password
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default ChangePassword;
