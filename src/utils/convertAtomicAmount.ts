import Decimal from "decimal.js";
import { ExchangeCurrencies } from "../types";
import { conversionMapping } from "../constants";

const factors = {
  xmr: new Decimal(conversionMapping.xmr),
  btc: new Decimal(conversionMapping.btc),
  eth: new Decimal(conversionMapping.eth),
  sol: new Decimal(conversionMapping.sol),
  ada: new Decimal(conversionMapping.ada),
  usdt: new Decimal(conversionMapping.usdt),
  usdc: new Decimal(conversionMapping.usdc),
  bnb: new Decimal(conversionMapping.bnb),
  xrp: new Decimal(conversionMapping.xrp),
  doge: new Decimal(conversionMapping.doge),
  dot: new Decimal(conversionMapping.dot),
};

/**
 * Expreses a atomic amount, rounded to an specific
 * number of decimal places.
 */
export function convertAtomicAmount(amount: number, currency: ExchangeCurrencies, decimals: number = 6, keepTrailingZeros: boolean = false) {
  // Casting the factors to Decimal, to avoid operating between
  // different type of numbers, because it could lead to loss
  // of precision.
  const roundingFactor = new Decimal(`1e${decimals}`);
  const factor = factors[currency];

  const decimalAmount = new Decimal(amount);
  const output = decimalAmount.div(factor);
  // TODO: This needs to be reviewed. We're rounding and then using toFixed.
  // We should make sure it does what we want.
  const rounded = output.times(roundingFactor).floor().div(roundingFactor).toFixed(decimals);
  return keepTrailingZeros ? rounded : rounded.replace(/^0+(\d)|(\d)0+$/gm, "$1$2");
}
