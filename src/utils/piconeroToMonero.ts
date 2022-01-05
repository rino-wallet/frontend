import { BigNumber } from "bignumber.js";

export default function piconeroToMonero(piconero:  string | number): string {
  const bigIntResult = new BigNumber(piconero).dividedBy(1e12);
  return bigIntResult.toFixed(12).replace(/\.?0+$/, "");
}