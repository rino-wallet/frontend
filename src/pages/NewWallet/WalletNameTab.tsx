import React from "react";
import * as yup from "yup";
import { Formik } from "formik";
import { Label, Input, Button, BeforeUnloadConfirm } from "../../components";
import { FormErrors } from "../../modules/index";
import CreatingWallet from "./CreatingWallet";

const validationSchema = yup.object().shape({
  name: yup
    .string()
    .required("This field is required."),
});

interface Props {
  isKeypairSet: boolean;
  createNewWallet: (name: string) => Promise<void>;
  isWalletCreating: boolean;
  stage: string;
}

const WalletNameTab: React.FC<Props> = ({ isKeypairSet, createNewWallet, isWalletCreating, stage }) => {
  return (
    <Formik
      initialValues={{
        message: "",
        name: "",
        non_field_errors: "",
      }}
      validationSchema={validationSchema}
      onSubmit={async (values, { setErrors }): Promise<void> => {
        try {
          await createNewWallet(values.name);
        } catch (err) {
          if (err?.status === "permission_error") {
            setErrors({ message: err.message });
          } else {
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
        <div id="wallet-name-tab-content" className="md:w-3/4">
          <BeforeUnloadConfirm needConfirmation={!!values.name} />
          <form onSubmit={handleSubmit}>
            <div className="form-field">
              <Label label="Wallet name" inline>
                <Input
                  name="name"
                  type="text"
                  placeholder="Wallet name"
                  value={values.name}
                  onBlur={handleBlur}
                  onChange={handleChange}
                  error={touched.name && errors.name || ""}
                  disabled={isSubmitting}
                />
              </Label>
            </div>
            <FormErrors errors={errors} />
            {
              !isSubmitting && (
                <div className="flex justify-end form-field mt-8">
                  <Button
                    name="submit-btn"
                    variant={Button.variant.PRIMARY_LIGHT}
                    disabled={!isKeypairSet || !isValid}
                    loading={isSubmitting}
                    type="submit"
                  >
                    Create Wallet
                </Button>
                </div>
              )
            }
            {
              isWalletCreating && (
                <div className="form-field">
                  <Label label="" inline>
                    <CreatingWallet stage={stage} />
                  </Label>
                </div>
              )
            }
          </form>
        </div>
      )}
    </Formik>
  );
}

export default WalletNameTab;
