import camelcaseKeys from "camelcase-keys";
import {unwrapResult} from "@reduxjs/toolkit";
import { store } from "../../store";
import sessionApi from "../../api/session";
import {
  initialState,
  signUp,
  signIn,
  signOut,
  getCurrentUser,
  switch2fa,
  reset,
  changePassword,
  updateUser,
  setupKeyPair,
  selectors,
} from "../../store/sessionSlice";
import signUpResponse from "../fixture/signUp.json";
import signInResponse from "../fixture/signIn.json";
import getCurrentUserResponse from "../fixture/getCurrentUser.json";
import modals from "../../modules/2FAModals";
import { TextEncoder, TextDecoder } from 'util';

(global as any).TextEncoder = TextEncoder;
(global as any).TextDecoder = TextDecoder;

jest.mock("../../api/session", () => {
  return {
    signUp: jest.fn(),
    signIn: jest.fn(),
    signOut: jest.fn(),
    getCurrentUser: jest.fn(),
    changePassword: jest.fn(),
    switch2fa: jest.fn(),
    updateUser: jest.fn(),
    setupKeyPair: jest.fn(),
    setToken: () => {},
  }
});

jest.mock("../../modules/2FAModals", () => {
  return {
    enter2FACode: jest.fn(),
  }
});

describe("SessionSlice", () => {
  it("Has initial state", () => {
    const state = store.getState().session;
    expect(state).toEqual(initialState);
  });
  it("Selectors returs expected data", () => {
    const state = store.getState();
    expect(selectors.getToken(state)).toEqual(initialState.token);
    expect(selectors.getUser(state)).toEqual(initialState.user);
    expect(selectors.getPassword(state)).toEqual(initialState.password);
  });
  it("signUp asyncThunk returns data", async() => {
    (sessionApi.signUp as any).mockResolvedValue(camelcaseKeys(signUpResponse, { deep: true }));
    const actionResponse = await store.dispatch(signUp({
      username: "pony",
      email: "new@test.com",
      password: "password",
      password_confirmation: "password",
    }));
    const response = unwrapResult(actionResponse as any)
    expect(response).toEqual(signUpResponse);
  });
  it("signIn asyncThunk changes token", async() => {
    (sessionApi.signIn as any).mockResolvedValue({ data: camelcaseKeys(signInResponse, { deep: true }) });
    unwrapResult(await store.dispatch(signIn({ username: "pony", password: "password" })) as any);
    expect(store.getState().session.token).toEqual(signInResponse.token);
  });
  it("signIn asyncThunk changes token (with 2fa)", async() => {
    store.dispatch(reset());
    (sessionApi.signIn as any).mockResolvedValue({ data: camelcaseKeys(signInResponse, { deep: true }) });
    // dispatch login action
    unwrapResult(await store.dispatch(signIn({ username: "new@test.com", password: "password", code: "123456" })) as any);
    // make sure that 2fa header is added to request

    expect((sessionApi.signIn as any).mock.calls[0][0]).toEqual({ username: "new@test.com", password: "password" });
    expect((sessionApi.signIn as any).mock.calls[0][1]).toEqual({ headers: { "X-RINO-2FA": "123456" }});
    expect((sessionApi.signIn as any).mock.calls.length).toEqual(1);
    expect(store.getState().session.token).toEqual(signInResponse.token);
  });
  it("signOut removes token", async() => {
    unwrapResult(await store.dispatch(signOut()) as any);
    expect((sessionApi.signOut as any).mock.calls.length).toEqual(1);
    expect(store.getState().session.token).toEqual("");
  });
  it("\"reset\" should restore the initial state", async () => {
    (sessionApi.getCurrentUser as any).mockResolvedValue(camelcaseKeys(getCurrentUserResponse, { deep: true }));
    unwrapResult(await store.dispatch(getCurrentUser()) as any);
    store.dispatch(reset());
    expect(store.getState().session).toEqual(initialState);
  });
  it("getCurrentUser fetches the current user object and updates the state", async() => {
    (sessionApi.getCurrentUser as any).mockResolvedValue(camelcaseKeys(getCurrentUserResponse, { deep: true }));
    unwrapResult(await store.dispatch(getCurrentUser()) as any);
    expect(store.getState().session.user.email).toEqual(getCurrentUserResponse.email);
  });
  it("changePassword thunk calls api request with provided request body", async() => {
    (sessionApi.getCurrentUser as any).mockResolvedValue(camelcaseKeys(getCurrentUserResponse, { deep: true }));
    unwrapResult(await store.dispatch(getCurrentUser()) as any);
    const thunkPayload = {
      new_password: "1234567890ss",
      current_password: "1234567890aa",
    };
    unwrapResult(await store.dispatch(changePassword(thunkPayload)) as any);
    expect((sessionApi.changePassword as any).mock.calls.length).toEqual(1);
  });
  it("switch2fa should change is2FaEnabled property of the current user", async() => {
    (sessionApi.getCurrentUser as any).mockResolvedValue(camelcaseKeys(getCurrentUserResponse, { deep: true }));
    unwrapResult(await store.dispatch(getCurrentUser()) as any);
    store.dispatch(switch2fa(!getCurrentUserResponse.is_2fa_enabled));
    expect(store.getState().session.user.is2FaEnabled).toEqual(!getCurrentUserResponse.is_2fa_enabled);
  });
  it("updateUser thunk calls api request with provided request body", async() => {
    (sessionApi.getCurrentUser as any).mockResolvedValue(camelcaseKeys(getCurrentUserResponse, { deep: true }));
    (sessionApi.updateUser as any).mockResolvedValue(camelcaseKeys(getCurrentUserResponse, { deep: true }));
    unwrapResult(await store.dispatch(getCurrentUser()) as any);
    const reqBody = {
      tx_notifications: false,
    };
    unwrapResult(await store.dispatch(getCurrentUser()) as any);
    unwrapResult(await store.dispatch(updateUser(reqBody)) as any);
    expect((sessionApi.updateUser as any).mock.calls[0][0]).toEqual(reqBody);
    expect((sessionApi.updateUser as any).mock.calls.length).toEqual(1);
  });
  it("setupKeyPair thunk calls api request with provided request body", async() => {
    const thunkPayload = {
      authKey: new Uint8Array(),
      recoveryKey: new Uint8Array(),
      encryptionPublicKey: new Uint8Array(),
      signingPublicKey: new Uint8Array(), 
      encPrivateKeysDataSet: {
        ek: {
          encryptedMessage: new Uint8Array(),
          nonce: new Uint8Array(),
        },
        rk: {
          encryptedMessage: new Uint8Array(),
          nonce: new Uint8Array(),
        }
      }, 
      signature: new Uint8Array(),
      clean: () => {},
    }
    unwrapResult(await store.dispatch(setupKeyPair(thunkPayload)) as any);
    expect((sessionApi.setupKeyPair as any).mock.calls.length).toEqual(1);
  });
});
