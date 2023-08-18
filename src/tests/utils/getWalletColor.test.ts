import { getWalletColor } from "../../utils/getWalletColor";

describe("getWalletColor", function () {
  it("getWalletColor returns css classes for community edition", async () => {
    expect(getWalletColor(false)).toEqual({
      main: "bg-gradient-to-r from-orange-900 to-orange-800",
      light: "bg-gradient-to-r from-orange-200",
    });
  });

  it("getWalletColor returns css classes for enterprise edition", async () => {
    expect(getWalletColor(true)).toEqual({
      main: "bg-gradient-to-r from-blue-900 to-blue-800",
      light: "bg-gradient-to-r from-blue-300 to-blue-100",
    });
  });
});