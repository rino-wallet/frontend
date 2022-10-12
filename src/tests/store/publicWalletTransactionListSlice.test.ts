import camelcaseKeys from "camelcase-keys";
import { unwrapResult } from "@reduxjs/toolkit";
import { store } from "../../store";
import {
  fetchWalletTransactions,
  initialState,
  reset,
  ITEMS_PER_PAGE,
} from "../../store/publicWalletTransactionListSlice";
import fetchTransactionsResponse from "../fixture/fetchTransactions.json";
import publicApi from "../../api/public";

jest.mock("../../api/public", () => {
  return {
    fetchPublicWalletTransactions: jest.fn(),
    setToken: jest.fn(),
  }
});

describe("publicWalletTransactionListSlice", () => {
  afterEach(() => {
    store.dispatch(reset());
  });
  it("Has initial state", () => {
    const state = store.getState().publicWalletTransactionList;
    expect(state).toEqual(initialState);
  });
  it("fetchWalletTransactions", async () => {
    const response = { ...fetchTransactionsResponse, results: fetchTransactionsResponse.results.slice(0, ITEMS_PER_PAGE) };
    (publicApi.fetchPublicWalletTransactions as any).mockResolvedValue(camelcaseKeys(response, { deep: true }));
    unwrapResult(await store.dispatch(fetchWalletTransactions({ walletId: "wallet id", page: 1 })) as any);
    expect((publicApi.fetchPublicWalletTransactions as any).mock.calls[0][0]).toEqual("wallet id");
    expect((publicApi.fetchPublicWalletTransactions as any).mock.calls[0][1]).toEqual({ "limit": ITEMS_PER_PAGE, "offset": 0 });
    expect(store.getState().publicWalletTransactionList.entities.length).toEqual(response.results.length);
  });
});