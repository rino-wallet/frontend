import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import {
  FetchSubaddressResponse, Subaddress, FetchSubaddressesThunkPayload, RootState, FetchWalletSubaddressThunkPayload,
} from "../types";
import publicApi from "../api/public";
import { createLoadingSelector, generateExtraReducer, generateListReqParams } from "../utils";

export const ITEMS_PER_PAGE = 5;
const SLICE_NAME = "publicWalletSubaddressList";

export const fetchSubaddresses = createAsyncThunk<FetchSubaddressResponse, FetchSubaddressesThunkPayload>(
  `${SLICE_NAME}/fetchSubaddresses`,
  async ({ page, walletId }, { rejectWithValue }) => {
    try {
      const listReqParams = {
        offset: (page - 1) * ITEMS_PER_PAGE + 1,
        limit: ITEMS_PER_PAGE,
      };
      const subaddresses = await publicApi.fetchPublicWalletSubaddresses(walletId, listReqParams);
      return subaddresses;
    } catch (err: any) {
      return rejectWithValue(err?.data);
    }
  },
);

export const fetchWalletSubaddress = createAsyncThunk<FetchSubaddressResponse, FetchWalletSubaddressThunkPayload>(
  `${SLICE_NAME}/fetchWalletSubaddress`,
  async ({ walletId }, { rejectWithValue, dispatch }) => {
    try {
      const addresses = await publicApi.fetchPublicWalletSubaddresses(walletId, generateListReqParams(1, 1));
      if (addresses.results.length) {
        dispatch(setAddress(addresses.results[0]));
      }
      return addresses;
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
  walletSubAddress: Subaddress | null;
  entities: Subaddress[];
  validated: number[];
  thunksInProgress: string[];
}

export const initialState: State = {
  count: 0,
  pages: 0,
  hasPreviousPage: false,
  hasNextPage: false,
  walletSubAddress: null,
  entities: [],
  validated: [],
  thunksInProgress: [],
};

export const publicWalletSubaddressListSlice = createSlice({
  name: SLICE_NAME,
  initialState,
  reducers: {
    setAddress(state, action: { payload: Subaddress }): void {
      state.walletSubAddress = action.payload;
    },
    markValidAddress(state, action: PayloadAction<number>): void {
      if (!state.validated.includes(action.payload)) {
        state.validated.push(action.payload);
      }
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
      fetchSubaddresses,
      (data) => ({
        // We avoid taking first subaddress into consideration, because it is not displayed in this list.
        entities: data.results,
        count: data.count - 1,
        pages: Math.ceil((data.count - 1) / ITEMS_PER_PAGE),
        hasPreviousPage: data.results.length && data.results[0].index !== data.count - 1 && !!data.previous,
        hasNextPage: !!data.next,
      }),
    ),
    ...generateExtraReducer(fetchWalletSubaddress),
  },
});

export const selectors = {
  getWalletSubAddress: (state: RootState): Subaddress => (state[SLICE_NAME].walletSubAddress ? ({ ...state[SLICE_NAME].walletSubAddress, isValid: state[SLICE_NAME].validated.includes(state[SLICE_NAME].walletSubAddress.index) }) : null),
  getListMetaData: (state: RootState): any => ({
    count: state[SLICE_NAME].count,
    pages: state[SLICE_NAME].pages,
    hasPreviousPage: state[SLICE_NAME].hasPreviousPage,
    hasNextPage: state[SLICE_NAME].hasNextPage,
  }),
  getSubaddresses: (state: RootState): Subaddress[] => state[SLICE_NAME].entities.map((entity: Subaddress) => ({ ...entity, isValid: state[SLICE_NAME].validated.includes(entity.index) })),
  // thunk statuses
  pendingFetchSubaddresses: createLoadingSelector(SLICE_NAME, fetchSubaddresses.pending.toString()),
  pendingFetchWalletSubaddress: createLoadingSelector(SLICE_NAME, fetchWalletSubaddress.pending.toString()),
};

export const {
  reset,
  setAddress,
  markValidAddress,
} = publicWalletSubaddressListSlice.actions;
