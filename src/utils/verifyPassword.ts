import { deriveUserKeys } from "./keypairs";
import sessionApi from "../api/session";
import { DerivedKeys } from "../types";

export default async function verifyPassword(password: string, email: string): Promise<DerivedKeys> {
  try {
    const derivedKeys = await deriveUserKeys(password);
    await sessionApi.verifyPassword({ email, password: derivedKeys.authKey })
    return derivedKeys;
  } catch(error) {
    if (error?.status === 400) {
      throw {
        ...error,
        data: {
          password: "Incorrect password",
        }
      };
    }
    return error;
  }
}
