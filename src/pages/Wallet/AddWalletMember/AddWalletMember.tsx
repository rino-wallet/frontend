import { useFormik } from "formik";
import React from "react";
import * as yup from "yup";
import { generatePath, useNavigate } from "react-router-dom";
import { ShareWalletPayload, Wallet } from "../../../types";
import { accessLevels } from "../../../constants";
import { FormErrors, PageTemplate } from "../../../modules/index";
import { Button, Label, Input, Select } from "../../../components";
import routes from "../../../router/routes";

const validationSchema = yup.object().shape({
  email: yup.string().required("This field is required."),
  access_level: yup.string().required("This field is required."),
});

interface Props {
  wallet: Wallet;
  shareWallet: (data: { wallet: Wallet, loginPassword: string; body: ShareWalletPayload }) => Promise<string>;
}

const AddWalletMember: React.FC<Props> = ({ wallet, shareWallet }) => {
  const navigate = useNavigate();
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
      email: "",
      access_level: "",
      password: "",
      encrypted_keys: "",
      non_field_errors: "",
    },
    onSubmit: async (formValues, { setErrors, resetForm }) => {
      try {
        await shareWallet({
          wallet,
          loginPassword: formValues.password,
          body: {
            email: formValues.email,
            access_level: parseInt(formValues.access_level),
            encrypted_keys:  "",
          },
        });
        navigate(-1);
        resetForm();
      } catch (err) {
        setErrors(err);
      }
    },
  });
  return (
    <PageTemplate title="Add user" backButtonRoute={`${generatePath(routes.wallet, { id: wallet.id })}/users`}>
      <form onSubmit={handleSubmit}>
        <div className="form-field">
          <Label label="Email">
            <Input
              type="email"
              name="email"
              value={values.email}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="email"
              error={touched.email && errors.email || ""}
            />
          </Label>
        </div>
        <div className="form-field">
          <Label label="Access level">
            <Select
              name="access_level"
              value={values.access_level}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.access_level && errors.access_level || ""}
            >
              <option value=""></option>
              {
                Object.values(accessLevels)
                  .filter(option => option.code !== accessLevels.owner.code)
                  .map((option) => <option key={option.code} value={option.code}>{option.title}</option>)
              }
            </Select>
          </Label>  
        </div>
        {
          parseInt(values.access_level) === accessLevels.admin.code && (
            <div className="form-field">
              <Label label="Password">
                <Input
                  type="password"
                  name="password"
                  value={values.password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="Password"
                  error={touched.password && errors.password || ""}
                />
              </Label>
            </div>
          )
        }
        <FormErrors errors={errors} />
        <div className="flex form-field justify-end mt-10">
          <Button
            disabled={!isValid || !dirty || isSubmitting}
            type="submit"
            name="submit-btn"
            loading={isSubmitting}
          >
            Share
          </Button>
        </div>
      </form>
    </PageTemplate>
  );
};

export default AddWalletMember;
