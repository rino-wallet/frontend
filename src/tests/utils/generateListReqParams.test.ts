import { generateListReqParams } from "../../utils/generateListReqParams";

describe("generateListReqParams", function () {
  it("generateListReqParams returns expected parametrs", async () => {
    expect(generateListReqParams(1, 10)).toEqual({ "limit": 10, "offset": 0 });
    expect(generateListReqParams(2, 10)).toEqual({ "limit": 10, "offset": 10 });
    expect(() => { generateListReqParams(0, 10); }).toThrow();
    expect(() => { generateListReqParams(1, 0); }).toThrow();
    expect(() => { generateListReqParams(0.1, 1); }).toThrow();
    expect(() => { generateListReqParams(1, 0.1); }).toThrow();
  });
  it("generateListReqParams throw an error when args less than 0 or float numbers", async () => {
    expect(() => { generateListReqParams(0, 1); }).toThrow();
    expect(() => { generateListReqParams(1, 0); }).toThrow();
    expect(() => { generateListReqParams(0.1, 1); }).toThrow();
    expect(() => { generateListReqParams(1, 0.1); }).toThrow();
  });
});