import {unwrapResult} from "@reduxjs/toolkit";
import camelcaseKeys from "camelcase-keys";
import { store } from "../../store";
import { getRandString } from "../../utils";
import tasksApi from "../../api/tasks";
import walletApi from "../../api/wallets";
import sessionApi from "../../api/session";
import {
  initialState,
  createNewWallet,
  setStage,
  reset,
  openWallet,
  fetchWalletDetails,
  // shareWallet,
  removeWalletAccess,
  addMember,
  removeMember,
  deleteWallet,
  selectors,
} from "../../store/walletSlice";
import {
  getCurrentUser,
} from "../../store/sessionSlice";
import walletDetailsResponse from "../fixture/walletDetails.json";
import createWalletTaskResponse from "../fixture/createWalletTask.json";
import fetchWalletDetailsResponse from "../fixture/walletDetails.json";
import shareWalletResponse from "../fixture/shareWallet.json";
import getCurrentUserResponse from "../fixture/getCurrentUser.json";
import { TextEncoder, TextDecoder } from 'util';

(global as any).TextEncoder = TextEncoder;
(global as any).TextDecoder = TextDecoder;

jest.setTimeout(60 * 1000);

jest.mock("../../api/tasks", () => {
  return {
    checkTask: jest.fn(),
    setToken: () => {},
  }
});

jest.mock("../../api/wallets", () => {
  return {
    createWallet: jest.fn(),
    finalizeWallet: jest.fn(),
    fetchWalletDetails: jest.fn(),
    shareWallet: jest.fn(),
    removeWalletAccess: jest.fn(),
    fetchWalletSubaddresses: jest.fn(),
    createSubaddress: jest.fn(),
    deleteWallet: jest.fn(),
    setToken: () => {},
  }
});

jest.mock("../../api/session", () => {
  return {
    getCurrentUser: jest.fn(),
    setToken: () => {},
  }
});


