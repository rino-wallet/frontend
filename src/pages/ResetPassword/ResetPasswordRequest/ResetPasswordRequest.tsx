import React, { useState } from "react";
import { Formik } from "formik";
import * as yup from "yup";
import { ResetPasswordRequestPayload } from "../../../types";
import { PageTemplate, FormErrors } from "../../../modules/index";
import { Label, Input, Button } from "../../../components";

const forgotPasswordRequestValidationSchema = yup.object().shape({
  email: yup
    .string()
    .email("Please enter a valid email address.")
    .required("This field is required."),
});

interface Props {
  onSubmit: (data: ResetPasswordRequestPayload) => Promise<void>
}

const ResetPasswordRequestPage: React.FC<Props> = ({ onSubmit }) => {
  const [successMessage, setSuccessMessage] = useState("");
  return (
    <PageTemplate title="Reset Password">
      <Formik
        initialValues={{
          email: "",
          non_field_errors: "",
        }}
        validationSchema={forgotPasswordRequestValidationSchema}
        onSubmit={(values, { setErrors }): Promise<void> => {
          return onSubmit({ email: values.email }).then(
            () => {
              setSuccessMessage(
                "Success! Please, check your email."
              );
            },
            (err) => {
              setErrors(err.response.data);
            }
          );
        }}
      >
        {({
          values,
          handleChange,
          handleBlur,
          handleSubmit,
          errors,
          dirty,
          isValid,
          touched,
          isSubmitting,
        }): React.ReactElement => (
          <form name="form-reset-password-request" onSubmit={handleSubmit} className="card">
            <div className="form-field">
              <Label label="E-mail">
                <Input
                  type="email"
                  name="email"
                  value={values.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="Your Email"
                  error={touched.email ? errors.email: ""}
                />
              </Label>
            </div>
            <FormErrors errors={errors} />
            <div className="form-field mb-3">
              <Button
                  disabled={dirty && !isValid || isSubmitting}
                  type="submit"
                  name="submit-btn"
                  loading={isSubmitting}
                  block
                >
                  Send
                </Button>
            </div>
            {successMessage ? (
              <div id="success-message" className="text-success">
                {successMessage}
              </div>
            ) : null}
          </form>
        )}
      </Formik>
    </PageTemplate>
  );
};

export default ResetPasswordRequestPage;
