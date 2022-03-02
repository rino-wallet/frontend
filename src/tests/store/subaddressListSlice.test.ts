import { unwrapResult } from "@reduxjs/toolkit";
import camelcaseKeys from "camelcase-keys";
import { store } from "../../store";
import {
  initialState,
  fetchSubaddresses,
  reset,
  selectors,
  ITEMS_PER_PAGE,
  setAddress,
  fetchWalletSubaddress,
  createSubaddress,
} from "../../store/subaddressListSlice";
import walletApi from "../../api/wallets";
import fetchSubaddressesResponse from "../fixture/fetchSubaddresses.json";
  import createSubAddressResp from "../fixture/createSubaddress.json";

jest.mock("../../api/wallets", () => {
  return {
    fetchWalletSubaddresses: jest.fn(),
    createSubaddress: jest.fn(),
    setToken: () => {},
  }
});

describe("SubaddressListSlice", () => {
  it("Has initial state", () => {
    expect(store.getState().subaddressList).toEqual(initialState);
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
    expect(selectors.getSubaddresses(state)).toEqual(initialState.entities);
  });
  it("fetchSubaddresses should get subaddresses list and update entities array", async() => {
    (walletApi.fetchWalletSubaddresses as any).mockResolvedValue(camelcaseKeys(fetchSubaddressesResponse, { deep: true }));
    unwrapResult(await store.dispatch(fetchSubaddresses({ page: 1, walletId: "pony" })) as any);
    expect((walletApi.fetchWalletSubaddresses as any).mock.calls[0][0]).toEqual("pony");
    expect((walletApi.fetchWalletSubaddresses as any).mock.calls[0][1]).toEqual({ limit: ITEMS_PER_PAGE, offset: 1 });
    expect((walletApi.fetchWalletSubaddresses as any).mock.calls.length).toEqual(1);
    expect(store.getState().subaddressList.entities.length).toEqual(ITEMS_PER_PAGE);
    expect(store.getState().subaddressList.count).toEqual(fetchSubaddressesResponse.count - 1);
    expect(store.getState().subaddressList.hasPreviousPage).toEqual(false);
    expect(store.getState().subaddressList.hasNextPage).toEqual(!!fetchSubaddressesResponse.next);
  });
    it("setAddress", async() => {
    unwrapResult(await store.dispatch(setAddress({
      address: "new address",
      index: 1,
      isUsed: false,
    })));
    expect(store.getState().subaddressList.walletSubAddress.address).toEqual("new address");
  });
  it("fetchWalletSubaddress should call api method and update wallet address", async() => {
    (walletApi.fetchWalletSubaddresses as any).mockResolvedValue(camelcaseKeys(fetchSubaddressesResponse, { deep: true }));
    unwrapResult(await store.dispatch(fetchWalletSubaddress({ walletId: "wallet.id" })) as any);
    expect((walletApi.fetchWalletSubaddresses as any).mock.calls[0][0]).toEqual("wallet.id");
    expect((walletApi.fetchWalletSubaddresses as any).mock.calls[0][1]).toEqual({ limit: 1, offset: 0 });
    expect((walletApi.fetchWalletSubaddresses as any).mock.calls.length).toEqual(1);
    expect(store.getState().subaddressList.walletSubAddress.address).toEqual(fetchSubaddressesResponse.results[0].address);
  });
  it("createSubaddress thunk calls api request with provided request body", async() => {
    (walletApi.createSubaddress as any).mockResolvedValue(camelcaseKeys(createSubAddressResp, { deep: true }));
    unwrapResult(await store.dispatch(createSubaddress({ walletId: "pony" })) as any);
    expect((walletApi.createSubaddress as any).mock.calls[0][0]).toEqual("pony");
    expect((walletApi.createSubaddress as any).mock.calls.length).toEqual(1);
    expect(store.getState().subaddressList.walletSubAddress.address).toEqual(createSubAddressResp.address);
  });
  it("reset should set the initial state", async() => {
    expect(store.getState().subaddressList.entities.length).toEqual(ITEMS_PER_PAGE);
    store.dispatch(reset());
    expect(store.getState().subaddressList.entities.length).toEqual(0);
  });
});
