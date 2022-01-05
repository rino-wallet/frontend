import React from "react";
import { useHistory, generatePath } from "react-router-dom";
import { Formik } from "formik";
import * as yup from "yup";
import { moneroToPiconero } from "../../../utils";
import { Button, Label, Input, AmountField, Radio } from "../../../components";
import { FormErrors, PageTemplate, WalletCard } from "../../../modules/index";
import {
  CreateUnsignedTransactionResponse,
  Destination,
  FetchWalletDetailsResponse,
  LocalWalletData,
  Wallet
} from "../../../types";
import routes from "../../../router/routes";
import { transactionPriorities } from "../../../constants";
import confirmPayment from "./PaymentConfirmation";
import CreatingTransaction from "./CreatingTransaction";

const validationSchema = yup.object().shape({
  address: yup.string().required("This field is required."),
  amount: yup.string().required("This field is required."),
  password: yup.string().required("This field is required."),
  priority: yup.string(),
  memo: yup.string(),
});

interface Props {
  wallet: Wallet | null;
  walletId: string;
  openWallet: (data: { wallet: Wallet, password: string }) => Promise<LocalWalletData | undefined>;
  getOutputs: (data: { id: string }) => Promise<LocalWalletData | undefined>;
  createTransaction: (data: { id: string, body: Destination, memo: string, priority: string }) => Promise<CreateUnsignedTransactionResponse>;
  fetchWalletDetails: (data: { id: string }) => Promise<FetchWalletDetailsResponse>;
}

const SendPayment: React.FC<Props> = ({ wallet, walletId, openWallet, fetchWalletDetails, getOutputs, createTransaction }) => {
  const { push } = useHistory();
  return (
    <PageTemplate title="Send" backButtonRoute={`${generatePath(routes.wallet, { id: walletId })}/transactions`}>
      <Formik
        initialValues={{
          address: "",
          amount: "",
          password: "",
          message: "",
          memo: "",
          priority: transactionPriorities.Normal,
          non_field_errors: "",
        }}
        validationSchema={validationSchema}
        onSubmit={async (values, { setErrors, resetForm }): Promise<void> => {
          if (wallet) {
            try {
              await confirmPayment({
                mount: values.amount,
                address: values.address,
                memo: values.memo,
                priority: values.priority,
              });
              await openWallet({ wallet, password: values.password });
              await getOutputs({ id: wallet.id });
              await createTransaction({
                id: wallet.id,
                body: { address: values.address, amount: moneroToPiconero(values.amount) },
                memo: values.memo,
                priority: values.priority,
              });
              resetForm();
              fetchWalletDetails({id: wallet.id}).then(() => null);
              push(`${generatePath(routes.wallet, { id: walletId })}/transactions`);
            } catch(err) {
              if (err) {
                setErrors(err);
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
        }): React.ReactElement => (
          <form name="form-sendPayment" onSubmit={handleSubmit}>
            <div className="form-field">
              <WalletCard
                balance={wallet?.balance || ""}
                unlocked={wallet?.unlockedBalance || ""}
                name={wallet?.name || ""}
                id={walletId}
              />
            </div>
            <div className="form-field">
              <Label label="To address">
                <Input
                  type="text"
                  name="address"
                  value={values.address}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="Address"
                  error={touched.address && errors.address || ""}
                />
              </Label>
            </div>
            <div className="form-field">
              <Label label="Amount">
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
              <Label label="Password">
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
              <Label label="Internal transaction memo">
                <Input
                  type="text"
                  name="memo"
                  value={values.memo}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="Memo"
                  error={touched.memo && errors.memo || ""}
                />
              </Label>
            </div>
            <div className="form-field">
              <Label label="Transaction Priority (Fee)">
                {Object.entries(transactionPriorities).map(([key, value]) => (
                  <div>
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
              </Label>
            </div>
            <FormErrors errors={errors} />
            <div className="form-field mt-10 flex space-x-3">
              <Button
                name="canel-btn"
                disabled={isSubmitting}
                onClick={(): void => push(`${generatePath(routes.wallet, { id: walletId })}/transactions`)}
                block
              >
                Cancel
              </Button>
              <Button
                disabled={!isValid || isSubmitting}
                type="submit"
                name="submit-btn"
                loading={isSubmitting}
                block
              >
                Proceed
              </Button>
            </div>
            {
              isSubmitting && (
                <CreatingTransaction amount={values.amount} address={values.address} />
              )
            }
          </form>
        )}
      </Formik>  
    </PageTemplate>
  )
}

export default SendPayment;
