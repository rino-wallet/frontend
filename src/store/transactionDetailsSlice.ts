import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  FetchTransactionDetailsPayload,
  FetchTransactionDetailsResponse,
  RootState,
  Transaction,
  UpdateTransactionDetailsPayload,
  UpdateTransactionDetailsResponse,
} from "../types";
import walletsApi from "../api/wallets";
import { createLoadingSelector, generateExtraReducer } from "../utils";

export const fetchTransactionDetails = createAsyncThunk<FetchTransactionDetailsResponse, FetchTransactionDetailsPayload>(
  "transactionDetails/fetchTransactionDetails",
  async (data, { rejectWithValue }) => {
    try {
      return await walletsApi.fetchTransactionDetails(data);
    } catch (err: any) {
      return rejectWithValue(err?.data);
    }
  },
);

export const updateTransactionDetails = createAsyncThunk<UpdateTransactionDetailsResponse, UpdateTransactionDetailsPayload>(
  "wallet/updateTransactionDetails",
  async (data, { rejectWithValue }) => {
    try {
      return await walletsApi.updateTransactionDetails(data);
    } catch (err: any) {
      return rejectWithValue(err?.data);
    }
  },
);

export interface ITransactionDetailsState {
  data: Transaction | null;
  thunksInProgress: string[];
}

export const initialState: ITransactionDetailsState = {
  data: null,
  thunksInProgress: [],
};

const SLICE_NAME = "transactionDetails";

export const transactionDetailsSlice = createSlice({
  name: SLICE_NAME,
  initialState,
  reducers: {
    reset(state): void {
      state.data = initialState.data;
      state.thunksInProgress = initialState.thunksInProgress;
    },
  },
  extraReducers: {
    ...generateExtraReducer(
      fetchTransactionDetails,
      (data) => ({ data }),
    ),
    ...generateExtraReducer(
      updateTransactionDetails,
      (data, stateData) => ({ data: { ...stateData.data, memo: data.memo } }),
    ),

  },
});

export const selectors = {
  getTransaction: (state: RootState): Transaction => state[SLICE_NAME].data,
  // thunk statuses
  pendingFetchTransactionDetails: createLoadingSelector(SLICE_NAME, fetchTransactionDetails.pending.toString()),
  pendingUpdateTransactionDetails: createLoadingSelector(SLICE_NAME, updateTransactionDetails.pending.toString()),
};

export const {
  reset,
} = transactionDetailsSlice.actions;
