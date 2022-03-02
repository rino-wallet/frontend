import { unwrapResult } from "@reduxjs/toolkit";
import camelcaseKeys from "camelcase-keys";
import { store } from "../../store";
import sessionApi from "../../api/session";
import { initialState, reset, changeEmailRequest, getEmailChangingInfo, confirmEmailChanging, selectors } from "../../store/changeEmailSlice";
import emailChangeInfoResponse from "../fixture/emailChangeInfo.json";

jest.mock("../../api/session", () => {
  return {
    changeEmailRequest: jest.fn(),
    getEmailChangingInfo: jest.fn(),
    confirmEmailChanging: () => {},
    setToken: () => {},
  }
});

describe("changeEmailSlice", () => {
  afterEach(() => {
    store.dispatch(reset());
  });
  it("Has initial state", () => {
    const state = store.getState().changeEmail;
    expect(state).toEqual(initialState);
  });
  it("Selectors returs expected data", () => {
    const state = store.getState();
    expect(selectors.getDetails(state)).toEqual(initialState.details);
    expect(selectors.getSucceeded(state)).toEqual(initialState.succeeded);
    expect(selectors.getError(state)).toEqual(initialState.error);
  });
  it("changeEmailRequest thunk calls api request with provided request body", async() => {
    const reqBody = {
      new_email: "test@test.com",
      current_password: "password",
    };
    unwrapResult(await store.dispatch(changeEmailRequest(reqBody)) as any);
    expect((sessionApi.changeEmailRequest as any).mock.calls[0][0]).toEqual(reqBody);
  });
  it("getEmailChangingInfo thunk calls api request and changes details", async() => {
    (sessionApi.getEmailChangingInfo as any).mockResolvedValue(camelcaseKeys(emailChangeInfoResponse, { deep: true }));
    const reqBody = { token: "token" };
    unwrapResult(await store.dispatch(getEmailChangingInfo(reqBody)) as any);
    expect(store.getState().changeEmail.details).toEqual(camelcaseKeys(emailChangeInfoResponse));
  });
  it("confirmEmailChanging thunk calls api request and changes succeeded flag", async() => {
    const reqBody = { token: "token" };
    unwrapResult(await store.dispatch(confirmEmailChanging(reqBody)) as any);
    expect(store.getState().changeEmail.succeeded).toEqual(true);
  });
  it("\"reset\" should restore the initial state", async () => {
    store.dispatch(reset());
    expect(store.getState().changeEmail).toEqual(initialState);
  });
});
