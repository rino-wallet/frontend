import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  FetchPendingTranfersResponse,
  PendingTransfer,
  RootState,
} from "../types";
import walletsApi from "../api/wallets";
import { createLoadingSelector, generateExtraReducer, generateListReqParams } from "../utils";
import { TRANSACTION_STATUS_CODE } from "../constants";

export const ITEMS_PER_PAGE = 5;
const SLICE_NAME = "pendingTransfers";

export const fetchEntities = createAsyncThunk<FetchPendingTranfersResponse, { page: number, walletId: string }>(
  `${SLICE_NAME}/fetchPendingTransfers`,
  async ({ walletId, page }, { rejectWithValue }) => {
    try {
      return await walletsApi.fetchPendingTransfers(walletId, { ...generateListReqParams(page, ITEMS_PER_PAGE), status: TRANSACTION_STATUS_CODE.PENDING });
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
  entities: PendingTransfer[];
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

export const pendingTransfersListSlice = createSlice({
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
      fetchEntities,
      (data, state) => ({
        ...state,
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
    count: state[SLICE_NAME]?.count,
    pages: state[SLICE_NAME]?.pages,
    hasPreviousPage: state[SLICE_NAME]?.hasPreviousPage,
    hasNextPage: state[SLICE_NAME]?.hasNextPage,
  }),
  getEntities: (state: RootState): PendingTransfer[] => state[SLICE_NAME]?.entities,
  // thunk statuses
  pendingFetch: createLoadingSelector(SLICE_NAME, fetchEntities.pending.toString()),
};

export const {
  reset,
} = pendingTransfersListSlice.actions;
