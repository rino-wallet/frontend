import {createSlice, PayloadAction, createAsyncThunk} from "@reduxjs/toolkit";
import {
  LocalWalletData,
  GetOutputsPayload,
  Wallet,
  CreateUnsignedTransactionResponse,
  Destination,
  WalletMember,
  ShareWalletResponse,
  CreateSubaddressThunkPayload,
  DeleteWalletPayload,
  DeleteWalletResponse,
  FetchSubaddressResponse,
  FetchWalletDetailsPayload,
  FetchWalletDetailsResponse,
  FetchWalletSubaddressThunkPayload,
  RemoveWalletAccessPayload,
  RemoveWalletAccessResponse,
  ShareWalletPayload,
  Subaddress,
  UpdateWalletDetailsPayload,
  UpdateWalletDetailsResponse,
  RootState,
} from "../types";
import walletsApi from "../api/wallets";
import walletService from "./walletInstance";
import pollTask from "../utils/pollTask";
import {generateExtraReducer, createLoadingSelector, generateListReqParams, getEncryptedKeys} from "../utils";
import { enter2FACode } from "../modules/2FAModals";
import { accessLevels } from "../constants";
import { decryptWalletKeys, encryptWalletKeys } from "../wallet"
import publicKeysApi from "../api/publicKeys";
import modals from "../modules/2FAModals";

function updateShareWalletResponse(response: ShareWalletResponse): WalletMember {
  return {
    id: response.id,
    user: response.user.email,
    accessLevel: response.accessLevel,
    encryptedKeys: "",
    createdAt: response.createdAt,
    updatedAt: response.createdAt,
  }
}

export const createNewWallet = createAsyncThunk<any, { name: string }>(
  "wallet/createNewWallet",
  async ({name}, { rejectWithValue, dispatch, getState }) => {
    try {
      const { publicKey } = (getState() as any).session.user;
      // create user and backup wallets
      dispatch(setStage("Step: 1/6"));
      console.log("Creating User and Backup wallets");
      await walletService.createWallets();
      // prepare multisigs for user and backup wallets
      dispatch(setStage("Step: 2/6"));
      console.log("Preparing multisigs");
      const preparedMultisigs = await walletService.prepareMultisigs();
      // create server wallet
      dispatch(setStage("Step: 3/6"));
      console.log("Creating Server Wallet and prepare multisig");
      const serverWallet = await walletsApi.createWallet({
        name,
        user_multisig_info: preparedMultisigs[0],
        backup_multisig_info: preparedMultisigs[1],
      });
      // get the task result
      const createServerWalletTask = await pollTask(serverWallet.taskId);
      const preparedServerMultisig = createServerWalletTask.result.serverMultisigInfo;
      const madeServerMultisig = createServerWalletTask.result.serverMultisigXinfo.state.multisigHex;
      const walletId = createServerWalletTask.walletId;
      // Make multisigs for user and backup wallets
      dispatch(setStage("Step: 4/6"));
      console.log("Making multisig for User and Backup wallets");
      const madeMultisigs = await walletService.makeMultisigs([...preparedMultisigs, preparedServerMultisig]);
      // Exchange multisig information for User and Backup wallets
      dispatch(setStage("Step: 5/6"));
      console.log("Exchanging multisig information for User and Backup wallets");
      const result = await walletService.exchangeMultisigKeys([...madeMultisigs, madeServerMultisig]);
      dispatch(setStage("Step: 6/6"));
      console.log("Finalizing server wallet");
      const encryptedWalletKeys =  await walletService.encryptWalletKeys(publicKey);
      const finalizedServerWallet = await walletsApi.finalizeWallet(walletId, {
        address: result.userResult.state.address,
        user_multisig_xinfo: madeMultisigs[0],
        backup_multisig_xinfo: madeMultisigs[1],
        encrypted_keys: encryptedWalletKeys,
      });
      // Refresh wallets data and add to store
      const updatedWallets = await walletService.getWalletsData();
      // finalize server wallet
      await pollTask(finalizedServerWallet.taskId);
      dispatch(setStage(""));
      return { ...updatedWallets, walletId };
    } catch(err) {
      return rejectWithValue(err?.data)
    }
  },
);

export const openWallet = createAsyncThunk<LocalWalletData, { wallet: Wallet, password: string }>(
  "wallet/openWallet",
  async ({wallet, password}, { rejectWithValue, dispatch, getState }) => {
    try {
      dispatch(setStage("Opening wallet..."));
      const { encPrivateKey, email } = (getState() as any).session.user;
      const encryptedWalletKeys = getEncryptedKeys(wallet, email);
      const walletKeys = await decryptWalletKeys(encryptedWalletKeys, encPrivateKey, password);
      const userWallet = await walletService.openWallet(walletKeys);
      dispatch(setStage(""));
      return userWallet;
    } catch(err) {
      return rejectWithValue(err?.data || err)
    }
  },
);

