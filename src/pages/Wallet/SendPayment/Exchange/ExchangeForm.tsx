import React, {
  useEffect, useState,
} from "react";
import { generatePath, useNavigate } from "react-router-dom";
import { Formik } from "formik";
import * as yup from "yup";
import { useTranslation } from "react-i18next";
import {
  CreateExchangeOrderPayload,
  ExchangeEstimation,
  ExchangeRange,
  GetExchangeEstimationPayload,
  GetExchangeEstimationResponse,
  GetExchangeOrderResponse,
  Wallet,
  CurrenciesList,
  GetExchangeRangeResponse,
  UseThunkActionCreator,
  ExchangeCurrencies,
} from "../../../../types";
import {
  DisableAutofill, Label, Input, AmountField, Button, Tooltip, Icon, Spinner, Select,
} from "../../../../components";
import { FormErrors } from "../../../../modules/FormErrors";
import routes from "../../../../router/routes";
import {
  debouncePromise,
  btcToSatoshi, moneroToPiconero, piconeroToMonero, convertAtomicAmount,
} from "../../../../utils";
import { ReactComponent as ChangeNowLogo } from "./change-now.svg";
import ExchangeConfirmation from "./ExchangeConfirmation";
import ExchangePayment from "./ExchangePayment";

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

const validationSchema = (limits: { minAmount: number; maxAmount: number; balance: number }, t: (key: string) => string): any => yup.object().shape({
  amount_to_send: yup
    .string()
    .test(minAmountSchema(parseFloat(piconeroToMonero(limits.minAmount))))
    .test(maxAmountSchema(parseFloat(piconeroToMonero(limits.maxAmount))))
    .test(
      "test-balance",
      limits.balance > 0 ? t("wallet.send.error.max").replace("{balance}", `${limits.balance}`) : t("wallet.send.error.nofunds"),
      (value) => parseFloat(value || "0") < limits.balance,
    )
    .test(
      "test-balance",
      t("wallet.send.error.morethen0"),
      (value) => parseFloat(value || "0") > 0,
    ),
  amount_to_receive: yup.string().required("errors.required"),
  address: yup.string().required("errors.required"),
});

const debounceRequest = debouncePromise((requestFn: any) => requestFn(), 500);

interface Props {
  walletSubAddress: string;
  wallet: Wallet | null;
  walletId: string;
  exchangeRange: ExchangeRange;
  exchangeEstimation: ExchangeEstimation;
  currencies: CurrenciesList;
  activeTab: number;
  getExchangeEstimation: (data: GetExchangeEstimationPayload) => Promise<GetExchangeEstimationResponse>,
  createExchangeOrder: (data: CreateExchangeOrderPayload) => Promise<GetExchangeOrderResponse>,
  setActiveTab: (value: number) => void;
  getExchangeRange: (data: {
    platform: string;
    to_currency: string;
  }) => UseThunkActionCreator<GetExchangeRangeResponse>
}

enum ExchangePlatformState {
  pending,
  available,
  not_available,
}

interface RetreiveEstimation {
  amount: number;
  amount_set_in: "from" | "to";
  currency: string;
  callback?: (data: GetExchangeEstimationResponse) => void;
}

