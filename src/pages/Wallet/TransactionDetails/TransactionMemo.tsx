import React from "react";
import { useFormik } from "formik";
import * as yup from "yup";
import { useTranslation } from "react-i18next";
import { Button, Label, Input } from "../../../components";
import { FormErrors } from "../../../modules/index";
import { updateTransactionDetails as updateTransactionDetailsThunk } from "../../../store/transactionListSlice";
import {
  UpdateTransactionDetailsResponse,
} from "../../../types";
import { useAccountType, useThunkActionCreator } from "../../../hooks";

const transactionPayloadValidationSchema = yup.object().shape({
  memo: yup.string(),
});

interface Props {
  walletId: string;
  transactionId: string;
  memo: string;
}
const TransactionMemo: React.FC<Props> = ({ walletId, transactionId, memo }) => {
  const updateTransactionDetails = useThunkActionCreator(updateTransactionDetailsThunk);
  const { t } = useTranslation();
  const { isEnterprise } = useAccountType();

  const formik = useFormik({
    enableReinitialize: true,
    validationSchema: transactionPayloadValidationSchema,
    initialValues: {
      memo,
    },
    onSubmit: async (values, { setErrors, resetForm }): Promise<UpdateTransactionDetailsResponse | void> => {
      try {
        await updateTransactionDetails({
          walletId,
          transactionId,
          memo: values.memo,
        });
        resetForm();
      } catch (err: any) {
        if (err) setErrors(err);
      }
    },
  });

  return (
    <div className="break-all col-span-2" data-qa-selector="transaction-memo">
      <Label
        inline
        label={t("wallet.transaction.internal.memo")}
        labelClassName="md:text-right"
        valueClassName=""
        isFormField
      >
        <Input
          autoComplete="off"
          type="text"
          name="memo"
          value={formik.values.memo}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.memo ? formik.errors.memo || "" : ""}
        />
      </Label>

      <div className="mt-2 text-right">
        {formik.dirty ? (
          <Button
            variant={
              isEnterprise
                ? Button.variant.ENTERPRISE_LIGHT
                : Button.variant.PRIMARY_LIGHT
            }
            size={Button.size.SMALL}
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
        ) : null}
      </div>

      <FormErrors errors={formik.errors} />
    </div>
  );
};

export default TransactionMemo;
