import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useFormik } from "formik";
import * as yup from "yup";
import { FormErrors, Modal } from "../../../modules/index";
import {
  Button, Label, Input, Copy,
} from "../../../components";
import apiKeysApi from "../../../api/apiManagement";
import { ApiKey } from "../../../types";
import "./style.css";

const validationSchema = yup.object().shape({
  name: yup.string().required("This field is required."),
  expires_at: yup.string().required("This field is required.").max(6, "Incorrect date format. Maximum number of days should contain 6 numbers."),
});

interface Props {
  goBackCallback: () => void;
  onCreateCallback: () => void;
}

const CreateNewApi: React.FC<Props> = ({ goBackCallback, onCreateCallback }) => {
  const [apiKey, setApiKey] = useState<ApiKey>();
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
      name: "",
      expires_at: "",
      non_field_errors: "",
    },
    onSubmit: async (formValues, { setErrors }) => {
      const currentDate = new Date();
      const expirationDate = new Date(currentDate.getTime() + Number(formValues.expires_at) * 24 * 60 * 60 * 1000);
      const formatedExpirationDate = expirationDate.toISOString();
      try {
        const response = await apiKeysApi.createApiKey({
          name: formValues.name,
          expires_at: String(formatedExpirationDate),
        });
        setApiKey(response);
      } catch (err: any) {
        if (err.data) {
          setErrors({ name: err.data.name, expires_at: err.data.expires_at });
        } else {
          setErrors(err);
        }
      } finally {
        onCreateCallback();
      }
    },
  });

  return (
    <Modal title={t("settings.api.management.modals.create.title")} onClose={goBackCallback}>
      <form onSubmit={handleSubmit}>
        <Modal.Body>
          <p className="mb-6">{t("settings.api.management.modals.create.text")}</p>
          <div className="mb-1 flex flex-col gap-6">
            <Label label={t("settings.api.management.modals.create.name")}>
              <Input
                type="text"
                name="name"
                value={values.name}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="API name"
                error={touched.name ? errors.name || "" : ""}
                maxLength={50}
              />
            </Label>
            <div className="relative">
              <Label label={t("settings.api.management.modals.create.expiry")}>
                <Input
                  type="number"
                  name="expires_at"
                  value={values.expires_at}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="eg. 8"
                  error={touched.expires_at ? errors.expires_at || "" : ""}
                  minValue={1}
                  maxLength={7}
                  postfix={<div className="pr-6 text-gray-300">days</div>}
                />
              </Label>
            </div>
          </div>
          <FormErrors errors={errors} />

          {apiKey
            && (
            <div className="mt-5">
              <p>{t("settings.api.management.modals.create.warning.text")}</p>
              <p className="text-red-500 text-sm">{t("settings.api.management.modals.create.slug")}</p>

              <div className="flex items-center mt-3">
                <Copy value={apiKey.apiKey}>
                  <span data-qa-selector={`transaction-id = ${apiKey?.apiKey}`} className="text-ellipsis inline-block overflow-hidden w-5/6">
                    {apiKey?.apiKey}
                  </span>
                </Copy>
              </div>
            </div>
            )}
        </Modal.Body>
        <Modal.Actions>
          <div className="flex justify-end space-x-3 whitespace-nowrap">
            {!apiKey
              ? (
                <>
                  <Button
                    disabled={isSubmitting}
                    type="button"
                    name="cancel-btn"
                    onClick={goBackCallback}
                  >
                    {t("common.cancel")}
                  </Button>
                  <Button
                    disabled={!isValid || !dirty || isSubmitting}
                    type="submit"
                    name="submit-btn"
                    loading={isSubmitting}
                    variant={Button.variant.PRIMARY}
                  >
                    {t("settings.api.management.buttons.create.api")}
                  </Button>
                </>
              )
              : (
                <Button
                  type="button"
                  name="close-button"
                  variant={Button.variant.PRIMARY}
                  onClick={goBackCallback}
                >
                  {t("common.close")}
                </Button>
              )}
          </div>
        </Modal.Actions>
      </form>
    </Modal>
  );
};

export default CreateNewApi;
