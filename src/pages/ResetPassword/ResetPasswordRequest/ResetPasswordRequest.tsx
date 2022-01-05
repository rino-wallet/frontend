import React, { useState } from "react";
import { Formik } from "formik";
import * as yup from "yup";
import { useNavigate } from "react-router-dom";
import { ResetPasswordRequestPayload } from "../../../types";
import { FormErrors } from "../../../modules/index";
import { Label, Input, Button, Panel } from "../../../components";
import routes from "../../../router/routes";

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
  const navigate = useNavigate();
  const [hasSubmitCompleted, setHasSubmitCompleted] = useState(false);
  return (
    <Formik
      initialValues={{
        email: "",
        non_field_errors: "",
      }}
      validationSchema={forgotPasswordRequestValidationSchema}
      onSubmit={(values, { setErrors }): Promise<void> => {
        return onSubmit({ email: values.email }).then(
          () => {
            setHasSubmitCompleted(true);
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
          {
            hasSubmitCompleted ? (
              <Panel title="Forgot Password">
                <Panel.Body>
                  <p>
                    We sent an email to <span className="text-primary font-bold break-words">{values.email}</span> with instructions to reset your password.
                  </p>
                </Panel.Body>
                <Panel.Actions>
                  <Button
                    size={Button.size.BIG}
                    variant={Button.variant.GRAY}
                    onClick={(): void => { navigate(routes.login); }}
                    type="button"
                    name="submit-btn"
                  >
                    Ok
                  </Button>
                </Panel.Actions>
              </Panel> 
            ) : (
              <Panel title="Forgot Password">
                <Panel.Body>
                  <div className="form-field">
                    <Label label="email">
                      <Input
                        type="email"
                        name="email"
                        value={values.email}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        placeholder="Your email"
                        error={touched.email ? errors.email: ""}
                      />
                    </Label>
                  </div>
                  <FormErrors errors={errors} />
                </Panel.Body>
                <Panel.Actions>
                  <Button
                    size={Button.size.BIG}
                    variant={Button.variant.GRAY}
                    type="button"
                    name="cancel-btn"
                    onClick={(): void => { navigate(routes.login); }}
                  >
                    Cancel
                  </Button>
                  <Button
                    size={Button.size.BIG}
                    variant={Button.variant.PRIMARY_LIGHT}
                    disabled={dirty && !isValid || isSubmitting}
                    type="submit"
                    name="submit-btn"
                    loading={isSubmitting}
                  >
                    Send
                  </Button>
                </Panel.Actions>
              </Panel>
            )
          }
        </form>
      )}
    </Formik>
  );
};

export default ResetPasswordRequestPage;
