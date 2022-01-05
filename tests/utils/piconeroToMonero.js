import { expect } from "chai";
import piconeroToMonero from "../../src/utils/piconeroToMonero";

describe("piconeroToMonero", function() {
  it("Converts piconero to Monero", () => {
    expect(piconeroToMonero(1)).to.equal("0.000000000001");
    expect(piconeroToMonero(1e12)).to.equal("1");
    expect(piconeroToMonero(9001000000000)).to.equal("9.001");
    expect(piconeroToMonero(90000000000000005)).to.equal("90000");
    expect(piconeroToMonero(9000000000000001)).to.equal("9000.000000000001");
    expect(piconeroToMonero(-9000000)).to.equal("-0.000009");
  });
});
