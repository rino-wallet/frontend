import {createSlice, PayloadAction, createAsyncThunk} from "@reduxjs/toolkit";
import {
  SignUpThunkPayload,
  SignUpResponse,
  SignInPayload,
  SignInResponse,
  SetUpKeyPairThunkPayload,
  SetUpKeyPairResponse,
  UserResponse,
  User,
  ChangePasswordThunkPayload,
  UpdateUserPayload,
  RootState,
  EncryptedPrivateKeysData,
  ResetPasswordConfirmThunkPayload,
} from "../types";
import sessionApi from "../api/session";
import { saveToken } from "./sessionUItils";
import { createLoadingSelector, deriveUserKeys, generateExtraReducer, reencrypPrivateKey } from "../utils";
import modals from "../modules/2FAModals";
import { fullReset } from "./actions";

function createPrivateKeyJson(data: EncryptedPrivateKeysData): string {
  return JSON.stringify({
    version: 1,
    method: "symmetric",
    enc_content: Buffer.from(data.encryptedMessage).toString("base64"),
    nonce: Buffer.from(data.nonce).toString("base64"),
  });
}

export const signUp = createAsyncThunk<SignUpResponse, SignUpThunkPayload>(
  "session/signUp",
  async (data: SignUpThunkPayload, { rejectWithValue }) => {
    try {
      const { authKey, clean } = await deriveUserKeys(data.password, data.username);
      const password = Buffer.from(authKey).toString("hex");
      clean();
      const response = await sessionApi.signUp({
        ...data,
        password: password,
        password_confirmation: password,
      });
      return response;
    } catch(err) {
      return rejectWithValue(err?.data)
    }
  },
);

export const signIn = createAsyncThunk<SignInResponse, SignInPayload>(
  "session/signIn",
  async (credentials: SignInPayload, { rejectWithValue, dispatch }) => {
    try {
      let response = await sessionApi.signIn(credentials);
      if (response.status === 202) {
        const code = await modals.enter2FACode();
        response = await sessionApi.signIn(credentials, {
          headers: { "X-RINO-2FA": code || "" },
        });
      }
      dispatch(setToken(response.data.token));
      return response.data;
    } catch(err) {
      return rejectWithValue(err?.data)
    }
  },
);

export const signOut = createAsyncThunk<void, void>(
  "session/signOut",
  async (_, { rejectWithValue, dispatch }) => {
    try {
      const response = await sessionApi.signOut();
      try {
        localStorage.clear(); // this is workaround for mocha which does not have window object
        // TODO: add a separate module to work with local storage, we can use "store" library
      } catch {
        console.error("localStorage is not available")
      }
      dispatch(fullReset());
      return response;  
    } catch(err) {
      return rejectWithValue(err?.data)
    }
  },
);

export const setupKeyPair = createAsyncThunk<SetUpKeyPairResponse, SetUpKeyPairThunkPayload>(
  "session/setupKeyPair",
  async (payload, { rejectWithValue, dispatch }) => {
    try {
      const response = await sessionApi.setupKeyPair({
        enc_private_key: createPrivateKeyJson(payload.encPrivateKeysDataSet.ek),
        enc_private_key_backup: createPrivateKeyJson(payload.encPrivateKeysDataSet.rk),
        encryption_public_key: Buffer.from(payload.encryptionPublicKey).toString("base64"),
        signing_public_key: Buffer.from(payload.signingPublicKey).toString("base64"),
        signature: Buffer.from(payload.signature).toString("base64"),
      });
      dispatch(getCurrentUser());
      return response;  
    } catch(err) {
      return rejectWithValue(err?.data)
    }
  },
);

export const getCurrentUser = createAsyncThunk<UserResponse, void>(
  "session/getCurrentUser",
  async (_, { rejectWithValue }) => {
    try {
      const response = await sessionApi.getCurrentUser();
      return response;  
    } catch(err) {
      return rejectWithValue(err?.data)
    }
  },
);


export const resetPasswordConfirm = createAsyncThunk<void, ResetPasswordConfirmThunkPayload>(
  "session/resetPasswordConfirm",
  async (payload, { rejectWithValue }) => {
    try {
      const { encPrivateKeyBackup, username } = await sessionApi.fetchBackupPrivateKey({
        uid: payload.uid,
        token: payload.token,
      });
      const encPrivateKeyBackupJson = JSON.parse(encPrivateKeyBackup);
      const { authKey, encPrivateKeysDataSet, signature, clean } = await reencrypPrivateKey(
        Buffer.from(encPrivateKeyBackupJson.enc_content, "base64"),
        Buffer.from(encPrivateKeyBackupJson.nonce, "base64"),
        Buffer.from(payload.recovery_key, "hex"),
        payload.new_password,
        username,
      );
      const response = await sessionApi.resetPasswordConfirm({
        uid: payload.uid,
        token: payload.token,
        new_password: Buffer.from(authKey).toString("hex"),
        re_new_password: Buffer.from(authKey).toString("hex"),
        signature: Buffer.from(signature).toString("base64"),
        enc_private_key: createPrivateKeyJson(encPrivateKeysDataSet.ek),
      });
      clean();
      return response;  
    } catch(err) {
      return rejectWithValue(err?.data || err);
    }
  },
);