describe("WalletSlice", () => {
  it("Has initial state", () => {
    expect(store.getState().wallet).toEqual(initialState);
  });
  it("Selectors returs expected data", () => {
    const state = store.getState();
    expect(selectors.getStage(state)).toEqual(initialState.stage);
    expect(selectors.getWallet(state)).toEqual(initialState.data);
  });
  it("setStage should change stage value", () => {
    const string = getRandString();
    store.dispatch(setStage(string));
    expect(store.getState().wallet.stage).toEqual(string);
  });
  it("createNewWallet should create User, Backup and Server wallets, and push the new wallet to the wallet list", async() => {
    (sessionApi.getCurrentUser as any).mockResolvedValue(camelcaseKeys(getCurrentUserResponse, { deep: true }));
    (walletApi.createWallet as any).mockResolvedValue(camelcaseKeys({ taskId: "1" }, { deep: true }));
    (walletApi.finalizeWallet as any).mockResolvedValue(camelcaseKeys({ taskId: "1" }, { deep: true }));
    (tasksApi.checkTask as any).mockResolvedValue(camelcaseKeys(createWalletTaskResponse, { deep: true }));

    unwrapResult(await store.dispatch(getCurrentUser()) as any);
    const actionResponse = await store.dispatch(createNewWallet({ name: "Main" }));
    const response = unwrapResult(actionResponse as any);
    expect(response).toHaveProperty("userWallet");
    expect(response).toHaveProperty("backupWallet");
  });
  it("openWallet should restore and open in memory wallet", async() => {
    (walletApi.fetchWalletDetails as any).mockResolvedValue(camelcaseKeys(fetchWalletDetailsResponse, { deep: true }));
    unwrapResult(await store.dispatch(fetchWalletDetails({ id: "a wallet id" })) as any);
    const wallet = store.getState().wallet.data;
    const response = unwrapResult(await store.dispatch(openWallet({ wallet, loginPassword: "1234567890aa" })) as any);
    expect(response.address).toEqual(walletDetailsResponse.address);
  });
  it("fetchWalletDetails should fetch the wallet and update store", async() => {
    (walletApi.fetchWalletDetails as any).mockResolvedValue(camelcaseKeys(fetchWalletDetailsResponse, { deep: true }));
    unwrapResult(await store.dispatch(fetchWalletDetails({ id: "a wallet id" })) as any);
    expect(store.getState().wallet.data.id).toEqual(fetchWalletDetailsResponse.id);
  });
  it("reset should set the initial state", async() => {
    (walletApi.fetchWalletDetails as any).mockResolvedValue(camelcaseKeys(fetchWalletDetailsResponse, { deep: true }));
    unwrapResult(await store.dispatch(fetchWalletDetails({ id: "a wallet id" })) as any);
    expect(store.getState().wallet.data.id).toEqual(fetchWalletDetailsResponse.id);
    store.dispatch(reset());
    expect(store.getState().wallet).toEqual(initialState);
  });
  it("addMember adds new member to the list of wallet mebers", async() => {
    (walletApi.fetchWalletDetails as any).mockResolvedValue(camelcaseKeys(fetchWalletDetailsResponse, { deep: true }));
    (walletApi.shareWallet as any).mockResolvedValue(camelcaseKeys(shareWalletResponse, { deep: true }));
    unwrapResult(await store.dispatch(fetchWalletDetails({ id: "a wallet id" })) as any);
    store.dispatch(addMember({
      id: "user id",
      user: "user@emai.com",
      accessLevel: "30",
      encryptedKeys: "",
      createdAt: "",
      updatedAt: "",
    }));
    expect(store.getState().wallet.data.members.filter((member: any) => member.id === "user id").length).toEqual(1);
  });
  it("removeMember removes user from the list of wallet mebers", async() => {
    (walletApi.fetchWalletDetails as any).mockResolvedValue(camelcaseKeys(fetchWalletDetailsResponse, { deep: true }));
    unwrapResult(await store.dispatch(fetchWalletDetails({ id: "a wallet id" })) as any);
    const wallet = store.getState().wallet.data;
    const memberId = wallet.members[0].id;
    store.dispatch(removeMember(memberId));
    expect(store.getState().wallet.data.members.filter((member: any) => member.id === memberId).length).toEqual(0);
  });
  // it("shareWallet update wallet members", async() => {
  //   unwrapResult(await store.dispatch(fetchWalletDetails({ id: "a wallet id" })));
  //   const wallet = store.getState().wallet.data;
  //   const requestBody = {
  //     access_level: 20,
  //     encrypted_keys: "",
  //     email: "test1@test.com",
  //   };
  //   const thunkArgs = {
  //     wallet: wallet,
  //     loginPassword: "1234567890aa",
  //     body: requestBody,
  //   }
  //   unwrapResult(await store.dispatch(shareWallet(thunkArgs)));
  //   expect(store.getState().wallet.data.members.filter(member => member.id === shareWalletResponse.id).length).toEqual(1);
  // });
  it("removeWalletAccess should call api method and update wallet members", async() => {
    const wallet = store.getState().wallet.data;
    const thunkArgs = {
      userId: shareWalletResponse.id,
      walletId: wallet.id,
    }
    unwrapResult(await store.dispatch(removeWalletAccess(thunkArgs)) as any);
    expect((walletApi.removeWalletAccess as any).mock.calls[0][0]).toEqual(thunkArgs);
    expect((walletApi.removeWalletAccess as any).mock.calls.length).toEqual(1);
    expect(store.getState().wallet.data.members.filter((member: any) => member.id === shareWalletResponse.id).length).toEqual(0);
  });
  it("deleteWallet thunk calls api request with provided request body", async() => {
    unwrapResult(await store.dispatch(deleteWallet({ id: "pony" })) as any);
    expect((walletApi.deleteWallet as any).mock.calls[0][0]).toEqual({ id: "pony" });
    expect((walletApi.deleteWallet as any).mock.calls.length).toEqual(1);
  });
  it("\"reset\" should restore the initial state", () => {
    const stage = getRandString();
    store.dispatch(setStage(stage));
    store.dispatch(reset());
    expect(store.getState().wallet).toEqual(initialState);
  });
  // This test was commented out because the outputsHex on the fixture cannot be read anymore. It was produced with an
  // older version of monero-javascript, and the exported outputs don't seem to be compatible. We'll re-create the outputsHex
  // with the new monero-js version in the future, and uncomment the test.
  // it("getOutputs should import outputs to the local wallet, wallet balance should be equal to 1000000000000", async() => {
  //   const stub = sinon.stub(tasksApi, "checkTask").resolves(camelcaseKeys(getOutputsTaskResponse, { deep: true }));
  //   unwrapResult(await store.dispatch(getOutputs({ id: "1" })));
  //   expect(store.getState().localWallets.userWallet.balance).to.equal("1000000000000");
  //   stub.restore();
  // });
});