const ExchangeForm: React.FC<Props> = ({
  walletSubAddress,
  wallet,
  walletId,
  exchangeRange,
  exchangeEstimation,
  currencies,
  activeTab,
  getExchangeEstimation,
  setActiveTab,
  createExchangeOrder,
  getExchangeRange,
}) => {
  const { t } = useTranslation();
  const [exchangePlatformState, setExchangePlatformState] = useState<ExchangePlatformState>(ExchangePlatformState.available);
  const [rate, setRate] = useState("");
  const navigate = useNavigate();
  const defaultCurrency = "btc";
  const inputDisabled = exchangePlatformState === ExchangePlatformState.pending || exchangePlatformState === ExchangePlatformState.not_available;
  async function fetchRate(data: {
    platform: string,
    to_currency: string,
    amount_set_in: "from" | "to",
    amount: number,
  }) {
    try {
      setExchangePlatformState(ExchangePlatformState.pending);
      const response = await getExchangeEstimation(data);
      setExchangePlatformState(ExchangePlatformState.available);
      return response;
    } catch (err: any) {
      if (err?.status >= 500) {
        setExchangePlatformState(ExchangePlatformState.not_available);
      } else {
        setExchangePlatformState(ExchangePlatformState.available);
      }
      throw err;
    }
  }
  useEffect(() => {
    if (activeTab === 0) {
      getExchangeRange({ platform: "changenow", to_currency: defaultCurrency });
      fetchRate({
        platform: "changenow",
        to_currency: defaultCurrency,
        amount_set_in: "from",
        amount: moneroToPiconero(1),
      }).then((resp) => {
        setRate(convertAtomicAmount(resp.toAmount, defaultCurrency));
      });
    }
  }, [activeTab]);
  async function retreiveEstimation({
    amount,
    amount_set_in,
    currency,
    callback,
  }: RetreiveEstimation): Promise<void> {
    try {
      const resp = await debounceRequest(() => fetchRate({
        platform: "changenow",
        to_currency: currency.toLowerCase(),
        amount_set_in,
        amount: amount_set_in === "from" ? moneroToPiconero(amount) : btcToSatoshi(amount),
      }));
      if (typeof callback === "function") {
        callback(resp as any);
      }
    } catch (err) {
      // eslint-disable-next-line
      console.error(err);
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
        currency: defaultCurrency,
      }}
      validationSchema={validationSchema({ ...exchangeRange, balance: parseFloat(piconeroToMonero(wallet ? wallet.unlockedBalance : "0")) }, t)}
      onSubmit={async (values, { setErrors }): Promise<void> => {
        try {
          await createExchangeOrder({
            to_currency: values.currency.toLocaleLowerCase(),
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
        resetForm,
        isSubmitting,
        touched,
        errors,
        isValid,
      }): React.ReactElement | null => {
        switch (activeTab) {
          case 0: {
            return (
              <form name="form-exchange" onSubmit={handleSubmit}>
                <DisableAutofill />
                <div className="m-auto md:w-3/4">
                  <div className="mb-4 md:mb-0" data-qa-selector="platform">
                    <Label labelClassName="md:text-right" label={t("wallet.exchange.platform")} inline isFormField>
                      <div className="flex items-center space-x-3 h-8 mt-3">
                        {
                          exchangePlatformState === ExchangePlatformState.available && <Icon name="check" className="theme-text-success" />
                        }
                        {
                          exchangePlatformState === ExchangePlatformState.not_available && <Icon name="cross" className="theme-text-error" />
                        }
                        {
                          exchangePlatformState === ExchangePlatformState.pending && <span><Spinner /></span>
                        }
                        <ChangeNowLogo data-qa-selector="changeNowLogo" style={{ width: "110px" }} />
                      </div>
                      {
                        (exchangePlatformState === ExchangePlatformState.not_available) && (
                        <div className="theme-text-error">
                          {t("wallet.send.exchange.not.available")}
                        </div>
                        )
                      }
                    </Label>
                  </div>
                  <div className="mb-4 md:mb-0">
                    <Label labelClassName="md:text-right" label={t("wallet.send.you.send")} isFormField inline>
                      <AmountField
                        postfix={<div className="pr-6">XMR</div>}
                        name="amount_to_send"
                        value={values.amount_to_send}
                        onChange={(e): void => {
                          retreiveEstimation({
                            amount: parseFloat(e.target.value),
                            amount_set_in: "from",
                            currency: values.currency,
                            callback: (est: GetExchangeEstimationResponse) => {
                              setFieldValue("amount_to_receive", e.target.value ? convertAtomicAmount(est.toAmount, values.currency as ExchangeCurrencies) : 0);
                              setFieldValue("amount_set_in", "from");
                            },
                          });
                          return handleChange(e);
                        }}
                        disabled={inputDisabled}
                        onBlur={handleBlur}
                        placeholder={`XMR ${t("wallet.send.amount")}`}
                        error={touched.amount_to_send ? t(errors.amount_to_send as string) || "" : ""}
                      />
                    </Label>
                  </div>
                  <div className="hidden md:block">
                    <Label labelClassName="md:text-right" valueClassName="text-center" label="" inline>
                      <Icon name="two-way-arrow" className="inline-block" />
                    </Label>
                  </div>
                  <div className="mb-4 md:mb-0">
                    <Label labelClassName="md:text-right" label={t("wallet.send.you.get")} isFormField inline>
                      <AmountField
                        postfix={(
                          <Select
                            name="currency"
                            value={values.currency}
                            onChange={(e) => {
                              getExchangeEstimation({
                                platform: "changenow",
                                to_currency: e.target.value.toLowerCase(),
                                amount_set_in: "from",
                                amount: moneroToPiconero(1),
                              })
                                .then((resp) => {
                                  setRate(convertAtomicAmount(resp.toAmount, e.target.value.toLowerCase() as ExchangeCurrencies));
                                });
                              getExchangeRange({ platform: "changenow", to_currency: e.target.value.toLowerCase() });
                              return handleChange(e);
                            }}
                            embeded
                          >
                            {currencies.map((c) => <option key={c[0]} value={c[0]}>{c[0].toUpperCase()}</option>)}
                          </Select>
                        )}
                        name="amount_to_receive"
                        value={values.amount_to_receive}
                        disabled={inputDisabled}
                        onChange={(e): void => {
                          setTouched({ amount_to_send: true });
                          retreiveEstimation({
                            amount: parseFloat(e.target.value),
                            amount_set_in: "to",
                            currency: values.currency,
                            callback: (est: GetExchangeEstimationResponse) => {
                              setFieldValue("amount_to_send", e.target.value ? piconeroToMonero(est.fromAmount) : 0);
                              setFieldValue("amount_set_in", "to");
                            },
                          });
                          return handleChange(e);
                        }}
                        onBlur={handleBlur}
                        placeholder={`${values.currency.toUpperCase()} Amount`}
                        error={touched.amount_to_receive ? t(errors.amount_to_receive as string) || "" : ""}
                      />
                    </Label>
                  </div>
                  <div className="mb-4 md:mb-0">
                    <Label labelClassName="md:text-right" label={t("wallet.send.destination.address")} isFormField inline>
                      <Input
                        autoComplete="off"
                        type="text"
                        name="address"
                        value={values.address}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        placeholder={t("wallet.send.destination.address") as string}
                        disabled={inputDisabled}
                        error={touched.address ? t(errors.address as string) || "" : ""}
                      />
                    </Label>
                  </div>
                  <div className="mb-4 mt-10 md:mb-0" data-qa-selector="estmated-rate">
                    <Label
                      labelClassName="md:text-right -mb-3"
                      label={(
                        <div className="flex items-center md:justify-end">
                          {t("wallet.send.estimated.rate.title")}
                          <div className="inline ml-1">
                            <Tooltip
                              content={(
                                <div className="md:w-64 text-sm normal-case text-left" data-qa-selector="exchange-rate-tooltip">
                                  {t("wallet.send.estimated.rate.tooltip")}
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
                          exchangePlatformState === ExchangePlatformState.pending ? <span><Spinner /></span> : (
                            rate ? (
                              <span>
                                1 XMR ≈
                                {" "}
                                <span className="text-green-400 inline-flex" data-qa-selector="xmr-to-btc">{rate}</span>
                                {" "}
                                {values.currency.toUpperCase()}
                              </span>
                            ) : null
                          )
                        }
                      </div>
                    </Label>
                  </div>
                  <div className="mb-4 md:mb-0" data-qa-selectort="operation-limit">
                    <Label labelClassName="md:text-right" label="Operation Limit" inline>
                      {
                        exchangePlatformState === ExchangePlatformState.pending ? <span><Spinner /></span> : (
                          rate ? (
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
                          ) : null
                        )
                      }
                    </Label>
                  </div>
                  <FormErrors errors={errors} fields={["refund_address", "rate_id"]} />
                  <div className="mt-10 flex space-x-3 flex justify-end">
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
                      disabled={!isValid || !parseFloat(wallet?.unlockedBalance || "0") || isSubmitting}
                      loading={isSubmitting}
                    >
                      {t("common.proceed")}
                    </Button>
                  </div>

                </div>
              </form>
            );
          }
          case 1: {
            return (
              <ExchangeConfirmation
                setActiveTab={setActiveTab}
                onEdit={(): void => {
                  setActiveTab(0);
                  resetForm({ values });
                }}
              />
            );
          }
          case 2: {
            return (
              <ExchangePayment
                walletId={walletId}
                onEdit={(): void => {
                  setActiveTab(0);
                  resetForm({ values });
                }}
              />
            );
          }
          default: {
            return null;
          }
        }
      }}
    </Formik>
  );
};

export default ExchangeForm;
