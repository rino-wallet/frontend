import { getNetworkType } from "../../utils/getNetworkType";

describe("getNetworkType", function () {
  it("getNetworkType returns stagenet for not production env", async () => {
    expect(getNetworkType()).toEqual("stagenet");
  });
  it("getNetworkType returns mainnet for production env", async () => {
    process.env.REACT_APP_ENV = "production";
    expect(getNetworkType()).toEqual("mainnet");
  });
});