import { BooleanSchema } from "yup";
import { User } from "../../types";
import { checkAccessLevel } from "../../utils";

const user = {
  id: "",
  email: "test@test.com",
  is2FaEnabled: false,
  isKeypairSet: true,
  name: "test",
  username: "test",
  encryptionPublicKey: "",
  signingPublicKey: "",
  encPrivateKey: {
    version: "",
    method: "symmetric",
    encContent: "",
    nonce: "",
  },
  txNotifications: false,
}

const wallet = {
  id: "",
  name: "",
  maxAmount: 0,
  minApprovals: 0,
  members: [
    {
      id: "",
      user: "test@test.com",
      accessLevel: "Admin",
      encryptedKeys: "",
      createdAt: "",
      updatedAt: "",
    }
  ],
  createdAt: "",
  updatedAt: "",
  height: "",
  address: "",
  balance: "",
  unlockedBalance: "",
  lockedAmounts: [],
  status: "",
  requires2Fa: false,
  isPublic: false,
  publicSlug: "wallet"
}

describe("checkAccessLevel", function() {
  it("Admin", () => {
    const accessLevel = checkAccessLevel(user as User, wallet);
    expect(accessLevel.isAdmin()).toEqual(true);
    expect(accessLevel.isOwner()).toEqual(false);
    expect(accessLevel.isViewOnly()).toEqual(false);
  });
  it("Owner", () => {
    const accessLevel = checkAccessLevel(user as User, { ...wallet, members: [{ ...wallet.members[0], accessLevel: "Owner" }], });
    expect(accessLevel.isOwner()).toEqual(true);
    expect(accessLevel.isAdmin()).toEqual(false);
    expect(accessLevel.isViewOnly()).toEqual(false);
  });
  it("View", () => {
    const accessLevel = checkAccessLevel(user as User, { ...wallet, members: [{ ...wallet.members[0], accessLevel: "View-only" }], });
    expect(accessLevel.isViewOnly()).toEqual(true);
    expect(accessLevel.isOwner()).toEqual(false);
    expect(accessLevel.isAdmin()).toEqual(false);
  });
});
