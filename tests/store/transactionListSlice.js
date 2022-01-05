import { unwrapResult } from "@reduxjs/toolkit";
import { expect } from "chai";
import { store } from "../../src/store";
import { initialState, fetchWalletTransactions, reset, updateTransactionDetails, selectors } from "../../src/store/transactionListSlice";
import updateTransactionDetailsResponse from "../fixture/updateTransactionDetails.json";

describe("TransactionListSlice", () => {
  before(() => {
    store.dispatch(reset());
  })
  it("Has initial state", () => {
    expect(store.getState().transactionList).to.deep.equal(initialState);
  });
  it("Selectors returs expected data", () => {
    const state = store.getState();
    expect(selectors.getListMetaData(state))
      .to.deep.equal({
        count: initialState.count,
        pages: initialState.pages,
        hasPreviousPage: initialState.hasPreviousPage,
        hasNextPage: initialState.hasNextPage,
      });
    expect(selectors.getTransactions(state)).to.equal(initialState.entities);
  });
  it("fetchWallets should get wallet list and update entities array", async() => {
    unwrapResult(await store.dispatch(fetchWalletTransactions({ id: 1 })));
    expect(store.getState().transactionList.entities.length).to.equal(7);
  });
  it("updateTransactionDetails should update the transaction and update store", async() => {
    unwrapResult(await store.dispatch(updateTransactionDetails({ transactionId: "tx id", walletId: "a wallet id", memo: "memo" })));
    expect(store.getState().transactionList.entities[0].memo).to.equal(updateTransactionDetailsResponse.memo);
  });
  it("reset should set the initial state", async() => {
    unwrapResult(await store.dispatch(fetchWalletTransactions({ id: 1 })));
    expect(store.getState().transactionList.entities.length).to.equal(7);
    store.dispatch(reset());
    expect(store.getState().transactionList.entities.length).to.equal(0);
  });
});
