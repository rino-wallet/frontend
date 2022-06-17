import React from "react";
import * as yup from "yup";
import { Formik } from "formik";
import {
  Label, Input, Button, Prompt,
} from "../../components";
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

const WalletNameTab: React.FC<Props> = ({
  isKeypairSet, createNewWallet, isWalletCreating, stage,
}) => (
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
      } catch (err: any) {
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
      <div id="wallet-name-tab-content" className="mx-auto md:w-3/4">
        <Prompt
          when={!!values.name && !Object.keys(errors).length}
          title="Wallet creation in progress."
          message="If you interrupt the wallet creation process, no wallet is created."
        />
        <form onSubmit={handleSubmit}>
          <div className="form-field">
            <Label labelClassName="md:text-right" label="Wallet name" inline>
              <Input
                autoComplete="off"
                name="name"
                type="text"
                placeholder="Wallet name"
                value={values.name}
                onBlur={handleBlur}
                onChange={handleChange}
                error={touched.name ? errors.name : ""}
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

export default WalletNameTab;