export const getOutputs = createAsyncThunk<LocalWalletData | undefined, GetOutputsPayload>(
  "wallet/getOutputs",
  async (data, { rejectWithValue }) => {
    try {
      const { userWallet } = walletService;
      const response = await walletsApi.getOutputs(data);
      const { result: { outputsHex } } = await pollTask(response.taskId);
      await userWallet?.importOutputs(outputsHex);
      const userWalletUpdated = await userWallet?.getWalletJSON();
      return userWalletUpdated;
    } catch(err) {
      return rejectWithValue(err?.data)
    }
  },
);

export const createTransaction = createAsyncThunk<CreateUnsignedTransactionResponse, { id: string, body: Destination,  memo: string, priority: string }>(
  "wallet/createTransaction",
  async (data, { rejectWithValue, getState }) => {
    try {
      const { is2FaEnabled } = (getState() as any).session.user;
      let code = "";
      const { userWallet } = walletService;
      const multisig = await userWallet?.getMultisigHex();
      const createTransactionResponse = await walletsApi.createUnsignedTransaction(data.id, { destinations: [data.body], multisig_hex: multisig || "", priority: data.priority });
      const { result: { multisigHex, txsHex } } = await pollTask(createTransactionResponse.taskId);
      await userWallet?.importMultisigHex([multisigHex]);
      const txHex = await userWallet?.reconstructTransaction(txsHex);
      if (is2FaEnabled) {
        code = await enter2FACode();
      }
      const submitTransactionResponse = await walletsApi.submitTransaction(
        data.id,
        {
          tx_hex: txHex || "",
          memo: data.memo,
        },
        code ? { headers: { "X-RINO-2FA": code } } : undefined,
      );
      await pollTask(submitTransactionResponse.taskId);
      return createTransactionResponse;
    } catch(err) {
      return rejectWithValue(err?.data)
    }
  },
);

export const fetchWalletDetails = createAsyncThunk<FetchWalletDetailsResponse, FetchWalletDetailsPayload>(
  "wallet/fetchWalletDetails",
  async (data, { rejectWithValue }) => {
    try {
      const wallet = await walletsApi.fetchWalletDetails(data);
      return wallet;
    } catch(err) {
      return rejectWithValue(err?.data)
    }
  },
);

export const updateWalletDetails = createAsyncThunk<UpdateWalletDetailsResponse, UpdateWalletDetailsPayload>(
  "wallet/updateWalletDetails",
  async (data, { rejectWithValue }) => {
    try {
      const wallet = await walletsApi.updateWalletDetails(data);
      return wallet;
    } catch(err) {
      return rejectWithValue(err?.data)
    }
  },
);

export const deleteWallet = createAsyncThunk<DeleteWalletResponse, DeleteWalletPayload>(
  "wallet/deleteWallet",
  async (data, { rejectWithValue, getState }) => {
    try {
      let code = "";
      const { is2FaEnabled } = (getState() as any).session.user;
      if (is2FaEnabled) {
        code = await modals.enter2FACode();
      }
      const wallet = await walletsApi.deleteWallet(data, code ? { headers: { "X-RINO-2FA": code } } : undefined);
      return wallet;
    } catch(err) {
      return rejectWithValue(err?.data)
    }
  },
); 

export const shareWallet = createAsyncThunk<string, { wallet: Wallet, password: string; body: ShareWalletPayload }>(
  "wallet/shareWallet",
  async ({wallet, password, body}, { rejectWithValue, getState, dispatch }) => {
    const requestBody = {
      ...body,
      encrypted_keys: "",
    }
    try {
      if (body.access_level === accessLevels.admin.code) {
        const publicKeys = await publicKeysApi.fetchPublicKey({ email: body.email });
        const { encPrivateKey, email } = (getState() as any).session.user;
        const encryptedWalletKeys = getEncryptedKeys(wallet, email);
        const walletKeys = await decryptWalletKeys(encryptedWalletKeys, encPrivateKey, password);
        requestBody.encrypted_keys = await encryptWalletKeys(publicKeys[0].publicKey, walletKeys); 
      }
      const response = await walletsApi.shareWallet(wallet.id, requestBody);
      dispatch(addMember(updateShareWalletResponse(response)));
      return "";
    } catch(err) {
      return rejectWithValue(err?.data || err)
    }
  },
);

