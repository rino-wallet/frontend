import React, { useEffect, useState } from "react";
import { generatePath, useNavigate } from "react-router-dom";
import { Formik } from "formik";
import * as yup from "yup";
import {
  CreateExchangeOrderPayload, ExchangeEstimation, ExchangeRange, GetExchangeEstimationPayload, GetExchangeEstimationResponse, GetExchangeOrderResponse, Wallet,
} from "../../../../types";
import {
  DisableAutofill, Label, Input, AmountField, Button, Tooltip, Icon, Spinner,
} from "../../../../components";
import { FormErrors } from "../../../../modules/FormErrors";
import routes from "../../../../router/routes";
import { ReactComponent as IconUp } from "../../arrow-up.svg";
import { ReactComponent as ChangeNowLogo } from "./change-now.svg";
import {
  btcToSatoshi, moneroToPiconero, piconeroToMonero, satoshiToBTC,
} from "../../../../utils";

interface AmountSchema {
  name: string;
  message: string;
  test: any; // eslint-disable-line
}

const minAmountSchema = (minValue: number): AmountSchema => ({
  name: "minAmount",
  message: minValue ? `The min amount is ${minValue}` : "",
  test: (value: string): boolean => parseFloat(value) >= minValue,
});
const maxAmountSchema = (maxValue: number): AmountSchema => ({
  name: "maxAmount",
  message: maxValue ? `The max amount is ${maxValue}` : "",
  test: (value: string): boolean => parseFloat(value) <= maxValue,
});

const validationSchema = (limits: { minAmount: number; maxAmount: number; balance: number }): any => yup.object().shape({
  amount_to_send: yup
    .string()
    .test(minAmountSchema(parseFloat(piconeroToMonero(limits.minAmount))))
    .test(maxAmountSchema(parseFloat(piconeroToMonero(limits.maxAmount))))
    .test(
      "test-balance",
      limits.balance > 0 ? `You can only transfer less than ${limits.balance}.` : "You don't have any unlocked funds to transfer.",
      (value) => parseFloat(value || "0") < limits.balance,
    )
    .required("This field is required."),
  amount_to_receive: yup.string().required("This field is required."),
  address: yup.string().required("This field is required."),
});

interface Props {
  walletSubAddress: string;
  wallet: Wallet | null;
  walletId: string;
  exchangeRange: ExchangeRange;
  exchangeEstimation: ExchangeEstimation;
  getExchangeEstimation: (data: GetExchangeEstimationPayload) => Promise<GetExchangeEstimationResponse>,
  createExchangeOrder: (data: CreateExchangeOrderPayload) => Promise<GetExchangeOrderResponse>,
  pendingGetExchangeEstimation: boolean;
  setActiveTab: (value: number) => void;
}

interface RetreiveEstimation {
  amount: number,
  amount_set_in: "from" | "to",
  callback?: (data: GetExchangeEstimationResponse) => void;
}

