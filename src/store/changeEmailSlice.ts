import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  ChangeEmailRequestPayload,
  ChangingEmailInfoPayload,
  ChangingEmailInfoResponse,
  ChangeEmailConfirmPayload,
  RootState,
  ApiError,
} from "../types";
import sessionApi from "../api/session";
import modals from "../modules/2FAModals";

import { createLoadingSelector, generateExtraReducer } from "../utils";

export const changeEmailRequest = createAsyncThunk<void, ChangeEmailRequestPayload>(
  "changeEmail/changeEmailRequest",
  async (data, { rejectWithValue, getState }) => {
    try {
      let code = "";
      const user = (getState() as any).session.user;
      if (user?.is2FaEnabled) {
        code = await modals.enter2FACode();
      }
      const response = await sessionApi.changeEmailRequest(
        data,
        code ? { headers: { "X-RINO-2FA": code } } : undefined,
      );
      return response;
    } catch (err: any) {
      return rejectWithValue(err?.data);
    }
  },
);

export const getEmailChangingInfo = createAsyncThunk<ChangingEmailInfoResponse, ChangingEmailInfoPayload>(
  "changeEmail/getEmailChangingInfo",
  async (data, { rejectWithValue }) => {
    try {
      const response = await sessionApi.getEmailChangingInfo(data);
      return response;
    } catch (err: any) {
      return rejectWithValue(err?.data);
    }
  },
);

export const confirmEmailChanging = createAsyncThunk<void, ChangeEmailConfirmPayload>(
  "changeEmail/confirmEmailChanging",
  async (data, { rejectWithValue }) => {
    try {
      const response = await sessionApi.confirmEmailChanging(data);
      return response;
    } catch (err: any) {
      return rejectWithValue(err?.data);
    }
  },
);

interface Details { token: string; newEmail: string; }

interface State {
  details: Details | null;
  succeeded: boolean;
  error: ApiError | null;
  thunksInProgress: string[];
}

export const initialState: State = {
  details: null,
  succeeded: false,
  error: null,
  thunksInProgress: [],
};

const SLICE_NAME = "changeEmail";

export const changeEmailSlice = createSlice({
  name: SLICE_NAME,
  initialState,
  reducers: {
    reset(state): void {
      state.details = initialState.details;
      state.succeeded = initialState.succeeded;
      state.error = initialState.error;
      state.thunksInProgress = initialState.thunksInProgress;
    },
  },
  extraReducers: {
    ...generateExtraReducer(changeEmailRequest),
    ...generateExtraReducer(getEmailChangingInfo, (data) => ({ details: data })),
    ...generateExtraReducer(confirmEmailChanging, () => ({ succeeded: true })),
  },
});

export const selectors = {
  getDetails: (state: RootState): Details | null => state[SLICE_NAME].details,
  getSucceeded: (state: RootState): boolean => state[SLICE_NAME].succeeded,
  getError: (state: RootState): ApiError | null => state[SLICE_NAME].error,
  // thunk statuses
  pendingChangeEmailRequest: createLoadingSelector(SLICE_NAME, changeEmailRequest.pending.toString()),
  pendingGetEmailChangingInfo: createLoadingSelector(SLICE_NAME, getEmailChangingInfo.pending.toString()),
  pendingConfirmEmailChanging: createLoadingSelector(SLICE_NAME, confirmEmailChanging.pending.toString()),
};

export const { reset } = changeEmailSlice.actions;
