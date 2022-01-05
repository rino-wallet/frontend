import { Wallet } from "../types";

export default function getEncryptedKeys(wallet: Wallet, email: string): string {
  const currentMember = wallet.members.find((m) => m.user === email);
  return currentMember?.encryptedKeys || "";
}
