import { Wallet } from "../../types";
import getEncryptedKeys from "../../utils/getEncryptedKeys";

const members = [
  {
    user: "test1@test.com",
    encryptedKeys: "test1@test.com"
  },
  {
    user: "test2@test.com",
    encryptedKeys: "test2@test.com"
  },
  {
    user: "test3@test.com",
    encryptedKeys: "test3@test.com"
  }
];

describe("getEncryptedKeys", function () {
  it("getEncryptedKeys returns encrypted keys for the user with given email", async () => {
    expect(getEncryptedKeys({
      members,
    } as Wallet, "test2@test.com")).toEqual("test2@test.com");
  });
  it("getEncryptedKeys returns an empty string if there is no user with given email", async () => {
    expect(getEncryptedKeys({
      members,
    } as Wallet, "test111@test.com")).toEqual("");
  });
});