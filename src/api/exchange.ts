import { AxiosRequestConfig } from "axios";
import MockAdapter from "axios-mock-adapter";
import camelcaseKeys from "camelcase-keys";
import {
  CreateExchangeOrderPayload,
  ExchangeOrder,
  GetExchangeEstimationPayload,
  GetExchangeEstimationResponse,
  GetExchangeOrderPayload,
  GetExchangeRangePayload,
  GetExchangeRangeResponse,
} from "../types";
import { Api } from "../axios/api";
import { apiConfig } from "./config";

export class ExchangeApi extends Api {
  constructor(config: AxiosRequestConfig) {
    super(config);
  }

  public getExchangeRange(data: GetExchangeRangePayload): Promise<GetExchangeRangeResponse> {
    return this.get<GetExchangeRangeResponse>("/exchange/orders/range/", { params: data })
      .then(this.success);
  }

  public getExchangeEstimation(data: GetExchangeEstimationPayload): Promise<GetExchangeEstimationResponse> {
    return this.get<GetExchangeEstimationResponse>("/exchange/orders/estimation/", { params: data })
      .then(this.success);
  }

  public getExchangeOrder(data: GetExchangeOrderPayload): Promise<ExchangeOrder> {
    return this.get<ExchangeOrder>(`/exchange/orders/${data.id}/`)
      .then(this.success);
  }

  public createExchangeOrder(data: CreateExchangeOrderPayload): Promise<ExchangeOrder> {
    return this.post<ExchangeOrder, CreateExchangeOrderPayload>("/exchange/orders/", data)
      .then(this.success);
  }

  public getExchangeCurrencies(): Promise<any> {
    return this.get<any>("/exchange/orders/currencies/")
      .then(this.success);
  }
}

const exchangeApi = new ExchangeApi(apiConfig);

if (process.env.REACT_APP_ENABLE_API_MOCKS === "true") {
  const axiosMockAdapterInstance = new MockAdapter(exchangeApi.axios, { delayResponse: 1000 });

  axiosMockAdapterInstance
    // eslint-disable-next-line
    .onGet(new RegExp("/exchange/orders/currencies/"))
    .reply(() => [201, [["xmr", "Monero"], ["btc", "Bitcoin"], ["eth", "Ethereum"], ["sol", "Solana"], ["ada", "Cardano"], ["usdt", "Tether"], ["usdc", "USD Coin"], ["bnb", "Binance Coin"], ["xrp", "Ripple"], ["doge", "Dogecoin"], ["dot", "Polkadot"]],
    ]);

  axiosMockAdapterInstance
    .onGet("/exchange/orders/range/")
    .reply(() => ([200, camelcaseKeys({ max_amount: "162393500900000", min_amount: "31822200000" })]));

  axiosMockAdapterInstance
    .onGet("/exchange/orders/estimation/")
    .reply(() => ([200, camelcaseKeys({
      from_amount: "1000000000000",
      to_amount: "607986",
      rate_id: "qoGq1g5NFnYkOCRity2YXaYJY5jEFuSf",
      valid_until: new Date(Date.now() + 15 * 60000).toISOString(),
    })]));

  axiosMockAdapterInstance
    // eslint-disable-next-line
    .onGet(new RegExp("/exchange/orders/*/"))
    .reply(() => [201, camelcaseKeys({
      id: "415b1b76-45f8-4949-9322-f0247a4b4cfc",
      created_by: "test@test.com",
      paid_with: "d0bb4e25-1f7a-435d-84e2-97f578bb342e",
      status: "Pending Payment",
      created_at: "2022-06-09T08:40:03.856265Z",
      updated_at: "2022-06-09T08:40:03.856288Z",
      expires_at: new Date(Date.now() + 15 * 60000).toISOString(),
      platform: "changenow",
      platform_order_id: "02bf6525959607",
      payment_currency: "xmr",
      payment_amount: "31000000000",
      payment_address: "8A4Z6Zp49K9EYLh9ttcQ9Mi9TFmvt6jdz489Ev3ZZrhJ4gKSLkRyvsu7D8HVcWYPPaAym7bzkm2wuVGZZWhLE9S4CsJkwhX",
      payment_txid: "",
      refund_address: "83kKJrCZGX77iucHbouep93bxaPW7RASiHgKcBzs3bRKLPwpHCE2eXzYkTTtjNUYh64carvFKCwyjXuoa5YCeR3zSFmimRh",
      paid_at: null,
      acknowledged_at: null,
      outgoing_currency: "btc",
      outgoing_amount: "17468",
      outgoing_address: "bc1qq54n8a7dat3288gyjuhc94we2x07hn8gpjjenf",
      outgoing_txid: "",
    })]);

  axiosMockAdapterInstance
    // eslint-disable-next-line
    .onPost(new RegExp("/exchange/orders/"))
    .reply(() => [201, camelcaseKeys({
      id: "415b1b76-45f8-4949-9322-f0247a4b4cfc",
      created_by: "test@test.com",
      paid_with: "d0bb4e25-1f7a-435d-84e2-97f578bb342e",
      status: "Pending Payment",
      created_at: "2022-06-09T08:40:03.856265Z",
      updated_at: "2022-06-09T08:40:03.856288Z",
      expires_at: new Date(Date.now() + 15 * 60000).toISOString(),
      platform: "changenow",
      platform_order_id: "02bf6525959607",
      payment_currency: "xmr",
      payment_amount: "31000000000",
      payment_address: "8A4Z6Zp49K9EYLh9ttcQ9Mi9TFmvt6jdz489Ev3ZZrhJ4gKSLkRyvsu7D8HVcWYPPaAym7bzkm2wuVGZZWhLE9S4CsJkwhX",
      payment_txid: "",
      refund_address: "83kKJrCZGX77iucHbouep93bxaPW7RASiHgKcBzs3bRKLPwpHCE2eXzYkTTtjNUYh64carvFKCwyjXuoa5YCeR3zSFmimRh",
      paid_at: null,
      acknowledged_at: null,
      outgoing_currency: "btc",
      outgoing_amount: "17468",
      outgoing_address: "bc1qq54n8a7dat3288gyjuhc94we2x07hn8gpjjenf",
      outgoing_txid: "",
    })]);
}

export default exchangeApi;
