import { unwrapResult } from "@reduxjs/toolkit";
import { expect } from "chai";
import { store } from "../../src/store";
import {
  initialState,
  fetchTransactionDetails,
  reset,
  updateTransactionDetails
} from "../../src/store/transactionDetailsSlice";
import fetchTransactionDetailsResponse from "../fixture/transactionDetails.json";
import updateTransactionDetailsResponse from "../fixture/updateTransactionDetails.json";

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
  it("updateTransactionDetails should update the transaction and update store", async() => {
    unwrapResult(await store.dispatch(fetchTransactionDetails({ id: "a transaction id" })));
    expect(store.getState().transactionDetails.data.id).to.equal(fetchTransactionDetailsResponse.id);
    unwrapResult(await store.dispatch(updateTransactionDetails({ transactionId: "a transaction id", walletId: "a wallet id", memo: "memo" })));
    expect(store.getState().transactionDetails.data.memo).to.equal(updateTransactionDetailsResponse.memo);
    // Make sure destinations stay the same.
    expect(store.getState().transactionDetails.data.destinations[0].address).to.equal(
      fetchTransactionDetailsResponse.destinations[0].address
    );
  });
});
