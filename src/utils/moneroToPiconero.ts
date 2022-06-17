import { BigNumber } from "bignumber.js";

export default function moneroToPiconero(monero: string | number): number {
  const bigIntResult = new BigNumber(1e12).multipliedBy(monero);
  return bigIntResult.toNumber();
}
