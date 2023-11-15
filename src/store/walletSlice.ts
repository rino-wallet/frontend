import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
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
  PendingTransaction,
  ShareWalletThunkPayload,
  ShareWalletResponse,
} from "../types";
import walletsApi from "../api/wallets";
import publicKeysApi from "../api/publicKeys";
import walletInstance from "../wallet";
import pollTask from "../utils/pollTask";
import {
  generateExtraReducer, createLoadingSelector, getEncryptedKeys, deriveUserKeys, decryptKeys,
} from "../utils";
import { accessLevels, createNewWalletSteps, createTransactionSteps } from "../constants";
import modals from "../modules/2FAModals";
import { PersistWalletThunkPayload, RequestWalletShareThunkPayload } from "../types/store";

const SLICE_NAME = "wallet";

function updateShareWalletResponse(response: ShareWalletResponse): WalletMember {
  return {
    id: response.id,
    user: response.user.email,
    accessLevel: response.accessLevel,
    encryptedKeys: "",
    createdAt: response.createdAt,
    updatedAt: response.createdAt,
    is2FaEnabled: response.user.is2FaEnabled,
    activeApiKeys: response.user.activeApiKeys,
  };
}

export const createNewWallet = createAsyncThunk<any, { name: string, signal: any }>(
  `${SLICE_NAME}/createNewWallet`,
  async ({ name, signal }, { rejectWithValue, dispatch }) => {
    signal.addEventListener("abort", () => {
      // eslint-disable-next-line
      console.log("Wallet Creation Aborted.");
      rejectWithValue(signal);
    });
    try {
      // create user and backup wallets
      dispatch(setStage(createNewWalletSteps.wallet1));
      // eslint-disable-next-line
      console.log("Creating User and Backup wallets");
      await walletInstance.createWallets();
      if (signal.aborted) return rejectWithValue({});
      // prepare multisigs for user and backup wallets
      dispatch(setStage(createNewWalletSteps.wallet2));
      // With this artificial delay we can show stage of creating wallet in the UI little bit longer time,
      // so user can read it
      await new Promise((resolve) => {
        setTimeout(resolve, 1000);
      });
      // eslint-disable-next-line
      console.log("Preparing multisigs");
      const preparedMultisigs = await walletInstance.prepareMultisigs();
      if (signal.aborted) return rejectWithValue({});
      // create server wallet
      dispatch(setStage(createNewWalletSteps.wallet3));
      // eslint-disable-next-line
      console.log("Creating Server Wallet and prepare multisig");
      const serverWallet = await walletsApi.createWallet({
        name,
        user_multisig_info: preparedMultisigs[0],
        backup_multisig_info: preparedMultisigs[1],
      });
      if (signal.aborted) return rejectWithValue({});
      // get the task result
      const polledTaskPromise = pollTask(serverWallet.taskId, signal);
      if (signal.aborted) {
        return rejectWithValue({});
      }
      const createServerWalletTask = await polledTaskPromise;
      const preparedServerMultisig = createServerWalletTask.result.serverMultisigInfo;
      const madeServerMultisig = createServerWalletTask.result.serverMultisigXinfo;
      const walletId = createServerWalletTask.walletId;
      // Make multisigs for user and backup wallets
      dispatch(setStage(createNewWalletSteps.wallet4));
      // eslint-disable-next-line
      console.log("Making multisig for User and Backup wallets");
      const madeMultisigs = await walletInstance.makeMultisigs([...preparedMultisigs, preparedServerMultisig]);
      if (signal.aborted) return rejectWithValue({});
      // Exchange multisig information for User and Backup wallets
      dispatch(setStage(createNewWalletSteps.wallet5));
      // eslint-disable-next-line
      console.log("Exchanging multisig information for User and Backup wallets");
      // With this artificial delay we can show stage of creating wallet in the UI little bit longer time,
      // so user can read it
      await new Promise((resolve) => {
        setTimeout(resolve, 1000);
      });
      const exchangeMultisigKeysResult = await walletInstance.exchangeMultisigKeys([...madeMultisigs, madeServerMultisig]);
      dispatch(setStage(createNewWalletSteps.wallet6));
      // eslint-disable-next-line
      console.log("Finalizing server wallet");
      if (signal.aborted) return rejectWithValue({});
      const finalizedServerWallet = await walletsApi.finalizeWallet(walletId, {
        user_multisig_xinfo: madeMultisigs[0],
        backup_multisig_xinfo: madeMultisigs[1],
        user_multisig_final: exchangeMultisigKeysResult.userResult.state.multisigHex,
        backup_multisig_final: exchangeMultisigKeysResult.backupResult.state.multisigHex,
      });
      if (signal.aborted) return rejectWithValue({});
      // finalize server wallet
      const finalizedWalletData = await pollTask(finalizedServerWallet.taskId, signal);
      const exchangeMultisigKeysResult2 = await walletInstance.exchangeMultisigKeys([
        exchangeMultisigKeysResult.userResult.state.multisigHex,
        exchangeMultisigKeysResult.backupResult.state.multisigHex,
        finalizedWalletData.result.serverMultisigFinal,
      ]);
      // Refresh wallets data, compare all addresses and check they match
      const updatedWallets = await walletInstance.getWalletsData();
      const addresses = [
        exchangeMultisigKeysResult2.userResult.state.address,
        exchangeMultisigKeysResult2.backupResult.state.address,
        updatedWallets.userWallet.address,
        updatedWallets.backupWallet.address,
      ];
      if (!addresses.every((v) => v === addresses[0])) {
        walletInstance.closeWallet();
        throw { data: { detail: "An error occurred while creating the wallet. Please, try again. If the problem persists please contact support@rino.io" } };
      }
      if (signal.aborted) return rejectWithValue({});
      dispatch(setStage(""));
      return { ...updatedWallets, walletId, walletPassword: Buffer.from(walletInstance.walletPassword).toString("hex") };
    } catch (err: any) {
      // eslint-disable-next-line
      console.log(err);
      return rejectWithValue(err?.data);
    }
  },
);

