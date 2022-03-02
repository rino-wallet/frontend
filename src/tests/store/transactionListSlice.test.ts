import { unwrapResult } from "@reduxjs/toolkit";
import camelcaseKeys from "camelcase-keys";
import { store } from "../../store";
import { initialState, fetchWalletTransactions, reset, updateTransactionDetails, selectors } from "../../store/transactionListSlice";
import updateTransactionDetailsResponse from "../fixture/updateTransactionDetails.json";
import fetchTransactionsResponse from "../fixture/fetchTransactions.json";
import walletApi from "../../api/wallets";

jest.mock("../../api/wallets", () => {
  return {
    fetchWalletTransactions: jest.fn(),
    updateTransactionDetails: jest.fn(),
    setToken: () => {},
  }
});


describe("TransactionListSlice", () => {
  it("Has initial state", () => {
    expect(store.getState().transactionList).toEqual(initialState);
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
    expect(selectors.getTransactions(state)).toEqual(initialState.entities);
  });
  it("fetchWallets should get wallet list and update entities array", async() => {
    (walletApi.fetchWalletTransactions as any).mockResolvedValue(camelcaseKeys(fetchTransactionsResponse, { deep: true }));
    unwrapResult(await store.dispatch(fetchWalletTransactions({ walletId: "walletId", page: 1 })) as any);
    expect(store.getState().transactionList.entities.length).toEqual(12);
  });
  it("updateTransactionDetails should update the transaction and update store", async() => {
    (walletApi.updateTransactionDetails as any).mockResolvedValue(camelcaseKeys(updateTransactionDetailsResponse, { deep: true }));
    unwrapResult(await store.dispatch(updateTransactionDetails({ transactionId: "tx id", walletId: "a wallet id", memo: "memo" })) as any);
    expect(store.getState().transactionList.entities[0].memo).toEqual(updateTransactionDetailsResponse.memo);
  });
  it("reset should set the initial state", async() => {
    (walletApi.fetchWalletTransactions as any).mockResolvedValue(camelcaseKeys(fetchTransactionsResponse, { deep: true }));
    unwrapResult(await store.dispatch(fetchWalletTransactions({ walletId: "walletId", page: 1 })) as any);
    expect(store.getState().transactionList.entities.length).toEqual(12);
    store.dispatch(reset());
    expect(store.getState().transactionList.entities.length).toEqual(0);
  });
});
