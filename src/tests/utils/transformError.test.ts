import transformError from "../../utils/transformError";

describe("transformError", function () {
  it("transformError", async () => {
    expect(transformError({
      name: ["this", "is", "error", "message"],
    })).toEqual({ "name": "this is error message" });
  });
});
