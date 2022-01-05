import { expect } from "chai";
import transformError from "../../src/utils/transformError";

const rawError = {
  name: ["error 1", "error 2"],
  email: "error 3",
  destination: [
    { address: ["error 4", "error 5"] }
  ]
}

const expected = {
  name: "error 1 error 2",
  email: "error 3",
  address: "error 4 error 5",
}

describe("transformError", function() {
  it("\"transformError\" should return expected object", () => {
    const result = transformError(rawError);
    expect(result).to.deep.equal(expected);
  });
});
