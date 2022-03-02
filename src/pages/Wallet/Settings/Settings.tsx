import React, { useState } from "react";
import { useFormik } from "formik";
import * as yup from "yup";
import { Button, Label, Input, Checkbox, Panel } from "../../../components";
import { FormErrors, CopyArea } from "../../../modules/index";
import { UpdateWalletDetailsPayload, UpdateWalletDetailsResponse, Wallet } from "../../../types";
import DeleteWallet from "../DeleteWallet";
import { enter2FACode } from "../../../modules/2FAModals";

const settingsValidationSchema = yup.object().shape({
  name: yup
    .string()
    .required("This field is required."),
});

interface Props {
  walletId: string;
  wallet: Wallet;
  is2FaEnabled: boolean;
  updateWalletDetails: (data: UpdateWalletDetailsPayload) => Promise<UpdateWalletDetailsResponse>;
}

const Settings: React.FC<Props> = ({ updateWalletDetails, walletId, is2FaEnabled, wallet }) => {
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [nonFieldErrors, setNonFieldErrors] = useState<{non_field_errors?: string, message?: string, detail?: string}>({});
  const formik = useFormik({
    enableReinitialize: true,
    validationSchema: settingsValidationSchema,
    initialValues: {
      name: wallet ? wallet.name : "",
      requires_2fa: wallet ? wallet.requires2Fa : false,
    },
    onSubmit: async (values, { setErrors, resetForm }): Promise<UpdateWalletDetailsResponse | void> => {
      try {
        let code = "";
        if (is2FaEnabled) {
          code = await enter2FACode();
        }

        await updateWalletDetails({
          id: walletId,
          requires_2fa: values.requires_2fa,
          code,
          ...(values.name !== wallet.name ? { name: values.name } : {}), // TODO remove this workaround after BE fix
        });
        resetForm();
      } catch (err: any) {
        const { non_field_errors, message, detail, ...formErrors } = err || {};
        setNonFieldErrors({ non_field_errors, message, detail });
        setErrors(formErrors || {}); 
      }
    },
  });
  return (
    <Panel title={(
      <div className="flex w-full justify-between items-center">
        <div className="overflow-ellipsis overflow-hidden whitespace-nowrap">Settings for {wallet?.name}</div>
        <div className="flex space-x-3 hidden md:block">
          {
            formik.dirty && (
              <Button
                variant={Button.variant.GRAY}
                size={Button.size.MEDIUM}
                type="button"
                onClick={(): void => {
                  formik.resetForm();
                }}
                name="cancel-btn"
              >
                Cancel
              </Button>
            )
          }
          <Button
            variant={Button.variant.PRIMARY_LIGHT}
            size={Button.size.MEDIUM}
            disabled={!formik.isValid || !formik.dirty || formik.isSubmitting}
            type="submit"
            onClick={(): void => {
              formik.handleSubmit();
            }}
            name="submit-btn"
            loading={formik.isSubmitting}
          >
            Save Changes
          </Button>
        </div>
      </div>
    )}>
      {
        deleteModalOpen && (
          <DeleteWallet
            walletId={walletId}
            goBackCallback={(): void => setDeleteModalOpen(false)}
          />
        )
      }
      <section className="border-t theme-border">
        <Panel.Body>
          <div className="px-6">
            <h3 className="uppercase font-bold mb-8">General</h3>
            <form className="md:w-1/2" name="form-wallet-settings" onSubmit={formik.handleSubmit}>
              <div className="form-field">
                <Label label="Wallet name">
                  <Input
                    type="text"
                    name="name"
                    value={formik.values.name}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.name && formik.errors.name || ""}
                  />
                </Label>
              </div>
              <div className="form-field">
                <Label label="WALLET PRIMARY ADDRESS">
                  <CopyArea value={wallet?.address || ""} qaSelector="wallet-address">
                    {wallet?.address}
                  </CopyArea>
                </Label>
              </div>
              <div className="form-field">
                <Checkbox
                  name="requires_2fa"
                  checked={formik.values.requires_2fa}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>):void | null => { formik.setFieldValue("requires_2fa", e.target.checked); }}
                >
                  Require 2FA for spending.
                </Checkbox>
              </div>
              <FormErrors fields={["requires_2fa"]} errors={{ ...formik.errors, ...nonFieldErrors }} />
              <div className="flex space-x-3 md:hidden">
                {
                  formik.dirty && (
                    <Button
                      variant={Button.variant.GRAY}
                      size={Button.size.MEDIUM}
                      type="button"
                      onClick={(): void => {
                        formik.resetForm();
                      }}
                      name="cancel-btn"
                    >
                      Cancel
                    </Button>
                  )
                }
                <Button
                  variant={Button.variant.PRIMARY_LIGHT}
                  size={Button.size.MEDIUM}
                  disabled={!formik.isValid || !formik.dirty || formik.isSubmitting}
                  type="submit"
                  onClick={(): void => {
                    formik.handleSubmit();
                  }}
                  name="submit-btn"
                  loading={formik.isSubmitting}
                >
                  Save Changes
                </Button>
              </div>
            </form>
          </div>
          <hr className="border-t theme-border my-10 -mx-10" />
          <div>
            <div className="flex justify-between mt-8">
              <Button
                name="delete-wallet-btn"
                onClick={(): void => setDeleteModalOpen(true)}
                variant={Button.variant.RED}
              >
                Delete Wallet
              </Button>
            </div>
          </div>
        </Panel.Body>
      </section>
    </Panel>
  )
}

export default Settings;
