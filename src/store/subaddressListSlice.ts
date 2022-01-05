import {createSlice, createAsyncThunk} from "@reduxjs/toolkit";
import { FetchSubaddressResponse, Subaddress, FetchSubaddressesThunkPayload, RootState } from "../types";
import walletsApi from "../api/wallets";
import { createLoadingSelector, generateExtraReducer, generateListReqParams } from "../utils";

export const ITEMS_PER_PAGE = 3;

export const fetchSubaddresses = createAsyncThunk<FetchSubaddressResponse, FetchSubaddressesThunkPayload>(
  "subaddressList/fetchSubaddresses",
  async ({ page, walletId }, { rejectWithValue }) => {
    try {
      const subaddresses = await walletsApi.fetchWalletSubaddresses(walletId, generateListReqParams(page, ITEMS_PER_PAGE));
      return subaddresses;
    } catch(err) {
      return rejectWithValue(err?.data)
    }
  },
);

export interface State {
  count: number;
  pages: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
  entities: Subaddress[];
  thunksInProgress: string[];
}

export const initialState: State = {
  count: 0,
  pages: 0,
  hasPreviousPage: false,
  hasNextPage: false,
  entities: [],
  thunksInProgress: [],
};

const SLICE_NAME = "subaddressList";

export const subaddressListSlice = createSlice({
  name: SLICE_NAME,
  initialState,
  reducers: {
    reset(state): void {
      state.count = initialState.count;
      state.pages = initialState.pages;
      state.hasPreviousPage = initialState.hasPreviousPage;
      state.hasNextPage = initialState.hasNextPage;
      state.entities = initialState.entities;
      state.thunksInProgress = initialState.thunksInProgress;
    },
  },
  extraReducers: {
    ...generateExtraReducer(
      fetchSubaddresses,
      (data) => ({
        entities: data.results,
        count: data.count,
        pages: Math.ceil(data.count / ITEMS_PER_PAGE),
        hasPreviousPage: !!data.previous,
        hasNextPage: !!data.next,
      }),
    ),
  }
});

export const selectors = {
  getListMetaData: (state: RootState): any => ({
    count: state[SLICE_NAME].count,
    pages: state[SLICE_NAME].pages,
    hasPreviousPage: state[SLICE_NAME].hasPreviousPage,
    hasNextPage: state[SLICE_NAME].hasNextPage,
  }),
  getSubaddresses: (state: RootState): Subaddress[] => state[SLICE_NAME].entities,
  // thunk statuses
  pendingFetchSubaddresses: createLoadingSelector(SLICE_NAME, fetchSubaddresses.pending.toString()),
}

export const {
  reset,
} = subaddressListSlice.actions;
