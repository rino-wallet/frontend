import * as openpgp from "openpgp";
import { expect } from "chai";
import {
  deriveUserKeys,
  generateRecoveryKey,
  generateUserKeyPair,
  encryptPrivateKeys,
  decryptKey,
  signKeys,
  generateUserKeyPairInfo,
  reencrypPrivateKey,
} from "../../src/utils/keypairs";

const testVectors = [
  {
    password: "beer",
    derivedKeys: {
      authKey: "eedc2e015f93b8ee141c1fc2b2fc2ec2",
      encryptionKey: "6fb9da71f625ca06516c45ee1d139eb3",
    }
  },
  {
    password: "ribs",
    derivedKeys: {
      authKey: "db140edf6009c09aa4922167aefa0c89",
      encryptionKey: "baf7d75b1da26d58cc5aab90d712e663",
    }
  },
  {
    password: "beer+ribs",
    derivedKeys: {
      authKey: "aafb6a21fff241489f76e0789498be6b",
      encryptionKey: "21994a90a8043ed281c984e263a405c7",
    }
  },
  {
    password: "07228e9815954eff204aa04fdbe2cdb3",
    derivedKeys: {
      authKey: "e9b47e29c7fd49fd8a7111d08caeb983",
      encryptionKey: "07e161f35d589cbee75c73e01a1b1eaa",
    }
  },
];
 
describe("userKeyPairs", function() {
  for (let i = 0; i < testVectors.length; i++) {
    const test = testVectors[i];
    const password = test.password;
    const derivedKeys = test.derivedKeys;
    const expectedAuthKey = derivedKeys.authKey;
    const expectedEncryptionKey = derivedKeys.encryptionKey;

    it(`Test deriveUserKeys for the password "${password}"`, async () => {
      const { authKey, encryptionKey } = await deriveUserKeys(password);
      expect(authKey).to.equal(expectedAuthKey);
      expect(encryptionKey).to.equal(expectedEncryptionKey);
    });
  }
  it("\"generateRecoveryKey\" function should return a random hex string of 32 chars", async () => {
    const keys = [];
    for (let i = 0; i < 100; i++) {
      const key = await generateRecoveryKey();
      expect(key.length).to.equal(32);
      expect(keys.includes(key)).to.equal(false);
      keys.push(key);
    }
  });
  it("\"generateUserKeyPair\" function should return a valid pgp keys", async () => {
    const keys = await generateUserKeyPair("example@mail.com");
    const publicKey = await openpgp.readKey({ armoredKey: keys.publicKey });
    const privateKey = await openpgp.readKey({ armoredKey: keys.privateKey });
    expect(publicKey).to.have.property("keyPacket");
    expect(publicKey.getUserIDs()[0]).to.equal("<example@mail.com>");
    expect(privateKey).to.have.property("keyPacket");
    expect(privateKey.getUserIDs()[0]).to.equal("<example@mail.com>");
  });
  it("The \"encryptPrivateKeys\" function encrypts private key with \"recoveryKey\" and \"encryptionKey\". The encrypted key possible to decrypt using \"decryptKey\" function", async () => {
    const password = "password";
    const { encryptionKey } = await deriveUserKeys(password);
    const { privateKey } = await generateUserKeyPair("example@mail.com");
    const recoveryKey = await generateRecoveryKey();
    const { privateKeyEK, privateKeyRK } = await encryptPrivateKeys(privateKey, encryptionKey, recoveryKey);
    expect(await decryptKey(privateKeyEK, encryptionKey)).to.equal(privateKey);
    expect(await decryptKey(privateKeyRK, recoveryKey)).to.equal(privateKey);
  });
  it("The \"signKeys\" should create a valid detached signature", async () => {
    const password = "password";
    const { encryptionKey } = await deriveUserKeys(password);
    const { privateKey, publicKey } = await generateUserKeyPair("example@mail.com");
    const recoveryKey = await generateRecoveryKey();
    const { privateKeyEK, privateKeyRK } = await encryptPrivateKeys(privateKey, encryptionKey, recoveryKey);
    const armoredSignature = await signKeys(privateKey, publicKey, privateKeyEK, privateKeyRK);

    const signature = await openpgp.readSignature({
      armoredSignature,
    });
    const verified = await openpgp.verify({
        message: await openpgp.createMessage({ text: `${publicKey}${privateKeyEK}${privateKeyRK}` }),
        signature,
        publicKeys: await openpgp.readKey({ armoredKey: publicKey }),
    });
    const { valid } = verified.signatures[0];
    expect(valid).to.equal(true);
  });
  it("The \"generateUserKeyPairInfo\" function should return all the necessary data", async () => {
    const data = await generateUserKeyPairInfo("example@mail.com", "password");
    expect(data.authKey.length > 0).to.equal(true);
    expect(data.recoveryKey.length > 0).to.equal(true);
    expect(data.publicKey.length > 0).to.equal(true);
    expect(data.privateKeyEK.length > 0).to.equal(true);
    expect(data.privateKeyRK.length > 0).to.equal(true);
    expect(data.signature.length > 0).to.equal(true);
  });
  it("The \"reencrypPrivateKey\" function should return all the necessary data", async () => {
    const { encryptionKey } = await deriveUserKeys("password");
    const { privateKey } = await generateUserKeyPair("example@mail.com");
    const recoveryKey = await generateRecoveryKey();
    const { privateKeyRK } = await encryptPrivateKeys(privateKey, encryptionKey, recoveryKey);
    const data = await reencrypPrivateKey(privateKeyRK, recoveryKey, "newpassword");
    expect(data.authKey.length > 0).to.equal(true);
    expect(data.privateKeyEK.length > 0).to.equal(true);
    expect(data.signature.length > 0).to.equal(true);
  });
});
