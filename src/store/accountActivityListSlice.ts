import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import {
  FetchAccountActivityResponse,
  AccountActivity,
  FetchAccountActivityThunkPayload,
  RootState,
} from "../types";
import sessionApi from "../api/session";
import {
  createLoadingSelector,
  generateExtraReducer,
  generateListReqParams,
} from "../utils";

export const ITEMS_PER_PAGE = 10;

export const fetchAccountActivity = createAsyncThunk<FetchAccountActivityResponse, FetchAccountActivityThunkPayload>(
  "accountActivityList/fetchAccountActivity",
  async ({ page }, { rejectWithValue }) => {
    try {
      return await sessionApi.getAccountActivity(generateListReqParams(page, ITEMS_PER_PAGE));
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
  entities: AccountActivity[];
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

const SLICE_NAME = "accountActivityList";

export const accountActivitySlice = createSlice({
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
      fetchAccountActivity,
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
  getAccountActivity: (state: RootState): AccountActivity[] => state[SLICE_NAME].entities,
  // thunk statuses
  pendingFetchAccountActivity: createLoadingSelector(SLICE_NAME, fetchAccountActivity.pending.toString()),
};

export const {
  reset,
} = accountActivitySlice.actions;
