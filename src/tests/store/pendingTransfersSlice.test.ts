import { unwrapResult } from "@reduxjs/toolkit";
import camelcaseKeys from "camelcase-keys";
import { store } from "../../store";
import { fetchEntities, initialState, reset, selectors } from "../../store/pendingTransfersSlice";
import fetchPendingTranfersResponse from "../fixture/fetchPendingTranfersResponse.json";
import walletApi from "../../api/wallets";

jest.mock("../../api/wallets", () => {
  return {
    fetchPendingTransfers: jest.fn(),
    setToken: () => {},
  }
});


describe("PendingTransactionsListSlice", () => {
  it("Has initial state", () => {
    expect(store.getState().pendingTransfers).toEqual(initialState);
  });
  it("Selectors returns expected data", () => {
    const state = store.getState();
    expect(selectors.getListMetaData(state))
      .toEqual({
        count: initialState.count,
        pages: initialState.pages,
        hasPreviousPage: initialState.hasPreviousPage,
        hasNextPage: initialState.hasNextPage,
      });
      expect(selectors.getEntities(state)).toEqual(initialState.entities);
  });
  it("fetchEntities get list of pending transactions", async() => {
    (walletApi.fetchPendingTransfers as any).mockResolvedValue(camelcaseKeys(fetchPendingTranfersResponse, { deep: true }));
    unwrapResult(await store.dispatch(fetchEntities({ walletId: "walletId", page: 1 })) as any);
    expect(store.getState().pendingTransfers.entities.length).toEqual(5);
  });
  it("reset should set the initial state", async() => {
    (walletApi.fetchPendingTransfers as any).mockResolvedValue(camelcaseKeys(fetchPendingTranfersResponse, { deep: true }));
    unwrapResult(await store.dispatch(fetchEntities({ walletId: "walletId", page: 1 })) as any);
    expect(store.getState().pendingTransfers.entities.length).toEqual(5);
    store.dispatch(reset());
    expect(store.getState().pendingTransfers.entities.length).toEqual(0);
  });
});
