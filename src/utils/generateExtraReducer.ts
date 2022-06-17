import { PayloadAction, AsyncThunk } from "@reduxjs/toolkit";
import { RootState } from "../types";

/**
   * This function generates set of extra reducers for a given thunk.
   * @param {object} thunk - thunk created with help of `createAsyncThunk`.
   * @param {function} transformResponse - a callback to transform returned thunk data
   * @returns {object} reducers that will handle thunk actions based on state of the promise pending/fulfilled/rejected.
   */
export function generateExtraReducer<ThunkReturned, ThunkArg, TransformedResponse>(
  thunk: AsyncThunk<ThunkReturned, ThunkArg, Record<string, unknown>>,
  transformResponse?: (data: ThunkReturned, stateData?: any) => TransformedResponse,
): any {
  const actionType = thunk.pending.toString();
  return {
    [thunk.pending.toString()]: (state: any): void => {
      if (state.thunksInProgress) {
        state.thunksInProgress.push(actionType);
      }
    },
    [thunk.fulfilled.toString()]: (state: any, action: PayloadAction<ThunkReturned>): void => {
      if (typeof transformResponse === "function") {
        const response = transformResponse(action.payload, state);
        Object.entries(response).forEach(([key, value]) => {
          state[key] = value;
        });
      }
      state.thunksInProgress = (state.thunksInProgress || []).filter((type: string) => type !== actionType);
    },
    [thunk.rejected.toString()]: (state: any, action: PayloadAction<Record<string, string>>): void => {
      state.thunksInProgress = (state.thunksInProgress || []).filter((type: string) => type !== actionType);
      if (state.error !== undefined) {
        state.error = action.payload;
      }
    },
  };
}

export const createLoadingSelector = (slice: string, type: string) => (state: RootState): boolean => state[slice].thunksInProgress.includes(type);
