import sessionApi from "../api/session";
import walletsApi from "../api/wallets";
import tasksApi from "../api/tasks";
import publicKeysApi from "../api/publicKeys";
import otpApi from "../api/otp";
import exchangeApi from "../api/exchange";
import zammadApi from "../api/zammad";
import rewardsApi from "../api/rewards";
import apiKeysApi from "../api/apiManagement";
import { setCookie } from "../utils";

export function setApiToken(token: string): void {
  sessionApi.setToken(token);
  walletsApi.setToken(token);
  tasksApi.setToken(token);
  publicKeysApi.setToken(token);
  otpApi.setToken(token);
  exchangeApi.setToken(token);
  zammadApi.setToken(token);
  rewardsApi.setToken(token);
  apiKeysApi.setToken(token);
  setCookie("loggedIn", token ? "true" : "false", 0.5, ".rino.io");
}

export function saveToken(token: string): void {
  if (typeof localStorage !== "undefined") {
    localStorage.setItem("sessionToken", token);
  }
}

export function getToken(): string {
  if (typeof localStorage !== "undefined") {
    return localStorage.getItem("sessionToken") || "";
  }
  return "";
}

export function saveSigningPublicKey(key: string): void {
  if (typeof localStorage !== "undefined") {
    localStorage.setItem("signingPublicKey", key);
  }
}

export function getSigningPublicKey(): string {
  if (typeof localStorage !== "undefined") {
    return localStorage.getItem("signingPublicKey") || "";
  }
  return "";
}
