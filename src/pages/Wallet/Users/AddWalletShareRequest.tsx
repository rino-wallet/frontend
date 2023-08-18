import { useFormik } from "formik";
import React from "react";
import * as yup from "yup";
import { Trans, useTranslation } from "react-i18next";
import { createModal } from "../../../modules/ModalFactory";
import {
  Wallet,
  RequestWalletShareThunkPayload,
} from "../../../types";
import { FormErrors, Modal } from "../../../modules/index";
import {
  Button, Label, Input, BindHotKeys, Tooltip, DisableAutofill, Icon,
} from "../../../components";
import { enter2FACode } from "../../../modules/2FAModals";

const validationSchema = yup.object().shape({
  email: yup
    .string()
    .email("errors.invalid.email")
    .required("errors.required"),
});

interface Props {
  wallet: Wallet;
  is2FaEnabled: boolean;
  isEnterprise: boolean;
  submit: (data: { email: string }) => Promise<void>;
  cancel: () => void;
  requestWalletShare: (data: RequestWalletShareThunkPayload) => Promise<Record<string, never>>;
}

const AddWalletShareRequest: React.FC<Props> = ({
  wallet, is2FaEnabled, isEnterprise, requestWalletShare, cancel, submit,
}) => {
  const { t } = useTranslation();
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
      encrypted_keys: "",
      non_field_errors: "",
    },
    onSubmit: async (formValues, { setErrors }) => {
      try {
        let code = "";
        if (is2FaEnabled) {
          code = await enter2FACode();
        }
        await requestWalletShare({
          email: formValues.email,
          wallet,
          code,
        });
        submit({
          email: formValues.email,
        });
      } catch (err: any) {
        if (err) {
          setErrors(err);
        }
      }
    },
  });

  const accountType = isEnterprise ? "enterprise" : "community";

  return (
    <BindHotKeys callback={handleSubmit} rejectCallback={cancel}>
      <Modal title={t("wallet.users.share.modal.title")} onClose={cancel} className="!z-10" showCloseIcon>
        <form onSubmit={handleSubmit}>
          <DisableAutofill />
          <Modal.Body>
            <div className="form-field">
              <Trans i18nKey="wallet.users.share.modal.message1">
                {/* eslint-disable-next-line */}
                You can only invite users that already have a RINO {{accountType}} account.
              </Trans>
            </div>
            <div className="form-field">
              <p>{t("wallet.users.share.modal.message2")}</p>
            </div>
            <div className="form-field">
              <Label label={(
                <div>
                  <Tooltip
                    content={(
                      <div className="md:w-76 text-sm text-center normal-case" data-qa-selector="tx-priority-tooltip">
                        {t("wallet.users.share.modal.tooltip")}
                      </div>
                    )}
                  >
                    {t("wallet.users.share.modal.user.email.address")}
                    {" "}
                    <div className="text-sm cursor-pointer inline-block" data-qa-selector="cursor-pointer-tx-priority-tooltip">
                      <Icon name="info" />
                    </div>
                  </Tooltip>
                </div>
              )}
              >
                <Input
                  autoComplete="off"
                  type="email"
                  name="email"
                  value={values.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder={t("wallet.users.share.modal.user.email.address") as string}
                  error={touched.email ? t(errors.email || "") as string : ""}
                />
              </Label>
            </div>
            <FormErrors errors={errors} />
          </Modal.Body>
          <Modal.Actions>
            <Button
              disabled={isSubmitting}
              type="button"
              name="cancel-btn"
              onClick={cancel}
            >
              {t("common.cancel")}
            </Button>
            <Button
              disabled={!isValid || !dirty || isSubmitting}
              type="submit"
              name="submit-btn"
              loading={isSubmitting}
              variant={
                isEnterprise
                  ? Button.variant.ENTERPRISE_LIGHT
                  : Button.variant.PRIMARY_LIGHT
              }
            >
              {t("wallet.users.share.modal.invite")}
            </Button>
          </Modal.Actions>
        </form>
      </Modal>
    </BindHotKeys>
  );
};

export default createModal(AddWalletShareRequest);
