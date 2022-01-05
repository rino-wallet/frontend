import React, { useState } from "react";
import { Formik } from "formik";
import { useHistory, useParams } from "react-router-dom";
import * as yup from "yup";
import routes from "../../../router/routes";
import {
  FetchBackupPrivateKeyPayload,
  FetchBackupPrivateKeyResponse,
  ResetPasswordConfirmPayload,
} from "../../../types";
import { reencrypPrivateKey, passwordValidationSchema } from "../../../utils";
import { FormErrors, PageTemplate, SuccessModal } from "../../../modules/index";
import { Label, Input, Button } from "../../../components";

interface Props {
  fetchBackupPrivateKey: (data: FetchBackupPrivateKeyPayload) => Promise<FetchBackupPrivateKeyResponse>;
  onSubmit: (data: ResetPasswordConfirmPayload) => Promise<void>;
}

const resetPasswordConfirmSchema = yup.object().shape({
  recovery_key: yup.string().length(32, "The recovery key should contain 32 characters.").required("This field is required."),
  new_password: passwordValidationSchema,
  re_new_password: yup
    .string()
    .required("This field is required.")
    .oneOf([yup.ref("new_password")], "Passwords must match."),
});
const ResetPasswordConfirm: React.FC<Props> = ({
  onSubmit,
  fetchBackupPrivateKey,
}) => {
  const { userId, token }: { userId: string; token: string } = useParams();
  const [isFinished, setIsFinished] = useState(false);
  const history = useHistory();
  return (
    <PageTemplate title="Set a new password">
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
          { setErrors }
        ): Promise<void> => {
          try {
            const { encPrivateKeyBackup: encPrivateKeyBackup } = await fetchBackupPrivateKey({
              uid: userId,
              token,
            });
            const { authKey, signature, privateKeyEK } = await reencrypPrivateKey(encPrivateKeyBackup, values.recovery_key, values.new_password);
            const response = await onSubmit({
              uid: userId,
              token,
              new_password: authKey,
              re_new_password: authKey,
              signature: signature,
              enc_private_key: privateKeyEK,
            });
            setIsFinished(true);
            return response;
          } catch(error) {
            if (error.data) {
              setErrors(error.data);
            }
            if (error.decryptKey) {
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
        }): React.ReactElement => (
          <form name="form-reset-password-confirm" onSubmit={handleSubmit} className="card">
            {
              isFinished && (
                <SuccessModal
                  title="Password Updated"
                  message="You have successfully updated your account password."
                  goBackCallback={(): void => history.push(routes.login)}
                />
              )
            }
            <div className="form-field">
              <Label label="Recovery key">
                <Input
                  type="text"
                  name="recovery_key"
                  placeholder="Recovery key"
                  value={values.recovery_key}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.recovery_key ? errors.recovery_key : ""}
                />
              </Label>
            </div>
            <div className="form-field">
              <Label label="Password">
                <Input
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
            <div className="form-field mt-8 mb-3">
              <Button
                disabled={!isValid || isSubmitting}
                type="submit"
                name="submit-btn"
                loading={isSubmitting}
                block
              >
                Update Password
              </Button>
            </div>
          </form>
        )}
      </Formik>
    </PageTemplate>
  );
};

export default ResetPasswordConfirm;