export const persistWallet = createAsyncThunk<void, PersistWalletThunkPayload>(
  `${SLICE_NAME}/PersistWallet`,
  async (data, { rejectWithValue, getState }) => {
    try {
      const { encryptionPublicKey } = (getState() as any).session.user;
      // at this stage the wallet is still in memory
      const encryptedWalletKeys = await walletInstance.encryptUserWalletKeys(Uint8Array.from(Buffer.from(encryptionPublicKey, "base64")));
      walletInstance.closeWallet();
      await walletsApi.persistWallet(data.id, {
        encrypted_keys: JSON.stringify({
          version: 1,
          method: "asymmetric",
          enc_content: Buffer.from(encryptedWalletKeys).toString("base64"),
        }),
      });
    } catch (err: any) {
      return rejectWithValue(err?.data);
    }
  },
);

export const openWallet = createAsyncThunk<LocalWalletData, { wallet: Wallet, loginPassword: string }>(
  `${SLICE_NAME}/openWallet`,
  async ({ wallet, loginPassword }, { rejectWithValue, dispatch, getState }) => {
    try {
      dispatch(setStage(createTransactionSteps.transaction1));
      const {
        encPrivateKey, encryptionPublicKey, email, username,
      } = (getState() as any).session.user;
      const encryptedWalletKeysJson = getEncryptedKeys(wallet, email);
      const encryptedWalletKeys = JSON.parse(encryptedWalletKeysJson).enc_content;
      const { encryptionKey, clean: cleanDerivedKeys } = await deriveUserKeys(loginPassword, username);
      const { encryptionPrivateKey, clean: cleanDecryptedKeys } = await decryptKeys(
        Uint8Array.from(Buffer.from(encPrivateKey.enc_content, "base64")),
        Uint8Array.from(Buffer.from(encPrivateKey.nonce, "base64")),
        encryptionKey,
      );
      const { walletKeys, walletPassword } = await walletInstance.decryptWalletKeys(
        Uint8Array.from(Buffer.from(encryptedWalletKeys, "base64")),
        Uint8Array.from(Buffer.from(encryptionPublicKey, "base64")),
        encryptionPrivateKey,
      );
      const userWallet = await walletInstance.openWallet(walletKeys, walletPassword);
      cleanDerivedKeys();
      cleanDecryptedKeys();
      return userWallet;
    } catch (err: any) {
      dispatch(setStage(""));
      return rejectWithValue(err?.data || err);
    }
  },
);

