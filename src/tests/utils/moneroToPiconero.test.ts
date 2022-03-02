import moneroToPiconero from "../../utils/moneroToPiconero";

describe("moneroToPiconero", function() {
  it("Converts Monero to piconero", () => {
    expect(moneroToPiconero("1")).toEqual(1000000000000);
    expect(moneroToPiconero(1)).toEqual(1000000000000);
    expect(moneroToPiconero(1.5)).toEqual(1500000000000);
    expect(moneroToPiconero(0.0001)).toEqual(100000000);
    expect(moneroToPiconero(0.000999)).toEqual(999000000);
  });
});
