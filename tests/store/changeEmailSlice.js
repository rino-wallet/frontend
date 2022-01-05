import { unwrapResult } from "@reduxjs/toolkit";
import camelcaseKeys from "camelcase-keys";
import { expect } from "chai";
import { store } from "../../src/store/index.ts";
import { initialState, reset, changeEmailRequest, getEmailChangingInfo, confirmEmailChanging, selectors } from "../../src/store/changeEmailSlice";
import { sessionApiStub } from "../fixture/apiStubs";
import emailChangeInfoResponse from "../fixture/emailChangeInfo.json";

describe("changeEmailSlice.spec", () => {
  afterEach(() => {
    store.dispatch(reset());
  });
  it("Has initial state", () => {
    const state = store.getState().changeEmail;
    expect(state).to.deep.equal(initialState);
  });
  it("Selectors returs expected data", () => {
    const state = store.getState();
    expect(selectors.getDetails(state)).to.equal(initialState.details);
    expect(selectors.getSucceeded(state)).to.equal(initialState.succeeded);
    expect(selectors.getError(state)).to.equal(initialState.error);
  });
  it("changeEmailRequest thunk calls api request with provided request body", async() => {
    const reqBody = {
      new_email: "test@test.com",
      current_password: "password",
    };
    unwrapResult(await store.dispatch(changeEmailRequest(reqBody)));
    expect(sessionApiStub.changeEmailRequest.withArgs(reqBody).callCount).to.equal(1);
  });
  it("getEmailChangingInfo thunk calls api request with provided request body", async() => {
    const reqBody = { token: "token" };
    unwrapResult(await store.dispatch(getEmailChangingInfo(reqBody)));
    expect(sessionApiStub.getEmailChangingInfo.withArgs(reqBody).callCount).to.equal(1);
    expect(store.getState().changeEmail.details).to.deep.equal(camelcaseKeys(emailChangeInfoResponse));
  });
  it("confirmEmailChanging thunk calls api request with provided request body", async() => {
    const reqBody = { token: "token" };
    unwrapResult(await store.dispatch(confirmEmailChanging(reqBody)));
    expect(sessionApiStub.confirmEmailChanging.withArgs(reqBody).callCount).to.equal(1);
    expect(store.getState().changeEmail.succeeded).to.equal(true);
  });
  it("\"reset\" should restore the initial state", async () => {
    store.dispatch(reset());
    expect(store.getState().changeEmail).to.deep.equal(initialState);
  });
});
