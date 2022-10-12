import camelcaseKeys from "camelcase-keys";
import { unwrapResult } from "@reduxjs/toolkit";
import { store } from "../../store";
import {
  getExchangeEstimation,
  getExchangeOrder,
  getExchangeRange,
  getExchangeCurrencies,
  createExchangeOrder,
  initialState,
  reset,
  selectors,
} from "../../store/exchangeSlice";
import exchangeApi from "../../api/exchange";

jest.mock("../../api/exchange", () => {
  return {
    getExchangeRange: jest.fn(),
    getExchangeEstimation: jest.fn(),
    getExchangeOrder: jest.fn(),
    createExchangeOrder: jest.fn(),
    getExchangeCurrencies: jest.fn(),
    setToken: jest.fn(),
  }
});

describe("exchangeSlice", () => {
  afterEach(() => {
    store.dispatch(reset());
  });
  it("Has initial state", () => {
    const state = store.getState().exchange;
    expect(state).toEqual(initialState);
  });
  it("Gets exchange range", async () => {
    (exchangeApi.getExchangeRange as any).mockResolvedValue(camelcaseKeys({min_amount: 1, max_amount: 300}));
    unwrapResult(await store.dispatch(getExchangeRange({ platform: "changenow", to_currency: "btc" })) as any);
    expect(store.getState().exchange.range.minAmount).toEqual(1)
    expect(store.getState().exchange.range.maxAmount).toEqual(300)
  });
  it("Gets exchange estimation", async () => {
    (exchangeApi.getExchangeEstimation as any).mockResolvedValue(camelcaseKeys({from_amount: 1, to_amount: 300, rate_id: "123123", validUntil: "now"}));
    unwrapResult(await store.dispatch(getExchangeEstimation({ platform: "changenow", to_currency: "btc", amount_set_in: "from", amount: 2 })) as any);
    expect(store.getState().exchange.estimation.fromAmount).toEqual(1)
    expect(store.getState().exchange.estimation.toAmount).toEqual(300)
    expect(store.getState().exchange.estimation.rateId).toEqual("123123")
    expect(store.getState().exchange.estimation.validUntil).toEqual("now")
  });
  it("Gets exchange order", async () => {
    (exchangeApi.getExchangeOrder as any).mockResolvedValue(camelcaseKeys({id: "123222"}));
    unwrapResult(await store.dispatch(getExchangeOrder({ id: "123333" })) as any);
    expect(store.getState().exchange.order.id).toEqual("123222")
  });
  it("Create exchange order", async () => {
    (exchangeApi.createExchangeOrder as any).mockResolvedValue({ id: "1" });
    unwrapResult(await store.dispatch(createExchangeOrder({
      to_currency: "BTC",
      platform: "exchange_now",
      wallet: "wallet id",
      amount_set_in: "from",
      amount: 1,
      address: "address",
      refund_address: "refund_address",
      rate_id: "0.1"
    })) as any);
    expect(store.getState().exchange.order.id).toEqual("1")
  });
  it("Get exchange currencies", async () => {
    const response = [["xmr", "Monero"], ["btc", "Bitcoin"], ["eth", "Ethereum"], ["sol", "Solana"], ["ada", "Cardano"], ["usdt", "Tether"], ["usdc", "USD Coin"], ["bnb", "Binance Coin"], ["xrp", "Ripple"], ["doge", "Dogecoin"], ["dot", "Polkadot"]];
    (exchangeApi.getExchangeCurrencies as any).mockResolvedValue(response);
    unwrapResult(await store.dispatch(getExchangeCurrencies()) as any);
    expect(store.getState().exchange.currencies.length).toEqual(response.filter((c) => c[0] !== "xmr").length);
  });
});