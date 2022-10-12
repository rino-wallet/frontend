import { isMobile } from "../../utils/isMobile";

describe("isMobile", function () {
  it("isMobile returns false", async () => {
    expect(isMobile()).toEqual(false);
  });
  it("isMobile returns true for mobile user agent", async () => {
    expect(isMobile("iphone")).toEqual(true);
  });
});