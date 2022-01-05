import { expect } from "chai";
import moneroToPiconero from "../../src/utils/moneroToPiconero";

describe("moneroToPiconero", function() {
  it("Converts Monero to piconero", () => {
    expect(moneroToPiconero("1")).to.equal(1000000000000);
    expect(moneroToPiconero(1)).to.equal(1000000000000);
    expect(moneroToPiconero(1.5)).to.equal(1500000000000);
    expect(moneroToPiconero(0.0001)).to.equal(100000000);
    expect(moneroToPiconero(0.000999)).to.equal(999000000);
  });
});
