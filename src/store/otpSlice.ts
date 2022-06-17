import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import {
  Create2FAResponse,
  Enable2FAResponse,
  Enable2FAPayload,
  Delete2FAPayload,
  RootState,
} from "../types";
import otpApi from "../api/otp";
import { switch2fa } from "./sessionSlice";
import { createLoadingSelector, generateExtraReducer } from "../utils";

export const create2FA = createAsyncThunk<Create2FAResponse, void>(
  "otp/create2FA",
  async (_, { rejectWithValue, dispatch }) => {
    try {
      const response = await otpApi.create2FA();
      dispatch(setProvisioningUri(response.provisioningUri));
      dispatch(setSecretKey(response.secretKey));
      return response;
    } catch (err: any) {
      // eslint-disable-next-line
      console.log("create2FA: ", err);
      return rejectWithValue(err?.data);
    }
  },
);

export const enable2FA = createAsyncThunk<Enable2FAResponse, Enable2FAPayload>(
  "otp/enable2FA",
  async (data, { rejectWithValue, dispatch }) => {
    try {
      const response = await otpApi.enable2FA(data);
      dispatch(switch2fa(true));
      return response;
    } catch (err: any) {
      return rejectWithValue(err?.data);
    }
  },
);

export const delete2FA = createAsyncThunk<void, Delete2FAPayload>(
  "otp/delete2FA",
  async (data, { rejectWithValue, dispatch }) => {
    try {
      const response = await otpApi.delete2FA(data);
      dispatch(switch2fa(false));
      return response;
    } catch (err: any) {
      return rejectWithValue(err?.data);
    }
  },
);

interface State {
  provisioningUri: string;
  secretKey: string;
  thunksInProgress: string[];
}

export const initialState: State = {
  provisioningUri: "",
  secretKey: "",
  thunksInProgress: [],
};

const SLICE_NAME = "otp";

export const otpSlice = createSlice({
  name: SLICE_NAME,
  initialState,
  reducers: {
    setProvisioningUri(state, action: PayloadAction<string>): void {
      state.provisioningUri = action.payload;
    },
    setSecretKey(state, action: PayloadAction<string>): void {
      state.secretKey = action.payload;
    },
    reset(state): void {
      state.provisioningUri = initialState.provisioningUri;
      state.secretKey = initialState.secretKey;
      state.thunksInProgress = initialState.thunksInProgress;
    },
  },
  extraReducers: {
    ...generateExtraReducer(create2FA),
    ...generateExtraReducer(enable2FA),
  },
});

export const selectors = {
  getProvisioningUri: (state: RootState): string => state[SLICE_NAME].provisioningUri,
  getSecretKey: (state: RootState): string => state[SLICE_NAME].secretKey,
  // thunk statuses
  pendingCreate2FA: createLoadingSelector(SLICE_NAME, create2FA.pending.toString()),
  pendingEnable2FA: createLoadingSelector(SLICE_NAME, enable2FA.pending.toString()),
  pendingDelete2FA: createLoadingSelector(SLICE_NAME, delete2FA.pending.toString()),
};

export const { setProvisioningUri, setSecretKey, reset } = otpSlice.actions;
