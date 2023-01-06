import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as yup from "yup";
import {
  Button, Label, Input, Panel, Tooltip, Copy, Icon, Switch,
} from "../../../components";
import { FormErrors, CopyArea } from "../../../modules/index";
import {
  Env, UpdateWalletDetailsPayload, UpdateWalletDetailsResponse, Wallet,
} from "../../../types";
import DeleteWallet from "../DeleteWallet";
import { enter2FACode, enable2FA } from "../../../modules/2FAModals";
import { useSelector, useAccountType } from "../../../hooks";
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
  canDelete: boolean;
  updateWalletDetails: (data: UpdateWalletDetailsPayload) => Promise<UpdateWalletDetailsResponse>;
}

const Settings: React.FC<Props> = ({
  updateWalletDetails, walletId, wallet, canDelete,
}) => {
  const { features } = useAccountType();
  const user = useSelector(sessionSelectors.getUser);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [nonFieldErrors, setNonFieldErrors] = useState<{ non_field_errors?: string, message?: string, detail?: string }>({});
  const navigate = useNavigate();
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
        const payload = {
          id: walletId,
          requires_2fa: values.requires_2fa,
          // it checks if is_public or public_slug changed,
          // and adds public_slug value to payload only if is_public equal to true
          ...(((values.is_public !== wallet.isPublic || values.public_slug !== wallet.publicSlug) && features?.publicWallet) ? {
            is_public: values.is_public,
            ...(values.is_public ? { public_slug: values.public_slug } : {}),
          } : {}),
          ...(values.name !== wallet.name ? { name: values.name } : {}), // TODO remove this workaround after BE fix
        };
        if (wallet.requires2Fa && !values.requires_2fa) {
          await enter2FACode({
            asyncCallback: async (code: string) => {
              await updateWalletDetails({
                ...payload,
                code,
              });
            },
            confirmCancel: () => {
              resetForm();
            },
          });
        } else {
          await updateWalletDetails(payload);
          resetForm();
        }
      } catch (err: any) {
        const {
          non_field_errors, message, detail, ...formErrors
        } = err || {};
        setNonFieldErrors({ non_field_errors, message, detail });
        setErrors(formErrors || {});
      }
    },
  });

  function goToSettings(): void{
    navigate("/settings");
    enable2FA();
  }

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
                <Switch
                  id="requires_2fa"
                  checked={formik.values.requires_2fa}
                  disabled={!user?.is2FaEnabled}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>): void | null => { formik.setFieldValue("requires_2fa", e.target.checked); }}
                >
                  <div className="flex items-center gap-4">
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

                    {!user?.is2FaEnabled && (
                      <Button onClick={():void => goToSettings()} className="w-fit text-sm border px-2 py-1 border-gray-300 rounded-lg">
                        <p className="text-gray-700">SET UP 2FA</p>
                      </Button>
                    )}
                  </div>
                </Switch>
              </div>
              {
                features?.publicWallet && (
                  <>
                    <h3 className="uppercase font-bold mb-8">Public wallet</h3>
                    <div>
                      <div className="form-field">
                        <Switch
                          id="is_public"
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
                        </Switch>
                      </div>
                      <div className="form-field">
                        <Label label={
                            (
                              <div>
                                Wallet identifier
                                <span className="ml-1 theme-text-secondary font-semibold text-sm">(REQUIRED)</span>
                              </div>
                            )
                          }
                        >
                          <Input
                            type="text"
                            name="public_slug"
                            value={formik.values.public_slug}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            disabled={!formik.values.is_public}
                            error={formik.errors.public_slug || ""}
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
                  </>
                )
              }
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
