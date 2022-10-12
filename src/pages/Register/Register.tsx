import React, { useState } from "react";
import { Formik } from "formik";
import { Link } from "react-router-dom";
import * as yup from "yup";
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

const registerValidationSchema = (isEnterprise: boolean) => yup.object().shape({
  email: yup
    .string()
    .email("Please enter valid email")
    .required("This field is required."),
  username: yup
    .string()
    .required("This field is required."),
  password: passwordValidationSchema,
  re_password: yup
    .string()
    .required("This field is required.")
    .oneOf([yup.ref("password")], "Passwords must match."),
  ...(isEnterprise ? {
    company_name: yup
      .string()
      .required("This field is required."),
    company_website: yup
      .string()
      .required("This field is required."),
  } : {}),
});

const RegistrationPage: React.FC<Props> = ({ signUp }) => {
  const { isEnterprise } = useAccountType();
  const [successMessage, setSuccessMessage] = useState("");
  const links = isEnterprise ? routes.static.enterprise : routes.static.consumer;

  const {
    nonFieldErrors,
    sortErrors,
  } = useSortErrors(["non_field_errors", "detail"]);
  return (
    successMessage ? (
      <Panel title="Account created">
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
          <Link to={routes.wallet}><Button name="ok-button">OK</Button></Link>
        </Panel.Actions>
      </Panel>
    ) : (
      <Panel>
        <Panel.Body>
          <h1 className="text-center mb-12 text-4xl flex items-center justify-center space-x-3 font-catamaran">
            <Logo small />
            {" "}
            <span>
              Welcome to
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
              ...(isEnterprise ? { company_name: "", company_website: "", account_type: "" } : {}),
              non_field_errors: "",
            }}
            validationSchema={registerValidationSchema}
            onSubmit={async (values, { setErrors }): Promise<void> => signUp({
              email: values.email,
              username: values.username,
              password: values.password,
              password_confirmation: values.password_confirmation,
              ...(isEnterprise ? { company_name: values.company_name, company_website: values.company_website, account_type: accountType.ENTERPRISE } : {}),
            })
              .then(() => {
                setSuccessMessage("You have registered successfully. Please check your email for further instructions.");
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
                  <Label label="Username">
                    <Input
                      autoComplete="off"
                      name="username"
                      type="text"
                      value={values.username}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      placeholder="Your unique username"
                      error={touched.username ? errors.username : ""}
                    />
                  </Label>
                  <div className="mt-1">You won’t be able to change it again, choose carefully 😉</div>
                </div>
                {
                    isEnterprise && (
                      <>
                        <div className="form-field">
                          <Label label="Company name">
                            <Input
                              autoComplete="off"
                              name="company_name"
                              type="text"
                              value={values.company_name}
                              onChange={handleChange}
                              onBlur={handleBlur}
                              placeholder="Your company name"
                              error={touched.company_name ? errors.company_name : ""}
                            />
                          </Label>
                        </div>
                        <div className="form-field">
                          <Label label="Company website">
                            <Input
                              autoComplete="off"
                              name="company_website"
                              type="text"
                              value={values.company_website}
                              onChange={handleChange}
                              onBlur={handleBlur}
                              placeholder="Your company website"
                              error={touched.company_website ? errors.company_website : ""}
                            />
                          </Label>
                        </div>
                      </>
                    )
                }
                <div className="form-field">
                  <Label label="email">
                    <Input
                      name="email"
                      type="email"
                      value={values.email}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      placeholder="Your email"
                      error={touched.email ? errors.email : ""}
                    />
                  </Label>
                </div>
                <div className="form-field">
                  <Label label="Account Password">
                    <Input
                      autoComplete="new-password"
                      name="password"
                      type="password"
                      value={values.password}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      placeholder="Password"
                      error={touched.password ? errors.password : ""}
                    />
                  </Label>
                </div>
                <div className="form-field">
                  <Label label="Account Password Confirmation">
                    <Input
                      autoComplete="new-password"
                      name="re_password"
                      type="password"
                      value={values.re_password}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      placeholder="Password"
                      error={touched.re_password ? errors.re_password : ""}
                    />
                  </Label>
                </div>
                <FormErrors errors={{ ...errors, ...nonFieldErrors }} />
                <div className="theme-text">
                  By clicking “Create Account” you confirm that you agree with our
                  {" "}
                  <a id="link-tos" className="theme-link" href={links.terms_of_service}>Terms of Service</a>
                  {" "}
                  and
                  {" "}
                  <a id="link-privacy-policy" className="theme-link" href={links.privacy_policy}>Privacy Policy.</a>
                </div>
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
                    Create Account
                  </Button>
                </div>
                {
                    isEnterprise ? (
                      <div className="theme-text flex justify-center mb-1">
                        Not an enterprise user?
                        <a id="link-login" className="theme-link ml-1" href={routes.register}>
                          Sign up here
                        </a>
                      </div>
                    ) : (
                      <div className="theme-text flex justify-center mb-1">
                        Enterprise user?
                        <a id="link-login" className="theme-link ml-1" href={`${routes.register}?business=true`}>
                          Sign up here
                        </a>
                      </div>
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
