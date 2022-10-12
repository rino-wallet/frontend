import camelcaseKeys from "camelcase-keys";
import { unwrapResult } from "@reduxjs/toolkit";
import { store } from "../../store";
import {
  fetchWalletSubaddress,
  fetchSubaddresses,
  initialState,
  reset,
  ITEMS_PER_PAGE,
  selectors,
} from "../../store/publicWalletSubaddressListSlice";
import fetchSubaddressesResponse from "../fixture/fetchSubaddresses.json";
import publicApi from "../../api/public";

jest.mock("../../api/public", () => {
  return {
    fetchPublicWalletSubaddresses: jest.fn(),
    setToken: jest.fn(),
  }
});

describe("publicWalletSubaddressListSlice", () => {
  afterEach(() => {
    store.dispatch(reset());
  });
  it("Has initial state", () => {
    const state = store.getState().publicWalletSubaddressList;
    expect(state).toEqual(initialState);
  });
  it("fetchSubaddresses", async () => {
    (publicApi.fetchPublicWalletSubaddresses as any).mockResolvedValue(camelcaseKeys(fetchSubaddressesResponse, { deep: true }));
    unwrapResult(await store.dispatch(fetchSubaddresses({ walletId: "wallet id", page: 1 })) as any);
    expect((publicApi.fetchPublicWalletSubaddresses as any).mock.calls[0][0]).toEqual("wallet id");
    expect((publicApi.fetchPublicWalletSubaddresses as any).mock.calls[0][1]).toEqual({ "limit": ITEMS_PER_PAGE, "offset": 1 });
    expect(store.getState().publicWalletSubaddressList.entities.length).toEqual(ITEMS_PER_PAGE);
  });
  it("fetchWalletSubaddress", async () => {
    (publicApi.fetchPublicWalletSubaddresses as any).mockResolvedValue(camelcaseKeys(fetchSubaddressesResponse, { deep: true }));
    unwrapResult(await store.dispatch(fetchWalletSubaddress({ walletId: "wallet id" })) as any);
    expect((publicApi.fetchPublicWalletSubaddresses as any).mock.calls[0][0]).toEqual("wallet id");
    expect((publicApi.fetchPublicWalletSubaddresses as any).mock.calls[0][1]).toEqual({ "limit": 1, "offset": 0 });
    expect(store.getState().publicWalletSubaddressList.walletSubAddress).toEqual(camelcaseKeys(fetchSubaddressesResponse.results[0]));
  });
});