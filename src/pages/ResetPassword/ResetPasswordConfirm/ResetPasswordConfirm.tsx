import React, { useState } from "react";
import { Formik } from "formik";
import { useNavigate, useParams } from "react-router-dom";
import * as yup from "yup";
import { useTranslation } from "react-i18next";
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
  recovery_key: yup.string().length(64, "errors.recovery.key.length").required("errors.required"),
  new_password: passwordValidationSchema,
  re_new_password: yup
    .string()
    .required("errors.required")
    .oneOf([yup.ref("new_password")], "errors.match.password"),
});
const ResetPasswordConfirm: React.FC<Props> = ({
  onSubmit,
}) => {
  const { t } = useTranslation();
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
            setErrors({ recovery_key: "errors.recovery.key.incorrect" });
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
                title={t("auth.password.updated")}
                message={t("auth.password.updated.message") as string}
                goBackCallback={(): void => navigate(routes.login)}
              />
            )
          }
          <Panel title={t("auth.set.new.password")}>
            <Panel.Body>
              <div className="form-field">
                <Label label={t("auth.recovery.secret.label")}>
                  <Input
                    autoComplete="off"
                    type="text"
                    name="recovery_key"
                    placeholder={t("auth.recovery.secret.label") as string}
                    value={values.recovery_key}
                    onChange={(e): void => setFieldValue("recovery_key", e.target.value.replace(/\s+/g, ""))}
                    onBlur={handleBlur}
                    error={touched.recovery_key ? t(errors.recovery_key as string) as string : ""}
                  />
                </Label>
              </div>
              <div className="form-field">
                <Label label={t("auth.password.label")}>
                  <Input
                    autoComplete="new-password"
                    type="password"
                    name="new_password"
                    placeholder={t("auth.password.placeholder") as string}
                    value={values.new_password}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.new_password ? t(errors.new_password as string) as string : ""}
                  />
                </Label>
              </div>
              <div className="form-field">
                <Label label={t("auth.passwordconfirmation.label")}>
                  <Input
                    autoComplete="new-password"
                    type="password"
                    name="re_new_password"
                    placeholder={t("auth.password.placeholder") as string}
                    value={values.re_new_password}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.re_new_password ? t(errors.re_new_password as string) as string : ""}
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
                {t("common.ok")}
              </Button>
              <Button
                size={Button.size.BIG}
                variant={Button.variant.PRIMARY_LIGHT}
                disabled={!isValid || isSubmitting}
                type="submit"
                name="submit-btn"
                loading={isSubmitting}
              >
                {t("auth.update.password")}
              </Button>
            </Panel.Actions>
          </Panel>
        </form>
      )}
    </Formik>
  );
};

export default ResetPasswordConfirm;
