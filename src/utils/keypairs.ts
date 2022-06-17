import _sodium from "libsodium-wrappers-sumo";
import { Keypair, EncryptedPrivateKeysDataSet, UserKeyPairInfo } from "../types";

/**
 * Derivation of authentication and encryption keys from the user password and username.
 *
 * This function generates a 64 bytes key using the crypto_pwhash derivation function.
 * This means using the key-derivation algorithm on a password that the user chooses.
 * This algorithm requires a password and salt. We'll use username as salt
 * The first 32 bytes, should be used for authentication purposes.
 * The last 32 bytes, should be used for encryption purposes.
 * This function shuld be called everytime when we ask for the user's password.
 */
export async function deriveUserKeys(password: string, username: string): Promise<{ authKey: Uint8Array; encryptionKey: Uint8Array; clean: () => void; }> {
  await _sodium.ready;
  const sodium = _sodium;
  const enc = new TextEncoder();
  const usernameSalt = Uint8Array.from(enc.encode(username));
  const salt = new Uint8Array(sodium.crypto_pwhash_SALTBYTES);
  salt.set(usernameSalt.subarray(0, sodium.crypto_pwhash_SALTBYTES));
  const key = sodium?.crypto_pwhash(
    64,
    password,
    salt,
    sodium.crypto_pwhash_OPSLIMIT_INTERACTIVE,
    sodium.crypto_pwhash_MEMLIMIT_INTERACTIVE,
    sodium.crypto_pwhash_ALG_DEFAULT,
  );
  const authKey = key.slice(0, 32);
  const encryptionKey = key.slice(32);
  sodium.memzero(usernameSalt);
  sodium.memzero(salt);
  return {
    authKey,
    encryptionKey,
    clean(): void {
      sodium.memzero(authKey);
      sodium.memzero(encryptionKey);
      sodium.memzero(key);
    },
  };
}

/**
 * Generate a recovery key.
 * We use sodium.randombytes_buf function to generate 32 bytes key
 */
export async function generateRecoveryKey(): Promise<{ recoveryKey: Uint8Array; clean: () => void; }> {
  await _sodium.ready;
  const sodium = _sodium;
  const recoveryKey = sodium.randombytes_buf(32);
  return {
    recoveryKey,
    clean(): void {
      sodium.memzero(recoveryKey);
    },
  };
}

/**
 * Generate new key pair
 */
export async function generateUserKeyPair(): Promise<{ encryption: Keypair; sign: Keypair; clean: () => void; }> {
  await _sodium.ready;
  const sodium = _sodium;
  const encryption = sodium.crypto_box_keypair();
  const sign = sodium.crypto_sign_keypair();
  return {
    encryption,
    sign,
    clean(): void {
      sodium.memzero(encryption.privateKey);
      sodium.memzero(encryption.publicKey);
      sodium.memzero(sign.privateKey);
      sodium.memzero(sign.publicKey);
    },
  };
}

/**
 * Encrypt the private keys using the encryption key.
 * Encrypt the private keys using the recovery key.
 * message = (2 bytes version) + encryptionPrivateKey + signingPrivateKey
 */
export async function encryptPrivateKeys(
  encryptionPrivateKey: Uint8Array,
  signingPrivateKey: Uint8Array,
  encryptionKey: Uint8Array,
  recoveryKey?: Uint8Array,
): Promise<EncryptedPrivateKeysDataSet> {
  await _sodium.ready;
  const sodium = _sodium;
  const version = new Uint8Array([0, 1]);
  const message = new Uint8Array(version.length + encryptionPrivateKey.length + signingPrivateKey.length);
  message.set(version);
  message.set(encryptionPrivateKey, version.length);
  message.set(signingPrivateKey, version.length + encryptionPrivateKey.length);
  const nonceEK = sodium.randombytes_buf(sodium.crypto_secretbox_NONCEBYTES);
  const nonceRK = sodium.randombytes_buf(sodium.crypto_secretbox_NONCEBYTES);
  const encryptedMessageEK = sodium.crypto_secretbox_easy(message, nonceEK, encryptionKey);
  const encryptedMessageRK = recoveryKey ? sodium.crypto_secretbox_easy(message, nonceRK, recoveryKey) : new Uint8Array();
  sodium.memzero(message);
  return {
    ek: { encryptedMessage: encryptedMessageEK, nonce: nonceEK },
    rk: {
      encryptedMessage: encryptedMessageRK,
      nonce: recoveryKey ? nonceRK : new Uint8Array(),
    },
  };
}

/**
 * Decrypt data using the encryption key.
 */
export async function decryptKeys(
  encryptedMessage: Uint8Array,
  nonce: Uint8Array,
  encryptionKey: Uint8Array,
): Promise<{
    version: number;
    encryptionPrivateKey: Uint8Array;
    signingPrivateKey: Uint8Array;
    clean: () => void;
  }> {
  try {
    await _sodium.ready;
    const sodium = _sodium;
    const decryptedMessage = sodium.crypto_secretbox_open_easy(encryptedMessage, nonce, encryptionKey);
    const version = decryptedMessage[1];
    const encryptionPrivateKey = decryptedMessage.slice(2, 34);
    const signingPrivateKey = decryptedMessage.slice(34);
    return {
      version,
      encryptionPrivateKey,
      signingPrivateKey,
      clean(): void {
        sodium.memzero(encryptionPrivateKey);
        sodium.memzero(signingPrivateKey);
      },
    };
  } catch (error) {
    throw ({ decryptKeys: "Decryption failed.", password: "Incorrect password." });
  }
}

/**
 * Convert encryptionPublicKey, signingPublicKey,  privateKeysEK, nonceEK,
 * privateKeysRK, nonceRK to base64 and concatinate into one string.
 * Create a detached signature of that resulting string.
 */
