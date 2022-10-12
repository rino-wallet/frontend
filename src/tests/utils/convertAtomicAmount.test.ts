import { convertAtomicAmount } from "../../utils/convertAtomicAmount";

describe("convertAtomicAmount", function () {
  it("convertAtomicAmount without trailing zeros", () => {
    expect(convertAtomicAmount(1000000000000, "xmr", 6, false)).toEqual("1");
  });
  it("convertAtomicAmount with trailing zeros", () => {
    expect(convertAtomicAmount(1000000000001, "xmr", 6, true)).toEqual("1.000000");
  });
  it("convertAtomicAmount with 10 trailing zeros", () => {
    expect(convertAtomicAmount(1001000000001, "xmr", 12, true)).toEqual("1.001000000001");
  });
  it("test converting of all currencies", () => {
    expect(convertAtomicAmount(1000000000000, "xmr")).toEqual("1");
    expect(convertAtomicAmount(100000000, "btc")).toEqual("1");
    expect(convertAtomicAmount(1000000000000000000, "eth")).toEqual("1");
    expect(convertAtomicAmount(1000000000, "sol")).toEqual("1");
    expect(convertAtomicAmount(1000000, "ada")).toEqual("1");
    expect(convertAtomicAmount(1, "usdt")).toEqual("1");
    expect(convertAtomicAmount(1000000, "usdc")).toEqual("1");
    expect(convertAtomicAmount(1000000000000000000, "bnb")).toEqual("1");
    expect(convertAtomicAmount(1000000, "xrp")).toEqual("1");
    expect(convertAtomicAmount(100000000, "doge")).toEqual("1");
    expect(convertAtomicAmount(10000000000, "dot")).toEqual("1");
  });
});