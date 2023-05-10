import React, { useState, useMemo } from "react";
import { Formik } from "formik";
import { Link, useNavigate } from "react-router-dom";
import * as yup from "yup";
import { useTranslation, Trans } from "react-i18next";
import routes from "../../router/routes";
import { SignUpResponse, SignUpThunkPayload } from "../../types";
import { accountType } from "../../constants";
import { passwordValidationSchema } from "../../utils";
import { useAccountType, useSortErrors } from "../../hooks";
import { FormErrors } from "../../modules/index";
import {
  Label, Input, Button, Panel, Logo, Check,
} from "../../components";

interface Props {
  signUp: (data: SignUpThunkPayload) => Promise<SignUpResponse>;
}

const RegistrationPage: React.FC<Props> = ({ signUp }) => {
  const { t } = useTranslation();
  const { isEnterprise } = useAccountType();
  const [successMessage, setSuccessMessage] = useState("");
  const links = isEnterprise ? routes.static.enterprise : routes.static.consumer;
  const {
    nonFieldErrors,
    sortErrors,
  } = useSortErrors(["non_field_errors", "detail"]);
  const navigate = useNavigate();

  const registerValidationSchema = useMemo(() => yup.object().shape({
    email: yup
      .string()
      .email(t("errors.invalid.email") || "errors.invalid.email")
      .required(t("errors.required") || "errors.required"),
    username: yup
      .string()
      .required(t("errors.required") || "errors.required"),
    password: passwordValidationSchema,
    referral_code: yup
      .string(),
    re_password: yup
      .string()
      .required(t("errors.required") || "errors.required")
      .oneOf(
        [yup.ref("password")],
        t("errors.match.password") || "errors.match.password",
      ),
    ...(isEnterprise ? {
      company_name: yup
        .string()
        .required(t("errors.required") || "errors.required"),
      company_website: yup
        .string()
        .required(t("errors.required") || "errors.required"),
    } : {}),
  }), [t, isEnterprise]);

  return (
    successMessage ? (
      <Panel title={t("auth.account.created.title")}>
        <Panel.Body>
          <div className="flex space-x-6">
            <div className="flex justify-center">
              <Check size={48} />
            </div>
            <div data-qa-selectort="succcess-message">
              {successMessage}
            </div>
          </div>
        </Panel.Body>
        <Panel.Actions>
          <Link to={routes.wallet}><Button name="ok-button">{t("common.ok")}</Button></Link>
        </Panel.Actions>
      </Panel>
    ) : (
      <Panel>
        <Panel.Body>
          <h1 className="text-center mb-12 text-4xl flex items-center justify-center space-x-3 font-catamaran">
            <Logo small />
            {" "}
            <span>
              {t("auth.title")}
              {" "}
              <span className="font-bold">rino</span>
            </span>
            !
          </h1>
          <Formik
            initialValues={{
              email: "",
              username: "",
              password: "",
              password_confirmation: "",
              re_password: "",
              referral_code: "",
              ...(isEnterprise ? { company_name: "", company_website: "", account_type: "" } : {}),
              non_field_errors: "",
            }}
            validationSchema={registerValidationSchema}
            onSubmit={async (values, { setErrors }): Promise<void> => signUp({
              email: values.email,
              username: values.username,
              password: values.password,
              password_confirmation: values.password_confirmation,
              referral_code: values.referral_code,
              ...(isEnterprise ? { company_name: values.company_name, company_website: values.company_website, account_type: accountType.ENTERPRISE } : {}),
            })
              .then(() => {
                setSuccessMessage(t("auth.account.created.message") as string);
              })
              .catch((error: any) => {
                setErrors(sortErrors(error || {}).fieldErrors);
              })}
          >
            {({
              isSubmitting,
              values,
              handleChange,
              handleBlur,
              handleSubmit,
              errors,
              dirty,
              isValid,
              touched,
            }): React.ReactElement => (
              <form name="form-registration" onSubmit={handleSubmit}>
                <div className="form-field">
                  <Label label={t("auth.username.label")}>
                    <Input
                      autoComplete="off"
                      name="username"
                      type="text"
                      value={values.username}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      placeholder={t("auth.username.placeholder") as string}
                      error={touched.username ? errors.username : ""}
                    />
                  </Label>
                  <div className="mt-1">
                    {t("auth.username.hint")}
                    {" "}
                    😉
                  </div>
                </div>
                {
                    isEnterprise && (
                      <>
                        <div className="form-field">
                          <Label label={t("auth.company.name.label")}>
                            <Input
                              autoComplete="off"
                              name="company_name"
                              type="text"
                              value={values.company_name}
                              onChange={handleChange}
                              onBlur={handleBlur}
                              placeholder={t("auth.company.name.placeholder") as string}
                              error={touched.company_name ? errors.company_name : ""}
                            />
                          </Label>
                        </div>
                        <div className="form-field">
                          <Label label={t("auth.company.website.label")}>
                            <Input
                              autoComplete="off"
                              name="company_website"
                              type="text"
                              value={values.company_website}
                              onChange={handleChange}
                              onBlur={handleBlur}
                              placeholder={t("auth.company.placeholder") as string}
                              error={touched.company_website ? errors.company_website : ""}
                            />
                          </Label>
                        </div>
                      </>
                    )
                }
                <div className="form-field">
                  <Label label={t("auth.email.label")}>
                    <Input
                      name="email"
                      type="email"
                      value={values.email}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      placeholder={t("auth.email.placeholder") as string}
                      error={touched.email ? errors.email : ""}
                    />
                  </Label>
                </div>
                <div className="form-field">
                  <Label label={t("auth.password.label")}>
                    <Input
                      autoComplete="new-password"
                      name="password"
                      type="password"
                      value={values.password}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      placeholder={t("auth.password.placeholder") as string}
                      error={touched.password ? errors.password : ""}
                    />
                  </Label>
                </div>
                <div className="form-field">
                  <Label label={t("auth.passwordconfirmation.label")}>
                    <Input
                      autoComplete="new-password"
                      name="re_password"
                      type="password"
                      value={values.re_password}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      placeholder={t("auth.password.placeholder") as string}
                      error={touched.re_password ? errors.re_password : ""}
                    />
                  </Label>
                </div>
                <div className="form-field">
                  <Label label={t("auth.code.label")}>
                    <Input
                      name="referral_code"
                      type="text"
                      value={values.referral_code}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      placeholder={t("auth.code.placeholder") as string}
                      error={touched.referral_code ? errors.referral_code : ""}
                    />
                  </Label>
                </div>
                <FormErrors errors={{ ...errors, ...nonFieldErrors }} />
                <Trans i18nKey="auth.confirmation.message" className="theme-text">
                  By clicking “Create Account” you confirm that you agree with our
                  {" "}
                  <a id="link-tos" className="theme-link" href={links.terms_of_service}>Terms of Service</a>
                  {" "}
                  and
                  {" "}
                  <a id="link-privacy-policy" className="theme-link" href={links.privacy_policy}>Privacy Policy.</a>
                </Trans>
                <div className="form-field mt-10 mb-3">
                  <Button
                    variant={Button.variant.PRIMARY_LIGHT}
                    size={Button.size.BIG}
                    disabled={(dirty && !isValid) || isSubmitting}
                    type="submit"
                    name="submit-btn"
                    loading={isSubmitting}
                    block
                  >
                    {t("auth.create.account")}
                  </Button>
                </div>
                {
                  isEnterprise ? (
                    process.env.REACT_APP_ENV !== "test" && (
                      <Trans i18nKey="auth.not.enterprise.user" className="theme-text flex justify-center mb-1">
                        Not an enterprise user?
                        <button
                          type="button"
                          id="link-sign-up-not-enterprise"
                          className="theme-link ml-1"
                          onClick={() => {
                            sessionStorage.setItem("enterprice", "false");
                            navigate(routes.register);
                          }}
                        >
                          Sign up here
                        </button>
                      </Trans>
                    )
                  ) : (
                    <Trans i18nKey="auth.enterprise.user" className="theme-text flex justify-center mb-1">
                      Enterprise user?
                      <a id="link-sign-up-enterprise" className="theme-link ml-1" href={`${routes.register}?business=true`}>
                        Sign up here
                      </a>
                    </Trans>
                  )
                }
              </form>
            )}
          </Formik>
        </Panel.Body>
      </Panel>
    )
  );
};

export default RegistrationPage;
