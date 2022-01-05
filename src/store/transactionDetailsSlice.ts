import {createSlice, createAsyncThunk} from "@reduxjs/toolkit";
import { FetchTransactionDetailsResponse, FetchTransactionDetailsPayload, Transaction, RootState } from "../types";
import walletsApi from "../api/wallets";
import { createLoadingSelector, generateExtraReducer } from "../utils";


export const fetchTransactionDetails = createAsyncThunk<FetchTransactionDetailsResponse, FetchTransactionDetailsPayload>(
  "transactionDetails/fetchTransactionDetails",
  async (data, { rejectWithValue }) => {
    try {
      const transaction = await walletsApi.fetchTransactionDetails(data);
      return transaction;
    } catch(err) {
      return rejectWithValue(err?.data)
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
  }
});

export const selectors = {
  getTransaction: (state: RootState): Transaction => state[SLICE_NAME].data,
  // thunk statuses
  pendingFetchTransactionDetails: createLoadingSelector(SLICE_NAME, fetchTransactionDetails.pending.toString()),
}

export const {
  reset,
} = transactionDetailsSlice.actions;
