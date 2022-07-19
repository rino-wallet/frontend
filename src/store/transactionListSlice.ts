import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  FetchWalletTransactionsResponse,
  Transaction,
  FetchWalletTransactionsThunkPayload,
  RootState,
  UpdateTransactionDetailsPayload,
  UpdateTransactionDetailsResponse,
} from "../types";
import walletsApi from "../api/wallets";
import { createLoadingSelector, generateExtraReducer, generateListReqParams } from "../utils";

export const ITEMS_PER_PAGE = 10;

export const fetchWalletTransactions = createAsyncThunk<FetchWalletTransactionsResponse, FetchWalletTransactionsThunkPayload>(
  "transactionList/fetchTransactions",
  async ({ walletId, page }, { rejectWithValue }) => {
    try {
      return await walletsApi.fetchWalletTransactions(walletId, generateListReqParams(page, ITEMS_PER_PAGE));
    } catch (err: any) {
      return rejectWithValue(err.response.data);
    }
  },
);

export const updateTransactionDetails = createAsyncThunk<UpdateTransactionDetailsResponse, UpdateTransactionDetailsPayload>(
  "transactionList/updateTransactionDetails",
  async (data, { rejectWithValue, dispatch }) => {
    try {
      const response = await walletsApi.updateTransactionDetails(data);
      dispatch(updateTransactionInList(response));
      return response;
    } catch (err: any) {
      return rejectWithValue(err?.data);
    }
  },
);

export interface State {
  count: number;
  pages: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
  entities: Transaction[];
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

const SLICE_NAME = "transactionList";

export const transactionListSlice = createSlice({
  name: SLICE_NAME,
  initialState,
  reducers: {
    updateTransactionInList(state, action): void {
      state.entities = state.entities.map((transaction) => {
        if (action.payload.id === transaction.id) {
          return { ...transaction, ...action.payload };
        }
        return transaction;
      });
    },
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
      fetchWalletTransactions,
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
  getTransactions: (state: RootState): Transaction[] => state[SLICE_NAME].entities,
  // thunk statuses
  pendingFetchWalletTransactions: createLoadingSelector(SLICE_NAME, fetchWalletTransactions.pending.toString()),
  pendingUpdateTransactionDetails: createLoadingSelector(SLICE_NAME, updateTransactionDetails.pending.toString()),
};

export const {
  reset,
  updateTransactionInList,
} = transactionListSlice.actions;
