import React from "react";
import { Formik } from "formik";
import * as yup from "yup";
import { useTranslation, Trans } from "react-i18next";
import { Link, useNavigate, generatePath } from "react-router-dom";
import ROUTES from "../../router/routes";
import { SignInPayload, SignInResponse, UserResponse } from "../../types";
import { deriveUserKeys, getSigningKeys } from "../../utils";
import { useSortErrors } from "../../hooks";
import { FormErrors } from "../../modules/index";
import { enter2FACode } from "../../modules/2FAModals";
import {
  Label, Input, Button, Panel, Logo,
} from "../../components";

const loginValidationSchema = yup.object().shape({
  username: yup
    .string()
    .required("errors.required"),
  password: yup.string().required("errors.required"),
});

interface Props {
  login: (data: SignInPayload) => Promise<SignInResponse>
  getCurrentUser: () => Promise<UserResponse>
  setPassword: (password: string) => void;
  setSigningPublicKey: (key: string) => void;
}
const LoginPage: React.FC<Props> = ({
  login, setPassword, getCurrentUser, setSigningPublicKey,
}) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const {
    nonFieldErrors,
    sortErrors,
  } = useSortErrors(["non_field_errors", "detail", "2fa"]);
  return (
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
            username: "",
            password: "",
            non_field_errors: "",
            detail: "",
            "2fa": "",
          }}
          validationSchema={loginValidationSchema}
          onSubmit={async (
            values,
            { setErrors },
          ): Promise<SignInResponse | undefined> => {
            localStorage.removeItem("_expiredTime");
            const { authKey, encryptionKey, clean } = await deriveUserKeys(values.password, values.username);
            const password = Buffer.from(authKey).toString("hex");
            try {
              let loginResponse;
              try {
                loginResponse = await login({
                  username: values.username,
                  password,
                });
              } catch (err: any) {
                if (err.required_2fa) {
                  await enter2FACode({
                    asyncCallback: async (code: string) => {
                      loginResponse = await login({
                        username: values.username,
                        password,
                        code,
                      });
                    },
                  });
                } else {
                  throw err;
                }
              }
              const user = await getCurrentUser();
              if (!user?.isKeypairSet) {
                setPassword(values.password);
                navigate(ROUTES.keypair);
              } else {
                const { signingPublicKey } = await getSigningKeys(JSON.parse(user.keypair?.encPrivateKey), encryptionKey);
                setSigningPublicKey(Buffer.from(signingPublicKey).toString("base64"));
                clean();
                navigate(ROUTES.wallets);
              }
              return loginResponse;
            } catch (err: any) {
              if (err) setErrors(sortErrors(err).fieldErrors);
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
                <Label label={t("auth.username.label")}>
                  <Input
                    type="text"
                    name="username"
                    value={values.username}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder={t("auth.username.label") as string}
                    error={touched.username ? t(errors.username as string) as string : ""}
                  />
                </Label>
              </div>
              <div className="form-field">
                <Label label={t("auth.password.label") as string}>
                  <Input
                    type="password"
                    name="password"
                    value={values.password}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder={t("auth.password.label") as string}
                    error={touched.password ? t(errors.password as string) as string : ""}
                  />
                </Label>
              </div>
              <div className="form-field">
                <p className="mb-1">
                  <Link
                    className="theme-link"
                    id="forgot-password"
                    to={generatePath(ROUTES.resetPassword, { "*": "reset" })}
                  >
                    {t("auth.forgot.password.link")}
                  </Link>
                </p>
                <p>
                  <Link
                    className="theme-link"
                    id="forgot-password"
                    to={ROUTES.resendActivationEmail}
                  >
                    {t("auth.didnt.receive.password")}
                  </Link>
                </p>
              </div>
              <FormErrors errors={{ ...errors, ...nonFieldErrors }} />
              <div className="mt-10 mb-3">
                <Button
                  disabled={(!isValid && !Object.keys(errors).includes("detail")) || isSubmitting}
                  type="submit"
                  name="submit-btn"
                  loading={isSubmitting}
                  variant={Button.variant.PRIMARY_LIGHT}
                  size={Button.size.BIG}
                  block
                >
                  {t("auth.login")}
                </Button>
              </div>
              <Trans i18nKey="auth.dont.have.account" className="theme-text flex justify-center mb-3">
                Don&apos;t have an account?
                <Link id="link-login" className="theme-link ml-1" to={ROUTES.register}>
                  Create account
                </Link>
              </Trans>
            </form>
          )}
        </Formik>
      </Panel.Body>
    </Panel>
  );
};

export default LoginPage;
