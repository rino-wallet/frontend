import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as yup from "yup";
import { Trans, useTranslation } from "react-i18next";
import {
  Button, Label, Input, Panel, Tooltip, Copy, Icon, Switch, Select,
} from "../../../components";
import { FormErrors, CopyArea } from "../../../modules/index";
import {
  Env, UpdateWalletDetailsPayload, UpdateWalletDetailsResponse, Wallet,
} from "../../../types";
import DeleteWallet from "../DeleteWallet";
import { enter2FACode, enable2FA } from "../../../modules/2FAModals";
import { useSelector, useAccountType } from "../../../hooks";
import { selectors as sessionSelectors } from "../../../store/sessionSlice";
import { accessLevels, APP_URLS_MAP } from "../../../constants";
import questionBox from "./message-question.svg";
import { moneroToPiconero, piconeroToMonero } from "../../../utils";

const settingsValidationSchema = yup.object().shape({
  name: yup
    .string()
    .required("errors.required"),
  public_slug: yup.string().when("is_public", {
    is: (access_level: boolean) => access_level,
    then: yup.string().required("errors.required"),
  }),
});

interface Props {
  walletId: string;
  wallet: Wallet;
  canDelete: boolean;
  canUpdateSettings: boolean;
  updateWalletDetails: (data: UpdateWalletDetailsPayload) => Promise<UpdateWalletDetailsResponse>;
}

