import React, { useState } from "react";
import { generatePath, useNavigate } from "react-router-dom";
import * as yup from "yup";
import { Formik } from "formik";
import { useTranslation } from "react-i18next";
import {
  AppDispatch, Destination, GetOutputsPayload,
  Wallet,
  UseThunkActionCreator,
  LocalWalletData,
  CreateUnsignedTransactionResponse,
} from "../../../../../types";
import routes from "../../../../../router/routes";
import {
  Label, Button, Input, AmountField, Collapsible, Radio, Tooltip, DisableAutofill, Icon,
} from "../../../../../components";
import { moneroToPiconero, piconeroToMonero } from "../../../../../utils";
import { transactionPriorities } from "../../../../../constants";
import { FormErrors } from "../../../../../modules/FormErrors";
import ConfirmTransaction from "../ConfirmTransaction";

const generateValidationSchema = (balance: number, t: (key: string) => string): yup.AnyObjectSchema => yup.object().shape({
  address: yup.string().required("errors.required"),
  amount: yup.string()
    .required("errors.required")
    .test(
      "test-balance",
      balance > 0 ? t("wallet.send.error.max").replace("{balance}", `${balance}`) : t("wallet.send.error.nofunds"),
      (value) => parseFloat(value || "0") < balance,
    )
    .test(
      "test-balance",
      t("wallet.send.error.morethen0"),
      (value) => parseFloat(value || "0") > 0,
    ),
  password: yup.string().required("errors.required"),
  priority: yup.string(),
  memo: yup.string().max(300, t("wallet.send.memo.length")),
});

interface Props {
  wallet: Wallet | null;
  walletId: string;
  setActiveTab: (value: number) => void;
  openWallet: ({ wallet, loginPassword }: { wallet: Wallet, loginPassword: string }) => UseThunkActionCreator<LocalWalletData>;
  getOutputs: ({ id }: GetOutputsPayload) => UseThunkActionCreator<LocalWalletData | undefined>;
  prepareTransaction: (
    {
      id, body, memo, priority,
    }: { id: string, body: Destination, memo: string, priority: string }
  ) => UseThunkActionCreator<CreateUnsignedTransactionResponse>;
  resetPendingTransaction: () => void;
}

