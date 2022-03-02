import {createSlice, PayloadAction, createAsyncThunk} from "@reduxjs/toolkit";
import {
  LocalWalletData,
  GetOutputsPayload,
  Wallet,
  CreateUnsignedTransactionResponse,
  Destination,
  WalletMember,
  DeleteWalletPayload,
  DeleteWalletResponse,
  FetchWalletDetailsPayload,
  FetchWalletDetailsResponse,
  RemoveWalletAccessPayload,
  RemoveWalletAccessResponse,
  UpdateWalletDetailsPayload,
  UpdateWalletDetailsResponse,
  RootState,
  PersistWalletPayload,
  PendingTransaction,
  ShareWalletThunkPayload,
  ShareWalletResponse,
} from "../types";
import walletsApi from "../api/wallets";
import publicKeysApi from "../api/publicKeys";
import walletInstance from "../wallet";
import pollTask from "../utils/pollTask";
import {generateExtraReducer, createLoadingSelector, getEncryptedKeys, deriveUserKeys, decryptKeys} from "../utils";
import { accessLevels, createNewWalletSteps, createTransactionSteps } from "../constants";
import { decryptWalletKeys, encryptWalletKeys } from "../wallet/WalletService";
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
      const { encryptionPublicKey } = (getState() as any).session.user;
      // create user and backup wallets
      dispatch(setStage(createNewWalletSteps.wallet1));
      console.log("Creating User and Backup wallets");
      await walletInstance.createWallets();
      // prepare multisigs for user and backup wallets
      dispatch(setStage(createNewWalletSteps.wallet2));
      // With this artificial delay we can show stage of creating wallet in the UI little bit longer time,
      // so user can read it
      await new Promise((resolve) => setTimeout(() => resolve({}), 1000));  
      console.log("Preparing multisigs");
      const preparedMultisigs = await walletInstance.prepareMultisigs();
      // create server wallet
      dispatch(setStage(createNewWalletSteps.wallet3));
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
      dispatch(setStage(createNewWalletSteps.wallet4));
      console.log("Making multisig for User and Backup wallets");
      const madeMultisigs = await walletInstance.makeMultisigs([...preparedMultisigs, preparedServerMultisig]);
      // Exchange multisig information for User and Backup wallets
      dispatch(setStage(createNewWalletSteps.wallet5));
      console.log("Exchanging multisig information for User and Backup wallets");
      const result = await walletInstance.exchangeMultisigKeys([...madeMultisigs, madeServerMultisig]);
      dispatch(setStage(createNewWalletSteps.wallet6));
      console.log("Finalizing server wallet");
      const encryptedWalletKeys =  await walletInstance.encryptWalletKeys(Uint8Array.from(Buffer.from(encryptionPublicKey, "base64")));
      const finalizedServerWallet = await walletsApi.finalizeWallet(walletId, {
        address: result.userResult.state.address,
        user_multisig_xinfo: madeMultisigs[0],
        backup_multisig_xinfo: madeMultisigs[1],
        encrypted_keys: JSON.stringify({
          version: 1,
          method: "asymmetric",
          enc_content: Buffer.from(encryptedWalletKeys).toString("base64"),
        }),
      });
      // Refresh wallets data and add to store
      const updatedWallets = await walletInstance.getWalletsData();
      // finalize server wallet
      await pollTask(finalizedServerWallet.taskId);
      walletInstance.closeWallet();
      dispatch(setStage(""));
      return { ...updatedWallets, walletId, walletPassword: Buffer.from(walletInstance.walletPassword).toString("hex") };
    } catch(err: any) {
      console.log(err);
      return rejectWithValue(err?.data)
    }
  },
);