const Settings: React.FC<Props> = ({
  updateWalletDetails, walletId, wallet, canDelete, canUpdateSettings,
}) => {
  const { t } = useTranslation();
  const { features } = useAccountType();
  const data = useAccountType();
  const user = useSelector(sessionSelectors.getUser);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [nonFieldErrors, setNonFieldErrors] = useState<{ non_field_errors?: string, message?: string, detail?: string }>({});
  const navigate = useNavigate();
  const approvers = useMemo(
    () => wallet?.members?.filter(
      (member) => member.accessLevel === accessLevels.approver.title
          || member.accessLevel === accessLevels.admin.title
          || member.accessLevel === accessLevels.spender.title,
    ),
    [wallet, accessLevels],
  );

  const numApprovers = useMemo(() => approvers?.length, [approvers]);

  const approvalsOptions = useMemo(() => {
    const options = [];
    for (let i = 0; i <= numApprovers; i += 1) {
      options.push(
        <option value={i} key={i}>
          {i}
        </option>,
      );
    }
    return options;
  }, [numApprovers]);

  const formik = useFormik({
    enableReinitialize: true,
    validationSchema: settingsValidationSchema,
    initialValues: {
      is_public: wallet ? wallet.isPublic : false,
      public_slug: wallet ? wallet.publicSlug || "" : "",
      name: wallet ? wallet.name : "",
      requires_2fa: wallet ? wallet.requires2Fa : false,
      daily_limit: wallet?.maxDailyAmount ? piconeroToMonero(String(wallet.maxDailyAmount)) : "0",
      transaction_limit: wallet?.maxAmount ? piconeroToMonero(String(wallet.maxAmount)) : "0",
      requiredApprovals: wallet?.minApprovals ? String(wallet.minApprovals) : "0",
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
          ...(data.isEnterprise ? {
            max_daily_amount: moneroToPiconero(values.daily_limit),
            max_amount: moneroToPiconero(values.transaction_limit),
            min_approvals: parseInt(values.requiredApprovals, 10),
          } : {}),
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
  const status2fa = formik.values.requires_2fa ? t("wallet.settings.disable") : t("wallet.settings.enable");
  const publicUrl = APP_URLS_MAP[process.env.REACT_APP_ENV as Env];
  return (
    <Panel title={(
      <div className="flex w-full justify-between items-center">
        <div className="overflow-ellipsis overflow-hidden whitespace-nowrap">
          {t("wallet.settings.settings.for")}
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
                {t("common.cancel")}
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
            {t("common.savechanges")}
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
            <h3 className="uppercase font-bold mb-8">{t("wallet.settings.general")}</h3>
            <form className="md:w-1/2" name="form-wallet-settings" onSubmit={formik.handleSubmit}>
              <div className="form-field">
                <Label label={t("wallet.settings.wallet.name")}>
                  <Input
                    disabled={!canUpdateSettings}
                    type="text"
                    name="name"
                    value={formik.values.name}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.name ? t(formik.errors.name as string) || "" : ""}
                  />
                </Label>
              </div>
              <div className="form-field">
                <Label label={t("wallet.settings.wallet.address")}>
                  <CopyArea value={wallet?.address || ""} qaSelector="wallet-address">
                    {wallet?.address}
                  </CopyArea>
                </Label>
              </div>
              {
                features?.publicWallet && (
                  <>
                    <h3 className="uppercase font-bold mb-8">Public wallet</h3>
                    <div className="mb-3">
                      <div className="form-field">
                        <Switch
                          id="is_public"
                          checked={formik.values.is_public}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>): void | null => { formik.setFieldValue("is_public", e.target.checked); }}
                        >
                          <div className="flex items-center">
                            <span>{t("wallet.settings.make.public.label")}</span>
                            <Tooltip
                              content={(
                                <p className="text-sm">{t("wallet.settings.make.public.message")}</p>
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
                                {t("wallet.settings.wallet.identifier")}
                                <span className="ml-1 theme-text-secondary font-semibold text-sm">
                                  (
                                  {t("wallet.settings.required")}
                                  )
                                </span>
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
                            error={t(formik.errors.public_slug as string) || ""}
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
                  {t("wallet.settings.delete.wallet")}
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
                      {t("common.cancel")}
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
                  {t("common.savechanges")}
                </Button>
              </div>
            </form>
            {canDelete && (
              <div className="hidden md:block">
                <Button
                  name="delete-wallet-btn"
                  onClick={(): void => setDeleteModalOpen(true)}
                  variant={Button.variant.RED}
                >
                  {t("wallet.settings.delete.wallet")}
                </Button>
                <hr className="border-t theme-border my-10 -mx-10" />
              </div>
            )}
          </div>
          <hr className="border-t theme-border my-10 -mx-10 md:hidden" />
          <div>
            <h3 className="uppercase font-bold mb-8">Security</h3>
            {
              features?.limits && (
                <form className="md:w-full" name="form-wallet-settings-limits" onSubmit={formik.handleSubmit}>
                  <div className="form-field flex gap-8">

                    {/* TOOLTIPS LEFT TO IMPLEMENT */}

                    <div className="relative">
                      <Label label="DAILY LIMIT">
                        <Input
                          disabled={!canUpdateSettings}
                          type="number"
                          name="daily_limit"
                          value={formik.values.daily_limit}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          error={formik.touched.name ? formik.errors.name || "" : ""}
                        />
                        <span className="absolute right-12 top-1/2 text-lg theme-text-secondary">XMR</span>
                      </Label>
                    </div>
                    <div className="relative">
                      <Label label="Transaction limit">
                        <Input
                          disabled={!canUpdateSettings}
                          type="number"
                          name="transaction_limit"
                          value={formik.values.transaction_limit}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          error={formik.touched.name ? formik.errors.name || "" : ""}
                        />
                        <span className="absolute right-12 top-1/2 text-lg theme-text-secondary">XMR</span>
                      </Label>
                    </div>
                  </div>
                </form>
              )
            }
            <div className="form-field">
              <Switch
                id="requires_2fa"
                checked={formik.values.requires_2fa}
                disabled={!user?.is2FaEnabled}
                onChange={(e: React.ChangeEvent<HTMLInputElement>): void | null => { formik.setFieldValue("requires_2fa", e.target.checked); }}
              >
                <div className="flex items-center gap-4">
                  <div className="flex items-center">
                    {t("wallet.settings.require.2fa")}
                    {!user?.is2FaEnabled ? (
                      <Tooltip
                        content={(
                          <Trans i18nKey="wallet.settings.activate.account" className="md:w-48 text-sm" data-qa-selector="tx-priority-tooltip">
                            Activate Account 2FA to
                            {" "}
                            {{ status2fa }}
                            {" "}
                            this option.
                          </Trans>
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
                    <p className="text-gray-700">{t("wallet.settings.setup.2fa")}</p>
                  </Button>
                  )}
                </div>
              </Switch>
            </div>
            {
              features?.approvals && (
                <>
                  <div className="flex items-center mb-2">
                    <span className="text-base font-semibold">Approvals</span>
                    <Tooltip
                      content={(
                        <div className="md:w-48 text-sm" data-qa-selector="wallet-approvals-tooltip">
                          Users with roles &quot;admin&quot;, &quot;spender&quot;, or &quot;approver&quot; are eligible to approve transactions. You cannot set the number of approvals required higher than the number of eligible users.
                        </div>
                              )}
                    >
                      <div className="text-sm cursor-pointer ml-1" data-qa-selector="cursor-pointer-wallet-approvals-tooltip">
                        <img src={questionBox} alt="info" />
                      </div>
                    </Tooltip>
                  </div>
                  <form
                    className={`md:w-1/3 ${!canUpdateSettings ? "pointer-events-none" : ""}`}
                    name="form-wallet-settings-limits"
                    onSubmit={formik.handleSubmit}
                  >
                    <div className="form-field">
                      <Select
                        className={`${!numApprovers && wallet?.minApprovals ? "!theme-border-error outline-none" : ""}`}
                        error={`${!numApprovers && wallet?.minApprovals ? "Wallet requires more approvers" : ""}`}
                        value={formik.values.requiredApprovals}
                        onChange={formik.handleChange}
                        name="requiredApprovals"
                      >
                        <option value="">--</option>
                        {approvalsOptions}
                      </Select>
                    </div>
                  </form>
                </>
              )
            }
          </div>
        </Panel.Body>
      </section>
    </Panel>
  );
};

export default Settings;
