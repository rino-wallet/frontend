import sinon from "sinon";
import {unwrapResult} from "@reduxjs/toolkit";
import camelcaseKeys from "camelcase-keys";
import { expect } from "chai";
import { store } from "../../src/store";
import { getRandString } from "../../src/utils";
import tasksApi from "../../src/api/tasks";
import walletApi from "../../src/api/wallets";
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
  setAddress,
  fetchWalletSubaddress,
  createSubaddress,
  deleteWallet,
  selectors,
} from "../../src/store/walletSlice";
import {
  getCurrentUser,
} from "../../src/store/sessionSlice";
import walletDetailsResponse from "../fixture/walletDetails.json";
import createWalletTaskResponse from "../fixture/createWalletTask.json";
import fetchWalletDetailsResponse from "../fixture/walletDetails.json";
import shareWalletResponse from "../fixture/shareWallet.json";
import fetchSubaddressesResponse from "../fixture/fetchSubaddresses.json";
import createSubAddressResp from "../fixture/createSubaddress.json";

describe("WalletSlice", () => {
  before(async() => {
    store.dispatch(reset());
    unwrapResult(await store.dispatch(getCurrentUser()));
  });
  it("Has initial state", () => {
    expect(store.getState().wallet).to.deep.equal(initialState);
  });
  it("Selectors returs expected data", () => {
    const state = store.getState();
    expect(selectors.getStage(state)).to.equal(initialState.stage);
    expect(selectors.getWallet(state)).to.equal(initialState.data);
  });
  it("setStage should change stage value", () => {
    const string = getRandString();
    store.dispatch(setStage(string));
    expect(store.getState().wallet.stage).to.equal(string);
  });
  it("createNewWallet should create User, Backup and Server wallets, and push the new wallet to the wallet list", async() => {
    const checkTaskStub = sinon.stub(tasksApi, "checkTask").resolves(camelcaseKeys(createWalletTaskResponse, { deep: true }));
    const actionResponse = await store.dispatch(createNewWallet({ name: "Main" }));
    const response = unwrapResult(actionResponse);
    expect(response).to.have.property("userWallet");
    expect(response).to.have.property("backupWallet");
    checkTaskStub.restore();
  });
  it("openWallet should restore and open in memory wallet", async() => {
    unwrapResult(await store.dispatch(fetchWalletDetails({ id: "a wallet id" })));
    const wallet = store.getState().wallet.data;
    const response = unwrapResult(await store.dispatch(openWallet({ wallet, loginPassword: "1234567890aa" })));
    expect(response.address).to.equal(walletDetailsResponse.address);
  });
  it("fetchWalletDetails should fetch the wallet and update store", async() => {
    unwrapResult(await store.dispatch(fetchWalletDetails({ id: "a wallet id" })));
    expect(store.getState().wallet.data.id).to.equal(fetchWalletDetailsResponse.id);
  });
  it("reset should set the initial state", async() => {
    unwrapResult(await store.dispatch(fetchWalletDetails({ id: "a wallet id" })));
    expect(store.getState().wallet.data.id).to.equal(fetchWalletDetailsResponse.id);
    store.dispatch(reset());
    expect(store.getState().wallet).to.deep.equal(initialState);
  });
  it("addMember adds new member to the list of wallet mebers", async() => {
    unwrapResult(await store.dispatch(fetchWalletDetails({ id: "a wallet id" })));
    store.dispatch(addMember({
      id: "user id",
      user: "user@emai.com",
      accessLevel: 30,
      encryptedKeys: "",
      createdAt: "",
      updatedAt: "",
    }));
    expect(store.getState().wallet.data.members.filter(member => member.id === "user id").length).to.equal(1);
  });
  it("removeMember removes user from the list of wallet mebers", async() => {
    unwrapResult(await store.dispatch(fetchWalletDetails({ id: "a wallet id" })));
    const wallet = store.getState().wallet.data;
    const memberId = wallet.members[0].id;
    store.dispatch(removeMember(memberId));
    expect(store.getState().wallet.data.members.filter(member => member.id === memberId).length).to.equal(0);
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
  //   expect(store.getState().wallet.data.members.filter(member => member.id === shareWalletResponse.id).length).to.equal(1);
  // });
  it("removeWalletAccess should call api method and update wallet members", async() => {
    const wallet = store.getState().wallet.data;
    const thunkArgs = {
      userId: shareWalletResponse.id,
      walletId: wallet.id,
    }
    unwrapResult(await store.dispatch(removeWalletAccess(thunkArgs)));
    expect(walletApi.removeWalletAccess.withArgs(thunkArgs).callCount).to.equal(1);
    expect(store.getState().wallet.data.members.filter(member => member.id === shareWalletResponse.id).length).to.equal(0);
  });
  it("setAddress", async() => {
    unwrapResult(await store.dispatch(setAddress("new wallet address")));
    expect(store.getState().wallet.walletSubAddress).to.equal("new wallet address");
  });
  it("fetchWalletSubaddress should call api method and update wallet address", async() => {
    const wallet = store.getState().wallet.data;
    unwrapResult(await store.dispatch(fetchWalletSubaddress({ walletId: wallet.id })));
    expect(walletApi.fetchWalletSubaddresses.withArgs(wallet.id, { limit: 1, offset: 0 }).callCount).to.equal(1);
    expect(store.getState().wallet.walletSubAddress).to.equal(fetchSubaddressesResponse.results[0].address);
  });
  it("createSubaddress thunk calls api request with provided request body", async() => {
    unwrapResult(await store.dispatch(createSubaddress({ walletId: "pony" })));
    expect(walletApi.createSubaddress.withArgs("pony").callCount).to.equal(1);
    expect(store.getState().wallet.walletSubAddress).to.equal(createSubAddressResp.address);
  });
  it("deleteWallet thunk calls api request with provided request body", async() => {
    unwrapResult(await store.dispatch(deleteWallet({ walletId: "pony" })));
    expect(walletApi.deleteWallet.withArgs({ walletId: "pony" }).callCount).to.equal(1);
  });
  it("\"reset\" should restore the initial state", () => {
    const stage = getRandString();
    store.dispatch(setStage(stage));
    store.dispatch(reset());
    expect(store.getState().wallet).to.deep.equal(initialState);
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
