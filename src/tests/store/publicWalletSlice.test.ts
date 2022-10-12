import camelcaseKeys from "camelcase-keys";
import { unwrapResult } from "@reduxjs/toolkit";
import { store } from "../../store";
import {
  fetchWalletDetails,
  initialState,
  reset,
  selectors,
} from "../../store/publicWalletSlice";
import publicApi from "../../api/public";

jest.mock("../../api/public", () => {
  return {
    fetchPublicWalletDetails: jest.fn(),
    setToken: jest.fn(),
  }
});

describe("publicWalletSlice", () => {
  afterEach(() => {
    store.dispatch(reset());
  });
  it("Has initial state", () => {
    const state = store.getState().publicWallet;
    expect(state).toEqual(initialState);
  });
  it("Gets exchange order", async () => {
    (publicApi.fetchPublicWalletDetails as any).mockResolvedValue(camelcaseKeys({id: "wallet id"}));
    unwrapResult(await store.dispatch(fetchWalletDetails({ id: "wallet id" })) as any);
    expect(store.getState().publicWallet.data).toEqual({ id: "wallet id" })
  });
});