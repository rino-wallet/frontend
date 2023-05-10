import React, { useState } from "react";
import { useFormik } from "formik";
import { useTranslation } from "react-i18next";
import * as yup from "yup";
import { generatePath, Link } from "react-router-dom";
import { ChangePasswordThunkPayload, UserResponse } from "../../../types";
import { FormErrors, Modal, SuccessModal } from "../../../modules/index";
import { Button, Label, Input } from "../../../components";
import { passwordValidationSchema } from "../../../utils";
import routes from "../../../router/routes";

const validationSchema = yup.object().shape({
  new_password: passwordValidationSchema,
  current_password: yup.string().required("errors.required"),
  re_new_password: yup
    .string()
    .required("errors.required")
    .oneOf([yup.ref("new_password")], "errors.match.password"),
});

interface Props {
  onSubmit: (data: ChangePasswordThunkPayload) => Promise<void>;
  goBackCallback: () => void;
  updateUser: () => Promise<UserResponse>;
}

const ChangePassword: React.FC<Props> = ({ onSubmit, goBackCallback, updateUser }) => {
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
      new_password: "",
      re_new_password: "",
      current_password: "",
      non_field_errors: "",
    },
    onSubmit: async (formValues, { setErrors }) => {
      try {
        await onSubmit({
          current_password: formValues.current_password,
          new_password: formValues.new_password,
        });
        await updateUser();
        setSubmited(true);
      } catch (err: any) {
        if (err.decryptKeys) {
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
      title={t("settings.change-password-modal.password-updated-title")}
      message={t("settings.change-password-modal.password-updated-message")}
    />
  ) : (
    <Modal title={t("settings.change-password-modal.title")} onClose={goBackCallback}>
      <form onSubmit={handleSubmit}>
        <Modal.Body>
          <div className="form-field">
            <Label label={t("settings.change-password-modal.current-password")}>
              <Input
                autoComplete="current-password"
                type="password"
                name="current_password"
                value={values.current_password}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder={t("settings.change-password-modal.current-password") || ""}
                error={touched.current_password ? t(errors.current_password || "") || "" : ""}
              />
            </Label>
          </div>
          <div className="mb-1">
            <Label label={t("settings.change-password-modal.new-password")}>
              <Input
                autoComplete="new-password"
                type="password"
                name="new_password"
                value={values.new_password}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder={t("settings.change-password-modal.new-password") || ""}
                error={touched.new_password ? t(errors.new_password || "") || "" : ""}
              />
            </Label>
            <div className="mt-3">
              <Input
                type="password"
                name="re_new_password"
                value={values.re_new_password}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder={t("settings.change-password-modal.confirm-password") || ""}
                error={touched.re_new_password ? t(errors.re_new_password || "") || "" : ""}
              />
            </div>
          </div>
          <div className="form-field">
            <Link
              className="theme-link"
              id="forgot-password"
              to={generatePath(routes.resetPassword, { "*": "reset" })}
            >
              {t("settings.change-password-modal.forgot-link")}
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
              {t("settings.change-password-modal.update-password")}
            </Button>
          </div>
        </Modal.Actions>
      </form>
    </Modal>
  );
};

export default ChangePassword;
