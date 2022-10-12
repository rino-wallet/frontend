import { getWalletColor } from "../../utils/getWalletColor";

describe("getWalletColor", function () {
  it("getWalletColor returns css classes", async () => {
    expect(getWalletColor()).toEqual({
      main: "bg-gradient-to-r from-orange-900 to-orange-800",
      light: "bg-gradient-to-r from-orange-200",
    });
  });
});