export const getOutputs = createAsyncThunk<LocalWalletData | undefined, GetOutputsPayload>(
  `${SLICE_NAME}/getOutputs`,
  async (data, { rejectWithValue, dispatch }) => {
    try {
      const { userWallet } = walletInstance;
      const response = await walletsApi.getOutputs(data);
      const { result: { outputsHex } } = await pollTask(response.taskId);
      const importedOutputs = await userWallet?.importOutputs(outputsHex);
      // eslint-disable-next-line
      console.dir(`Imported ${importedOutputs} outputs`);
      const userWalletUpdated = await userWallet?.getWalletJSON();
      return userWalletUpdated;
    } catch (err: any) {
      dispatch(setStage(""));
      return rejectWithValue(err?.data);
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
  `${SLICE_NAME}/SyncMultisig`,
  async (id, { rejectWithValue, dispatch }) => {
    try {
      dispatch(setStage(createTransactionSteps.transaction5));
      await new Promise((resolve) => {
        setTimeout(resolve, 500);
      });
      const { userWallet } = walletInstance;
      if (!userWallet) {
        return;
      }
      const payload1 = {
        multisig_hex: await userWallet.getMultisigHex(),
        id,
      };
      const response1 = await walletsApi.syncMultisig(payload1);
      const { result: { multisigHex: multisigHex1 } } = await pollTask(response1.taskId);
      await userWallet.importMultisigHex([multisigHex1]);

      const payload2 = {
        multisig_hex: await userWallet.getMultisigHex(),
        id,
      };
      const response2 = await walletsApi.syncMultisig(payload2);
      await pollTask(response2.taskId);

      const userWalletUpdated = await userWallet.getWalletJSON();
      return userWalletUpdated;
    } catch (err: any) {
      dispatch(setStage(""));
      return rejectWithValue(err?.data || err);
    }
  },
);

export const prepareTransaction = createAsyncThunk<CreateUnsignedTransactionResponse, { id: string, body: Destination, memo: string, priority: string, orderId?: string }>(
  `${SLICE_NAME}/prepareTransaction`,
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
      await await new Promise((resolve) => {
        setTimeout(resolve, 1000);
      });
      const { userWallet } = walletInstance;
      const multisig = await userWallet?.getMultisigHex();
      dispatch(setStage(createTransactionSteps.transaction3));
      const createTransactionResponse = await walletsApi.createUnsignedTransaction(data.id, {
        destinations: [data.body],
        multisig_hex: multisig || "",
        priority: data.priority,
      });
      const { result: { multisigHex, txsHex } } = await pollTask(createTransactionResponse.taskId);
      await userWallet?.importMultisigHex([multisigHex]);
      const txData = await userWallet?.loadMultisigTx(txsHex);
      if (txData?.state.fee) {
        dispatch(setPendingTransaction({
          address: data.body.address,
          amount: data.body.amount.toString(),
          fee: txData.state.fee,
          txsHex,
          memo: data.memo,
          priority: data.priority,
          orderId: data.orderId,
        }));
        return createTransactionResponse;
      }
      dispatch(setStage(""));
      return rejectWithValue({ detail: "Could not get transaction fee." });
    } catch (err: any) {
      dispatch(setStage(""));
      return rejectWithValue(err?.data);
    }
  },
);

export const createTransaction = createAsyncThunk<CreateUnsignedTransactionResponse, { id: string, code: string }>(
  `${SLICE_NAME}/createTransaction`,
  async (data, { rejectWithValue, getState, dispatch }) => {
    try {
      const pendingTransaction = (getState() as any).wallet.pendingTransaction;
      const { userWallet } = walletInstance;
      const txsHex = await userWallet?.reconstructAndValidateTransaction(pendingTransaction.txsHex, {
        address: pendingTransaction.address,
        amount: pendingTransaction.amount,
      });
      dispatch(setStage(createTransactionSteps.transaction4));
      const submitTransactionResponse = await walletsApi.submitTransaction(
        data.id,
        {
          tx_hex: txsHex || "",
          memo: pendingTransaction.memo,
          ...(pendingTransaction.orderId ? { order_id: pendingTransaction.orderId } : {}),
        },
        data.code ? { headers: { "X-RINO-2FA": data.code } } : undefined,
      );
      return submitTransactionResponse;
    } catch (err: any) {
      dispatch(setStage(""));
      return rejectWithValue(err?.data);
    }
  },
);

