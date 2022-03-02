import { unwrapResult } from "@reduxjs/toolkit";
import camelcaseKeys from "camelcase-keys";
import { store } from "../../store";
import { initialState, fetchWallets, reset, selectors, ITEMS_PER_PAGE } from "../../store/walletListSlice";
import walletApi from "../../api/wallets";
import fetchWalletsResponse from "../fixture/fetchWallets.json";

jest.mock("../../api/wallets", () => {
  return {
    fetchWallets: jest.fn(),
    setToken: () => {},
  }
});

describe("WalletListSlice", () => {
  it("Has initial state", () => {
    expect(store.getState().walletList).toEqual(initialState);
  });
  it("Selectors returs expected data", () => {
    const state = store.getState();
    expect(selectors.getListMetaData(state))
      .toEqual({
        count: initialState.count,
        pages: initialState.pages,
        hasPreviousPage: initialState.hasPreviousPage,
        hasNextPage: initialState.hasNextPage,
      });
    expect(selectors.getWallets(state)).toEqual(initialState.entities);
  });
  it("fetchWallets should get wallet list and update entities array", async() => {
    (walletApi.fetchWallets as any).mockResolvedValue(camelcaseKeys(fetchWalletsResponse, { deep: true }));
    unwrapResult(await store.dispatch(fetchWallets({ page: 1 }) as any));
    expect((walletApi.fetchWallets as any).mock.calls[0][0]).toEqual({ limit: ITEMS_PER_PAGE, offset: 0 });
    expect((walletApi.fetchWallets as any).mock.calls.length).toEqual(1);
    expect(store.getState().walletList.entities.length).toEqual(fetchWalletsResponse.results.length);
    expect(store.getState().walletList.count).toEqual(fetchWalletsResponse.count);
    expect(store.getState().walletList.hasPreviousPage).toEqual(!!fetchWalletsResponse.previous);
    expect(store.getState().walletList.hasNextPage).toEqual(!!fetchWalletsResponse.next);
  });
  it("reset should set the initial state", async() => {
    (walletApi.fetchWallets as any).mockResolvedValue(camelcaseKeys(fetchWalletsResponse, { deep: true }));
    unwrapResult(await store.dispatch(fetchWallets({ page: 1 }) as any));
    expect(store.getState().walletList.entities.length).toEqual(fetchWalletsResponse.results.length);
    store.dispatch(reset());
    expect(store.getState().walletList.entities.length).toEqual(0);
  });
});
