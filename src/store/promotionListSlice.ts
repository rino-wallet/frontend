import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import {
  RootState,
  ListMetadata,
  FetchPromotionsResponse,
  Promotion,
  FetchReferralListThunkPayload,
} from "../types";
import rewardsApi from "../api/rewards";
import { createLoadingSelector, generateExtraReducer, generateListReqParams } from "../utils";

export const ITEMS_PER_PAGE = 10;
const SLICE_NAME = "promotionList";

export const getPromotions = createAsyncThunk<any, FetchReferralListThunkPayload>(
  `${SLICE_NAME}/getPromotions`,
  async ({ page }, { rejectWithValue, dispatch }) => {
    try {
      const response = await rewardsApi.getPromotions(generateListReqParams(page, ITEMS_PER_PAGE));
      dispatch(setEntities(response.results));
      dispatch(setPage(page));
      return response;
    } catch (err: any) {
      // eslint-disable-next-line
      return rejectWithValue(err?.data);
    }
  },
);

function transformResponse(data: FetchPromotionsResponse) {
  return {
    entities: data.results,
    count: data.count,
    pages: Math.ceil(data.count / ITEMS_PER_PAGE),
    hasPreviousPage: !!data.previous,
    hasNextPage: !!data.next,
  };
}

export interface State {
  page: number;
  count: number;
  pages: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
  entities: Promotion[];
  thunksInProgress: string[];
}

export const initialState: State = {
  page: 1,
  count: 0,
  pages: 0,
  hasPreviousPage: false,
  hasNextPage: false,
  entities: [],
  thunksInProgress: [],
};

export const promotionListSlice = createSlice({
  name: SLICE_NAME,
  initialState,
  reducers: {
    setEntities(state, action: PayloadAction<Promotion[]>): void {
      state.entities = action.payload;
    },
    setPage(state, action: PayloadAction<number>): void {
      state.page = action.payload;
    },
    reset(state): void {
      state.page = initialState.count;
      state.count = initialState.count;
      state.pages = initialState.pages;
      state.hasPreviousPage = initialState.hasPreviousPage;
      state.hasNextPage = initialState.hasNextPage;
      state.entities = initialState.entities;
      state.thunksInProgress = initialState.thunksInProgress;
    },
  },
  extraReducers: {
    ...generateExtraReducer(getPromotions, transformResponse),
  },
});

export const selectors = {
  getListMetaData: (state: RootState): ListMetadata => ({
    page: state[SLICE_NAME].page,
    count: state[SLICE_NAME].count,
    pages: state[SLICE_NAME].pages,
    hasPreviousPage: state[SLICE_NAME].hasPreviousPage,
    hasNextPage: state[SLICE_NAME].hasNextPage,
  }),
  getEntities: (state: RootState): Promotion[] => state[SLICE_NAME].entities,
  // thunk statuses
  pendingGetPromotions: createLoadingSelector(SLICE_NAME, getPromotions.pending.toString()),
};

export const {
  reset,
  setEntities,
  setPage,
} = promotionListSlice.actions;