export const pollCreateTransactionTask = createAsyncThunk<CreateUnsignedTransactionResponse, { taskId: string }>(
  `${SLICE_NAME}/pollCreateTransactionTask`,
  async (data, { rejectWithValue, dispatch }) => {
    try {
      const resp = await pollTask(data.taskId);
      dispatch(setPendingTransaction({
        address: "",
        amount: "",
        orderId: "",
        fee: undefined,
        txsHex: undefined,
        memo: undefined,
        priority: undefined,
      }));
      walletInstance.closeWallet();
      return resp;
    } catch (err: any) {
      dispatch(setStage(""));
      return rejectWithValue(err?.data);
    }
  },
);

export const fetchWalletDetails = createAsyncThunk<FetchWalletDetailsResponse, FetchWalletDetailsPayload>(
  `${SLICE_NAME}/fetchWalletDetails`,
  async (data, { rejectWithValue }) => {
    try {
      const wallet = await walletsApi.fetchWalletDetails(data);
      return wallet;
    } catch (err: any) {
      return rejectWithValue(err?.data);
    }
  },
);

export const updateWalletDetails = createAsyncThunk<UpdateWalletDetailsResponse, UpdateWalletDetailsPayload>(
  `${SLICE_NAME}/updateWalletDetails`,
  async (data, { rejectWithValue }) => {
    try {
      const wallet = await walletsApi.updateWalletDetails(data, data.code ? { headers: { "X-RINO-2FA": data.code } } : undefined);
      return wallet;
    } catch (err: any) {
      return rejectWithValue(err?.data);
    }
  },
);

export const deleteWallet = createAsyncThunk<DeleteWalletResponse, DeleteWalletPayload>(
  `${SLICE_NAME}/deleteWallet`,
  async (data, { rejectWithValue, getState }) => {
    try {
      let code = "";
      const { is2FaEnabled } = (getState() as any).session.user;
      if (is2FaEnabled) {
        code = await modals.enter2FACode();
      }
      const wallet = await walletsApi.deleteWallet(data, code ? { headers: { "X-RINO-2FA": code } } : undefined);
      return wallet;
    } catch (err: any) {
      return rejectWithValue(err?.data);
    }
  },
);

export const requestWalletShare = createAsyncThunk<void, RequestWalletShareThunkPayload>(
  `${SLICE_NAME}/walletShareRequest`,
  async (data, { rejectWithValue }) => {
    const requestBody = { email: data.email };
    try {
      await walletsApi.requestWalletShare(data.wallet.id, requestBody, data.code ? { headers: { "X-RINO-2FA": data.code } } : undefined);
    } catch (err: any) {
      return rejectWithValue(err?.data || err);
    }
  },
);

export const shareWallet = createAsyncThunk<void, ShareWalletThunkPayload>(
  `${SLICE_NAME}/shareWallet`,
  async (data, { rejectWithValue, getState, dispatch }) => {
    const requestBody = { access_level: data.accessLevel, email: data.email, encrypted_keys: "" };
    try {
      if (data.accessLevel === accessLevels.admin.code || data.accessLevel === accessLevels.spender.code) {
        const {
          encryptionPublicKey, email, username, encPrivateKey,
        } = (getState() as any).session.user;
        const { encryptionKey, clean: cleanDerivedKeys } = await deriveUserKeys(data.password, username);
        const encryptedWalletKeysJson = getEncryptedKeys(data.wallet, email);
        const encryptedWalletKeys = JSON.parse(encryptedWalletKeysJson).enc_content;
        const { encryptionPrivateKey, clean: cleanDecryptedKeys } = await decryptKeys(
          Uint8Array.from(Buffer.from(encPrivateKey.enc_content, "base64")),
          Uint8Array.from(Buffer.from(encPrivateKey.nonce, "base64")),
          encryptionKey,
        );
        const publicKeys = await publicKeysApi.fetchPublicKey({ email: data.email });
        // stop execution if there is no such user
        if (!publicKeys.length) {
          return;
        }
        const { walletKeys, walletPassword } = await walletInstance.decryptWalletKeys(
          Uint8Array.from(Buffer.from(encryptedWalletKeys, "base64")),
          Uint8Array.from(Buffer.from(encryptionPublicKey, "base64")),
          encryptionPrivateKey,
        );
        const reEncWalletKeys = await walletInstance.encryptWalletKeys(Uint8Array.from(Buffer.from(publicKeys[0].encryptionPublicKey, "base64")), walletKeys, walletPassword);
        requestBody.encrypted_keys = JSON.stringify({
          version: 1,
          method: "asymmetric",
          enc_content: Buffer.from(reEncWalletKeys).toString("base64"),
        });
        cleanDerivedKeys();
        cleanDecryptedKeys();
        if (data.update && data.member) {
          const response = await walletsApi.updateWalletAccess(data.wallet.id, data.member.id, requestBody, data.code ? { headers: { "X-RINO-2FA": data.code } } : undefined);
          await dispatch(removeMember(data.member.id));
          dispatch(addMember(updateShareWalletResponse(response)));
        } else {
          const response = await walletsApi.shareWallet(data.wallet.id, requestBody, data.code ? { headers: { "X-RINO-2FA": data.code } } : undefined);
          dispatch(addMember(updateShareWalletResponse(response)));
        }
      } else if (data.update && data.member) {
        const response = await walletsApi.updateWalletAccess(data.wallet.id, data.member.id, requestBody, data.code ? { headers: { "X-RINO-2FA": data.code } } : undefined);
        await dispatch(removeMember(data.member.id));
        dispatch(addMember(updateShareWalletResponse(response)));
      } else {
        const response = await walletsApi.shareWallet(data.wallet.id, requestBody, data.code ? { headers: { "X-RINO-2FA": data.code } } : undefined);
        dispatch(addMember(updateShareWalletResponse(response)));
      }
    } catch (err: any) {
      return rejectWithValue(err?.data || err);
    }
  },
);

