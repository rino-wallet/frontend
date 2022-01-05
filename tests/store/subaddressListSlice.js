import { unwrapResult } from "@reduxjs/toolkit";
import { expect } from "chai";
import { store } from "../../src/store";
import { initialState, fetchSubaddresses, reset, selectors, ITEMS_PER_PAGE } from "../../src/store/subaddressListSlice";
import walletApi from "../../src/api/wallets";
import fetchSubaddressesResponse from "../fixture/fetchSubaddresses.json";

describe("SubaddressListSlice", () => {
  before(() => {
    store.dispatch(reset());
  })
  it("Has initial state", () => {
    expect(store.getState().subaddressList).to.deep.equal(initialState);
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
    expect(selectors.getSubaddresses(state)).to.equal(initialState.entities);
  });
  it("fetchSubaddresses should get subaddresses list and update entities array", async() => {
    unwrapResult(unwrapResult(await store.dispatch(fetchSubaddresses({ page: 1, walletId: "pony" }, ))));
    expect(walletApi.fetchWalletSubaddresses.withArgs("pony", { limit: ITEMS_PER_PAGE, offset: 0 }).callCount).to.equal(1);
    expect(store.getState().subaddressList.entities.length).to.equal(ITEMS_PER_PAGE);
    expect(store.getState().subaddressList.count).to.equal(fetchSubaddressesResponse.count);
    expect(store.getState().subaddressList.hasPreviousPage).to.equal(!!fetchSubaddressesResponse.previous);
    expect(store.getState().subaddressList.hasNextPage).to.equal(!!fetchSubaddressesResponse.next);
  });
  it("reset should set the initial state", async() => {
    expect(walletApi.fetchWalletSubaddresses.withArgs("pony", { limit: ITEMS_PER_PAGE, offset: 0 }).callCount).to.equal(1);
    expect(store.getState().subaddressList.entities.length).to.equal(ITEMS_PER_PAGE);
    store.dispatch(reset());
    expect(store.getState().subaddressList.entities.length).to.equal(0);
  });
});
