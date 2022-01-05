export function getNetworkType(): "mainnet" | "stagenet" {
  return process.env.REACT_APP_ENV === "production" ? "mainnet" : "stagenet";
}