export const changePassword = createAsyncThunk<void, ChangePasswordThunkPayload>(
  "session/changePassword",
  async (data, { rejectWithValue, getState }) => {
    try {
      let code = "";
      const { is2FaEnabled, username, encPrivateKey } = (getState() as any).session.user;
      const { authKey: authKeyOld, encryptionKey: encryptionKeyOld, clean: cleanOld } = await deriveUserKeys(data.current_password, username);
      const { authKey: authKeyNew, encPrivateKeysDataSet, signature, clean: cleanNew } = await reencrypPrivateKey(
        Buffer.from(encPrivateKey.enc_content, "base64"),
        Buffer.from(encPrivateKey.nonce, "base64"),
        encryptionKeyOld,
        data.new_password,
        username,
      );
      const requestBody = {
        new_password: Buffer.from(authKeyNew).toString("hex"),
        re_new_password: Buffer.from(authKeyNew).toString("hex"),
        current_password: Buffer.from(authKeyOld).toString("hex"),
        enc_private_key: createPrivateKeyJson(encPrivateKeysDataSet.ek),
        signature: Buffer.from(signature).toString("base64"),
      }
      cleanOld();
      cleanNew();
      if (is2FaEnabled) {
        code = await modals.enter2FACode();
      }
      const response = await sessionApi.changePassword(requestBody, code ? { headers: { "X-RINO-2FA": code } } : undefined);
      return response;  
    } catch(err) {
      return rejectWithValue(err?.data || err)
    }
  },
);

export const updateUser = createAsyncThunk<UserResponse, UpdateUserPayload>(
  "session/updateUser",
  async (data, { rejectWithValue }) => {
    try {
      const response = await sessionApi.updateUser(data);
      return response;  
    } catch(err) {
      return rejectWithValue(err?.data)
    }
  },
);

interface State {
  token: string;
  password: string;
  user: User | null;
  preventNavigation: boolean;
  thunksInProgress: string[];
}

export const initialState: State = {
  token: "",
  password: "",
  user: null,
  preventNavigation: false,
  thunksInProgress: [],
};

const SLICE_NAME = "session";

export const sessionSlice = createSlice({
  name: SLICE_NAME,
  initialState,
  reducers: {
    setToken(state, action: PayloadAction<string>): void {
      state.token = action.payload;
      saveToken(action.payload);
    },
    switch2fa(state, action: PayloadAction<boolean>): void {
      if (state.user) {
        state.user = { ...state.user, is2FaEnabled: action.payload };
      }
    },
    setPassword(state, action: PayloadAction<string>): void {
      state.password = action.payload;
    },
    reset(state): void {
      state.token = initialState.token;
      state.password = initialState.password;
      state.user = initialState.user;
      state.thunksInProgress = initialState.thunksInProgress;
      state.preventNavigation = initialState.preventNavigation;
    },
    setPreventNavigation(state, action: PayloadAction<boolean>): void {
      state.preventNavigation = action.payload;
    }
  },
  extraReducers: {
    ...generateExtraReducer(signUp),
    ...generateExtraReducer(signIn),
    ...generateExtraReducer(signOut),
    ...generateExtraReducer(setupKeyPair),
    ...generateExtraReducer(
      getCurrentUser,
      (data) => ({ user: updateResponse(data) })
    ),
    ...generateExtraReducer(changePassword),
    ...generateExtraReducer(
      updateUser,
      (data) => ({ user: updateResponse(data) })
    ),
  }
});

export const selectors = {
  getToken: (state: RootState): string => state[SLICE_NAME].token,
  getPassword: (state: RootState): string => state[SLICE_NAME].password,
  getPreventNavigation: (state: RootState): boolean => state[SLICE_NAME].preventNavigation,
  getUser: (state: RootState): User => state[SLICE_NAME].user,
  // thunk statuses
  pendingSignUp: createLoadingSelector(SLICE_NAME, signUp.pending.toString()),
  pendingSignIn: createLoadingSelector(SLICE_NAME, signIn.pending.toString()),
  pendingSignOut: createLoadingSelector(SLICE_NAME, signOut.pending.toString()),
  pendingSetupKeyPair: createLoadingSelector(SLICE_NAME, setupKeyPair.pending.toString()),
  pendingGetCurrentUser: createLoadingSelector(SLICE_NAME, getCurrentUser.pending.toString()),
  pendingResetPasswordConfirm: createLoadingSelector(SLICE_NAME, resetPasswordConfirm.pending.toString()),
  pendingChangePassword: createLoadingSelector(SLICE_NAME, changePassword.pending.toString()),
  pendingUpdateUser: createLoadingSelector(SLICE_NAME, updateUser.pending.toString()),
}

function updateResponse (data: UserResponse): User {
  const parsedKeypairJson = data.keypair ? JSON.parse(data.keypair.encPrivateKey) : {};
  return {
    ...data,
    encPrivateKey: parsedKeypairJson,
    encryptionPublicKey: data.keypair?.encryptionPublicKey || "",
    signingPublicKey: data.keypair?.signingPublicKey || "",
  }
}

export const {setToken, switch2fa, setPassword, setPreventNavigation, reset} = sessionSlice.actions;
