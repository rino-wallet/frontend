import sinon from "sinon";
import camelcaseKeys from "camelcase-keys";
// api services
import walletsApi from "../../src/api/wallets";
import publicKeysApi from "../../src/api/publicKeys";
import sessionApi from "../../src/api/session";
import otpApi from "../../src/api/otp";
// fixture
import getCurrentUserResponse from "./getCurrentUser.json";
import publicKeyResponse from "./publicKey.json";
import fetchWalletDetailsResponse from "./walletDetails.json";
import fetchWalletsResponse from "./fetchWallets.json";
import signUpResponse from "./signUp.json";
import signInResponse from "./signIn.json";
import create2FAResponse from "./create2FA.json";
import fetchTransactionsResponse from "./fetchTransactions.json";
import emailChangeInfoResponse from "./emailChangeInfo.json";
import shareWalletResponse from "./shareWallet.json";
import transactionDetailsResponse from "./transactionDetails.json";
import fetchSubaddressesResponse from "./fetchSubaddresses.json";

const ccConfig = { deep: true };

export const tasksApiStub = {};
export const walletsApiStub = {};
export const publicKeysApiStub = {};
export const sessionApiStub = {};
export const otpApiStub = {};

before(() => {
  walletsApiStub.createWallet = sinon.stub(walletsApi, "createWallet").resolves(camelcaseKeys({ taskId: "create-wallet" }, ccConfig));
  walletsApiStub.finalizeWallet = sinon.stub(walletsApi, "finalizeWallet").resolves(camelcaseKeys({ taskId: "finalize-wallet" }, ccConfig));
  walletsApiStub.fetchWalletDetails = sinon.stub(walletsApi, "fetchWalletDetails").resolves(camelcaseKeys(fetchWalletDetailsResponse, ccConfig));
  walletsApiStub.fetchWallets = sinon.stub(walletsApi, "fetchWallets").resolves(camelcaseKeys(fetchWalletsResponse, ccConfig));
  walletsApiStub.getOutputs = sinon.stub(walletsApi, "getOutputs").resolves(camelcaseKeys({ taskId: "get-outputs" }, ccConfig));
  walletsApiStub.fetchWalletTransactions = sinon.stub(walletsApi, "fetchWalletTransactions").resolves(camelcaseKeys(fetchTransactionsResponse, ccConfig));
  walletsApiStub.shareWallet = sinon.stub(walletsApi, "shareWallet").resolves(camelcaseKeys(shareWalletResponse, ccConfig));
  walletsApiStub.removeWalletAccess = sinon.stub(walletsApi, "removeWalletAccess").resolves(camelcaseKeys({}, ccConfig));
  walletsApiStub.fetchTransactionDetails = sinon.stub(walletsApi, "fetchTransactionDetails").resolves(camelcaseKeys(transactionDetailsResponse, ccConfig));
  walletsApiStub.fetchWalletSubaddresses = sinon.stub(walletsApi, "fetchWalletSubaddresses").resolves(camelcaseKeys(fetchSubaddressesResponse, ccConfig));
  walletsApiStub.createSubaddress = sinon.stub(walletsApi, "createSubaddress").resolves(camelcaseKeys({ taskId: "create subaddress" }, ccConfig));
  walletsApiStub.deleteWallet = sinon.stub(walletsApi, "deleteWallet").resolves(camelcaseKeys({}, ccConfig));
  publicKeysApiStub.fetchPublicKey = sinon.stub(publicKeysApi, "fetchPublicKey").resolves(camelcaseKeys(publicKeyResponse, ccConfig));
  sessionApiStub.signUp = sinon.stub(sessionApi, "signUp").resolves(camelcaseKeys(signUpResponse, ccConfig));
  sessionApiStub.signIn = sinon.stub(sessionApi, "signIn").resolves(camelcaseKeys({ data: signInResponse }, ccConfig));
  sessionApiStub.getCurrentUser = sinon.stub(sessionApi, "getCurrentUser").resolves(camelcaseKeys(getCurrentUserResponse, ccConfig));
  sessionApiStub.signOut = sinon.stub(sessionApi, "signOut").resolves(camelcaseKeys({ data: {} }, ccConfig));
  sessionApiStub.changeEmailRequest = sinon.stub(sessionApi, "changeEmailRequest").resolves(camelcaseKeys({ data: {} }, ccConfig));
  sessionApiStub.getEmailChangingInfo = sinon.stub(sessionApi, "getEmailChangingInfo").resolves(camelcaseKeys(emailChangeInfoResponse, ccConfig));
  sessionApiStub.confirmEmailChanging = sinon.stub(sessionApi, "confirmEmailChanging").resolves(camelcaseKeys({ data: {} }, ccConfig));
  sessionApiStub.changePassword = sinon.stub(sessionApi, "changePassword").resolves(camelcaseKeys({ data: {} }, ccConfig));
  sessionApiStub.updateUser = sinon.stub(sessionApi, "updateUser").resolves(camelcaseKeys({ data: {} }, ccConfig));
  sessionApiStub.setupKeyPair = sinon.stub(sessionApi, "setupKeyPair").resolves(camelcaseKeys({ data: { recoveryKey: "recoveryKey" } }, ccConfig));
  otpApiStub.create2FA = sinon.stub(otpApi, "create2FA").resolves(camelcaseKeys(create2FAResponse, ccConfig));
  otpApiStub.enable2FA = sinon.stub(otpApi, "enable2FA").resolves();
  otpApiStub.delete2FA = sinon.stub(otpApi, "delete2FA").resolves();
});
