import {configureStore, combineReducers} from "@reduxjs/toolkit";
import {sessionSlice, setToken} from "./sessionSlice";
import {walletSlice} from "./walletSlice";
import {walletListSlice} from "./walletListSlice";
import {otpSlice} from "./otpSlice";
import {transactionListSlice} from "./transactionListSlice";
import {changeEmailSlice} from "./changeEmailSlice";
import {transactionDetailsSlice} from "./transactionDetailsSlice";
import {subaddressListSlice} from "./subaddressListSlice";
import {setApiToken, getToken} from "./sessionUItils";
import { navigate, fullReset } from "./actions";

const combinedReducer = combineReducers({
  session: sessionSlice.reducer,
  wallet: walletSlice.reducer,
  walletList: walletListSlice.reducer,
  otp: otpSlice.reducer,
  transactionList: transactionListSlice.reducer,
  changeEmail: changeEmailSlice.reducer,
  transactionDetails: transactionDetailsSlice.reducer,
  subaddressList: subaddressListSlice.reducer,
});

/**
 * Root reducer has several global actions:
 * 1) "navigate" selectively reset the store, should be dispatched on page changing
 * 2) "reset" full reset of the redux store, should be dispatched only on logout
 */
//@ts-ignore
const rootReducer = (state, action): any => {
  if (action.type === navigate.toString()) {
    state = { session: state.session };
  }
  if (action.type === fullReset.toString()) {
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
// set token to redux store
store.dispatch(setToken(sessionToken));
// set token to api services
setApiToken(sessionToken);

store.subscribe(()=> {
  const state = store.getState();
  // sync token in redux state with all api services
  if (state.session) {
    setApiToken(state.session.token || "");
  }
});
