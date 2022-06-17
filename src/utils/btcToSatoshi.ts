import Decimal from "decimal.js";

export function btcToSatoshi(amount: number) {
  return new Decimal(amount).mul(100000000).toNumber();
}
