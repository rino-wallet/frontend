import React, { useState } from "react";
import { Formik } from "formik";
import * as yup from "yup";
import { Button, Label, Input } from "../../../components";
import { FormErrors } from "../../../modules/index";
import { UpdateWalletDetailsPayload, UpdateWalletDetailsResponse, Wallet } from "../../../types";
import DeleteWallet from "../DeleteWallet";

const settingsValidationSchema = yup.object().shape({
  name: yup
    .string()
    .required("This field is required."),
});

interface Props {
  walletId: string;
  wallet: Wallet;
  updateWalletDetails: (data: UpdateWalletDetailsPayload) => Promise<UpdateWalletDetailsResponse>;
}

const Settings: React.FC<Props> = ({ updateWalletDetails, walletId, wallet }) => {
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  return (
    <div>
      {
        deleteModalOpen && (
          <DeleteWallet
            walletId={walletId}
            goBackCallback={(): void => setDeleteModalOpen(false)}
          />
        )
      }
      <div className="p-5 border-b border-gray-200">
        <h2 className="text-base mb-3">General</h2>
        <Formik
          enableReinitialize
          initialValues={{
            name: wallet ? wallet.name : "",
            non_field_errors: "",
            message: "",
          }}
          validationSchema={settingsValidationSchema}
          onSubmit={async (values,  { setErrors, resetForm }): Promise<UpdateWalletDetailsResponse | void> => {
            try {
              await updateWalletDetails({
                id: walletId,
                name: values.name,
              });
              resetForm();
            } catch(err) {
              if (err) setErrors(err);
            }
          }}
        >
          {({
            values,
            handleChange,
            handleBlur,
            handleSubmit,
            isSubmitting,
            touched,
            errors,
            isValid,
          }): React.ReactElement => (
            <form name="form-wallet-settings" onSubmit={handleSubmit}>
              <div className="form-field">
                <Label label="Wallet name">
                  <Input
                    type="text"
                    name="name"
                    value={values.name}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.name && errors.name || ""}
                  />
                </Label>
              </div>
              <FormErrors errors={errors} />
              <div className="mt-8 flex justify-end">
                <Button
                  disabled={!isValid || isSubmitting}
                  type="submit"
                  name="submit-btn"
                  loading={isSubmitting}
                >
                  Save
                </Button>
              </div>
            </form>
          )}
        </Formik>
      </div>
      <div className="p-5 border-b border-gray-200">
        <h2 className="text-base mb-3">Emergency</h2>
        <p className="form-field">
          You can freeze or delete the wallet.
        </p>
        <div className="flex justify-between mt-8">
          <Button disabled>Freeze Wallet</Button>
          <Button
            name="delete-wallet-btn"
            onClick={(): void => setDeleteModalOpen(true)}
            variant={Button.variant.RED}
          >
            Delete Wallet
          </Button>
        </div>
      </div>  
    </div>
  )
}

export default Settings;
