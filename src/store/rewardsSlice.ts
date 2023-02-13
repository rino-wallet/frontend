import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import {
  Promotion,
  Referral,
  RootState,
} from "../types";
import rewardsApi from "../api/rewards";
import exchangeApi from "../api/exchange";
import { createLoadingSelector, generateExtraReducer } from "../utils";

const SLICE_NAME = "rewards";

export const getOwnRefferal = createAsyncThunk<any, void>(
  `${SLICE_NAME}/getOwnRefferal`,
  async (_, { rejectWithValue, dispatch }) => {
    try {
      const response = await rewardsApi.getOwnReferral();
      dispatch(setOwnReferral(response));
      return response;
    } catch (err: any) {
      // eslint-disable-next-line
      return rejectWithValue(err?.data);
    }
  },
);

export const getRefferal = createAsyncThunk<any, { id: string }>(
  `${SLICE_NAME}/getRefferal`,
  async (payload, { rejectWithValue }) => {
    try {
      const response = await rewardsApi.getReferral(payload);
      return response;
    } catch (err: any) {
      // eslint-disable-next-line
      return rejectWithValue(err?.data);
    }
  },
);

export const getReferralsStats = createAsyncThunk<any, void>(
  `${SLICE_NAME}/getReferralsStats`,
  async (_, { rejectWithValue, dispatch }) => {
    try {
      const response = await rewardsApi.getReferralsStats();
      dispatch(setReferralsStats(parseInt(response.referrerTotal, 10) + parseInt(response.refereeTotal, 10)));
      return response;
    } catch (err: any) {
      // eslint-disable-next-line
      return rejectWithValue(err?.data);
    }
  },
);

export const getPromotionsStats = createAsyncThunk<any, void>(
  `${SLICE_NAME}/getPromotionsStats`,
  async (_, { rejectWithValue, dispatch }) => {
    try {
      const response = await rewardsApi.getPromotionsStats();
      dispatch(setPromotionsStats(parseInt(response.userTotal, 10)));
      return response;
    } catch (err: any) {
      // eslint-disable-next-line
      return rejectWithValue(err?.data);
    }
  },
);

export const claimReferral = createAsyncThunk<any, { id: string, address: string }>(
  `${SLICE_NAME}/claimReferral`,
  async (payload, { rejectWithValue }) => {
    try {
      const response = await rewardsApi.claimReferral(payload.id, { address: payload.address });
      return response;
    } catch (err: any) {
      // eslint-disable-next-line
      return rejectWithValue(err?.data);
    }
  },
);

export const getOrdersStats = createAsyncThunk<any, void>(
  `${SLICE_NAME}/getOrdersStats`,
  async (_, { rejectWithValue, dispatch }) => {
    try {
      const response = await exchangeApi.getOrdersStats();
      dispatch(setUserTotal(response.userTotal));
      return response;
    } catch (err: any) {
      // eslint-disable-next-line
      return rejectWithValue(err?.data);
    }
  },
);

export const addPromotion = createAsyncThunk<any, { code: string }>(
  `${SLICE_NAME}/addPromotion`,
  async (payload, { rejectWithValue }) => {
    try {
      const response = await rewardsApi.addPromotion({ code: payload.code });
      // dispatch(setPromotions(response))
      return response;
    } catch (err: any) {
      // eslint-disable-next-line
      return rejectWithValue(err?.data);
    }
  },
);

export const claimPromotion = createAsyncThunk<any, { id: string, address: string }>(
  `${SLICE_NAME}/claimPromotion`,
  async (payload, { rejectWithValue }) => {
    try {
      const response = await rewardsApi.claimPromotion(payload.id, { address: payload.address });
      return response;
    } catch (err: any) {
      // eslint-disable-next-line
      return rejectWithValue(err?.data);
    }
  },
);

interface State {
  userTotal: number;
  ownReferral: Referral | null;
  promotionsStats: number;
  referralsStats: number;
  thunksInProgress: string[];
}

export const initialState: State = {
  userTotal: 0,
  ownReferral: null,
  promotionsStats: 0,
  referralsStats: 0,
  thunksInProgress: [],
};

export const rewardsSlice = createSlice({
  name: SLICE_NAME,
  initialState,
  reducers: {
    setUserTotal(state, action: PayloadAction<number>): void {
      state.userTotal = action.payload;
    },
    setOwnReferral(state, action: PayloadAction<Referral>): void {
      state.ownReferral = action.payload;
    },
    setPromotionsStats(state, action: PayloadAction<number>): void {
      state.promotionsStats = action.payload;
    },
    setReferralsStats(state, action: PayloadAction<number>): void {
      state.referralsStats = action.payload;
    },
    reset(state): void {
      state.userTotal = initialState.userTotal;
      state.thunksInProgress = initialState.thunksInProgress;
    },
  },
  extraReducers: {
    ...generateExtraReducer(getOwnRefferal),
    ...generateExtraReducer(getRefferal),
    ...generateExtraReducer(claimReferral),
    ...generateExtraReducer(getOrdersStats),
    ...generateExtraReducer(addPromotion),
    ...generateExtraReducer(claimPromotion),
  },
});

export const selectors = {
  // getProvisioningUri: (state: RootState): string => state[SLICE_NAME].provisioningUri,
  getUserTotal: (state: RootState): number => state[SLICE_NAME].userTotal,
  getReferrals: (state: RootState): Referral[] => state[SLICE_NAME].referrals,
  getOwnReferral: (state: RootState): Referral => state[SLICE_NAME].ownReferral,
  getPromotions: (state: RootState): Promotion[] => state[SLICE_NAME].promotions,
  getPromotionsStats: (state: RootState): number => state[SLICE_NAME].promotionsStats,
  getReferralsStats: (state: RootState): number => state[SLICE_NAME].referralsStats,
  // thunk statuses
  pendingGetOwnRefferal: createLoadingSelector(SLICE_NAME, getOwnRefferal.pending.toString()),
  pendingGetRefferal: createLoadingSelector(SLICE_NAME, getRefferal.pending.toString()),
  pendingClaimReferral: createLoadingSelector(SLICE_NAME, claimReferral.pending.toString()),
  pendingGetOrdersStats: createLoadingSelector(SLICE_NAME, getOrdersStats.pending.toString()),
  pendingAddPromotion: createLoadingSelector(SLICE_NAME, addPromotion.pending.toString()),
  pendingClaimPromotion: createLoadingSelector(SLICE_NAME, claimPromotion.pending.toString()),
};

export const {
  reset, setUserTotal, setOwnReferral, setPromotionsStats, setReferralsStats,
} = rewardsSlice.actions;