const ExchangeForm: React.FC<Props> = ({
  walletSubAddress,
  wallet,
  walletId,
  exchangeRange,
  exchangeEstimation,
  // eslint-disable-next-line
  pendingGetExchangeEstimation,
  getExchangeEstimation,
  setActiveTab,
  createExchangeOrder,
}) => {
  const [rate, setRate] = useState("");
  const navigate = useNavigate();
  const currency = "btc";
  useEffect(() => {
    getExchangeEstimation({
      platform: "changenow",
      to_currency: currency,
      amount_set_in: "from",
      amount: moneroToPiconero(1),
    }).then((resp) => {
      setRate(satoshiToBTC(resp.toAmount));
    });
  }, []);
  async function retreiveEstimation({
    amount,
    amount_set_in,
    callback,
  }: RetreiveEstimation): Promise<void> {
    const resp = await getExchangeEstimation({
      platform: "changenow",
      to_currency: currency,
      amount_set_in,
      amount: amount_set_in === "from" ? moneroToPiconero(amount) : btcToSatoshi(amount),
    });
    if (typeof callback === "function") {
      callback(resp);
    }
  }
  return (
    <Formik
      initialValues={{
        non_field_errors: "",
        amount_set_in: "",
        amount_to_send: "",
        amount_to_receive: "",
        address: "",
      }}
      validationSchema={validationSchema({ ...exchangeRange, balance: parseFloat(piconeroToMonero(wallet ? wallet.unlockedBalance : "0")) })}
      onSubmit={async (values, { setErrors }): Promise<void> => {
        try {
          await createExchangeOrder({
            to_currency: currency,
            platform: "changenow",
            wallet: walletId,
            amount_set_in: values.amount_set_in as "from" | "to",
            amount: values.amount_set_in === "from" ? moneroToPiconero(values.amount_to_send) : btcToSatoshi(parseFloat(values.amount_to_receive)),
            address: values.address,
            refund_address: walletSubAddress,
            rate_id: exchangeEstimation.rateId,
          });
          setActiveTab(1);
        } catch (err: any) {
          if (err) {
            setErrors(err);
          }
        }
      }}
    >
      {({
        values,
        handleChange,
        handleBlur,
        handleSubmit,
        setFieldValue,
        setTouched,
        isSubmitting,
        touched,
        errors,
        isValid,
      }): React.ReactElement | null => (
        <form name="form-exchange" onSubmit={handleSubmit}>
          <DisableAutofill />
          <div className="m-auto md:w-3/4">
            <div className="mb-4 md:mb-0">
              <Label labelClassName="md:text-right" label="Exchange platform" inline>
                <ChangeNowLogo style={{ width: "110px" }} />
              </Label>
            </div>
            <div className="mb-4 md:mb-0">
              <Label labelClassName="md:text-right" label="You Send" inline>
                <AmountField
                  postfix="XMR"
                  name="amount_to_send"
                  value={values.amount_to_send}
                  onChange={(e): void => {
                    retreiveEstimation({
                      amount: parseFloat(e.target.value),
                      amount_set_in: "from",
                      callback: (est: GetExchangeEstimationResponse) => {
                        setFieldValue("amount_to_receive", e.target.value ? satoshiToBTC(est.toAmount) : 0);
                        setFieldValue("amount_set_in", "from");
                      },
                    });
                    return handleChange(e);
                  }}
                  onBlur={handleBlur}
                  placeholder="XMR Amount"
                  error={touched.amount_to_send ? errors.amount_to_send || "" : ""}
                />
              </Label>
            </div>
            <div className="hidden md:block">
              <Label labelClassName="md:text-right" label="" inline>
                <IconUp className="inline-block h-4 w-4 fill-black rotate-180 ml-4" />
              </Label>
            </div>
            <div className="mb-4 md:mb-0">
              <Label labelClassName="md:text-right" label="You Get" inline>
                <AmountField
                  postfix="BTC"
                  name="amount_to_receive"
                  value={values.amount_to_receive}
                  onChange={(e): void => {
                    setTouched({ amount_to_send: true });
                    retreiveEstimation({
                      amount: parseFloat(e.target.value),
                      amount_set_in: "to",
                      callback: (est: GetExchangeEstimationResponse) => {
                        setFieldValue("amount_to_send", e.target.value ? piconeroToMonero(est.fromAmount) : 0);
                        setFieldValue("amount_set_in", "to");
                      },
                    });
                    return handleChange(e);
                  }}
                  onBlur={handleBlur}
                  placeholder={`${currency.toUpperCase()} Amount`}
                  error={touched.amount_to_receive ? errors.amount_to_receive || "" : ""}
                />
              </Label>
            </div>
            <div className="mb-4 md:mb-0">
              <Label labelClassName="md:text-right" label="Destination Address" inline>
                <Input
                  autoComplete="off"
                  type="text"
                  name="address"
                  value={values.address}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="Destination Address"
                  error={touched.address ? errors.address || "" : ""}
                />
              </Label>
            </div>
            <div className="mb-4 mt-10 md:mb-0">
              <Label
                labelClassName="md:text-right -mb-3"
                label={(
                  <div className="flex items-center md:justify-end">
                    Estimated rate
                    <div className="inline ml-1">
                      <Tooltip
                        content={(
                          <div className="md:w-64 text-sm normal-case" data-qa-selector="exchange-rate-tooltip">
                            The actual exchange rate can still change (a tiny bit).
                            Make sure to verify the numbers at the next step.
                          </div>
                        )}
                      >
                        <div className="text-sm cursor-pointer hover:text-orange-500" data-qa-selector="cursor-pointer-tx-priority-tooltip"><Icon name="info" /></div>
                      </Tooltip>
                    </div>
                  </div>
                )}
                inline
              >
                <div className="mt-1">
                  {
                    rate ? (
                      <span>
                        1 XMR ≈
                        {" "}
                        <span className="text-green-400">{rate}</span>
                        {" "}
                        {currency.toUpperCase()}
                      </span>
                    ) : <span><Spinner /></span>
                  }
                </div>
              </Label>
            </div>
            <div className="mb-4 md:mb-0">
              <Label labelClassName="md:text-right" label="Operation Limit" inline>
                <div>
                  from
                  {" "}
                  {piconeroToMonero(exchangeRange.minAmount)}
                  {" "}
                  XMR to
                  {" "}
                  {piconeroToMonero(exchangeRange.maxAmount)}
                  {" "}
                  XMR
                </div>
              </Label>
            </div>
            <FormErrors errors={errors} fields={["refund_address"]} />
            <div className="mt-10 flex space-x-3 flex justify-end">
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
                disabled={!isValid || !parseFloat(wallet?.unlockedBalance || "0")}
                loading={isSubmitting}
              >
                Proceed
              </Button>
            </div>
          </div>
        </form>
      )}
    </Formik>
  );
};

export default ExchangeForm;