export const openWallet = createAsyncThunk<LocalWalletData, { wallet: Wallet, loginPassword: string }>(
  "wallet/openWallet",
  async ({wallet, loginPassword}, { rejectWithValue, dispatch, getState }) => {
    try {
      dispatch(setStage(createTransactionSteps.transaction1));
      const { encPrivateKey, encryptionPublicKey, email, username } = (getState() as any).session.user;
      const encryptedWalletKeysJson = getEncryptedKeys(wallet, email);
      const encryptedWalletKeys = JSON.parse(encryptedWalletKeysJson).enc_content;
      const { encryptionKey, clean: cleanDerivedKeys } = await deriveUserKeys(loginPassword, username);
      const { encryptionPrivateKey, clean: cleanDecryptedKeys } = await decryptKeys(
        Uint8Array.from(Buffer.from(encPrivateKey.enc_content, "base64")),
        Uint8Array.from(Buffer.from(encPrivateKey.nonce, "base64")),
        encryptionKey,
      );
      const { walletKeys, walletPassword } = await decryptWalletKeys(
        Uint8Array.from(Buffer.from(encryptedWalletKeys, "base64")),
        Uint8Array.from(Buffer.from(encryptionPublicKey, "base64")),
        encryptionPrivateKey,
      );
      const userWallet = await walletInstance.openWallet(walletKeys, walletPassword);
      cleanDerivedKeys();
      cleanDecryptedKeys();
      return userWallet;
    } catch(err: any) {
      dispatch(setStage(""));
      return rejectWithValue(err?.data || err)
    }
  },
);

export const getOutputs = createAsyncThunk<LocalWalletData | undefined, GetOutputsPayload>(
  "wallet/getOutputs",
  async (data, { rejectWithValue, dispatch }) => {
    try {
      const { userWallet } = walletInstance;
      const response = await walletsApi.getOutputs(data);
      const { result: { outputsHex } } = await pollTask(response.taskId);
      const importedOutputs = await userWallet?.importOutputs(outputsHex);
      console.dir(`Imported ${importedOutputs} outputs`);

      const userWalletUpdated = await userWallet?.getWalletJSON();
      return userWalletUpdated;
    } catch(err: any) {
      dispatch(setStage(""));
      return rejectWithValue(err?.data)
    }
  },
);

/**
 * syncMultisig does a couple of consecutive multisig hex exchanges with the backend.
 * On the first exchange, it assumes that the FE doesn't have complete multisig info;
 * so for the backend's benefit it does a second exchange after the FE gets complete
 * multisig info.
 * 
 * This is kind of experimental and should be polished later, if successful
 */
export const syncMultisig = createAsyncThunk<LocalWalletData | undefined, string>(
  "wallet/SyncMultisig",
  async (id, { rejectWithValue, dispatch }) => {
    try {
      dispatch(setStage(createTransactionSteps.transaction5));
      const { userWallet } = walletInstance;
      if (!userWallet) {
        return;
      }
      const payload1 = {
        multisig_hex: await userWallet.getMultisigHex(),
        id: id,
      };
      const response1 = await walletsApi.syncMultisig(payload1);
      const { result: { multisigHex: multisigHex1 } } = await pollTask(response1.taskId);
      await userWallet.importMultisigHex([multisigHex1]);

      const payload2 = {
        multisig_hex: await userWallet.getMultisigHex(),
        id: id,
      };
      const response2 = await walletsApi.syncMultisig(payload2);
      await pollTask(response2.taskId);

      const userWalletUpdated = await userWallet.getWalletJSON();
      return userWalletUpdated;
    } catch(err: any) {
      dispatch(setStage(""));
      return rejectWithValue(err?.data || err)
    }
  },
);
export const prepareTransaction = createAsyncThunk<CreateUnsignedTransactionResponse, { id: string, body: Destination,  memo: string, priority: string }>(
  "wallet/prepareTransaction",
  async (data, { rejectWithValue, dispatch }) => {
    try {
      dispatch(setPendingTransaction({
         address: data.body.address,
         amount: data.body.amount.toString(),
         memo: data.memo,
         priority: data.priority,
      }));
      // With this artificial delay we can show stage of creating transaction in the UI little bit longer time,
      // so user can read it
      dispatch(setStage(createTransactionSteps.transaction2));
      await new Promise((resolve) => setTimeout(() => resolve({}), 1000));  
      const {userWallet} = walletInstance;
      const multisig = await userWallet?.getMultisigHex();
      dispatch(setStage(createTransactionSteps.transaction3));
      const createTransactionResponse = await walletsApi.createUnsignedTransaction(data.id, {
        destinations: [data.body],
        multisig_hex: multisig || "",
        priority: data.priority
      });
      const {result: {multisigHex, txsHex}} = await pollTask(createTransactionResponse.taskId);
      await userWallet?.importMultisigHex([multisigHex]);
      const txData = await userWallet?.loadMultisigTx(txsHex);
      if (txData?.state.fee) {
        dispatch(setPendingTransaction({
          address: data.body.address,
          amount: data.body.amount.toString(),
          fee: txData.state.fee,
          txsHex: txsHex,
          memo: data.memo,
          priority: data.priority,
        }));
        return createTransactionResponse;
      } else {
        dispatch(setStage(""));
        return rejectWithValue({"detail": "Could not get transaction fee."});
      }
    } catch (err: any) {
      console.log(111, err);
      dispatch(setStage(""));
      return rejectWithValue(err?.data)
    }
  },
);

