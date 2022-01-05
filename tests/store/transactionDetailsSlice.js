import { unwrapResult } from "@reduxjs/toolkit";
import { expect } from "chai";
import { store } from "../../src/store";
import { initialState, fetchTransactionDetails, reset } from "../../src/store/transactionDetailsSlice";
import fetchTransactionDetailsResponse from "../fixture/transactionDetails.json";

describe("TransactionDetailsSlice", () => {
  before(async() => {
    store.dispatch(reset());
  });
  it("Has initial state", () => {
    const state = store.getState().transactionDetails;
    expect(state).to.deep.equal(initialState);
  });
  it("fetchTransactionDetails should fetch the transaction and update store", async() => {
    unwrapResult(await store.dispatch(fetchTransactionDetails({ transactionId: "a transaction id", walletId: "a wallet id" })));
    expect(store.getState().transactionDetails.data.id).to.equal(fetchTransactionDetailsResponse.id);
  });
  it("reset should set the initial state", async() => {
    unwrapResult(await store.dispatch(fetchTransactionDetails({ id: "a transaction id" })));
    expect(store.getState().transactionDetails.data.id).to.equal(fetchTransactionDetailsResponse.id);
    store.dispatch(reset());
    expect(store.getState().transactionDetails).to.deep.equal(initialState);
  });
});