const TransactionForm: React.FC<Props> = ({
  wallet,
  walletId,
  setActiveTab,
  openWallet,
  getOutputs,
  prepareTransaction,
  resetPendingTransaction,
}) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [currentWalletCall, setCurrentWalletCall] = useState<Promise<AppDispatch> | any>(null);
  const [transactionPrepared, setTransactionPrepared] = useState(false);
  return (
    <Formik
      initialValues={{
        address: "",
        amount: "",
        password: "",
        memo: "",
        priority: transactionPriorities.Normal,
        non_field_errors: "",
      }}
      validationSchema={generateValidationSchema(parseFloat(piconeroToMonero(wallet ? wallet.unlockedBalance : "0")), t)}
      onSubmit={async (values, { setErrors }): Promise<void> => {
        if (wallet) {
          setTransactionPrepared(true);
          setActiveTab(1);
          try {
            const openWalletPromise = openWallet({ wallet, loginPassword: values.password });
            setCurrentWalletCall(openWalletPromise);
            await openWalletPromise;

            const getOutputsPromise = getOutputs({ id: wallet.id });
            setCurrentWalletCall(getOutputsPromise);
            await getOutputsPromise;

            const prepareTransactionPromise = prepareTransaction({
              id: wallet.id,
              body: { address: values.address, amount: moneroToPiconero(values.amount) },
              memo: values.memo,
              priority: values.priority,
            });
            setCurrentWalletCall(prepareTransactionPromise);
            await prepareTransactionPromise;
          } catch (err: any) {
            // the error should be ignored if user press on "Edit" button
            if (err && err?.name !== "AbortError") {
              setErrors(err);
              setTransactionPrepared(false);
              setActiveTab(0);
            }
          }
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
        setFieldValue,
        resetForm,
      }): React.ReactElement | null => (!transactionPrepared ? (
        <form name="form-sendPayment" onSubmit={handleSubmit}>
          <DisableAutofill />
          <div className="m-auto md:w-3/4">
            <div className="form-field">
              <Label labelClassName="md:text-right" label={t("wallet.send.to.address")} isFormField inline>
                <Input
                  autoComplete="off"
                  type="text"
                  name="address"
                  value={values.address}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder={t("wallet.send.destination.address") as string}
                  error={touched.address ? t(errors.address as string) || "" : ""}
                />
              </Label>
            </div>
            <div className="form-field">
              <Label labelClassName="md:text-right" label={t("wallet.send.amount")} isFormField inline>
                <AmountField
                  name="amount"
                  value={values.amount}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder={t("wallet.send.amount") as string}
                  error={touched.amount ? t(errors.amount as string) || "" : ""}
                />
              </Label>
            </div>
            <div className="form-field">
              <Label labelClassName="md:text-right" label={t("wallet.send.password")} isFormField inline>
                <Input
                  type="password"
                  name="password"
                  autoComplete="current-password"
                  value={values.password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder={t("wallet.send.password") as string}
                  error={touched.password ? t(errors.password as string) || "" : ""}
                />
              </Label>
            </div>
            <div className="form-field">
              <Label labelClassName="md:text-right" label={t("wallet.send.transaction.memo")} subtitle="optional" isFormField inline>
                <Input
                  autoComplete="off"
                  type="text"
                  name="memo"
                  value={values.memo}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder={t("wallet.send.internal.memo") as string}
                  error={t(errors.memo as string) || ""}
                />
              </Label>
            </div>
            <div className="form-field md:ml-10">
              <Collapsible
                title={<div className="mt-0.5 uppercase">{t("wallet.send.advanced")}</div>}
              >
                <div className="pt-5">
                  <div className="w-full flex items-center space-x-3 mb-3">
                    <p className="whitespace-nowrap text-sm theme-text uppercase font-catamaran leading-none -mb-1">{t("wallet.send.transaction.priority")}</p>
                    <Tooltip
                      content={(
                        <div className="md:w-96 text-sm" data-qa-selector="tx-priority-tooltip">
                          {t("wallet.send.priority.tooltip")}
                        </div>
                      )}
                    >
                      <div className="text-sm cursor-pointer" data-qa-selector="cursor-pointer-tx-priority-tooltip"><Icon name="info" /></div>
                    </Tooltip>
                  </div>
                  {Object.entries(transactionPriorities).map(([key, value]) => (
                    <div key={key}>
                      <label>
                        <Radio
                          checked={value === values.priority}
                          onChange={(): void => setFieldValue("priority", value)}
                          value={value}
                        >
                          {key}
                        </Radio>
                      </label>
                    </div>
                  ))}
                </div>
              </Collapsible>
            </div>
            <FormErrors errors={errors} />
            <div className="form-field mt-10 flex space-x-3 flex justify-end">
              <Button
                variant={Button.variant.GRAY}
                size={Button.size.BIG}
                name="cancel-btn"
                disabled={isSubmitting}
                onClick={(): void => navigate(`${generatePath(routes.wallet, { id: walletId })}/transactions`)}
              >
                {t("common.cancel")}
              </Button>
              <Button
                type="submit"
                name="submit-btn"
                variant={Button.variant.PRIMARY_LIGHT}
                size={Button.size.BIG}
                disabled={!isValid || !parseFloat(wallet?.unlockedBalance || "0")}
                loading={isSubmitting}
              >
                {t("wallet.send.review")}
              </Button>
            </div>
          </div>
        </form>
      )
        : (
          <ConfirmTransaction
            loading={isSubmitting}
            transactionData={values}
            walletId={walletId}
            errors={errors}
            onEdit={(prevState: any): void => {
              setTransactionPrepared(false);
              setActiveTab(0);
              currentWalletCall.abort();
              resetPendingTransaction();
              resetForm({ values: prevState });
            }}
          />
        ))}
    </Formik>
  );
};

export default TransactionForm;
