import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { createLoadingSelector, generateExtraReducer } from "../utils";
import {
  ExchangeOrder,
  CreateExchangeOrderPayload,
  GetExchangeOrderResponse,
  GetExchangeEstimationResponse,
  GetExchangeRangeResponse,
  RootState,
  GetExchangeEstimationPayload,
} from "../types";
import exchangeApi from "../api/exchange";

const SLICE_NAME = "exchange";

export const getExchangeRange = createAsyncThunk<GetExchangeRangeResponse, { platform: string, to_currency: string }>(
  `${SLICE_NAME}/getExchangeRange`,
  async (data, { rejectWithValue, dispatch }) => {
    try {
      const response = await exchangeApi.getExchangeRange(data);
      dispatch(setRange(response));
      return response;
    } catch (err: any) {
      return rejectWithValue(err?.data);
    }
  },
);

export const getExchangeEstimation = createAsyncThunk<GetExchangeEstimationResponse, GetExchangeEstimationPayload>(
  `${SLICE_NAME}/getExchangeEstimation`,
  async (data, { rejectWithValue, dispatch }) => {
    try {
      const response = await exchangeApi.getExchangeEstimation(data);
      dispatch(setEstimation(response));
      return response;
    } catch (err: any) {
      return rejectWithValue(err?.data);
    }
  },
);

export const getExchangeOrder = createAsyncThunk<GetExchangeOrderResponse, { id: string }>(
  `${SLICE_NAME}/getExchangeOrder`,
  async (data, { rejectWithValue, dispatch }) => {
    try {
      const response = await exchangeApi.getExchangeOrder(data);
      dispatch(setOrderData(response));
      return response;
    } catch (err: any) {
      return rejectWithValue(err?.data);
    }
  },
);

export const createExchangeOrder = createAsyncThunk<GetExchangeOrderResponse, CreateExchangeOrderPayload>(
  `${SLICE_NAME}/createExchangeOrder`,
  async (data, { rejectWithValue, dispatch }) => {
    try {
      const response = await exchangeApi.createExchangeOrder(data);
      dispatch(setOrderData(response));
      return response;
    } catch (err: any) {
      return rejectWithValue(err?.data);
    }
  },
);

export interface State {
  range: {
    minAmount?: number;
    maxAmount?: number;
  },
  estimation?: {
    fromAmount?: number;
    toAmount?: number;
    rateId?: string;
    validUntil?: string;
  },
  orderId?: string;
  order?: ExchangeOrder;
  thunksInProgress: string[];
}

export const initialState: State = {
  range: {},
  estimation: {},
  order: undefined,
  orderId: undefined,
  thunksInProgress: [],
};

export const exchangeSlice = createSlice({
  name: SLICE_NAME,
  initialState,
  reducers: {
    setRange(state, action: PayloadAction<{ minAmount: number, maxAmount: number }>): void {
      state.range = action.payload;
    },
    setEstimation(state, action: PayloadAction<{ fromAmount: number, toAmount: number, rateId: string, validUntil: string }>): void {
      state.estimation = action.payload;
    },
    setOrderData(state, action: PayloadAction<ExchangeOrder>): void {
      state.order = action.payload;
    },
    reset(state): void {
      state.range = {};
      state.estimation = {};
    },
  },
  extraReducers: {
    ...generateExtraReducer(
      getExchangeRange,
    ),
    ...generateExtraReducer(getExchangeEstimation),
    ...generateExtraReducer(getExchangeOrder),
  },
});

export const selectors = {
  getExchangeRange: (state: RootState): { minAmount: number, maxAmount: number } => state[SLICE_NAME].range,
  getExchangeEstimation: (state: RootState): { fromAmount: number, toAmount: number, rateId: string, validUntil: string } => state[SLICE_NAME].estimation,
  getExchangeOrder: (state: RootState): ExchangeOrder => state[SLICE_NAME].order,
  // thunk statuses
  pendingGetExchangeRange: createLoadingSelector(SLICE_NAME, getExchangeRange.pending.toString()),
  pendingGetExchangeEstimation: createLoadingSelector(SLICE_NAME, getExchangeEstimation.pending.toString()),
  pendingGetExchangeOrder: createLoadingSelector(SLICE_NAME, getExchangeRange.pending.toString()),
};

export const {
  setRange,
  setEstimation,
  setOrderData,
  reset,
} = exchangeSlice.actions;