export const createTransaction = createAsyncThunk<CreateUnsignedTransactionResponse,{ id: string, code: string }>(
  "wallet/createTransaction",
  async (data, { rejectWithValue, getState, dispatch }) => {
    try {
      const pendingTransaction = (getState() as any).wallet.pendingTransaction;
      const {userWallet} = walletInstance;
      const txHex = await userWallet?.reconstructAndValidateTransaction(pendingTransaction.txsHex, {
        address: pendingTransaction.address,
        amount: pendingTransaction.amount
      });
      dispatch(setStage(createTransactionSteps.transaction4));
      const submitTransactionResponse = await walletsApi.submitTransaction(
        data.id,
        {
          tx_hex: txHex || "",
          memo: pendingTransaction.memo,
        },
        data.code ? { headers: { "X-RINO-2FA": data.code } } : undefined,
      );
      await pollTask(submitTransactionResponse.taskId);
      dispatch(setPendingTransaction({
        address: "",
        amount: "",
        fee: undefined,
        txsHex: undefined,
        memo: undefined,
        priority: undefined,
      }))
      walletInstance.closeWallet();
      return submitTransactionResponse;
    } catch(err: any) {
      dispatch(setStage(""));
      return rejectWithValue(err?.data)
    }
  },
);

export const persistWallet = createAsyncThunk<void, PersistWalletPayload>(
  "wallet/PersistWallet",
  async (data, { rejectWithValue }) => {
    try {
      await walletsApi.persistWallet(data);
    } catch(err: any) {
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
    } catch(err: any) {
      return rejectWithValue(err?.data)
    }
  },
);

export const updateWalletDetails = createAsyncThunk<UpdateWalletDetailsResponse, UpdateWalletDetailsPayload>(
  "wallet/updateWalletDetails",
  async (data, { rejectWithValue }) => {
    try {
      const wallet = await walletsApi.updateWalletDetails(data, data.code ? { headers: { "X-RINO-2FA": data.code } } : undefined,);
      return wallet;
    } catch(err: any) {
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
    } catch(err: any) {
      return rejectWithValue(err?.data)
    }
  },
); 

export const shareWallet = createAsyncThunk<void, ShareWalletThunkPayload>(
  "wallet/shareWallet",
  async (data, { rejectWithValue, getState, dispatch }) => {
    const requestBody = { access_level: data.accessLevel, email: data.email, encrypted_keys: "" }
    try {
      if (data.accessLevel === accessLevels.admin.code) {
        const publicKeys = await publicKeysApi.fetchPublicKey({ email: data.email });
        // stop execution if there is no such user
        if (!publicKeys.length) {
          return;
        }
        const { encryptionPublicKey, email, username, encPrivateKey } = (getState() as any).session.user;
        const { encryptionKey, clean: cleanDerivedKeys } = await deriveUserKeys(data.password, username);
        const encryptedWalletKeysJson = getEncryptedKeys(data.wallet, email);
        const encryptedWalletKeys = JSON.parse(encryptedWalletKeysJson).enc_content;
        const { encryptionPrivateKey, clean: cleanDecryptedKeys } = await decryptKeys(
          Uint8Array.from(Buffer.from(encPrivateKey.enc_content, "base64")),
          Uint8Array.from(Buffer.from(encPrivateKey.nonce, "base64")),
          encryptionKey,
        );
        const { walletKeys, walletPassword } = await decryptWalletKeys(
          Uint8Array.from(Buffer.from(encryptedWalletKeys, "base64")),
          Uint8Array.from(Buffer.from(encryptionPublicKey, "base64")),
          encryptionPrivateKey,
        );
        const reEncWalletKeys = await encryptWalletKeys(Uint8Array.from(Buffer.from(publicKeys[0].encryptionPublicKey, "base64")), walletKeys, walletPassword); 
        requestBody.encrypted_keys = JSON.stringify({
          version: 1,
          method: "asymmetric",
          enc_content: Buffer.from(reEncWalletKeys).toString("base64"),
        });
        cleanDerivedKeys();
        cleanDecryptedKeys();
        const response = await walletsApi.shareWallet(data.wallet.id, requestBody, data.code ? { headers: { "X-RINO-2FA": data.code } } : undefined,);
        dispatch(addMember(updateShareWalletResponse(response)));
      } else {
        const response = await walletsApi.shareWallet(data.wallet.id, requestBody, data.code ? { headers: { "X-RINO-2FA": data.code } } : undefined,);
        dispatch(addMember(updateShareWalletResponse(response)));
      }
    } catch(err: any) {
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
    } catch(err: any) {
      return rejectWithValue(err?.data)
    }
  },
);

