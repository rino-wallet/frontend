import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import {
  FetchWalletActivityResponse,
  WalletActivity,
  FetchWalletActivityThunkPayload,
  RootState,
} from "../types";
import walletsApi from "../api/wallets";
import {
  createLoadingSelector,
  generateExtraReducer,
  generateListReqParams,
} from "../utils";

export const ITEMS_PER_PAGE = 10;

export const fetchWalletActivity = createAsyncThunk<FetchWalletActivityResponse, FetchWalletActivityThunkPayload>(
  "walletActivityList/fetchWalletActivity",
  async ({ walletId, page }, { rejectWithValue }) => {
    try {
      return await walletsApi.getWalletActivity(walletId, generateListReqParams(page, ITEMS_PER_PAGE));
    } catch (err: any) {
      return rejectWithValue(err.response.data);
    }
  },
);

export interface State {
  count: number;
  pages: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
  entities: WalletActivity[];
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

const SLICE_NAME = "walletActivityList";

export const walletActivitySlice = createSlice({
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
      fetchWalletActivity,
      (data) => ({
        entities: data.results,
        count: data.count,
        pages: Math.ceil(data.count / ITEMS_PER_PAGE),
        hasPreviousPage: !!data.previous,
        hasNextPage: !!data.next,
      }),
    ),
  },
});

export const selectors = {
  getListMetaData: (state: RootState): any => ({
    count: state[SLICE_NAME].count,
    pages: state[SLICE_NAME].pages,
    hasPreviousPage: state[SLICE_NAME].hasPreviousPage,
    hasNextPage: state[SLICE_NAME].hasNextPage,
  }),
  getWalletActivity: (state: RootState): WalletActivity[] => state[SLICE_NAME].entities,
  // thunk statuses
  pendingFetchWalletActivity: createLoadingSelector(SLICE_NAME, fetchWalletActivity.pending.toString()),
};

export const {
  reset,
} = walletActivitySlice.actions;
