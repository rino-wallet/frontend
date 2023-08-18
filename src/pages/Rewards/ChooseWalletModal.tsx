import React from "react";
import * as yup from "yup";
import { useFormik } from "formik";
import { useTranslation } from "react-i18next";
import { createModal } from "../../modules/ModalFactory";
import { Button, Input, Label } from "../../components";
import { FormErrors, Modal } from "../../modules/index";
import { useAccountType } from "../../hooks";

const validationSchema = yup.object().shape({
  address: yup.string().required("errors.required"),
});

interface Props {
  submit: () => void;
  cancel: () => void;
  asyncCallback: (address: string) => Promise<any>;
}

const ChooseWalletModal = ({
  cancel, submit, asyncCallback,
}: Props) => {
  const { t } = useTranslation();
  const { isEnterprise } = useAccountType();

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
      address: "",
      non_field_errors: "",
    },
    onSubmit: async (formValues, { setErrors }) => {
      try {
        await asyncCallback(formValues.address);
        submit();
      } catch (err: any) {
        setErrors(err);
      }
    },
  });

  return (
    <Modal size={Modal.size.MEDIUM} title={t("rewards.choose.wallet.title")} showCloseIcon>
      <form onSubmit={handleSubmit}>
        <Modal.Body>
          <p className="mb-10">
            {t("rewards.choose.wallet.message")}
          </p>
          <div className="overflow-y-auto pr-4 mb-4">
            <Label label={t("rewards.enter.wallet.address")}>
              <Input
                type="text"
                name="address"
                value={values.address}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.address ? t(errors.address as string) || "" : ""}
              />
            </Label>
          </div>
          <FormErrors errors={{ ...errors }} />
        </Modal.Body>
        <Modal.Actions>
          <Button
            onClick={cancel}
            name="return-btn"
          >
            {t("common.cancel")}
          </Button>
          <Button
            variant={
              isEnterprise
                ? Button.variant.ENTERPRISE_LIGHT
                : Button.variant.PRIMARY_LIGHT
            }
            type="submit"
            name="submit-btn"
            loading={isSubmitting}
            disabled={dirty && !isValid}
          >
            {t("common.continue")}
          </Button>
        </Modal.Actions>
      </form>
    </Modal>
  );
};

export const showChooseWalletModal = createModal(ChooseWalletModal);
