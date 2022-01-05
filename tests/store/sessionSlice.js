import sinon from "sinon";
import camelcaseKeys from "camelcase-keys";
import {unwrapResult} from "@reduxjs/toolkit";
import { expect } from "chai";
import { store } from "../../src/store";
import sessionApi from "../../src/api/session";
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
} from "../../src/store/sessionSlice";
import { sessionApiStub } from "../fixture/apiStubs";
import signUpResponse from "../fixture/signUp.json";
import signInResponse from "../fixture/signIn.json";
import getCurrentUserResponse from "../fixture/getCurrentUser.json";
import modals from "../../src/modules/2FAModals";

describe("SessionSlice", () => {
  before(() => {
    store.dispatch(reset());
  });
  it("Has initial state", () => {
    const state = store.getState().session;
    expect(state).to.deep.equal(initialState);
  });
  it("Selectors returs expected data", () => {
    const state = store.getState();
    expect(selectors.getToken(state)).to.equal(initialState.token);
    expect(selectors.getUser(state)).to.equal(initialState.user);
    expect(selectors.getPassword(state)).to.equal(initialState.password);
  });
  it("signUp asyncThunk returns data", async() => {
    const actionResponse = await store.dispatch(signUp({ email: "new@email.com", password: "password", password_confirmation: "password" }));
    const response = unwrapResult(actionResponse)
    expect(response).to.deep.equal(signUpResponse);
  });
  it("signIn asyncThunk changes token", async() => {
    unwrapResult(await store.dispatch(signIn({ email: "new@email.com", password: "password" })));
    expect(store.getState().session.token).to.equal(signInResponse.token);
  });
  it("signIn asyncThunk changes token (with 2fa)", async() => {
    store.dispatch(reset());
    // restore stub, and add 202 response status code, wich means that 2fa is required
    sessionApiStub.signIn.restore();
    const signInStub = sinon.stub(sessionApi, "signIn").resolves(camelcaseKeys({ data: signInResponse, status: 202 }, { deep: true }));
    // mock the module for entering 2fa code
    const enterCodeStub = sinon.stub(modals, "enter2FACode").resolves(123456);
    // dispatch login action
    unwrapResult(await store.dispatch(signIn({ email: "new@email.com", password: "password" })));
    // make sure that 2fa header is added to request
    expect(sessionApi.signIn.withArgs({ email: "new@email.com", password: "password" }, { headers: { "X-RINO-2FA": 123456 } }).callCount).to.equal(1);
    expect(store.getState().session.token).to.equal(signInResponse.token);
    enterCodeStub.restore();
    signInStub.restore();
  });
  it("signOut removes token", async() => {
    unwrapResult(await store.dispatch(signOut()));
    expect(store.getState().session.token).to.equal("");
  });
  it("\"reset\" should restore the initial state", async () => {
    unwrapResult(await store.dispatch(getCurrentUser()));
    store.dispatch(reset());
    expect(store.getState().session).to.deep.equal(initialState);
  });
  it("getCurrentUser fetches the current user object and updates the state", async() => {
    unwrapResult(await store.dispatch(getCurrentUser()));
    expect(store.getState().session.user.email).to.equal(getCurrentUserResponse.email);
  });
  it("changePassword thunk calls api request with provided request body", async() => {
    const reqBody = {
      new_password: "password",
      re_new_password: "password",
      current_password: "current password",
      enc_private_key: "private key",
      signature: "signature",
    };
    unwrapResult(await store.dispatch(changePassword(reqBody)));
    expect(sessionApiStub.changePassword.withArgs(reqBody).callCount).to.equal(1);
  });
  it("switch2fa should change is2FaEnabled property of the current user", async() => {
    unwrapResult(await store.dispatch(getCurrentUser()));
    store.dispatch(switch2fa(!getCurrentUserResponse.is_2fa_enabled));
    expect(store.getState().session.user.is2FaEnabled).to.equal(!getCurrentUserResponse.is_2fa_enabled);
  });
  it("updateUser thunk calls api request with provided request body", async() => {
    const reqBody = {
      name: "Bugs Bunny",
    };
    unwrapResult(await store.dispatch(updateUser(reqBody)));
    expect(sessionApiStub.updateUser.withArgs(reqBody).callCount).to.equal(1);
  });
  it("setupKeyPair thunk calls api request with provided request body", async() => {
    const reqBody = {
      enc_private_key: "enc_private_key",
      enc_private_key_backup: "enc_private_key_backup",
      public_key: "public_key", 
      signature: "signature",
    }
    unwrapResult(await store.dispatch(setupKeyPair(reqBody)));
    expect(sessionApi.setupKeyPair.withArgs(reqBody).callCount).to.equal(1);
  });
});
