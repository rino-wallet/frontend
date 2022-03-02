import { unwrapResult } from "@reduxjs/toolkit";
import camelcaseKeys from "camelcase-keys";
import { store } from "../../store";
import {
  initialState,
  fetchTransactionDetails,
  reset,
  updateTransactionDetails
} from "../../store/transactionDetailsSlice";
import fetchTransactionDetailsResponse from "../fixture/transactionDetails.json";
import updateTransactionDetailsResponse from "../fixture/updateTransactionDetails.json";
import walletApi from "../../api/wallets";

jest.mock("../../api/wallets", () => {
  return {
    fetchTransactionDetails: jest.fn(),
    updateTransactionDetails: jest.fn(),
    setToken: () => {},
  }
});

describe("TransactionDetailsSlice", () => {
  it("Has initial state", () => {
    const state = store.getState().transactionDetails;
    expect(state).toEqual(initialState);
  });
  it("fetchTransactionDetails should fetch the transaction and update store", async() => {
    (walletApi.fetchTransactionDetails as any).mockResolvedValue(camelcaseKeys(fetchTransactionDetailsResponse, { deep: true }));
    unwrapResult(await store.dispatch(fetchTransactionDetails({ transactionId: "a transaction id", walletId: "a wallet id" })) as any);
    expect(store.getState().transactionDetails.data.id).toEqual(fetchTransactionDetailsResponse.id);
  });
  it("reset should set the initial state", async() => {
    (walletApi.fetchTransactionDetails as any).mockResolvedValue(camelcaseKeys(fetchTransactionDetailsResponse, { deep: true }));
    unwrapResult(await store.dispatch(fetchTransactionDetails({ transactionId: "a transaction id", walletId: "a wallet id" })) as any);
    expect(store.getState().transactionDetails.data.id).toEqual(fetchTransactionDetailsResponse.id);
    store.dispatch(reset());
    expect(store.getState().transactionDetails).toEqual(initialState);
  });
  it("updateTransactionDetails should update the transaction and update store", async() => {
    (walletApi.fetchTransactionDetails as any).mockResolvedValue(camelcaseKeys(fetchTransactionDetailsResponse, { deep: true }));
    (walletApi.updateTransactionDetails as any).mockResolvedValue(camelcaseKeys(updateTransactionDetailsResponse, { deep: true }));
    unwrapResult(await store.dispatch(fetchTransactionDetails({ transactionId: "a transaction id", walletId: "a wallet id" })) as any);
    expect(store.getState().transactionDetails.data.id).toEqual(fetchTransactionDetailsResponse.id);
    unwrapResult(await store.dispatch(updateTransactionDetails({ transactionId: "a transaction id", walletId: "a wallet id", memo: "memo" })) as any);
    expect(store.getState().transactionDetails.data.memo).toEqual(updateTransactionDetailsResponse.memo);
    // Make sure destinations stay the same.
    expect(store.getState().transactionDetails.data.destinations[0].address).toEqual(
      fetchTransactionDetailsResponse.destinations[0].address
    );
  });
});
