import {createSlice, createAsyncThunk, PayloadAction} from "@reduxjs/toolkit";
import { FetchSubaddressResponse, Subaddress, FetchSubaddressesThunkPayload, RootState, CreateSubaddressThunkPayload, FetchWalletSubaddressThunkPayload, UpdateSubaddressThunkPayload, SubaddressResponse } from "../types";
import walletsApi from "../api/wallets";
import walletInstance from "../wallet";
import { createLoadingSelector, generateExtraReducer, generateListReqParams, deriveUserKeys, signMessage, verifySignature } from "../utils";

export const ITEMS_PER_PAGE = 5;
const SLICE_NAME = "subaddressList";

export const fetchSubaddresses = createAsyncThunk<FetchSubaddressResponse, FetchSubaddressesThunkPayload>(
  `${SLICE_NAME}/fetchSubaddresses`,
  async ({ page, walletId }, { rejectWithValue, dispatch, getState }) => {
    try {
      const { signingPublicKey } = (getState() as any).session;
      const listReqParams = {
        offset: (page - 1) * ITEMS_PER_PAGE + 1,
        limit: ITEMS_PER_PAGE,
      }
      const response = await walletsApi.fetchWalletSubaddresses(walletId, listReqParams);
      // verify signatures of all sub addresses
      response.results.forEach((subaddress: Subaddress) => {
        if (subaddress.signature) {
          const verified = verifySignature(Buffer.from(subaddress.signature, "base64"), subaddress.address, Buffer.from(signingPublicKey, "base64"));
          if (verified) {
            dispatch(markValidAddress(subaddress.index));
          }
        }
      });
      dispatch(setAddresses(response));
      return response;
    } catch(err: any) {
      return rejectWithValue(err?.data)
    }
  },
);

export const validateSubAddress = createAsyncThunk<void, {walletId: string; address: string; index: number; loginPassword: string}>(
  `${SLICE_NAME}/validateSubAddress`,
  async (data, { rejectWithValue, dispatch, getState }) => {
    try {
      const { userWallet } = walletInstance;
      const subAddress = await userWallet?.getSubaddresses(data.index);
      const isValid = subAddress[0].state.address === data.address;
      if (isValid) {
        dispatch(markValidAddress(data.index));
        const { encPrivateKey, username } = (getState() as any).session.user;
        const { encryptionKey, clean: cleanDerivedKeys } = await deriveUserKeys(data.loginPassword, username);
        const signature = Buffer.from(await signMessage(encPrivateKey, encryptionKey, data.address)).toString("base64");
        cleanDerivedKeys();
        await walletsApi.addSubaddressSignature(data.walletId, data.address, { signature });
      }
      walletInstance.closeWallet();
      return;
    } catch(err: any) {
      console.log(err);
      return rejectWithValue(err?.data)
    }
  },
);

export const fetchWalletSubaddress = createAsyncThunk<FetchSubaddressResponse, FetchWalletSubaddressThunkPayload>(
  `${SLICE_NAME}/fetchWalletSubaddress`,
  async ({ walletId }, { rejectWithValue, dispatch, getState }) => {
    try {
      const { signingPublicKey } = (getState() as any).session;
      const addresses = await walletsApi.fetchWalletSubaddresses(walletId, generateListReqParams(1, 1));
      if (addresses.results.length) {
        const subaddress = addresses.results[0];
        dispatch(setWalletSubaddress(subaddress));
        if (subaddress.signature) {
          const verified = verifySignature(Buffer.from(subaddress.signature, "base64"), subaddress.address, Buffer.from(signingPublicKey, "base64"));
          if (verified) {
            dispatch(markValidAddress(subaddress.index));
          }
        }
      }
      return addresses;
    } catch(err: any) {
      return rejectWithValue(err?.data)
    }
  },
);

export const updateSubaddress = createAsyncThunk<SubaddressResponse, UpdateSubaddressThunkPayload>(
  `${SLICE_NAME}/updateSubaddress`,
  async ({ id, address, label}, { rejectWithValue, dispatch, getState }) => {
    try {
      const walletSubAddress = (getState() as any)[SLICE_NAME].walletSubAddress;
      const subaddress = await walletsApi.updateWalletSubaddresses(id, address, { label });
      if (walletSubAddress.address === subaddress.address) {
        dispatch(setWalletSubaddress(subaddress));
      } else {
        dispatch(updateSubaddressInList(subaddress));
      }
      return subaddress;
    } catch(err: any) {
      return rejectWithValue(err?.data)
    }
  },
);


export const createSubaddress = createAsyncThunk<Subaddress, CreateSubaddressThunkPayload>(
  `${SLICE_NAME}/createSubaddress`,
  async ({ walletId }, { rejectWithValue, dispatch }) => {
    try {
      const response = await walletsApi.createSubaddress(walletId);
      dispatch(setWalletSubaddress(response))
      return response;
    } catch(err: any) {
      return rejectWithValue(err?.data)
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

export const subaddressListSlice = createSlice({
  name: SLICE_NAME,
  initialState,
  reducers: {
    setWalletSubaddress(state, action: { payload: Subaddress }): void {
      state.walletSubAddress = action.payload;
    },
    updateSubaddressInList(state, action: { payload: Subaddress }): void {
      state.entities = state.entities.map((entity) => entity.address === action.payload.address ? action.payload : entity);
    },
    markValidAddress(state, action: PayloadAction<number>): void {
      if (!state.validated.includes(action.payload)) {
        state.validated.push(action.payload);
      }
    },
    setAddresses(state, action: { payload: FetchSubaddressResponse }): void {
      state.entities = action.payload.results;
      state.count = action.payload.count - 1;
      state.pages = Math.ceil((action.payload.count - 1) / ITEMS_PER_PAGE);
      state.hasPreviousPage = !!(action.payload.results.length && action.payload.results[0].index !== action.payload.count - 1 && !!action.payload.previous);
      state.hasNextPage = !!action.payload.next;
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
    ...generateExtraReducer(fetchSubaddresses),
    ...generateExtraReducer(fetchWalletSubaddress),
    ...generateExtraReducer(createSubaddress),
  }
});

export const selectors = {
  getWalletSubAddress: (state: RootState): Subaddress => state[SLICE_NAME].walletSubAddress ? ({ ...state[SLICE_NAME].walletSubAddress, isValid: state[SLICE_NAME].validated.includes(state[SLICE_NAME].walletSubAddress.index) }) : null,
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
  pendingCreateSubaddress: createLoadingSelector(SLICE_NAME, createSubaddress.pending.toString()),
}

export const {
  reset,
  setWalletSubaddress,
  updateSubaddressInList,
  setAddresses,
  markValidAddress,
} = subaddressListSlice.actions;
