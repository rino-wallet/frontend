import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  PublicWallet,
  RootState,
  PendingTransaction,
  FetchPublicWalletDetailsResponse,
} from "../types";
import publicApi from "../api/public";
import { generateExtraReducer, createLoadingSelector } from "../utils";

const SLICE_NAME = "publicWallet";

export const fetchWalletDetails = createAsyncThunk<FetchPublicWalletDetailsResponse, { id: string }>(
  `${SLICE_NAME}/fetchWalletDetails`,
  async (data, { rejectWithValue }) => {
    try {
      const wallet = await publicApi.fetchPublicWalletDetails(data.id);
      return wallet;
    } catch (err: any) {
      return rejectWithValue(err?.data);
    }
  },
);

export interface State {
  data: PublicWallet | null;
  thunksInProgress: string[];
}

export const initialState: State = {
  data: null,
  thunksInProgress: [],
};

export const publicWalletSlice = createSlice({
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
      fetchWalletDetails,
      (data) => ({ data }),
    ),
  },
});

export const selectors = {
  getStage: (state: RootState): string => state[SLICE_NAME].stage,
  getWallet: (state: RootState): PublicWallet => state[SLICE_NAME].data,
  getPendingTransaction: (state: RootState): PendingTransaction => state[SLICE_NAME].pendingTransaction,
  // thunk statuses
  pendingFetchWalletDetails: createLoadingSelector(SLICE_NAME, fetchWalletDetails.pending.toString()),
};

export const {
  reset,
} = publicWalletSlice.actions;
