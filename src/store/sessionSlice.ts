import {createSlice, PayloadAction, createAsyncThunk} from "@reduxjs/toolkit";
import {
  SignUpPayload,
  SignUpResponse,
  SignInPayload,
  SignInResponse,
  SetUpKeyPairPayload,
  SetUpKeyPairResponse,
  UserResponse,
  User,
  ChangePasswordPayload,
  UpdateUserPayload,
  RootState,
} from "../types";
import sessionApi from "../api/session";
import { saveToken } from "./sessionUItils";
import { createLoadingSelector, generateExtraReducer } from "../utils";
import modals from "../modules/2FAModals";
import { fullReset } from "./actions";

export const signUp = createAsyncThunk<SignUpResponse, SignUpPayload>(
  "session/signUp",
  async (data: SignUpPayload, { rejectWithValue }) => {
    try {
      const response = await sessionApi.signUp(data);
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
      dispatch(fullReset());
      return response;  
    } catch(err) {
      return rejectWithValue(err?.data)
    }
  },
);

export const setupKeyPair = createAsyncThunk<SetUpKeyPairResponse, SetUpKeyPairPayload>(
  "session/setupKeyPair",
  async (payload, { rejectWithValue, dispatch }) => {
    try {
      const response = await sessionApi.setupKeyPair(payload);
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

export const changePassword = createAsyncThunk<void, ChangePasswordPayload>(
  "session/changePassword",
  async (data, { rejectWithValue, getState }) => {
    try {
      let code = "";
      const { is2FaEnabled } = (getState() as any).session.user;
      if (is2FaEnabled) {
        code = await modals.enter2FACode();
      }
      const response = await sessionApi.changePassword(data, code ? { headers: { "X-RINO-2FA": code } } : undefined);
      return response;  
    } catch(err) {
      return rejectWithValue(err?.data)
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
  thunksInProgress: string[];
}

export const initialState: State = {
  token: "",
  password: "",
  user: null,
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
    },
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
  getUser: (state: RootState): User => state[SLICE_NAME].user,
  // thunk statuses
  pendingSignUp: createLoadingSelector(SLICE_NAME, signUp.pending.toString()),
  pendingSignIn: createLoadingSelector(SLICE_NAME, signIn.pending.toString()),
  pendingSignOut: createLoadingSelector(SLICE_NAME, signOut.pending.toString()),
  pendingSetupKeyPair: createLoadingSelector(SLICE_NAME, setupKeyPair.pending.toString()),
  pendingGetCurrentUser: createLoadingSelector(SLICE_NAME, getCurrentUser.pending.toString()),
  pendingChangePassword: createLoadingSelector(SLICE_NAME, changePassword.pending.toString()),
  pendingUpdateUser: createLoadingSelector(SLICE_NAME, updateUser.pending.toString()),
}

function updateResponse (data: UserResponse): User {
  return {
    ...data,
    publicKey: data.keypair?.publicKey || "",
    encPrivateKey: data.keypair?.encPrivateKey || "",
    fingerprint: data.keypair?.fingerprint || "",
  }
}

export const {setToken, switch2fa, setPassword, reset} = sessionSlice.actions;
