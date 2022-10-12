import getRandString from "../../utils/getRandString";

describe("getRandString", function () {
  it("getRandString returns unique string", async () => {
    const array = [];
    for (let i = 0; i <= 1000; i += 1) {
      array.push(getRandString());
    }
    expect(array.length).toEqual(new Set(array).size);
  });
});