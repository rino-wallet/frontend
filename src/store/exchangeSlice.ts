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
  CurrenciesList,
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

export const getExchangeCurrencies = createAsyncThunk<any>(
  `${SLICE_NAME}/getExchangeCurrencies`,
  async (data, { rejectWithValue, dispatch }) => {
    try {
      const response = await exchangeApi.getExchangeCurrencies();
      dispatch(setCurrencies(response.filter((c: [string, string]) => c[0] !== "xmr")));
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
      return rejectWithValue(err);
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
  currencies: CurrenciesList;
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
  currencies: [],
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
    setCurrencies(state, action: PayloadAction<CurrenciesList>): void {
      state.currencies = action.payload;
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
  getCurrencies: (state: RootState): CurrenciesList => state[SLICE_NAME].currencies,
  // thunk statuses
  pendingGetExchangeRange: createLoadingSelector(SLICE_NAME, getExchangeRange.pending.toString()),
  pendingGetExchangeEstimation: createLoadingSelector(SLICE_NAME, getExchangeEstimation.pending.toString()),
  pendingGetExchangeOrder: createLoadingSelector(SLICE_NAME, getExchangeRange.pending.toString()),
};

export const {
  setRange,
  setEstimation,
  setOrderData,
  setCurrencies,
  reset,
} = exchangeSlice.actions;
