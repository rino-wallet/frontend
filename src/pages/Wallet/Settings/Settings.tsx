import React, { useState } from "react";
import { useFormik } from "formik";
import * as yup from "yup";
import {
  Button, Label, Input, Checkbox, Panel, Tooltip, Copy, Icon,
} from "../../../components";
import { FormErrors, CopyArea } from "../../../modules/index";
import {
  Env, UpdateWalletDetailsPayload, UpdateWalletDetailsResponse, Wallet,
} from "../../../types";
import DeleteWallet from "../DeleteWallet";
import { enter2FACode } from "../../../modules/2FAModals";
import { useSelector } from "../../../hooks";
import { selectors as sessionSelectors } from "../../../store/sessionSlice";
import { APP_URLS_MAP } from "../../../constants";

const settingsValidationSchema = yup.object().shape({
  name: yup
    .string()
    .required("This field is required."),
  public_slug: yup.string().when("is_public", {
    is: (access_level: boolean) => access_level,
    then: yup.string().required("This field is required."),
  }),
});

interface Props {
  walletId: string;
  wallet: Wallet;
  is2FaEnabled: boolean;
  canDelete: boolean;
  updateWalletDetails: (data: UpdateWalletDetailsPayload) => Promise<UpdateWalletDetailsResponse>;
}

const Settings: React.FC<Props> = ({
  updateWalletDetails, walletId, is2FaEnabled, wallet, canDelete,
}) => {
  const user = useSelector(sessionSelectors.getUser);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [nonFieldErrors, setNonFieldErrors] = useState<{ non_field_errors?: string, message?: string, detail?: string }>({});
  const formik = useFormik({
    enableReinitialize: true,
    validationSchema: settingsValidationSchema,
    initialValues: {
      is_public: wallet ? wallet.isPublic : false,
      public_slug: wallet ? wallet.publicSlug || "" : "",
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
          // it checks if is_public or public_slug changed,
          // and adds public_slug value to payload only if is_public equal to true
          ...((values.is_public !== wallet.isPublic || values.public_slug !== wallet.publicSlug) ? {
            is_public: values.is_public,
            ...(values.is_public ? { public_slug: values.public_slug } : {}),
          } : {}),
          ...(values.name !== wallet.name ? { name: values.name } : {}), // TODO remove this workaround after BE fix
        });
        resetForm();
      } catch (err: any) {
        const {
          non_field_errors, message, detail, ...formErrors
        } = err || {};
        setNonFieldErrors({ non_field_errors, message, detail });
        setErrors(formErrors || {});
      }
    },
  });
  const publicUrl = APP_URLS_MAP[process.env.REACT_APP_ENV as Env];
  return (
    <Panel title={(
      <div className="flex w-full justify-between items-center">
        <div className="overflow-ellipsis overflow-hidden whitespace-nowrap">
          Settings for
          {" "}
          {wallet?.name}
        </div>
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
    )}
    >
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
          <div>
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
                    error={formik.touched.name ? formik.errors.name || "" : ""}
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
                  disabled={!user?.is2FaEnabled}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>): void | null => { formik.setFieldValue("requires_2fa", e.target.checked); }}
                >
                  <div className="flex items-center">
                    Require 2FA for spending.
                    {!user?.is2FaEnabled ? (
                      <Tooltip
                        content={(
                          <div className="md:w-48 text-sm" data-qa-selector="tx-priority-tooltip">
                            Activate Account 2FA to
                            {" "}
                            {formik.values.requires_2fa ? "disable" : "enable"}
                            {" "}
                            this option.
                          </div>
                        )}
                      >
                        <div className="text-sm cursor-pointer ml-1" data-qa-selector="cursor-pointer-tx-priority-tooltip">
                          <Icon name="info" />
                        </div>
                      </Tooltip>
                    ) : null}
                  </div>
                </Checkbox>
              </div>
              <h3 className="uppercase font-bold mb-8">Public wallet</h3>
              <div>
                <div className="form-field">
                  <Checkbox
                    name="is_public"
                    checked={formik.values.is_public}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>): void | null => { formik.setFieldValue("is_public", e.target.checked); }}
                  >
                    <div className="flex items-center">
                      <span>Make public</span>
                      <Tooltip
                        content={(
                          <p className="text-sm">Make this wallet publicly visible to anyone with the link</p>
                        )}
                      >
                        <div className="text-sm cursor-pointer ml-1" data-qa-selector="cursor-pointer-tx-priority-tooltip">
                          <Icon name="info" />
                        </div>
                      </Tooltip>
                    </div>
                  </Checkbox>
                </div>
                <div className="form-field">
                  <Label label="Wallet identifier">
                    <Input
                      type="text"
                      name="public_slug"
                      value={formik.values.public_slug}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      error={formik.errors.public_slug || ""}
                      disabled={!formik.values.is_public}
                    />
                  </Label>
                </div>
                {wallet?.isPublic && (
                  <Label label="Wallet URL:">
                    <div className="break-all text-sm">
                      <Copy value={`${publicUrl}/public/wallets/${wallet?.publicSlug}`}>
                        {publicUrl}
                        /public/wallets/
                        {wallet?.publicSlug}
                      </Copy>
                    </div>
                  </Label>
                )}
              </div>
              <FormErrors fields={["requires_2fa"]} errors={{ ...formik.errors, ...nonFieldErrors }} />
              {canDelete && (
                <Button
                  className="mt-8 md:hidden"
                  name="delete-wallet-btn"
                  onClick={(): void => setDeleteModalOpen(true)}
                  variant={Button.variant.RED}
                >
                  Delete Wallet
                </Button>
              )}
              <hr className="border-t theme-border my-10 -mx-10 md:hidden" />
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
            {canDelete && (
              <div className="hidden md:block">
                <hr className="border-t theme-border my-10 -mx-10" />
                <Button
                  name="delete-wallet-btn"
                  onClick={(): void => setDeleteModalOpen(true)}
                  variant={Button.variant.RED}
                >
                  Delete Wallet
                </Button>
              </div>
            )}
          </div>
        </Panel.Body>
      </section>
    </Panel>
  );
};

export default Settings;
