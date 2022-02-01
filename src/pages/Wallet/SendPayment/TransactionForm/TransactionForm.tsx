import React, { useState } from "react";
import { generatePath, useNavigate } from "react-router-dom";
import * as yup from "yup";
import {
  AppDispatch, Destination, GetOutputsPayload,
  Wallet,
  UseThunkActionCreator,
  LocalWalletData,
  CreateUnsignedTransactionResponse,
} from "../../../../types";
import { Formik } from "formik";
import routes from "../../../../router/routes";
import { Label, Button, Input, AmountField, Collapsible, Radio, Tooltip } from "../../../../components";
import { moneroToPiconero, piconeroToMonero } from "../../../../utils";
import { transactionPriorities } from "../../../../constants";
import { FormErrors } from "../../../../modules/FormErrors";
import ConfirmTransaction from "../ConfirmTransaction";
import { ReactComponent as InfoIcon } from "./16px_info.svg";

const generateValidationSchema = (balance: number): yup.AnyObjectSchema => yup.object().shape({
  address: yup.string().required("This field is required."),
  amount: yup.string()
    .required("This field is required.")
      .test(
        "test-balance",
        `Your unlocked balance is ${balance}`,
        (value) => parseFloat(value ? value : "0") < balance
      )
      .test(
        "test-balance",
        "Transaction amount should be greater than zero.",
        (value) => parseFloat(value || "0") > 0
      ),
  password: yup.string().required("This field is required."),
  priority: yup.string(),
  memo: yup.string().max(300, "Maximum memo length is 300 characters.")
});

interface Props {
  wallet: Wallet | null;
  walletId: string;
  setActiveTab: (value: number) => void;
  openWallet: ({ wallet, loginPassword }: { wallet: Wallet, loginPassword: string }) => UseThunkActionCreator<LocalWalletData>;
  getOutputs: ({ id }: GetOutputsPayload) => UseThunkActionCreator<LocalWalletData | undefined>;
  prepareTransaction: (
    { id, body, memo, priority }: { id: string, body: Destination, memo: string, priority: string }
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
    validationSchema={generateValidationSchema(parseFloat(piconeroToMonero(wallet ? wallet.unlockedBalance : "0")))}
    onSubmit={async (values, { setErrors }): Promise<void> => {
      if (wallet) {
        setTransactionPrepared(true);
        setActiveTab(1);
        try {
          const openWalletPromise = openWallet({ wallet, loginPassword: values.password })
          setCurrentWalletCall(openWalletPromise);
          await openWalletPromise;

          const getOutputsPromise = getOutputs({ id: wallet.id })
          setCurrentWalletCall(getOutputsPromise)
          await getOutputsPromise

          const prepareTransactionPromise = prepareTransaction({
            id: wallet.id,
            body: { address: values.address, amount: moneroToPiconero(values.amount) },
            memo: values.memo,
            priority: values.priority,
          });
          setCurrentWalletCall(prepareTransactionPromise);
          await prepareTransactionPromise
        } catch (err) {
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
    }): React.ReactElement | null => {
      return !transactionPrepared ? (
        <form name="form-sendPayment" onSubmit={handleSubmit}>
          <div className="m-auto md:w-3/4">
            <div className="form-field">
              <Label label="To address" inline>
                <Input
                  type="text"
                  name="address"
                  value={values.address}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="Destination Address"
                  error={touched.address && errors.address || ""}
                />
              </Label>
            </div>
            <div className="form-field">
              <Label label="Amount" inline>
                <AmountField
                  name="amount"
                  value={values.amount}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="Amount"
                  error={touched.amount && errors.amount || ""}
                />
              </Label>
            </div>
            <div className="form-field">
              <Label label="Password" inline>
                <Input
                  type="password"
                  name="password"
                  value={values.password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="Password"
                  error={touched.password && errors.password || ""}
                />
              </Label>
            </div>
            <div className="form-field">
              <Label label="Internal transaction memo" subtitle="optional" inline>
                <Input
                  type="text"
                  name="memo"
                  value={values.memo}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="Internal Memo"
                  error={errors.memo || ""}
                />
              </Label>
            </div>
            <div className="form-field md:-ml-10">
              <Collapsible
                title={<div className="mt-0.5 uppercase">Advanced</div>}
              >
                <div className="pt-5">
                <div className="w-full flex items-center space-x-3 mb-3">
                  <p className="whitespace-nowrap text-sm theme-text uppercase font-catamaran leading-none -mb-1">Transaction Priority (Fee)</p>
                  <Tooltip
                    content={(
                      <div className="md:w-96 text-sm" data-qa-selector="tx-priority-tooltip">
                        The priority refers to the level of fees paid to miners by the transaction.
                        As the network is currently not under heavy load, paying higher fees than normal is useless and will not influence the transaction confirmation time.
                        We advise to leave it as "Normal".
                      </div>
                    )}
                  >
                    <div className="text-sm cursor-pointer" data-qa-selector="cursor-pointer-tx-priority-tooltip"><InfoIcon /></div>
                  </Tooltip>
                </div>
                  {Object.entries(transactionPriorities).map(([key, value]) => (
                    <div key={key}>
                      <label>
                        <Radio
                          checked={value == values.priority}
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
                Cancel
              </Button>
              <Button
                type="submit"
                name="submit-btn"
                variant={Button.variant.PRIMARY_LIGHT}
                size={Button.size.BIG}
                disabled={!isValid}
                loading={isSubmitting}
              >
                Review
              </Button>
            </div>
          </div>
        </form>
      ) :
        <ConfirmTransaction
          loading={isSubmitting}            
          transactionData={values}
          walletId={walletId}
          currentWalletCall={currentWalletCall}
          errors={errors}
          onEdit={(prevState: any): void => {
            setTransactionPrepared(false);
            setActiveTab(0);
            currentWalletCall.abort();
            resetPendingTransaction();
            resetForm({values: prevState });
          }}
        />
    }}
  </Formik>
  );
}

export default TransactionForm;