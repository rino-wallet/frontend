import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import {
  RootState,
  FetchWalletMembersResponse,
  FetchWalletMembersThunkPayload,
  WalletMember,
  ListMetadata,
} from "../types";
import walletsApi from "../api/wallets";
import { createLoadingSelector, generateExtraReducer, generateListReqParams } from "../utils";

export const ITEMS_PER_PAGE = 10;
const SLICE_NAME = "walletMembersList";

export const fetchWalletMembers = createAsyncThunk<FetchWalletMembersResponse, FetchWalletMembersThunkPayload>(
  `${SLICE_NAME}/fetchWalletMembers`,
  async ({ walletId, page }, { rejectWithValue }) => {
    try {
      const response = await walletsApi.fetchWalletMembers(walletId, generateListReqParams(page, ITEMS_PER_PAGE));
      return response;
    } catch (err: any) {
      return rejectWithValue(err?.data);
    }
  },
);

export const fetchRevokedMembers = createAsyncThunk<FetchWalletMembersResponse, FetchWalletMembersThunkPayload>(
  `${SLICE_NAME}/fetchRevokedMembers`,
  async ({ walletId, page }, { rejectWithValue }) => {
    try {
      const response = await walletsApi.fetchRevokedMembers(walletId, generateListReqParams(page, ITEMS_PER_PAGE));
      return response;
    } catch (err: any) {
      return rejectWithValue(err?.data);
    }
  },
);

function transformResponse(data: FetchWalletMembersResponse) {
  return {
    entities: data.results.map((member) => {
      const { user } = member;
      const { email, ...rest } = typeof user !== "string"
        ? user
        : { email: user };

      return {
        ...member,
        user: typeof user === "string" ? user : user.email,
        ...rest,
      };
    }),
    count: data.count,
    pages: Math.ceil(data.count / ITEMS_PER_PAGE),
    hasPreviousPage: !!data.previous,
    hasNextPage: !!data.next,
  };
}

export interface State {
  count: number;
  pages: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
  entities: WalletMember[];
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

export const walletMembersListSlice = createSlice({
  name: SLICE_NAME,
  initialState,
  reducers: {
    setEntities(state, action: PayloadAction<WalletMember[]>): void {
      state.entities = action.payload;
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
    ...generateExtraReducer(fetchWalletMembers, transformResponse),
    ...generateExtraReducer(fetchRevokedMembers, transformResponse),
  },
});

export const selectors = {
  getListMetaData: (state: RootState): ListMetadata => ({
    count: state[SLICE_NAME].count,
    pages: state[SLICE_NAME].pages,
    hasPreviousPage: state[SLICE_NAME].hasPreviousPage,
    hasNextPage: state[SLICE_NAME].hasNextPage,
  }),
  getEntities: (state: RootState): WalletMember[] => state[SLICE_NAME].entities,
  // thunk statuses
  pendingFetchWalletMembers: createLoadingSelector(SLICE_NAME, fetchWalletMembers.pending.toString()),
  pendingFetchRevokedMembers: createLoadingSelector(SLICE_NAME, fetchRevokedMembers.pending.toString()),
};

export const {
  reset,
  setEntities,
} = walletMembersListSlice.actions;
