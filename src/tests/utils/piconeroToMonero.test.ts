import piconeroToMonero from "../../utils/piconeroToMonero";

describe("piconeroToMonero", function() {
  it("Converts piconero to Monero", () => {
    expect(piconeroToMonero(1)).toEqual("0.000000000001");
    expect(piconeroToMonero(1e12)).toEqual("1");
    expect(piconeroToMonero(9001000000000)).toEqual("9.001");
    expect(piconeroToMonero(90000000000000005)).toEqual("90000");
    expect(piconeroToMonero(9000000000000001)).toEqual("9000.000000000001");
    expect(piconeroToMonero(-9000000)).toEqual("-0.000009");
  });
});