export const removeWalletAccess = createAsyncThunk<RemoveWalletAccessResponse, RemoveWalletAccessPayload>(
  "wallet/removeWalletAccess",
  async (data, { rejectWithValue, dispatch }) => {
    try {
      const response = await walletsApi.removeWalletAccess(data);
      dispatch(removeMember(data.userId))
      return response;
    } catch(err) {
      return rejectWithValue(err?.data)
    }
  },
);

export const fetchWalletSubaddress = createAsyncThunk<FetchSubaddressResponse, FetchWalletSubaddressThunkPayload>(
  "wallet/fetchWalletSubaddress",
  async ({ walletId }, { rejectWithValue, dispatch }) => {
    try {
      const addresses = await walletsApi.fetchWalletSubaddresses(walletId, generateListReqParams(1, 1));
      if (addresses.results.length) {
        dispatch(setAddress(addresses.results[0].address));
      }
      return addresses;
    } catch(err) {
      return rejectWithValue(err?.data)
    }
  },
);

export const createSubaddress = createAsyncThunk<Subaddress, CreateSubaddressThunkPayload>(
  "wallet/createSubaddress",
  async ({ walletId }, { rejectWithValue, dispatch }) => {
    try {
      const response = await walletsApi.createSubaddress(walletId);
      const taskResult = await pollTask(response.taskId);
      dispatch(setAddress(taskResult.result.address))
      return taskResult;
    } catch(err) {
      return rejectWithValue(err?.data)
    }
  },
);

export interface State {
  data: Wallet | null;
  stage: string;
  thunksInProgress: string[];
}

export const initialState: State = {
  data: null,
  stage: "",
  thunksInProgress: [],
};

const SLICE_NAME = "wallet";

export const walletSlice = createSlice({
  name: SLICE_NAME,
  initialState,
  reducers: {
    setAddress(state, action: { payload: string }): void {
      if (state.data) {
        state.data = {
          ...state.data,
          address: action.payload,
        }
      }
    },
    addMember(state, action: { payload: WalletMember }): void {
      if (state.data) {
        state.data = {
          ...state.data,
          members: [...state.data.members, action.payload],
        }
      }
    },
    removeMember(state, action: { payload: string }): void {
      if (state.data) {
        state.data = {
          ...state.data,
          members: state.data.members.filter((member) => member.id !== action.payload),
        }
      }
    },
    setStage(state, action: PayloadAction<string>): void {
      state.stage = action.payload;
    },
    reset(state): void {
      state.data = initialState.data;
      state.stage = initialState.stage;
      state.thunksInProgress = initialState.thunksInProgress;
    },
  },
  extraReducers: {
    ...generateExtraReducer(createNewWallet),
    ...generateExtraReducer(openWallet),
    ...generateExtraReducer(getOutputs),
    ...generateExtraReducer(createTransaction),
    ...generateExtraReducer(
      fetchWalletDetails,
      (data) => ({ data: data }),
    ),
    ...generateExtraReducer(
      updateWalletDetails,
      (data) => ({ data: data }),
    ),
    ...generateExtraReducer(deleteWallet),
    ...generateExtraReducer(shareWallet),
    ...generateExtraReducer(removeWalletAccess),
    ...generateExtraReducer(fetchWalletSubaddress),
    ...generateExtraReducer(createSubaddress),
  }
});

export const selectors = {
  getStage: (state: RootState): string => state[SLICE_NAME].stage,
  getWallet: (state: RootState): Wallet => state[SLICE_NAME].data,
  // thunk statuses
  pendingCreateNewWallet: createLoadingSelector(SLICE_NAME, createNewWallet.pending.toString()),
  pendingOpenWallet: createLoadingSelector(SLICE_NAME, openWallet.pending.toString()),
  pendingGetOutputs: createLoadingSelector(SLICE_NAME, getOutputs.pending.toString()),
  pendingCreateTransaction: createLoadingSelector(SLICE_NAME, createTransaction.pending.toString()),
  pendingFetchWalletDetails: createLoadingSelector(SLICE_NAME, fetchWalletDetails.pending.toString()),
  pendingUpdateWalletDetails: createLoadingSelector(SLICE_NAME, updateWalletDetails.pending.toString()),
  pendingDeleteWallet: createLoadingSelector(SLICE_NAME, deleteWallet.pending.toString()),
  pendingShareWallet: createLoadingSelector(SLICE_NAME, shareWallet.pending.toString()),
  pendingRemoveWalletAccess: createLoadingSelector(SLICE_NAME, removeWalletAccess.pending.toString()),
  pendingFetchWalletSubaddress: createLoadingSelector(SLICE_NAME, fetchWalletSubaddress.pending.toString()),
  pendingCreateSubaddress: createLoadingSelector(SLICE_NAME, createSubaddress.pending.toString()),
}

export const {
  addMember,
  removeMember,
  setAddress,
  setStage,
  reset,
} = walletSlice.actions;
