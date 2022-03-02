import { unwrapResult } from "@reduxjs/toolkit";
import camelcaseKeys from "camelcase-keys";
import { store } from "../../store";
import { create2FA, enable2FA, delete2FA, setProvisioningUri, setSecretKey, reset, initialState, selectors } from "../../store/otpSlice";
import otpApi from "../../api/otp";
import sessionApi from "../../api/session";
import { getCurrentUser } from "../../store/sessionSlice";
import create2FAResponse from "../fixture/create2FA.json";
import getCurrentUserResponse from "../fixture/getCurrentUser.json";


jest.mock("../../api/otp", () => {
  return {
    create2FA: jest.fn(),
    enable2FA: jest.fn(),
    delete2FA: jest.fn(),
    setToken: () => {},
  }
});
jest.mock("../../api/session", () => {
  return {
    getCurrentUser: jest.fn(),
    setToken: () => {},
  }
});

describe("otpSlice", () => {
  afterEach(() => {
    store.dispatch(reset());
  });
  it("Has initial state", () => {
    const state = store.getState().otp;
    expect(state).toEqual(initialState);
  });
  it("Selectors returs expected data", () => {
    const state = store.getState();
    expect(selectors.getProvisioningUri(state)).toEqual(initialState.provisioningUri);
    expect(selectors.getSecretKey(state)).toEqual(initialState.secretKey);
  });
  it("setProvisioningUri changes provisioningUri", () => {
    const provisioningUri = "provisioningUri";
    store.dispatch(setProvisioningUri(provisioningUri));
    expect(store.getState().otp.provisioningUri).toEqual(provisioningUri);
  });
  it("setSecretKey changes secretKey", () => {
    const secretKey = "secretKey";
    store.dispatch(setSecretKey(secretKey));
    expect(store.getState().otp.secretKey).toEqual(secretKey);
  });
  it("create2FA fetches provisioningUri, secretKey and updates the state", async() => {
    (otpApi.create2FA as any).mockResolvedValue(camelcaseKeys(create2FAResponse, { deep: true }));
    unwrapResult(await store.dispatch(create2FA()) as any);
    expect(store.getState().otp.secretKey).toEqual(create2FAResponse.secret_key);
    expect(store.getState().otp.provisioningUri).toEqual(create2FAResponse.provisioning_uri);
  });
  it("enable2FA should call api method and update user object", async() => {
    (otpApi.enable2FA as any).mockResolvedValue();
    (sessionApi.getCurrentUser as any).mockResolvedValue(camelcaseKeys(getCurrentUserResponse, { deep: true }));
    unwrapResult(await store.dispatch(getCurrentUser()) as any);
    unwrapResult(await store.dispatch(enable2FA({ code: "123456" })) as any);
    expect((otpApi.enable2FA as any).mock.calls[0][0]).toEqual({ code: "123456" });
    expect((otpApi.enable2FA as any).mock.calls.length).toEqual(1);
    expect(store.getState().session.user.is2FaEnabled).toEqual(true);
  });
  it("delete2FA should call api method and update user object", async() => {
    (sessionApi.getCurrentUser as any).mockResolvedValue(camelcaseKeys(getCurrentUserResponse, { deep: true }));
    unwrapResult(await store.dispatch(getCurrentUser()) as any);
    unwrapResult(await store.dispatch(delete2FA({ code: "123456" })) as any);
    expect((otpApi.delete2FA as any).mock.calls[0][0]).toEqual({ code: "123456" });
    expect((otpApi.delete2FA as any).mock.calls.length).toEqual(1);
    expect(store.getState().session.user.is2FaEnabled).toEqual(false);
  });
});
