import Decimal from "decimal.js";

/**
 * Expreses a Satoshi amount in BTC, rounded to an specific
 * number of decimal places.
 */
export function satoshiToBTC(amount: number, decimals: number = 6, keepTrailingZeros: boolean = false) {
  // Casting the factors to Decimal, to avoid operating between
  // different type of numbers, because it could lead to loss
  // of precision.
  const roundingFactor = new Decimal(`1e${decimals}`);
  const btcFactor = new Decimal("1e8");

  const decimalAmount = new Decimal(amount);
  const btc = decimalAmount.div(btcFactor);
  // TODO: This needs to be reviewed. We're rounding and then using toFixed.
  // We should make sure it does what we want.
  const rounded = btc.times(roundingFactor).floor().div(roundingFactor).toFixed(decimals);
  return keepTrailingZeros ? rounded : rounded.replace(/^0+(\d)|(\d)0+$/gm, "$1$2");
}