export const removeWalletAccess = createAsyncThunk<RemoveWalletAccessResponse, RemoveWalletAccessPayload>(
  `${SLICE_NAME}/removeWalletAccess`,
  async (data, { rejectWithValue, dispatch }) => {
    try {
      const response = await walletsApi.removeWalletAccess(data);
      dispatch(removeMember(data.userId));
      return response;
    } catch (err: any) {
      return rejectWithValue(err?.data);
    }
  },
);
export interface State {
  data: Wallet | null;
  revokedUsers: WalletMember[];
  stage: string;
  pendingTransaction: PendingTransaction
  thunksInProgress: string[];
}

export const initialState: State = {
  data: null,
  revokedUsers: [],
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

export const walletSlice = createSlice({
  name: SLICE_NAME,
  initialState,
  reducers: {
    addMember(state, action: { payload: WalletMember }): void {
      if (state.data) {
        state.data = {
          ...state.data,
          members: [...state.data.members, action.payload],
        };
      }
    },
    removeMember(state, action: { payload: string }): void {
      if (state.data) {
        state.data = {
          ...state.data,
          members: state.data.members.filter((member) => member.id !== action.payload),
        };
      }
    },
    setStage(state, action: PayloadAction<string>): void {
      state.stage = action.payload;
    },
    setRevokedUsers(state, action: PayloadAction<WalletMember[]>): void {
      state.revokedUsers = action.payload;
    },
    setPendingTransaction(state, action: PayloadAction<PendingTransaction>): void {
      Object.assign(state.pendingTransaction, action.payload);
    },
    resetPendingTransaction(state): void {
      state.pendingTransaction = initialState.pendingTransaction;
    },
    reset(state): void {
      state.data = initialState.data;
      state.revokedUsers = initialState.revokedUsers;
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
      (data) => ({ data }),
    ),
    ...generateExtraReducer(
      updateWalletDetails,
      (data) => ({ data }),
    ),
    ...generateExtraReducer(deleteWallet),
    // ...generateExtraReducer(shareWallet),
    ...generateExtraReducer(removeWalletAccess),
  },
});

export const selectors = {
  getStage: (state: RootState): string => state[SLICE_NAME].stage,
  getWallet: (state: RootState): Wallet => state[SLICE_NAME].data,
  getPendingTransaction: (state: RootState): PendingTransaction => state[SLICE_NAME].pendingTransaction,
  getRevokedUsers: (state: RootState): WalletMember[] => state[SLICE_NAME].revokedUsers,
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
};

export const {
  addMember,
  removeMember,
  setStage,
  setPendingTransaction,
  reset,
  resetPendingTransaction,
  setRevokedUsers,
} = walletSlice.actions;
