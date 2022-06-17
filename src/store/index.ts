import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { sessionSlice, setSigningPublicKey, setToken } from "./sessionSlice";
import { walletSlice } from "./walletSlice";
import { walletListSlice } from "./walletListSlice";
import { otpSlice } from "./otpSlice";
import { transactionListSlice } from "./transactionListSlice";
import { changeEmailSlice } from "./changeEmailSlice";
import { transactionDetailsSlice } from "./transactionDetailsSlice";
import { subaddressListSlice } from "./subaddressListSlice";
import {
  setApiToken, getToken, saveSigningPublicKey, getSigningPublicKey,
} from "./sessionUItils";
import { publicWalletSlice } from "./publicWalletSlice";
import { publicWalletTransactionListSlice } from "./publicWalletTransactionListSlice";
import { publicWalletSubaddressListSlice } from "./publicWalletSubaddressListSlice";
import { walletShareRequestListSlice } from "./walletShareRequestListSlice";
import { exchangeSlice } from "./exchangeSlice";
import { changeLocation, fullReset } from "./actions";
import walletInstance from "../wallet";

const combinedReducer = combineReducers({
  session: sessionSlice.reducer,
  wallet: walletSlice.reducer,
  walletList: walletListSlice.reducer,
  otp: otpSlice.reducer,
  transactionList: transactionListSlice.reducer,
  changeEmail: changeEmailSlice.reducer,
  transactionDetails: transactionDetailsSlice.reducer,
  subaddressList: subaddressListSlice.reducer,
  publicWallet: publicWalletSlice.reducer,
  publicWalletTransactionList: publicWalletTransactionListSlice.reducer,
  publicWalletSubaddressList: publicWalletSubaddressListSlice.reducer,
  walletShareRequestList: walletShareRequestListSlice.reducer,
  exchange: exchangeSlice.reducer,
});

/**
 * Root reducer has several global actions:
 * 1) "changeLocation" selectively reset the store, should be dispatched on page changing
 * 2) "reset" full reset of the redux store, should be dispatched only on logout
 */
// @ts-ignore
const rootReducer = (state, action): any => {
  if (action.type === changeLocation.toString()) {
    // eslint-disable-next-line
    state = { session: state.session };
    walletInstance.closeWallet();
  }
  if (action.type === fullReset.toString()) {
    // eslint-disable-next-line
    state = undefined;
  }
  return combinedReducer(state, action);
};

// init redux store
export const store = configureStore({
  reducer: rootReducer,
});

// get token from local storage
const sessionToken = getToken();
const signingPublicKey = getSigningPublicKey();
// set token and signingPublicKey to redux store
store.dispatch(setToken(sessionToken));
store.dispatch(setSigningPublicKey(signingPublicKey));
// set token to api services
setApiToken(sessionToken);

store.subscribe(() => {
  const state = store.getState();
  // sync token in redux state with all api services
  if (state.session) {
    setApiToken(state.session.token || "");
    saveSigningPublicKey(state.session.signingPublicKey || "");
  }
});
