import React from "react";
import { Formik } from "formik";
import * as yup from "yup";
import { Link } from "react-router-dom";
import ROUTES from "../../router/routes";
import { SignInPayload, SignInResponse } from "../../types";
import { deriveUserKeys } from "../../utils";
import { PageTemplate, FormErrors } from "../../modules/index";
import { Label, Input, Button } from "../../components";

const loginValidationSchema = yup.object().shape({
  email: yup
    .string()
    .email("Please enter a valid email address.")
    .required("This field is required."),
  password: yup.string().required("This field is required."),
});

interface Props {
  login: (data: SignInPayload) => Promise<SignInResponse>
  push: (path: string) => void;
  setPassword: (password: string) => void;
}
const LoginPage: React.FC<Props> = ({ push, login, setPassword }) => {
  return (
    <PageTemplate title="Login">
      <Formik
        initialValues={{
          email: "",
          password: "",
          non_field_errors: "",
          detail: "",
          "2fa": "",
        }}
        validationSchema={loginValidationSchema}
        onSubmit={async (
          values,
          { setErrors }
        ): Promise<void> => {
          const { authKey } = await deriveUserKeys(values.password);
          return login({
            email: values.email,
            password: authKey,
          }).then(
            () => {
              push(ROUTES.wallets);
              setPassword(values.password);
            },
            (err: { [key: string]: string }) => {
              if (err) setErrors(err);
            }
          );
        }}
      >
        {({
          values,
          handleChange,
          handleBlur,
          handleSubmit,
          touched,
          errors,
          isValid,
          isSubmitting,
        }): React.ReactElement => (
          <form name="form-login" onSubmit={handleSubmit}>
            <div className="form-field">
              <Label label="E-mail">
                <Input
                  type="email"
                  name="email"
                  value={values.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="Your Email"
                  error={touched.email ? errors.email : ""}
                />
              </Label>
            </div>
            <div className="form-field">
              <Label label="Password">
                <Input
                   type="password"
                   name="password"
                   value={values.password}
                   onChange={handleChange}
                   onBlur={handleBlur}
                   placeholder="Password"
                   error={touched.password ? errors.password : ""}
                />
              </Label>
            </div>
            <div className="form-field">
              <Link
                className="link"
                id="forgot-password"
                to={ROUTES.resetPasswordRequest}
              >
                I Forgot My Password
              </Link>
            </div>
            <FormErrors errors={errors} />
            <div className="form-field mt-10">
              <Button
                disabled={!isValid || isSubmitting}
                type="submit"
                name="submit-btn"
                loading={isSubmitting}
                block
              >
                Login
              </Button>
            </div>
          </form>
        )}
      </Formik>
    </PageTemplate>
  );
};

export default LoginPage;
