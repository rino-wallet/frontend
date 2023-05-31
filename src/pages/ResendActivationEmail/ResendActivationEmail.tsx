import React, { useState } from "react";
import { Formik } from "formik";
import * as yup from "yup";
import { useNavigate } from "react-router-dom";
import { useTranslation, Trans } from "react-i18next";
import { ResendActivationEmailPayload } from "../../types";
import { FormErrors } from "../../modules/index";
import {
  Label, Input, Button, Panel,
} from "../../components";
import routes from "../../router/routes";

const forgotPasswordRequestValidationSchema = yup.object().shape({
  email: yup
    .string()
    .email("errors.invalid.email")
    .required("errors.required"),
});

interface Props {
  onSubmit: (data: ResendActivationEmailPayload) => Promise<void>
}

const ResendActivationEmailPage: React.FC<Props> = ({ onSubmit }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [hasSubmitCompleted, setHasSubmitCompleted] = useState(false);
  return (
    <Formik
      initialValues={{
        email: "",
        non_field_errors: "",
      }}
      validationSchema={forgotPasswordRequestValidationSchema}
      onSubmit={(values, { setErrors }): Promise<void> => onSubmit({ email: values.email }).then(
        () => {
          setHasSubmitCompleted(true);
        },
        (err) => {
          if (Object.keys(err?.data || {}).length === 0) {
            setHasSubmitCompleted(true);
          } else {
            setErrors(err.data);
          }
        },
      )}
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
              <Panel title={t("auth.resend.email.title")}>
                <Panel.Body>
                  <Trans i18nKey="auth.activation.link.sent">
                    We sent an email to
                    {" "}
                    <span className="text-primary font-bold break-words">{values.email}</span>
                    {" "}
                    with the activation link.
                  </Trans>
                </Panel.Body>
                <Panel.Actions>
                  <Button
                    size={Button.size.BIG}
                    variant={Button.variant.GRAY}
                    onClick={(): void => { navigate(routes.login); }}
                    type="button"
                    name="submit-btn"
                  >
                    {t("common.ok")}
                  </Button>
                </Panel.Actions>
              </Panel>
            ) : (
              <Panel title={t("auth.resend.email.title")}>
                <Panel.Body>
                  <p className="mb-8">{t("auth.resend.email.message")}</p>
                  <div className="form-field">
                    <Label label={t("auth.email.label")}>
                      <Input
                        autoComplete="off"
                        type="email"
                        name="email"
                        value={values.email}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        placeholder={t("auth.email.placeholder") as string}
                        error={touched.email ? t(errors.email || "") || "" : ""}
                      />
                    </Label>
                  </div>
                  <FormErrors errors={errors} />
                </Panel.Body>
                <Panel.Actions>
                  <div className="flex flex-col-reverse m-auto gap-4 md:flex-row">
                    <Button
                      size={Button.size.BIG}
                      variant={Button.variant.GRAY}
                      type="button"
                      name="cancel-btn"
                      onClick={(): void => { navigate(routes.login); }}
                    >
                      {t("common.cancel")}
                    </Button>
                    <Button
                      size={Button.size.BIG}
                      variant={Button.variant.PRIMARY_LIGHT}
                      disabled={dirty && (!isValid || isSubmitting)}
                      type="submit"
                      name="submit-btn"
                      className="whitespace-nowrap"
                      loading={isSubmitting}
                    >
                      {t("auth.resend.confirmation")}
                    </Button>
                  </div>
                </Panel.Actions>
              </Panel>
            )
          }
        </form>
      )}
    </Formik>
  );
};

export default ResendActivationEmailPage;
