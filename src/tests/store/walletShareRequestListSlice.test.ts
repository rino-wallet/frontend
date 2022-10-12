import camelcaseKeys from "camelcase-keys";
import { unwrapResult } from "@reduxjs/toolkit";
import { store } from "../../store";
import {
  fetchWalletShareRequests,
  initialState,
  reset,
  ITEMS_PER_PAGE,
} from "../../store/walletShareRequestListSlice";
import fetchTransactionsResponse from "../fixture/fetchTransactions.json";
import walletsApi from "../../api/wallets";

jest.mock("../../api/wallets", () => {
  return {
    fetchWalletShareRequests: jest.fn(),
    setToken: jest.fn(),
  }
});

describe("walletShareRequestListSlice", () => {
  afterEach(() => {
    store.dispatch(reset());
  });
  it("Has initial state", () => {
    const state = store.getState().walletShareRequestList;
    expect(state).toEqual(initialState);
  });
  it("fetchWalletShareRequests", async () => {
    const response = {
      results: [{
        id: "1",
        wallet: "wallet",
        email: "new@test.com",
        isAccepted: false,
        accessLevel: "Admin",
      }],
    };
    (walletsApi.fetchWalletShareRequests as any).mockResolvedValue(response);
    unwrapResult(await store.dispatch(fetchWalletShareRequests({ walletId: "wallet id", page: 1 })) as any);
    expect((walletsApi.fetchWalletShareRequests as any).mock.calls[0][0]).toEqual("wallet id");
    expect((walletsApi.fetchWalletShareRequests as any).mock.calls[0][1]).toEqual({ "limit": ITEMS_PER_PAGE, "offset": 0 });
    expect(store.getState().walletShareRequestList.entities.length).toEqual(response.results.length);
  });
});