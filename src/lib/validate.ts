import { PublicKey } from "@solana/web3.js";

export function isValidSolanaAddress(address: string): boolean {
  try {
    new PublicKey(address);
    return true;
  } catch {
    return false;
  }
}

export function isValidAmount(amount: number, min = 0.01, max = 10000): boolean {
  return typeof amount === "number" && !isNaN(amount) && amount >= min && amount <= max;
}

export function isValidString(str: string, maxLength = 500): boolean {
  return typeof str === "string" && str.trim().length > 0 && str.length <= maxLength;
}
