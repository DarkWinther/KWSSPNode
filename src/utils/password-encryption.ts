import { pbkdf2Sync, randomBytes } from "crypto";

const iterations = 8192;
const length = 32;
const digest = "sha512";

export const hashPassword = (password: string): string => {
  const salt = randomBytes(16).toString("hex");
  const hash = pbkdf2Sync(password, salt, iterations, length, digest).toString('hex');
  return [salt, hash].join("$");
};

export const verifyPassword = (password: string, hash: string): boolean => {
  if (hash.includes("$")) {
    const split = hash.split("$");
    if (split.length === 2) {
      const [salt, ogHash] = split;
      const hashedPwd = pbkdf2Sync(
        password,
        salt,
        iterations,
        length,
        digest
      ).toString("hex");

      return hashedPwd === ogHash;
    }
  }
  return false;
};
