import { unwrapResult } from "@reduxjs/toolkit";
import { expect } from "chai";
import { store } from "../../src/store";
import { create2FA, enable2FA, delete2FA, setProvisioningUri, setSecretKey, reset, initialState, selectors } from "../../src/store/otpSlice";
import otpApi from "../../src/api/otp";
import { getCurrentUser } from "../../src/store/sessionSlice";
import create2FAResponse from "../fixture/create2FA.json";

describe("otpSlice", () => {
  afterEach(() => {
    store.dispatch(reset());
  });
  it("Has initial state", () => {
    const state = store.getState().otp;
    expect(state).to.deep.equal(initialState);
  });
  it("Selectors returs expected data", () => {
    const state = store.getState();
    expect(selectors.getProvisioningUri(state)).to.equal(initialState.provisioningUri);
    expect(selectors.getSecretKey(state)).to.equal(initialState.secretKey);
  });
  it("setProvisioningUri changes provisioningUri", () => {
    const provisioningUri = "provisioningUri";
    store.dispatch(setProvisioningUri(provisioningUri));
    expect(store.getState().otp.provisioningUri).to.equal(provisioningUri);
  });
  it("setSecretKey changes secretKey", () => {
    const secretKey = "secretKey";
    store.dispatch(setSecretKey(secretKey));
    expect(store.getState().otp.secretKey).to.equal(secretKey);
  });
  it("create2FA fetches provisioningUri, secretKey and updates the state", async() => {
    unwrapResult(await store.dispatch(create2FA()));
    expect(store.getState().otp.secretKey).to.equal(create2FAResponse.secret_key);
    expect(store.getState().otp.provisioningUri).to.equal(create2FAResponse.provisioning_uri);
  });
  it("enable2FA should call api method and update user object", async() => {
    unwrapResult(await store.dispatch(getCurrentUser()));
    unwrapResult(await store.dispatch(enable2FA({ code: "123456" })));
    expect(otpApi.enable2FA.withArgs({ code: "123456" }).callCount).to.equal(1);
    expect(store.getState().session.user.is2FaEnabled).to.equal(true);
  });
  it("delete2FA should call api method and update user object", async() => {
    unwrapResult(await store.dispatch(getCurrentUser()));
    unwrapResult(await store.dispatch(delete2FA({ code: "123456" })));
    expect(otpApi.delete2FA.withArgs({ code: "123456" }).callCount).to.equal(1);
    expect(store.getState().session.user.is2FaEnabled).to.equal(false);
  });
});
