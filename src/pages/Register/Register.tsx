import React, { useState } from "react";
import { Formik } from "formik";
import { Link, useHistory } from "react-router-dom";
import * as yup from "yup";
import routes from "../../router/routes";
import { SignUpResponse, SignUpPayload } from "../../types";
import { deriveUserKeys, passwordValidationSchema } from "../../utils";
import { PageTemplate, FormErrors } from "../../modules/index";
import { Label, Input, Button } from "../../components";

interface Props {
  signUp: (data: SignUpPayload) => Promise<SignUpResponse>;
}

const registerValidationSchema = yup.object().shape({
  email: yup
    .string()
    .email("Please enter valid email")
    .required("This field is required."),
  password: passwordValidationSchema,
});

const RegistrationPage: React.FC<Props> = ({ signUp }) => {
  const history = useHistory();
  const [successMessage, setSuccessMessage] = useState("");
  return (
    <PageTemplate title="Registration">
      <Formik
        initialValues={{
          email: "",
          password: "",
          password_confirmation: "",
          non_field_errors: "",
        }}
        validationSchema={registerValidationSchema}
        onSubmit={async (values, { setErrors }): Promise<void> => {
          const { authKey } = await deriveUserKeys(values.password);
          return signUp({
            email: values.email,
            password: authKey,
            password_confirmation: authKey,
          })
          .then(() => {
            setSuccessMessage(
              "You have registered successfully. Please check your email for further instructions."
            );
            setTimeout(() => history.push(routes.login), 3000);
          })
          .catch(error => {
            setErrors(error);
          });
        }}
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
              <Label label="E-mail">
                <Input
                  name="email"
                  type="email"
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
            <FormErrors errors={errors} />
            <div className="text-secondary">
              By clicking “Create Account” you confirm that you agree with the <Link id="link-tos" className="link" to="/">Terms of Service.</Link>
            </div>
            <div className="form-field mt-10 mb-3">
              <Button
                variant={Button.variant.GRAY}
                disabled={(dirty && !isValid) || isSubmitting}
                type="submit"
                name="submit-btn"
                loading={isSubmitting}
                block
              >
                Create Account
              </Button>
            </div>
            {successMessage ? (
              <div className="text-success">
                {successMessage}
              </div>
            ) : null}
            <div className="text-secondary flex justify-center mb-0">
                Already have an account?
                <Link id="link-login" className="link ml-1" to={routes.login}>
                  Log in
                </Link>
              </div>
          </form>
        )}
      </Formik>
    </PageTemplate>
  );
};

export default RegistrationPage;
