import camelcaseKeys from "camelcase-keys";
import { unwrapResult } from "@reduxjs/toolkit";
import { store } from "../../store";
import {
  getExchangeEstimation,
  getExchangeOrder,
  getExchangeRange,
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
});