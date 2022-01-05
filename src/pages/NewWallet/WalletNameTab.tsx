import React from "react";
import * as yup from "yup";
import { Formik } from "formik";
import { Label, Input, Button } from "../../components";
import { FormErrors } from "../../modules/index";

const validationSchema = yup.object().shape({
  name: yup
    .string()
    .required("This field is required."),
});

interface Props{
  isKeypairSet: boolean;
  createNewWallet: (name: string) => Promise<void>;
}

const WalletNameTab: React.FC<Props> = ({ isKeypairSet, createNewWallet }) => {
  return (
    <Formik
      initialValues={{
        name: "",
        non_field_errors: "",
      }}
      validationSchema={validationSchema}
      onSubmit={async (values, { setErrors }): Promise<void> => {
        try {
          await createNewWallet(values.name);
        } catch (err) {
          if (err) {
            setErrors(err);
          }
        }
      }}
    >
      {({
        isSubmitting,
        values,
        handleChange,
        handleBlur,
        handleSubmit,
        errors,
        isValid,
        touched,
      }): React.ReactElement => (
        <div id="wallet-name-tab-content">
          <form onSubmit={handleSubmit}>
            <div className="form-field">
              <Label label="Wallet name">
                <Input
                  name="name"
                  type="text"
                  placeholder="Wallet name"
                  value={values.name}
                  onBlur={handleBlur}
                  onChange={handleChange}
                  error={touched.name && errors.name || ""}
                />
              </Label>
            </div>
            <FormErrors errors={errors} />
            <div className="flex justify-end form-field mt-8">
              <Button
                name="submit-btn"
                disabled={!isKeypairSet || !isValid}
                loading={isSubmitting}
                type="submit"
              >
                Next
              </Button>
            </div>
          </form>
        </div>
      )}
    </Formik>  
  );
}

export default WalletNameTab;
