import _sodium from "libsodium-wrappers";
import {
  deriveUserKeys,
  generateRecoveryKey,
  generateUserKeyPair,
  encryptPrivateKeys,
  decryptKeys,
  signKeys,
  generateUserKeyPairInfo,
  reencrypPrivateKey,
} from "../../utils/keypairs";
import { TextEncoder, TextDecoder } from 'util';

(global as any).TextEncoder = TextEncoder;
(global as any).TextDecoder = TextDecoder;

const testVectors = [
  {
    password: "beer",
    derivedKeys: {
      authKey: "f35c346b6b6006800083b3116cc79123cb738b4e51a8b7e6eb5cd12f091664c6",
      encryptionKey: "8729f76fab17c73d1ee2696e18e064f9118395926a13ed11eb95a02c7a300fa1",
    }
  },
  {
    password: "ribs",
    derivedKeys: {
      authKey: "99955a15d14a2fb3490f0476d0d3a15a6e51387bc84f0de91558c8674fabb8db",
      encryptionKey: "23c63edb1b080de72bba5ebc1f494e76039bb266f1d9d9f9eae79d007c2af720",
    }
  },
  {
    password: "beer+ribs",
    derivedKeys: {
      authKey: "31cbe827f77c3acfb8ed9a2c5dac7516456d65d1eb1c3c551602ae24a523319c",
      encryptionKey: "2e554f2ee4b8460701cc6dc9f98555d1d4f8d502011cc8de8629fbc59720ea20",
    }
  },
  {
    password: "07228e9815954eff204aa04fdbe2cdb3",
    derivedKeys: {
      authKey: "dcd8e8c47a65fc2d8a2c2eac44dc825533c0abc69548a59885c833e8c136a66b",
      encryptionKey: "7b54ae01e7beecf58d5ff60482492eb70d6306ed7089d9c032fdcedb11e5c773",
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
      const { authKey, encryptionKey } = await deriveUserKeys(password, "pony");
      expect(Buffer.from(authKey).toString("hex")).toEqual(expectedAuthKey);
      expect(Buffer.from(encryptionKey).toString("hex")).toEqual(expectedEncryptionKey);
    });
  }
  it("\"generateRecoveryKey\" function should return a random hex string of 32 chars", async () => {
    const keys = [];
    for (let i = 0; i < 100; i++) {
      const key = Buffer.from(await (await generateRecoveryKey()).recoveryKey).toString("hex");
      expect(key.length).toEqual(64);
      expect(keys.includes(key)).toEqual(false);
      keys.push(key);
    }
  });
  it("\"generateUserKeyPair\" function should return a valid keys", async () => {
    const { encryption, sign } = await generateUserKeyPair();
    expect(encryption.publicKey.length).toEqual(32);
    expect(encryption.privateKey.length).toEqual(32);
    expect(sign.publicKey.length).toEqual(32);
    expect(sign.privateKey.length).toEqual(64);
  });
  it("The \"encryptPrivateKeys\" function encrypts encryption and signing private keys with \"recoveryKey\" and \"encryptionKey\". The encrypted keys possible to decrypt using \"decryptKey\" function", async () => {
    const password = "password";
    const { encryptionKey } = await deriveUserKeys(password, "pony");
    const { encryption, sign } = await generateUserKeyPair();
    const { recoveryKey } = await generateRecoveryKey();
    const { ek, rk } = await encryptPrivateKeys(encryption.privateKey, sign.privateKey, encryptionKey, recoveryKey);
    const ekDecrypted = await decryptKeys(ek.encryptedMessage, ek.nonce, encryptionKey);
    const rkDecrypted = await decryptKeys(rk.encryptedMessage, rk.nonce, recoveryKey);
    expect(ekDecrypted.version).toEqual(1);
    expect(ekDecrypted.encryptionPrivateKey).toEqual(encryption.privateKey);
    expect(ekDecrypted.signingPrivateKey).toEqual(sign.privateKey);
    expect(rkDecrypted.version).toEqual(1);
    expect(rkDecrypted.encryptionPrivateKey).toEqual(encryption.privateKey);
    expect(rkDecrypted.signingPrivateKey).toEqual(sign.privateKey);
  });
  it("The \"signKeys\" should create a valid detached signature", async () => {
    await _sodium.ready;
  const sodium = _sodium;
    const password = "password";
    const { encryptionKey } = await deriveUserKeys(password, "pony");
    const { encryption, sign } = await generateUserKeyPair();
    const { recoveryKey } = await generateRecoveryKey();
    const { ek, rk } = await encryptPrivateKeys(encryption.privateKey, sign.privateKey, encryptionKey, recoveryKey);
    const signature = await signKeys(sign.privateKey, encryption.publicKey, sign.publicKey, ek.encryptedMessage, ek.nonce, rk.encryptedMessage, rk.nonce);
    const arrays = [
      encryption.publicKey,
      sign.publicKey,
      ek.encryptedMessage,
      ek.nonce,
      rk.encryptedMessage,
      rk.nonce,
    ];
    const message = arrays.reduce((prev, cur) => prev + Buffer.from(cur).toString("base64"), "");
    const valid = sodium.crypto_sign_verify_detached(signature, message, sign.publicKey);
    expect(valid).toEqual(true);
  });
  it("The \"generateUserKeyPairInfo\" function should return all the necessary data", async () => {
    const data = await generateUserKeyPairInfo("pony", "password");
    expect(data.authKey.length).toEqual(32);
    expect(data.recoveryKey.length).toEqual(32);
    expect(data.encryptionPublicKey.length).toEqual(32);
    expect(data.signingPublicKey.length).toEqual(32);
    expect(data.encPrivateKeysDataSet.ek.encryptedMessage.length).toEqual(114);
    expect(data.encPrivateKeysDataSet.ek.nonce.length).toEqual(24);
    expect(data.encPrivateKeysDataSet.rk.encryptedMessage.length).toEqual(114);
    expect(data.encPrivateKeysDataSet.rk.nonce.length).toEqual(24);
    expect(data.signature.length).toEqual(64);
  });
  it("The \"reencrypPrivateKey\" function should return all the necessary data", async () => {
    const { encryptionKey } = await deriveUserKeys("password", "pony");
    const { encryption, sign } = await generateUserKeyPair();
    const { recoveryKey } = await generateRecoveryKey();
    const { rk } = await encryptPrivateKeys(encryption.privateKey, sign.privateKey, encryptionKey, recoveryKey);
    const data = await reencrypPrivateKey(rk.encryptedMessage, rk.nonce, recoveryKey, "newpassword", "pony");
    expect(data.authKey.length).toEqual(32);
    expect(data.recoveryKey.length).toEqual(32);
    expect(data.encryptionPublicKey.length).toEqual(0);
    expect(data.signingPublicKey.length).toEqual(0);
    expect(data.encPrivateKeysDataSet.ek.encryptedMessage.length).toEqual(114);
    expect(data.encPrivateKeysDataSet.ek.nonce.length).toEqual(24);
    expect(data.encPrivateKeysDataSet.rk.encryptedMessage.length).toEqual(0);
    expect(data.encPrivateKeysDataSet.rk.nonce.length).toEqual(0);
    expect(data.signature.length).toEqual(64);
  });
  it("deriveUserKeys clean methood zero out buffers containing sensitive data", async () => {
    const { authKey, encryptionKey, clean } = await deriveUserKeys("password", "pony");
    clean();
    expect(isOverwiten(authKey)).toEqual(true);
    expect(isOverwiten(encryptionKey)).toEqual(true);
  });
  it("deriveUserKeys clean methood zero out buffers containing sensitive data", async () => {
    const { authKey, encryptionKey, clean } = await deriveUserKeys("password", "pony");
    clean();
    expect(isOverwiten(authKey)).toEqual(true);
    expect(isOverwiten(encryptionKey)).toEqual(true);
  });
  it("generateRecoveryKey clean methood zero out buffers containing sensitive data", async () => {
    const { recoveryKey, clean } = await generateRecoveryKey();
    clean();
    expect(isOverwiten(recoveryKey)).toEqual(true);
  });
  it("generateUserKeyPair clean methood zero out buffers containing sensitive data", async () => {
    const { encryption, sign, clean } = await generateUserKeyPair();
    clean();
    expect(isOverwiten(encryption.privateKey)).toEqual(true);
    expect(isOverwiten(encryption.publicKey)).toEqual(true);
    expect(isOverwiten(sign.privateKey)).toEqual(true);
    expect(isOverwiten(sign.publicKey)).toEqual(true);
  });
  it("decryptKeys clean methood zero out buffers containing sensitive data", async () => {
    const password = "password";
    const { encryptionKey } = await deriveUserKeys(password, "pony");
    const { encryption, sign } = await generateUserKeyPair();
    const { recoveryKey } = await generateRecoveryKey();
    const { ek } = await encryptPrivateKeys(encryption.privateKey, sign.privateKey, encryptionKey, recoveryKey);
    const ekDecrypted = await decryptKeys(ek.encryptedMessage, ek.nonce, encryptionKey);
    ekDecrypted.clean();
    expect(isOverwiten(ekDecrypted.encryptionPrivateKey)).toEqual(true);
    expect(isOverwiten(ekDecrypted.signingPrivateKey)).toEqual(true);
  });
  it("generateUserKeyPairInfo clean methood zero out buffers containing sensitive data", async () => {
    const password = "password";
    const {
      authKey,
      recoveryKey,
      clean,
    } = await generateUserKeyPairInfo("pony", password);
    clean();
    expect(isOverwiten(authKey)).toEqual(true);
    expect(isOverwiten(recoveryKey)).toEqual(true);
  });
});

function isOverwiten(arr: any) {
  return arr.every((el: number) => {
    return el === 0;
  });
}