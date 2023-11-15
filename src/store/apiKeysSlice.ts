import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import {
  CreateApiKeyPayload,
  CreateApiKeyResponse,
  FetchApiKeysResponse, RootState,
} from "../types";
import apiKeysApi from "../api/apiManagement";
import { generateExtraReducer, generateListReqParams } from "../utils";
import modals from "../modules/2FAModals";

export const ITEMS_PER_PAGE = 5;
const SLICE_NAME = "apiKeys";

export const fetchEntities = createAsyncThunk<FetchApiKeysResponse, { page: number }>(
  `${SLICE_NAME}/fetchApiKeys`,
  async ({ page }, { rejectWithValue }) => {
    try {
      const response = await apiKeysApi.fetchApiKeys({ ...generateListReqParams(page, ITEMS_PER_PAGE) });
      return response;
    } catch (err: any) {
      return rejectWithValue(err.response.data);
    }
  },
);

export const createEntity = createAsyncThunk<CreateApiKeyResponse, CreateApiKeyPayload>(
  `${SLICE_NAME}/createApiKey`,
  async (data: CreateApiKeyPayload, { rejectWithValue, getState }) => {
    try {
      let code = "";
      const { is2FaEnabled } = (getState() as any).session.user;

      if (is2FaEnabled) {
        code = await modals.enter2FACode();
      }

      return await apiKeysApi.createApiKey(
        data,
        code ? { headers: { "X-RINO-2FA": code } } : undefined,
      );
    } catch (err: any) {
      return rejectWithValue(err.response.data);
    }
  },
);

export const deleteEntity = createAsyncThunk<void, string>(
  `${SLICE_NAME}/deleteApiKey`,
  async (id, { rejectWithValue, getState }) => {
    try {
      let code = "";
      const user = (getState() as any).session.user;

      if (user && user.is2FaEnabled) {
        code = await modals.enter2FACode();
      }

      await apiKeysApi.deleteApiKey(
        id,
        code ? { headers: { "X-RINO-2FA": code } } : undefined,
      );
    } catch (err: any) {
      return rejectWithValue(err.response.data);
    }
  },
);

export interface State {
  entities: FetchApiKeysResponse["results"];
  count: number;
  pages: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
  thunksInProgress: string[];
}

export const initialState: State = {
  entities: [],
  count: 0,
  pages: 0,
  hasPreviousPage: false,
  hasNextPage: false,
  thunksInProgress: [],
};

export const apiKeysSlice = createSlice({
  name: SLICE_NAME,
  initialState,
  reducers: {},
  extraReducers: {
    ...generateExtraReducer(fetchEntities, (data, state) => ({
      ...state,
      entities: data.results,
      count: data.count,
      pages: Math.ceil(data.count / ITEMS_PER_PAGE),
      hasPreviousPage: !!data.previous,
      hasNextPage: !!data.next,
    })),
  },
});

export const selectors = {
  getListMetaData: (state: RootState) => ({
    count: state[SLICE_NAME]?.count,
    pages: state[SLICE_NAME]?.pages,
    hasPreviousPage: state[SLICE_NAME]?.hasPreviousPage,
    hasNextPage: state[SLICE_NAME]?.hasNextPage,
  }),

  getEntities: (state: RootState) => state[SLICE_NAME].entities,
  getState: (state: RootState) => state[SLICE_NAME],
};
