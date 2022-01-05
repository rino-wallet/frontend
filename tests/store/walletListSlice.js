import { unwrapResult } from "@reduxjs/toolkit";
import { expect } from "chai";
import { store } from "../../src/store";
import { initialState, fetchWallets, reset, selectors, ITEMS_PER_PAGE } from "../../src/store/walletListSlice";
import walletApi from "../../src/api/wallets";
import fetchWalletsResponse from "../fixture/fetchWallets.json";

describe("WalletListSlice", () => {
  before(() => {
    store.dispatch(reset());
  })
  it("Has initial state", () => {
    expect(store.getState().walletList).to.deep.equal(initialState);
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
    expect(selectors.getWallets(state)).to.equal(initialState.entities);
  });
  it("fetchWallets should get wallet list and update entities array", async() => {
    unwrapResult(unwrapResult(await store.dispatch(fetchWallets({ page: 1 }, ))));
    expect(walletApi.fetchWallets.withArgs({ limit: ITEMS_PER_PAGE, offset: 0 }).callCount).to.equal(1);
    expect(store.getState().walletList.entities.length).to.equal(ITEMS_PER_PAGE);
    expect(store.getState().walletList.count).to.equal(fetchWalletsResponse.count);
    expect(store.getState().walletList.hasPreviousPage).to.equal(!!fetchWalletsResponse.previous);
    expect(store.getState().walletList.hasNextPage).to.equal(!!fetchWalletsResponse.next);
  });
  it("reset should set the initial state", async() => {
    unwrapResult(unwrapResult(await store.dispatch(fetchWallets({ page: 1 }))));
    expect(store.getState().walletList.entities.length).to.equal(ITEMS_PER_PAGE);
    store.dispatch(reset());
    expect(store.getState().walletList.entities.length).to.equal(0);
  });
});
