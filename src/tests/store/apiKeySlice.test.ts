import { unwrapResult } from "@reduxjs/toolkit";
import camelcaseKeys from "camelcase-keys";
import { store } from "../../store";
import { fetchEntities, initialState, selectors, deleteEntity } from "../../store/apiKeysSlice";
import fetchApiKeysResponse from "../fixture/fetchApiKeysResponse.json";
import apiKeysApi from "../../api/apiManagement";

jest.mock("../../api/apiManagement", () => {
  return {
    fetchApiKeys: jest.fn(),
    createApiKey: jest.fn(),
    deleteApiKey: jest.fn(),
    setToken: () => {},
  }
});


describe("ApiKeyListSlice", () => {
  it("Has initial state", () => {
    expect(store.getState().apiKeys).toEqual(initialState);
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
  it("fetchEntities get list of api keys", async() => {
    (apiKeysApi.fetchApiKeys as any).mockResolvedValue(camelcaseKeys(fetchApiKeysResponse, { deep: true }));
    unwrapResult(await store.dispatch(fetchEntities({ page: 1 })) as any);
    expect(store.getState().apiKeys.entities.length).toEqual(5);
  });
  it("deleteEntity should delete specific entity", async () => {
    (apiKeysApi.deleteApiKey as any).mockResolvedValue(camelcaseKeys(fetchApiKeysResponse, { deep: true }));
    const idToDelete = "id";
    unwrapResult(await store.dispatch(deleteEntity(idToDelete)) as any);
    expect(store.getState().apiKeys.entities.length).toEqual(5);
  });
});
