import React, { useState } from "react";
import { useFormik } from "formik";
import { Link } from "react-router-dom";
import * as yup from "yup";
import { ChangeEmailRequestPayload } from "../../../types";
import { FormErrors, Modal } from "../../../modules/index";
import { Button, Label, Input } from "../../../components";
import { deriveUserKeys } from "../../../utils";
import ChangeEmailInstructions from "./ChangeEmailInstructions";
import routes from "../../../router/routes";

const validationSchema = yup.object().shape({
  new_email: yup.string().email("Please enter valid email").required("This field is required."),
  current_password: yup.string().required("This field is required."),
});

interface Props {
  onSubmit: (data: ChangeEmailRequestPayload) => Promise<void>;
  goBackCallback: () => void;
}

const ChangeEmail: React.FC<Props> = ({ onSubmit, goBackCallback }) => {
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
      new_email: "",
      current_password: "",
      non_field_errors: "",
    },
    onSubmit: async (formValues, { setErrors }) => {
      try {
        const { authKey } = await deriveUserKeys(formValues.current_password);
        await onSubmit({ new_email: formValues.new_email, current_password: authKey });
        setSubmited(true);
      } catch (err) {
        setErrors(err.response ? err.response.data : err);
      }
    },
  });
  return submited ? (
    <ChangeEmailInstructions
      email={values.new_email}
      goBackCallback={goBackCallback}
    />
  ) : (
    <Modal title="Change Email" goBackCallback={goBackCallback}>
      <form onSubmit={handleSubmit}>
        <p className="mb-6">
          We will send a validation message to your new email address. <br />
          Please follow instructions in the message.
        </p>
        <div className="form-field">
          <Label label="New email">
            <Input
              type="email"
              name="new_email"
              value={values.new_email}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="New email"
              error={touched.new_email && errors.new_email || ""}
            />
          </Label>
        </div>
        <div className="mb-1">
          <Label label="Reenter account password">
            <Input
              type="password"
              name="current_password"
              value={values.current_password}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Account password"
              error={touched.current_password && errors.current_password || ""}
            />
          </Label>
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
            Update Email
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default ChangeEmail;
