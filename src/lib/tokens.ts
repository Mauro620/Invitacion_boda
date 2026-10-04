import { customAlphabet } from "nanoid";

// No look-alike chars (0/O, 1/l/I) so tokens survive being read aloud or retyped.
const alphabet = "23456789abcdefghijkmnpqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ";
const make = customAlphabet(alphabet, 11);

export const TOKEN_REGEX = /^[2-9a-km-zA-HJ-NP-Z]{10,12}$/;

export function generateToken(): string {
  return make();
}

export function isValidTokenShape(token: unknown): token is string {
  return typeof token === "string" && TOKEN_REGEX.test(token);
}