export interface State {
  data: Wallet | null;
  stage: string;
  pendingTransaction: PendingTransaction
  thunksInProgress: string[];
}

export const initialState: State = {
  data: null,
  stage: "",
  thunksInProgress: [],
  pendingTransaction: {
    address: "",
    amount: "",
    fee: undefined,
    txsHex: undefined,
    memo: undefined,
    priority: undefined,
  },
};

const SLICE_NAME = "wallet";

export const walletSlice = createSlice({
  name: SLICE_NAME,
  initialState,
  reducers: {
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
    setPendingTransaction(state, action: PayloadAction<PendingTransaction>): void {
      Object.assign(state.pendingTransaction, action.payload);
    },
    resetPendingTransaction(state): void {
      state.pendingTransaction = initialState.pendingTransaction;
    },
    reset(state): void {
      state.data = initialState.data;
      state.stage = initialState.stage;
      state.thunksInProgress = initialState.thunksInProgress;
      state.pendingTransaction = initialState.pendingTransaction;
    },
  },
  extraReducers: {
    ...generateExtraReducer(createNewWallet),
    ...generateExtraReducer(openWallet),
    ...generateExtraReducer(getOutputs),
    ...generateExtraReducer(prepareTransaction),
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
    // ...generateExtraReducer(shareWallet),
    ...generateExtraReducer(removeWalletAccess),
  }
});

export const selectors = {
  getStage: (state: RootState): string => state[SLICE_NAME].stage,
  getWallet: (state: RootState): Wallet => state[SLICE_NAME].data,
  getPendingTransaction: (state: RootState): PendingTransaction => state[SLICE_NAME].pendingTransaction,
  // thunk statuses
  pendingCreateNewWallet: createLoadingSelector(SLICE_NAME, createNewWallet.pending.toString()),
  pendingOpenWallet: createLoadingSelector(SLICE_NAME, openWallet.pending.toString()),
  pendingGetOutputs: createLoadingSelector(SLICE_NAME, getOutputs.pending.toString()),
  pendingPrepareTransaction: createLoadingSelector(SLICE_NAME, prepareTransaction.pending.toString()),
  pendingCreateTransaction: createLoadingSelector(SLICE_NAME, createTransaction.pending.toString()),
  pendingFetchWalletDetails: createLoadingSelector(SLICE_NAME, fetchWalletDetails.pending.toString()),
  pendingUpdateWalletDetails: createLoadingSelector(SLICE_NAME, updateWalletDetails.pending.toString()),
  pendingDeleteWallet: createLoadingSelector(SLICE_NAME, deleteWallet.pending.toString()),
  // pendingShareWallet: createLoadingSelector(SLICE_NAME, shareWallet.pending.toString()),
  pendingRemoveWalletAccess: createLoadingSelector(SLICE_NAME, removeWalletAccess.pending.toString()),
}

export const {
  addMember,
  removeMember,
  setStage,
  setPendingTransaction,
  reset,
  resetPendingTransaction,
} = walletSlice.actions;
