import React, { useState } from "react";
import { useFormik } from "formik";
import { useTranslation } from "react-i18next";
import { generatePath, Link } from "react-router-dom";
import * as yup from "yup";
import { ChangeEmailRequestPayload } from "../../../types";
import { FormErrors, Modal } from "../../../modules/index";
import { Button, Label, Input } from "../../../components";
import { deriveUserKeys } from "../../../utils";
import ChangeEmailInstructions from "./ChangeEmailInstructions";
import routes from "../../../router/routes";

const validationSchema = yup.object().shape({
  new_email: yup.string().email("errors.invalid.email").required("errors.required"),
  current_password: yup.string().required("errors.required"),
});

interface Props {
  onSubmit: (data: ChangeEmailRequestPayload) => Promise<void>;
  goBackCallback: () => void;
  username: string;
}

const ChangeEmail: React.FC<Props> = ({ onSubmit, goBackCallback, username }) => {
  const { t } = useTranslation();
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
        const { authKey, clean } = await deriveUserKeys(formValues.current_password, username);
        const currentPassword = Buffer.from(authKey).toString("hex");
        clean();
        await onSubmit({ new_email: formValues.new_email, current_password: currentPassword });
        setSubmited(true);
      } catch (err: any) {
        setErrors(err.response ? err.response.data : err);
      }
    },
  });
  return submited ? (
    <ChangeEmailInstructions
      email={values.new_email}
      onClose={goBackCallback}
    />
  ) : (
    <Modal title={t("settings.change-email-modal.title")} onClose={goBackCallback}>
      <form onSubmit={handleSubmit}>
        <Modal.Body>
          <p className="mb-6">
            {t("settings.change-email-modal.message")}
          </p>
          <div className="form-field">
            <Label label={t("settings.change-email-modal.new-email")}>
              <Input
                type="email"
                name="new_email"
                value={values.new_email}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder={t("settings.change-email-modal.new-email") as string}
                error={touched.new_email ? t(errors.new_email || "") || "" : ""}
              />
            </Label>
          </div>
          <div className="mb-1">
            <Label label={t("settings.change-email-modal.account-password")}>
              <Input
                autoComplete="current-password"
                type="password"
                name="current_password"
                value={values.current_password}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder={t("settings.change-email-modal.account-password") as string}
                error={touched.current_password ? t(errors.current_password || "") || "" : ""}
              />
            </Label>
          </div>
          <div className="form-field">
            <Link
              className="theme-link"
              id="forgot-password"
              to={generatePath(routes.resetPassword, { "*": "reset" })}
            >
              {t("settings.change-email-modal.forgot-link") as string}
            </Link>
          </div>
          <FormErrors errors={errors} />
        </Modal.Body>
        <Modal.Actions>
          <div className="flex justify-end space-x-3 whitespace-nowrap">
            <Button
              disabled={isSubmitting}
              type="button"
              name="cancel-btn"
              onClick={goBackCallback}
            >
              {t("common.cancel")}
            </Button>
            <Button
              disabled={!isValid || !dirty || isSubmitting}
              type="submit"
              name="submit-btn"
              loading={isSubmitting}
            >
              {t("settings.change-email-modal.update-email") as string}
            </Button>
          </div>
        </Modal.Actions>
      </form>
    </Modal>
  );
};

export default ChangeEmail;
