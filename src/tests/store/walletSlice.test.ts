import {unwrapResult} from "@reduxjs/toolkit";
import camelcaseKeys from "camelcase-keys";
import { store } from "../../store";
import { getRandString } from "../../utils";
import tasksApi from "../../api/tasks";
import walletApi from "../../api/wallets";
import sessionApi from "../../api/session";
import publicKeysApi from "../../api/publicKeys";
import walletInstance from "../../wallet";
import {
  initialState,
  createNewWallet,
  setStage,
  reset,
  openWallet,
  fetchWalletDetails,
  syncMultisig,
  prepareTransaction,
  createTransaction,
  pollCreateTransactionTask,
  updateWalletDetails,
  requestWalletShare,
  shareWallet,
  removeWalletAccess,
  addMember,
  removeMember,
  deleteWallet,
  getOutputs,
  selectors,
  setRevokedUsers,
  setPendingTransaction,
  resetPendingTransaction,
} from "../../store/walletSlice";
import {
  getCurrentUser,
} from "../../store/sessionSlice";
import walletDetailsResponse from "../fixture/walletDetails.json";
import createWalletTaskResponse from "../fixture/creatingWallet/createWalletTask.json";
import finalizeWalletTaskResponse from "../fixture/creatingWallet/finalizeWalletTask.json";
import monerojsExchangeMultisigKeys1 from "../fixture/creatingWallet/monerojsExchangeMultisigKeys1.json";
import monerojsExchangeMultisigKeys2 from "../fixture/creatingWallet/monerojsExchangeMultisigKeys2.json";
import monerojsGetWalletsData from "../fixture/creatingWallet/monerojsGetWalletsData.json";
import monerojsMakeMultisigs from "../fixture/creatingWallet/monerojsMakeMultisigs.json";
import monerojsPrepareMultisigs from "../fixture/creatingWallet/monerojsPrepareMultisigs.json";
import fetchWalletDetailsResponse from "../fixture/walletDetails.json";
import getOutputsTaskResponse from "../fixture/getOutputsTask.json";
import shareWalletResponse from "../fixture/shareWallet.json";
import getCurrentUserResponse from "../fixture/getCurrentUser.json";
import { TextEncoder, TextDecoder } from 'util';
import { deriveUserKeys, decryptKeys } from "../../utils/keypairs"
import { AccessLevel, Wallet } from "../../types";
import { accessLevels } from "../../constants";

(global as any).TextEncoder = TextEncoder;
(global as any).TextDecoder = TextDecoder;

jest.setTimeout(60 * 1000);

jest.mock("../../wallet", () => {
  return {
    createWallets: jest.fn(),
    prepareMultisigs: jest.fn(),
    makeMultisigs: jest.fn(),
    exchangeMultisigKeys: jest.fn(),
    closeWallet: jest.fn(), 
    getWalletsData: jest.fn(), 
    openWallet: jest.fn(),
    decryptWalletKeys: jest.fn(),
    encryptWalletKeys: jest.fn(),
    userWallet: {
      importOutputs: jest.fn(),
      getWalletJSON: jest.fn(),
      getMultisigHex: jest.fn(),
      importMultisigHex: jest.fn(),
      loadMultisigTx: jest.fn(),
      reconstructAndValidateTransaction: jest.fn(),
    },
    walletPassword: "password",
  };
});

jest.mock("../../utils/keypairs", () => {
  return {
    deriveUserKeys: jest.fn(),
    decryptKeys: jest.fn(),
  };
});


jest.mock("../../api/tasks", () => {
  return {
    checkTask: jest.fn(),
    setToken: () => {},
  }
});

