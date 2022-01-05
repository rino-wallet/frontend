import * as openpgp from "openpgp";
import scrypt from "scrypt-js";
import CryptoJS from "crypto-js";
import { DerivedKeys } from "../types";

/**
 * Derivation of authentication and encryption keys from the user password.
 * 
 * This function generates a 64 bytes/char key using the scrypt derivation function.
 * This means using the key-derivation algorithm (scrypt.) on a password that the user chooses.
 * This algorithm requires a password and salt. We'll us sha256(password) as salt
 * The first 32 chars, should be used for authentication purposes.
 * The last 32 chars, should be used for encryption purposes.
 * This function shuld be called everytime when we ask for the user's password.
 */
export async function deriveUserKeys(password: string): Promise<DerivedKeys> {
  /*
    N - The CPU/memory cost; increasing this increases the overall difficulty
    r - The block size; increasing this increases the dependency on memory latency and bandwidth
    p - The parallelization cost; increasing this increases the dependency on multi-processing
    scrypt.scrypt( password , salt , N , r , p , dkLen [ , progressCallback ] ) => Promise
  */
  const N = 1024;
  const r = 8;
  const p = 1;
  const dkLen = 32;

  const passwordHash = CryptoJS.SHA256(password).toString();
  const passwordNFC = new (Buffer as any).from(password.normalize("NFKC"));
  const saltNFC = new (Buffer as any).from(passwordHash.normalize("NFKC"));
  const derivedKey = await scrypt.scrypt(passwordNFC, saltNFC, N, r, p, dkLen);
  const derivedKeyHash = Buffer.from(derivedKey).toString("hex");
  const authKey = derivedKeyHash.slice(0, 32);
  const encryptionKey = derivedKeyHash.slice(32);

  return {
    authKey,
    encryptionKey,
  }
}

/**
 * Generate a recovery key.
 * We use the same algorithm as in deriveUserKeys function,
 * but we use a long random string as password, and another one as salt.
 */
export async function generateRecoveryKey(): Promise<string> {
  const random1 = CryptoJS.lib.WordArray.random(128 / 8).toString();
  const random2 = CryptoJS.lib.WordArray.random(128 / 8).toString();
  const key = await scrypt.scrypt(Buffer.from(random1), Buffer.from(random2), 1024, 8, 1, 16);
  return Buffer.from(key).toString("hex");
}

/**
 * Generate new PGP key pair
 */
export async function generateUserKeyPair(email: string): Promise<{privateKey: string; publicKey: string}> {
  const { privateKeyArmored, publicKeyArmored } = await openpgp.generateKey({
    type: "ecc",
    curve: "curve25519",
    userIDs: [{ email }],
  });
  return { privateKey: privateKeyArmored, publicKey: publicKeyArmored };
}

/**
 * Encrypt the private key using the encryption key.
 * Encrypt the private key using the recovery key.
 */
export async function encryptPrivateKeys(
  privateKey: string,
  encryptionKey: string,
  recoveryKey: string): Promise<{privateKeyEK: string; privateKeyRK: string}> {
  const message = await openpgp.createMessage({ text: privateKey });
  return {
    privateKeyEK: encryptionKey ? await openpgp.encrypt({
      message,
      passwords: [encryptionKey],
    }) : "",
    privateKeyRK: recoveryKey ?  await openpgp.encrypt({
      message,
      passwords: [recoveryKey],
    }) : "",
  }
}

/**
 * Decrypt a key using the recovery key.
 */
export async function decryptKey(encryptedKey: string, recoveryKey: string): Promise<string> {
  try {
    const message = await openpgp.readMessage({
      armoredMessage: encryptedKey,
    });
    const { data } = await openpgp.decrypt({
        message,
        passwords: [recoveryKey],
        format: "utf8"
    });
    return data;
  } catch(error) {
    throw({ decryptKey: "decryption failed." })
  }
}

/**
 * Concat public key, private privateKeyEncryptedByEncryptedKey and privateKeyEncryptedByRecoveryKey
 * Create a detached signature of that resulting string.
 */
export async function signKeys(
  privateKey: string,
  publicKey: string,
  privateKeyEK: string,
  privateKeyRK: string): Promise<string> {
  const cleartextMessage = await openpgp.createMessage({ text: `${publicKey}${privateKeyEK}${privateKeyRK}` });
  const detachedSignature = await openpgp.sign({
    message: cleartextMessage,
    privateKeys: await openpgp.readKey({ armoredKey: privateKey }),
    detached: true
  });
  return detachedSignature;
}

/**
 * Generate user keypair information.
 */
export async function generateUserKeyPairInfo(email: string, password: string, derivedKeys?: { authKey: string, encryptionKey: string }): Promise<{
  authKey: string;
  recoveryKey: string;
  publicKey: string;
  privateKeyEK: string;
  privateKeyRK: string;
  signature: string;
}> {
  const { authKey, encryptionKey } = derivedKeys ? derivedKeys : await deriveUserKeys(password);
  const recoveryKey = await generateRecoveryKey();
  const { privateKey, publicKey } = await generateUserKeyPair(email);
  const {privateKeyEK, privateKeyRK } = await encryptPrivateKeys(privateKey, encryptionKey, recoveryKey);
  const signature = await signKeys(privateKey, publicKey, privateKeyEK, privateKeyRK);
  return {
    authKey,
    recoveryKey,
    publicKey,
    privateKeyEK,
    privateKeyRK,
    signature,
  }
}

/**
 * This function is used when resetting the user's password.
 * 1. decrypts encrypted private pgp key with the recovery key
 * 2. derivates authentication and encription keys from the new user password
 * 3. encrypts private pgp key using the new encription key
 * 4. creates signature
 */
export async function reencrypPrivateKey(encryptedPrivateKey: string, recoveryKey: string, newPassword: string): Promise<{
  authKey: string;
  privateKeyEK: string;
  signature: string;
}> {
  const { authKey, encryptionKey } = await deriveUserKeys(newPassword);
  const privateKey = await decryptKey(encryptedPrivateKey, recoveryKey);
  const { privateKeyEK } = await encryptPrivateKeys(privateKey, encryptionKey, ""); // do not encrypt with recovery key
  const signature = await signKeys(privateKey, "", privateKeyEK, ""); // sign only encrypted private key
  return {
    authKey,
    privateKeyEK,
    signature,
  }
}
