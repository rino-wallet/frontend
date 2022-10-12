import { btcToSatoshi } from "../../utils/btcToSatoshi";

describe("btcToSatoshi", function () {
  it("1 btc is equal to 100000000 satoshi", () => {
    const result = btcToSatoshi(1);
    expect(result).toEqual(100000000);
  });
  it("-1 btc is equal to -100000000 satoshi", () => {
    const result = btcToSatoshi(-1);
    expect(result).toEqual(-100000000);
  });
  it("0.00000001 btc is equal to 1 satoshi", () => {
    const result = btcToSatoshi(0.00000001);
    expect(result).toEqual(1);
  });
});