jest.mock("../../api/publicKeys", () => {
  return {
    fetchPublicKey: jest.fn(),
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
    getOutputs: jest.fn(),
    syncMultisig: jest.fn(),
    createUnsignedTransaction: jest.fn(),
    submitTransaction: jest.fn(),
    pollCreateTransactionTask: jest.fn(),
    updateWalletDetails: jest.fn(),
    requestWalletShare: jest.fn(),
    updateWalletAccess: jest.fn(),
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
  afterEach(() => {
    store.dispatch(reset());
  });
  
  it("Has initial state", () => {
    expect(store.getState().wallet).toEqual(initialState);
  });

  it("Selectors returs expected data", () => {
    const state = store.getState();
    expect(selectors.getStage(state)).toEqual(initialState.stage);
    expect(selectors.getWallet(state)).toEqual(initialState.data);
    expect(selectors.getPendingTransaction(state)).toEqual(initialState.pendingTransaction);
    expect(selectors.getRevokedUsers(state)).toEqual(initialState.revokedUsers);
  });

  it("setStage should change stage value", () => {
    const string = getRandString();
    store.dispatch(setStage(string));
    expect(store.getState().wallet.stage).toEqual(string);
  });

  it("setRevokedUsers should change revokedUsers value", () => {
    const user = {
      id: "1",
      user: "user",
      accessLevel: "Owner" as AccessLevel,
      encryptedKeys: "keys",
      createdAt: "2022-10-05T07:47:02.915Z",
      updatedAt: "2022-10-05T07:47:02.915Z",
      deletedAt: "2022-10-05T07:47:23.346Z",
    };
    store.dispatch(setRevokedUsers([user]));
    expect(store.getState().wallet.revokedUsers).toEqual([user]);
  });

  it("setPendingTransaction should change pendingTransaction value", () => {
    const transaction = {
      address: "address",
      amount: "1",
      fee: 0.1,
      txsHex: "txsHex",
      memo: "memo",
      priority: "priority",
      orderId: "orderId",
    }
    store.dispatch(setPendingTransaction(transaction));
    expect(store.getState().wallet.pendingTransaction).toEqual(transaction);
  });

  it("resetPendingTransaction should change pendingTransaction value", () => {
    const transaction = {
      address: "address",
      amount: "1",
      fee: 0.1,
      txsHex: "txsHex",
      memo: "memo",
      priority: "priority",
      orderId: "orderId",
    }
    store.dispatch(setPendingTransaction(transaction));
    expect(store.getState().wallet.pendingTransaction.address).toEqual("address");
    store.dispatch(resetPendingTransaction());
    expect(store.getState().wallet.pendingTransaction).toEqual(initialState.pendingTransaction);
  });

  it("createNewWallet should create User, Backup and Server wallets", async() => {
    // mock api calls and wallet instance
    (sessionApi.getCurrentUser as any).mockResolvedValue(camelcaseKeys(getCurrentUserResponse, { deep: true }));
    (walletApi.createWallet as any).mockResolvedValue(camelcaseKeys({ taskId: "1" }, { deep: true }));
    (walletApi.finalizeWallet as any).mockResolvedValue(camelcaseKeys({ taskId: "1" }, { deep: true }));
    (tasksApi.checkTask as any)
      .mockResolvedValueOnce(camelcaseKeys(createWalletTaskResponse, { deep: true }))
      .mockResolvedValueOnce(camelcaseKeys(finalizeWalletTaskResponse, { deep: true }));
    (walletInstance.prepareMultisigs as any).mockResolvedValueOnce(monerojsPrepareMultisigs);
    (walletInstance.makeMultisigs as any).mockResolvedValueOnce(monerojsMakeMultisigs);
    (walletInstance.exchangeMultisigKeys as any)
      .mockResolvedValueOnce(monerojsExchangeMultisigKeys1)
      .mockResolvedValueOnce(monerojsExchangeMultisigKeys2);
    (walletInstance.getWalletsData as any).mockResolvedValueOnce(monerojsGetWalletsData);

    // dispatch createNewWallet thunk
    unwrapResult(await store.dispatch(getCurrentUser()) as any);
    const actionResponse = await store.dispatch(createNewWallet({ name: "Main", signal: (new AbortController()).signal }));
    const response = unwrapResult(actionResponse as any);

    // check that all api request were made
    expect((sessionApi.getCurrentUser as any).mock.calls.length).toEqual(1);
    expect((walletApi.createWallet as any).mock.calls.length).toEqual(1);
    expect((walletApi.finalizeWallet as any).mock.calls.length).toEqual(1);
    expect((tasksApi.checkTask as any).mock.calls.length).toEqual(2);

    // check that all wallet methods was called
    expect((walletInstance.prepareMultisigs as any).mock.calls.length).toEqual(1);
    expect((walletInstance.makeMultisigs as any).mock.calls.length).toEqual(1);
    expect((walletInstance.getWalletsData as any).mock.calls.length).toEqual(1);
    expect((walletInstance.exchangeMultisigKeys as any).mock.calls.length).toEqual(2);

    // check that createWallet wallet sends wallet name and prepared multisigs as payload
    expect((walletApi.createWallet as any).mock.calls[0][0]).toEqual({
      name: "Main",
      user_multisig_info: monerojsPrepareMultisigs[0],
      backup_multisig_info: monerojsPrepareMultisigs[1],
    });

    // Check that the makeMultisigs uses prepared multisigs and server wallet multisig
    expect((walletInstance.makeMultisigs as any).mock.calls[0][0]).toEqual([
      ...monerojsPrepareMultisigs,
      createWalletTaskResponse.result.serverMultisigInfo,
    ]);

    // Check that the first round of exchangeMultisigKeys uses correct data from previous steps
    expect((walletInstance.exchangeMultisigKeys as any).mock.calls[0][0]).toEqual([
      ...monerojsMakeMultisigs,
      createWalletTaskResponse.result.serverMultisigXinfo,
    ]);

    // Check that the second round of exchangeMultisigKeys uses correct data from previous steps
    expect((walletInstance.exchangeMultisigKeys as any).mock.calls[1][0]).toEqual([
      monerojsExchangeMultisigKeys1.userResult.state.multisigHex,
      monerojsExchangeMultisigKeys1.backupResult.state.multisigHex,
      finalizeWalletTaskResponse.result.serverMultisigFinal,
    ]);

    expect(response.userWallet).toEqual(monerojsGetWalletsData.userWallet);
    expect(response.backupWallet).toEqual(monerojsGetWalletsData.backupWallet);
    expect(response.walletId).toEqual(createWalletTaskResponse.walletId);
    expect(response).toHaveProperty("walletPassword");
  });

  it("openWallet should restore and open in memory wallet and clean sensetive data", async() => {
    (walletApi.fetchWalletDetails as any).mockResolvedValue(camelcaseKeys(fetchWalletDetailsResponse, { deep: true }));
    (walletInstance.openWallet as any).mockResolvedValueOnce(monerojsGetWalletsData.userWallet);
    (walletInstance.decryptWalletKeys as any).mockResolvedValueOnce({ walletKeys: "walletKeys", walletPassword: "walletPassword" });
    const cleanDerivedKeys = jest.fn();
    (deriveUserKeys as any).mockResolvedValueOnce({ encryptionKey: "encryptionKey", clean: cleanDerivedKeys });
    const cleanDecryptedKeys = jest.fn();
    (decryptKeys as any).mockResolvedValueOnce({ encryptionPrivateKey: "encryptionKey", clean: cleanDecryptedKeys });
    
    // fetch wallet
    unwrapResult(await store.dispatch(fetchWalletDetails({ id: "a wallet id" })) as any);
    const wallet = store.getState().wallet.data;

    // dispatch createNewWallet thunk
    const response = unwrapResult(await store.dispatch(openWallet({ wallet, loginPassword: "1234567890aa" })) as any);

    expect((cleanDerivedKeys as any).mock.calls.length).toEqual(1);
    expect((cleanDecryptedKeys as any).mock.calls.length).toEqual(1);

    expect(response.address).toEqual(walletDetailsResponse.address);
  });

  it("getOutputs should import outputs to the local wallet", async () => {
    (walletApi.getOutputs as any).mockResolvedValue(camelcaseKeys({ taskId: "1" }, { deep: true }));
    (tasksApi.checkTask as any)
      .mockResolvedValueOnce(camelcaseKeys(getOutputsTaskResponse, { deep: true }));
    (walletInstance as any).userWallet.importOutputs.mockResolvedValueOnce("outputsHex");
    (walletInstance as any).userWallet.getWalletJSON.mockResolvedValueOnce(monerojsGetWalletsData.userWallet);

    // dispatch getOutputs thunk
    const response = unwrapResult(await store.dispatch(getOutputs({ id: "a wallet id" })) as any);

    expect((walletInstance as any).userWallet.importOutputs.mock.calls[0][0]).toEqual(getOutputsTaskResponse.result.outputs_hex);
    expect((walletInstance as any).userWallet.getWalletJSON.mock.calls.length).toEqual(1);
    expect(response).toEqual(monerojsGetWalletsData.userWallet);
  });

  it("syncMultisig does multisig hex exchanges with the backend", async () => {
    (walletApi.syncMultisig as any).mockResolvedValue(camelcaseKeys({ taskId: "1" }, { deep: true }));
    (tasksApi.checkTask as any)
      .mockResolvedValueOnce({ status: "COMPLETED", result: { multisigHex: "multisigHex1" } })
      .mockResolvedValueOnce({ status: "COMPLETED", result: { multisigHex: "multisigHex2" } });
    (walletInstance as any).userWallet.getMultisigHex
      .mockResolvedValueOnce("userWalletMultisigHex1")
      .mockResolvedValueOnce("userWalletMultisigHex2");
    (walletInstance as any).userWallet.importMultisigHex.mockResolvedValueOnce("multisigHex1");

    // dispatch getOutputs thunk
    unwrapResult(await store.dispatch(syncMultisig("a wallet id")) as any);

    expect((walletApi.syncMultisig as any).mock.calls[0][0]).toEqual({
      multisig_hex: "userWalletMultisigHex1",
      id: "a wallet id",
    });
    expect((walletInstance as any).userWallet.importMultisigHex.mock.calls[0][0]).toEqual(["multisigHex1"]);
    expect((walletApi.syncMultisig as any).mock.calls[1][0]).toEqual({
      multisig_hex: "userWalletMultisigHex2",
      id: "a wallet id",
    });
    expect((walletInstance as any).userWallet.getWalletJSON.mock.calls.length).toEqual(1);
  });

  it("prepareTransaction should create transaction object and save it ti store", async () => {
    const createUnsignedTransactionTaskResponse = { status: "COMPLETED", result: { multisigHex: "multisigHex", txsHex: "txsHex" } };
    const loadMultisigTxResponse = {
      state: {
        address: "address",
        amount: "1",
        fee: 0.1,
      }
    };
    const thunkPayload = {
      id: "a wallet id",
      body: {
        address: "address",
        amount: 1,
      },
      memo: "memo",
      priority: "medium"
    };
    (walletInstance as any).userWallet.getMultisigHex.mockResolvedValueOnce("userWalletMultisigHex");
    (walletInstance as any).userWallet.importMultisigHex.mockResolvedValueOnce("multisigHex");
    (walletInstance as any).userWallet.loadMultisigTx.mockResolvedValueOnce(loadMultisigTxResponse);
    (walletApi.createUnsignedTransaction as any).mockResolvedValue({ taskId: "1" });
    (tasksApi.checkTask as any).mockResolvedValueOnce(createUnsignedTransactionTaskResponse);
    
    // dispatch prepareTransaction thunk
    unwrapResult(await store.dispatch(prepareTransaction(thunkPayload)) as any);
    const pendingTransaction = store.getState().wallet.pendingTransaction;

    expect(pendingTransaction).toEqual({
      address: thunkPayload.body.address,
      amount: thunkPayload.body.amount.toString(),
      fee: loadMultisigTxResponse.state.fee,
      txsHex: createUnsignedTransactionTaskResponse.result.txsHex,
      memo: thunkPayload.memo,
      priority: thunkPayload.priority,
    });
  });

  it("createTransaction should reconstruct, validate and submit tranasaction", async () => {
    (walletInstance as any).userWallet.reconstructAndValidateTransaction.mockResolvedValue("txsHex");
    (walletApi.submitTransaction as any).mockResolvedValue(camelcaseKeys({ taskId: "1" }));

    const pendingTransaction = {
      address: "address",
      amount: "1",
      fee: 0.1,
      txsHex: "txsHex",
      memo: "memo",
      priority: "medium",
    };

    // dispatch pending transaction
    await store.dispatch(setPendingTransaction(pendingTransaction))

    // dispatch createTransaction thunk
    const response = unwrapResult(await store.dispatch(createTransaction({ id: "1", code: "1" })) as any);

    expect((walletInstance as any).userWallet.reconstructAndValidateTransaction.mock.calls[0][0]).toEqual(pendingTransaction.txsHex);
    expect((walletInstance as any).userWallet.reconstructAndValidateTransaction.mock.calls[0][1]).toEqual({
      address: pendingTransaction.address,
      amount: pendingTransaction.amount,
    });
    expect((walletApi.submitTransaction as any).mock.calls[0][0]).toEqual("1");
    expect((walletApi.submitTransaction as any).mock.calls[0][1]).toEqual({
      memo: pendingTransaction.memo,
      tx_hex: pendingTransaction.txsHex,
    });
    expect(response).toEqual({ taskId: "1" });
  });

  it("pollCreateTransactionTask fetch newly created transaction data, reset pending transaction and close the userWallet", async () => {
    (tasksApi.checkTask as any)
      .mockResolvedValueOnce({ status: "COMPLETED", result: {} });
    
    const pendingTransaction = {
      address: "address",
      amount: "1",
      fee: 0.1,
      txsHex: "txsHex",
      memo: "memo",
      priority: "medium",
    };

    // dispatch pending transaction
    await store.dispatch(setPendingTransaction(pendingTransaction))

    // dispatch pollCreateTransactionTask thunk
    unwrapResult(await store.dispatch(pollCreateTransactionTask({ taskId: "1" })) as any);

    // check if pending the transaction data was reset
    expect(store.getState().wallet.pendingTransaction).toEqual({
      address: "",
      amount: "",
      orderId: "",
      fee: undefined,
      txsHex: undefined,
      memo: undefined,
      priority: undefined,
    });

    expect((walletInstance.closeWallet as any).mock.calls.length).toEqual(1);
  });

  it("fetchWalletDetails should fetch the wallet and update store", async() => {
    (walletApi.fetchWalletDetails as any).mockResolvedValue(camelcaseKeys(fetchWalletDetailsResponse, { deep: true }));

    unwrapResult(await store.dispatch(fetchWalletDetails({ id: "a wallet id" })) as any);
    expect(store.getState().wallet.data.id).toEqual(fetchWalletDetailsResponse.id);
  });

  it("updateWalletDetails should send request to update the wallet and update the store", async () => {
    (walletApi.updateWalletDetails as any).mockResolvedValue(camelcaseKeys({ ...fetchWalletDetailsResponse, name: "newWalletName"}, { deep: true }));

    const payload = { name: "newWalletName", id: "" };
    unwrapResult(await store.dispatch(updateWalletDetails(payload)) as any);
    expect(store.getState().wallet.data.name).toEqual("newWalletName");
    expect((walletApi.updateWalletDetails as any).mock.calls[0][0]).toEqual(payload);
  });

  it("deleteWallet sends api rquest", async () => {
    (walletApi.deleteWallet as any).mockResolvedValue({});

    unwrapResult(await store.dispatch(deleteWallet({ id: "1" })) as any);
    expect((walletApi.deleteWallet as any).mock.calls[0][0]).toEqual({ id: "1" });
    expect((walletApi.deleteWallet as any).mock.calls.length).toEqual(1);
  });

  it("requestWalletShare  sends api rquest", async () => {
    (walletApi.requestWalletShare as any).mockResolvedValue({});

    unwrapResult(store.dispatch(requestWalletShare({ wallet: { id: "1" } as Wallet, email: "test@test.com" })) as any);
    expect((walletApi.requestWalletShare as any).mock.calls[0][0]).toEqual("1");
    expect((walletApi.requestWalletShare as any).mock.calls[0][1]).toEqual({ email: "test@test.com" });
  });

  it("removeWalletAccess should call api method and update wallet members", async () => {
    (walletApi.fetchWalletDetails as any).mockResolvedValue(camelcaseKeys(fetchWalletDetailsResponse, { deep: true }));
    // Fetch wallet details
    unwrapResult(await store.dispatch(fetchWalletDetails({ id: "a wallet id" })) as any);
    store.dispatch(addMember({
      id: shareWalletResponse.id,
      user: shareWalletResponse.user.name,
      accessLevel: shareWalletResponse.access_level as AccessLevel,
      encryptedKeys: "",
      createdAt: "",
      updatedAt: "",
    }));

    const wallet = store.getState().wallet.data;
    const thunkArgs = {
      userId: shareWalletResponse.id,
      walletId: wallet.id,
    }

    // check if the user is in the list
    expect(store.getState().wallet.data.members.filter((member: any) => member.id === shareWalletResponse.id).length).toEqual(1);
    // dispatch removeWalletAccess thunk
    unwrapResult(await store.dispatch(removeWalletAccess(thunkArgs)) as any);
    expect((walletApi.removeWalletAccess as any).mock.calls[0][0]).toEqual(thunkArgs);
    // make sure that user is removed from the list
    expect((walletApi.removeWalletAccess as any).mock.calls.length).toEqual(1);

    expect(store.getState().wallet.data.members.filter((member: any) => member.id === shareWalletResponse.id).length).toEqual(0);
  });

  it("reset should set the initial state", async() => {
    (walletApi.fetchWalletDetails as any).mockResolvedValue(camelcaseKeys(fetchWalletDetailsResponse, { deep: true }));
    // Fetch wallet details
    unwrapResult(await store.dispatch(fetchWalletDetails({ id: "a wallet id" })) as any);
    expect(store.getState().wallet.data.id).toEqual(fetchWalletDetailsResponse.id);
    store.dispatch(reset());
    expect(store.getState().wallet).toEqual(initialState);
  });

  it("addMember adds new member to the list of wallet mebers", async() => {
    (walletApi.fetchWalletDetails as any).mockResolvedValue(camelcaseKeys(fetchWalletDetailsResponse, { deep: true }));
    // Fetch wallet details
    unwrapResult(await store.dispatch(fetchWalletDetails({ id: "a wallet id" })) as any);
    store.dispatch(addMember({
      id: "user id",
      user: "user@emai.com",
      accessLevel: "Admin",
      encryptedKeys: "",
      createdAt: "",
      updatedAt: "",
    }));
    expect(store.getState().wallet.data.members.filter((member: any) => member.id === "user id").length).toEqual(1);
  });

  it("shareWallet (not admin)", async () => {
    (walletApi.fetchWalletDetails as any).mockResolvedValue(camelcaseKeys(fetchWalletDetailsResponse, { deep: true }));
    (walletApi.shareWallet as any).mockResolvedValue(camelcaseKeys(shareWalletResponse, { deep: true }));

    // Fetch wallet details
    unwrapResult(await store.dispatch(fetchWalletDetails({ id: "a wallet id" })) as any);

    const payload = {
      email: shareWalletResponse.user.email,
      password: "1234567890aa",
      accessLevel: accessLevels.viewOnly.code,
      wallet: store.getState().wallet.data,
    }

    // dispatch shareWallet thunk
    unwrapResult(await store.dispatch(shareWallet(payload)) as any);
    const requestBody = { access_level: payload.accessLevel, email: payload.email, encrypted_keys: "" };

    expect((walletApi.shareWallet as any).mock.calls[0][0]).toEqual(payload.wallet.id);
    expect((walletApi.shareWallet as any).mock.calls[0][1]).toEqual(requestBody);
    expect(store.getState().wallet.data.members.filter((member: any) => member.id === shareWalletResponse.id).length).toEqual(1);
  });

  it("shareWallet (admin)", async () => {
    (walletApi.fetchWalletDetails as any).mockResolvedValue(camelcaseKeys(fetchWalletDetailsResponse, { deep: true }));
    (walletApi.shareWallet as any).mockResolvedValue(camelcaseKeys(shareWalletResponse, { deep: true }));
    (walletApi.updateWalletAccess as any).mockResolvedValue(camelcaseKeys(shareWalletResponse, { deep: true }));
    (walletInstance as any).decryptWalletKeys.mockResolvedValue({ walletKeys: "walletKeys", walletPassword: "walletPassword" });
    (walletInstance as any).encryptWalletKeys.mockResolvedValue("reEncWalletKeys");

    (publicKeysApi.fetchPublicKey as any).mockResolvedValue(camelcaseKeys([{
      encryptionPublicKey: "encryptionPublicKey",
      email: "new@test.com",
    }], { deep: true }));
    const cleanDerivedKeys = jest.fn();
    (deriveUserKeys as any).mockResolvedValueOnce({ encryptionKey: "encryptionKey", clean: cleanDerivedKeys });
    const cleanDecryptedKeys = jest.fn();
    (decryptKeys as any).mockResolvedValueOnce({ encryptionPrivateKey: "encryptionKey", clean: cleanDecryptedKeys });

    // Fetch wallet details
    unwrapResult(await store.dispatch(fetchWalletDetails({ id: "a wallet id" })) as any);

    const payload = {
      email: shareWalletResponse.user.email,
      password: "1234567890aa",
      accessLevel: accessLevels.admin.code,
      wallet: store.getState().wallet.data,
    }

    // dispatch shareWallet thunk
    unwrapResult(await store.dispatch(shareWallet(payload)) as any);
    const requestBody = {
      access_level: payload.accessLevel,
      email: payload.email,
      encrypted_keys: "{\"version\":1,\"method\":\"asymmetric\",\"enc_content\":\"cmVFbmNXYWxsZXRLZXlz\"}",
    };

    expect((walletApi.shareWallet as any).mock.calls[0][0]).toEqual(payload.wallet.id);
    expect((walletApi.shareWallet as any).mock.calls[0][1]).toEqual(requestBody);
    expect(store.getState().wallet.data.members.filter((member: any) => member.id === shareWalletResponse.id).length).toEqual(1);
  });
});
