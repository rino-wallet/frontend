import React, { useState } from "react";
import { Formik } from "formik";
import { useNavigate, useParams } from "react-router-dom";
import * as yup from "yup";
import routes from "../../../router/routes";
import { ResetPasswordConfirmThunkPayload } from "../../../types";
import { passwordValidationSchema } from "../../../utils";
import { FormErrors, SuccessModal } from "../../../modules/index";
import {
  Label, Input, Button, Panel,
} from "../../../components";

interface Props {
  onSubmit: (data: ResetPasswordConfirmThunkPayload) => Promise<void>;
}

const resetPasswordConfirmSchema = yup.object().shape({
  recovery_key: yup.string().length(64, "The recovery key should contain 64 characters.").required("This field is required."),
  new_password: passwordValidationSchema,
  re_new_password: yup
    .string()
    .required("This field is required.")
    .oneOf([yup.ref("new_password")], "Passwords must match."),
});
const ResetPasswordConfirm: React.FC<Props> = ({
  onSubmit,
}) => {
  const { userId, token } = useParams();
  const [isFinished, setIsFinished] = useState(false);
  const navigate = useNavigate();
  return (
    <Formik
      initialValues={{
        token: "",
        uid: "",
        recovery_key: "",
        new_password: "",
        re_new_password: "",
        non_field_errors: "",
      }}
      validationSchema={resetPasswordConfirmSchema}
      onSubmit={async (
        values,
        { setErrors },
      ): Promise<void> => {
        try {
          const response = await onSubmit({
            uid: userId as string,
            token: token as string,
            new_password: values.new_password,
            recovery_key: values.recovery_key,
          });
          setIsFinished(true);
          return response;
        } catch (error: any) {
          if (error) {
            setErrors(error);
          }
          if (error.decryptKeys) {
            setErrors({ recovery_key: "Incorrect recovery key." });
          }
        }
      }}
    >
      {({
        values,
        handleChange,
        handleBlur,
        handleSubmit,
        errors,
        isValid,
        touched,
        isSubmitting,
        setFieldValue,
      }): React.ReactElement => (
        <form name="form-reset-password-confirm" onSubmit={handleSubmit} className="card">
          {
            isFinished && (
              <SuccessModal
                title="Password Updated"
                message="You have successfully updated your account password."
                goBackCallback={(): void => navigate(routes.login)}
              />
            )
          }
          <Panel title="Set a new password">
            <Panel.Body>
              <div className="form-field">
                <Label label="Account Recovery Secret">
                  <Input
                    autoComplete="off"
                    type="text"
                    name="recovery_key"
                    placeholder="Account Recovery Secret"
                    value={values.recovery_key}
                    onChange={(e): void => setFieldValue("recovery_key", e.target.value.replace(/\s+/g, ""))}
                    onBlur={handleBlur}
                    error={touched.recovery_key ? errors.recovery_key : ""}
                  />
                </Label>
              </div>
              <div className="form-field">
                <Label label="Password">
                  <Input
                    autoComplete="new-password"
                    type="password"
                    name="new_password"
                    placeholder="Password"
                    value={values.new_password}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.new_password ? errors.new_password : ""}
                  />
                </Label>
              </div>
              <div className="form-field">
                <Label label="Confirm Password">
                  <Input
                    autoComplete="new-password"
                    type="password"
                    name="re_new_password"
                    placeholder="Confirm Password"
                    value={values.re_new_password}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.re_new_password ? errors.re_new_password : ""}
                  />
                </Label>
              </div>
              <FormErrors errors={errors} fields={["token", "uuid"]} />
            </Panel.Body>
            <Panel.Actions>
              <Button
                size={Button.size.BIG}
                variant={Button.variant.GRAY}
                onClick={(): void => { navigate(routes.login); }}
                type="button"
                name="cancel-btn"
              >
                Cancel
              </Button>
              <Button
                size={Button.size.BIG}
                variant={Button.variant.PRIMARY_LIGHT}
                disabled={!isValid || isSubmitting}
                type="submit"
                name="submit-btn"
                loading={isSubmitting}
              >
                Update Password
              </Button>
            </Panel.Actions>
          </Panel>
        </form>
      )}
    </Formik>
  );
};

export default ResetPasswordConfirm;
