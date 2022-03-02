import React from "react";
import { Formik } from "formik";
import * as yup from "yup";
import { Link, useNavigate, generatePath } from "react-router-dom";
import ROUTES from "../../router/routes";
import { SignInPayload, SignInResponse, UserResponse } from "../../types";
import { deriveUserKeys } from "../../utils";
import { FormErrors } from "../../modules/index";
import { Label, Input, Button, Panel, Logo } from "../../components";

const loginValidationSchema = yup.object().shape({
  username: yup
    .string()
    .required("This field is required."),
  password: yup.string().required("This field is required."),
});

interface Props {
  login: (data: SignInPayload) => Promise<SignInResponse>
  getCurrentUser: () => Promise<UserResponse>
  setPassword: (password: string) => void;
}
const LoginPage: React.FC<Props> = ({ login, setPassword, getCurrentUser }) => {
  const navigate = useNavigate();
  return (
    <Panel>
      <Panel.Body>
        <h1 className="text-center mb-12 text-4xl flex items-center justify-center space-x-3 font-catamaran">
          <Logo small /> <span>Welcome to <span className="font-bold">rino</span></span>!
        </h1>
        <Formik
          initialValues={{
            username: "",
            password: "",
            non_field_errors: "",
            detail: "",
            "2fa": "",
          }}
          validationSchema={loginValidationSchema}
          onSubmit={async (
            values,
            { setErrors }
          ): Promise<SignInResponse | undefined> => {
            try {
              const { authKey, clean } = await deriveUserKeys(values.password, values.username);
              const password = Buffer.from(authKey).toString("hex");
              clean();
              const loginResponse = await login({
                username: values.username,
                password,
              });
              const user = await getCurrentUser();
              if (!user?.isKeypairSet) {
                setPassword(values.password);
                navigate(ROUTES.keypair);
              } else {
                navigate(ROUTES.wallets);
              }
              return loginResponse;
            } catch(err: any) {
              if (err) setErrors(err);
            }
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
                <Label label="Username">
                  <Input
                    type="text"
                    name="username"
                    value={values.username}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="Username"
                    error={touched.username ? errors.username : ""}
                  />
                </Label>
              </div>
              <div className="form-field">
                <Label label="Account Password">
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
                  className="theme-link"
                  id="forgot-password"
                  to={generatePath(ROUTES.resetPassword, {"*": "reset"})}
                >
                  I forgot my password
                </Link>
              </div>
              <FormErrors errors={errors} />
              <div className="mt-10">
                <Button
                  disabled={!isValid || isSubmitting}
                  type="submit"
                  name="submit-btn"
                  loading={isSubmitting}
                  variant={Button.variant.PRIMARY_LIGHT}
                  size={Button.size.BIG}
                  block
                >
                  Login
                </Button>
              </div>
            </form>
          )}
        </Formik>
      </Panel.Body>
    </Panel>
  );
};

export default LoginPage;