export async function signKeys(
  privateKey: Uint8Array,
  encryptionPublicKey: Uint8Array,
  signingPublicKey: Uint8Array,
  privateKeysEK: Uint8Array,
  nonceEK: Uint8Array,
  privateKeysRK: Uint8Array,
  nonceRK: Uint8Array,
): Promise<Uint8Array> {
  await _sodium.ready;
  const sodium = _sodium;
  const arrays = [
    encryptionPublicKey,
    signingPublicKey,
    privateKeysEK,
    nonceEK,
    privateKeysRK,
    nonceRK,
  ];
  const message = arrays.reduce((prev, cur) => prev + Buffer.from(cur).toString("base64"), "");
  return sodium.crypto_sign_detached(message, privateKey);
}

/**
 * Generate user keypair information.
 */
export async function generateUserKeyPairInfo(
  username: string,
  password: string,
  derivedKeys?: { authKey: Uint8Array, encryptionKey: Uint8Array, clean: () => void },
): Promise<UserKeyPairInfo> {
  const { authKey, encryptionKey, clean: cleanDerivedKeys } = derivedKeys || await deriveUserKeys(password, username);
  const { recoveryKey, clean: cleanRecoveryKey } = await generateRecoveryKey();
  const { clean: cleanUserKeyPair, ...keyPair } = await generateUserKeyPair();
  const encPrivateKeysDataSet = await encryptPrivateKeys(
    keyPair.encryption.privateKey,
    keyPair.sign.privateKey,
    encryptionKey,
    recoveryKey,
  );
  const signature = await signKeys(
    keyPair.sign.privateKey,
    keyPair.encryption.publicKey,
    keyPair.sign.publicKey,
    encPrivateKeysDataSet.ek.encryptedMessage,
    encPrivateKeysDataSet.ek.nonce,
    encPrivateKeysDataSet.rk.encryptedMessage,
    encPrivateKeysDataSet.rk.nonce,
  );
  return {
    authKey,
    recoveryKey,
    encryptionPublicKey: keyPair.encryption.publicKey,
    signingPublicKey: keyPair.sign.publicKey,
    encPrivateKeysDataSet,
    signature,
    clean(): void {
      cleanDerivedKeys();
      cleanRecoveryKey();
      cleanUserKeyPair();
    },
  };
}

/**
 * This function is used when resetting the user's password.
 * 1. decrypts encrypted private key with the recovery key
 * 2. derivates authentication and encription keys from the new user password
 * 3. encrypts private keys using the new encription key
 * 4. creates signature
 */
export async function reencrypPrivateKey(
  encPrivateKeys: Uint8Array,
  nonce: Uint8Array,
  recoveryKey: Uint8Array,
  newPassword: string,
  username: string,
): Promise<UserKeyPairInfo> {
  const { authKey, encryptionKey, clean: cleanDerivedKeys } = await deriveUserKeys(newPassword, username);
  const { clean: cleanDecrypredKeys, ...decryptedData } = await decryptKeys(
    encPrivateKeys,
    nonce,
    recoveryKey,
  );
  // do not encrypt with recovery key
  const reEncPrivateKeysDataSet = await encryptPrivateKeys(
    decryptedData.encryptionPrivateKey,
    decryptedData.signingPrivateKey,
    encryptionKey,
  );
  // sign only encrypted private key
  const signature = await signKeys(
    decryptedData.signingPrivateKey,
    new Uint8Array(),
    new Uint8Array(),
    reEncPrivateKeysDataSet.ek.encryptedMessage,
    reEncPrivateKeysDataSet.ek.nonce,
    reEncPrivateKeysDataSet.rk.encryptedMessage,
    reEncPrivateKeysDataSet.rk.nonce,
  );
  return {
    authKey,
    recoveryKey,
    encryptionPublicKey: new Uint8Array(), // empty array to correspond function response interface
    signingPublicKey: new Uint8Array(), // empty array to correspond function response interface
    encPrivateKeysDataSet: reEncPrivateKeysDataSet,
    signature,
    clean(): void {
      cleanDerivedKeys();
      cleanDecrypredKeys();
    },
  };
}

/**
 * This function is used to get signingPrivateKey and signingPublicKey from enc_private_key.
 * @param data enc_private_key data
 */
export async function getSigningKeys(data: { enc_content: string; nonce: string; }, encryptionKey: Uint8Array): Promise<{
  signingPrivateKey: Uint8Array;
  signingPublicKey: Uint8Array;
  clean: () => void;
}> {
  const sodium = _sodium;
  const enc_content = Buffer.from(data.enc_content, "base64");
  const nonce = Buffer.from(data.nonce, "base64");
  const { signingPrivateKey, clean } = await decryptKeys(enc_content, nonce, encryptionKey);
  const signingPublicKey = sodium.crypto_sign_ed25519_sk_to_pk(signingPrivateKey);
  return {
    signingPrivateKey,
    signingPublicKey,
    clean,
  };
}

/**
 * This function is used to create signature for message.
 * @param data enc_private_key data
 */
export async function signMessage(data: any, encryptionKey: Uint8Array, message: string): Promise<Uint8Array> {
  const sodium = _sodium;
  const { signingPrivateKey, clean } = await getSigningKeys(data, encryptionKey);
  const signature = sodium.crypto_sign_detached(message, signingPrivateKey);
  clean();
  return signature;
}

/**
 * This function is used to verify signature
 */
export function verifySignature(signature: Uint8Array, message: string, signingPublicKey: Uint8Array): boolean {
  const sodium = _sodium;
  return sodium.crypto_sign_verify_detached(signature, message, signingPublicKey);
}
