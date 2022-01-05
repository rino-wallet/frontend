import sessionApi from "../api/session";
import walletsApi from "../api/wallets";
import tasksApi from "../api/tasks";
import publicKeysApi from "../api/publicKeys";
import otpApi from "../api/otp";

export function setApiToken(token: string): void {
  sessionApi.setToken(token);
  walletsApi.setToken(token);
  tasksApi.setToken(token);
  publicKeysApi.setToken(token);
  otpApi.setToken(token);
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