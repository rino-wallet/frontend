import {createSlice, createAsyncThunk} from "@reduxjs/toolkit";
import { FetchWalletsResponse, Wallet, FetchWalletListThunkPayload, RootState } from "../types";
import walletsApi from "../api/wallets";
import { createLoadingSelector, generateExtraReducer, generateListReqParams } from "../utils";

export const ITEMS_PER_PAGE = 5;

export const fetchWallets = createAsyncThunk<FetchWalletsResponse, FetchWalletListThunkPayload>(
  "walletList/fetchWallets",
  async ({ page }, { rejectWithValue }) => {
    try {
      const wallets = await walletsApi.fetchWallets(generateListReqParams(page, ITEMS_PER_PAGE));
      return wallets;
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
  entities: Wallet[];
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

const SLICE_NAME = "walletList";

export const walletListSlice = createSlice({
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
      fetchWallets,
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
  getWallets: (state: RootState): Wallet[] => state[SLICE_NAME].entities,
  // thunk statuses
  pendingFetchWallets: createLoadingSelector(SLICE_NAME, fetchWallets.pending.toString()),
}

export const {
  reset,
} = walletListSlice.actions;
