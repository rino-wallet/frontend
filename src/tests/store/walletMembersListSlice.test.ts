import camelcaseKeys from "camelcase-keys";
import { unwrapResult } from "@reduxjs/toolkit";
import { store } from "../../store";
import {
  fetchWalletMembers,
  fetchRevokedMembers,
  initialState,
  reset,
  ITEMS_PER_PAGE,
} from "../../store/walletMembersListSlice";
import fetchTransactionsResponse from "../fixture/fetchTransactions.json";
import walletsApi from "../../api/wallets";

jest.mock("../../api/wallets", () => {
  return {
    fetchWalletMembers: jest.fn(),
    fetchRevokedMembers: jest.fn(),
    setToken: jest.fn(),
  }
});

describe("walletMembersListSlice", () => {
  afterEach(() => {
    store.dispatch(reset());
  });
  it("Has initial state", () => {
    const state = store.getState().walletMembersList;
    expect(state).toEqual(initialState);
  });
  it("fetchWalletMembers", async () => {
    const response = {
      results: [
        { user: "test1@gmail.com" },
        { user: "test2@gmail.com" },
        { user: "test3@gmail.com" },
        { user: "test4@gmail.com" },
      ],
    };
    (walletsApi.fetchWalletMembers as any).mockResolvedValue(response);
    unwrapResult(await store.dispatch(fetchWalletMembers({ walletId: "wallet id", page: 1 })) as any);
    expect((walletsApi.fetchWalletMembers as any).mock.calls[0][0]).toEqual("wallet id");
    expect((walletsApi.fetchWalletMembers as any).mock.calls[0][1]).toEqual({ "limit": ITEMS_PER_PAGE, "offset": 0 });
    expect(store.getState().walletMembersList.entities.length).toEqual(response.results.length);
  });
  it("fetchRevokedMembers", async () => {
    const response = {
      results: [
        { user: "test1@gmail.com" },
        { user: "test2@gmail.com" },
        { user: "test3@gmail.com" },
        { user: "test4@gmail.com" },
      ],
    };
    (walletsApi.fetchRevokedMembers as any).mockResolvedValue(response);
    unwrapResult(await store.dispatch(fetchRevokedMembers({ walletId: "wallet id", page: 1 })) as any);
    expect((walletsApi.fetchRevokedMembers as any).mock.calls[0][0]).toEqual("wallet id");
    expect((walletsApi.fetchRevokedMembers as any).mock.calls[0][1]).toEqual({ "limit": ITEMS_PER_PAGE, "offset": 0 });
    expect(store.getState().walletMembersList.entities.length).toEqual(response.results.length);
  });
});