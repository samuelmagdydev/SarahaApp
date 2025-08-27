import crypto from "crypto-js";

export const generateEncryption = async ({
  plaintext = "",
  secretKey = process.env.ENCRYPTION_SECRET,
} = {}) => {
  return crypto.AES.encrypt(plaintext, secretKey).toString();
};

export const decreyptEncryption = async ({
  cipherText = "",
  secretKey = process.env.ENCRYPTION_SECRET,
} = {}) => {
  return crypto.AES.decrypt(cipherText, secretKey).toString(crypto.enc.Utf8);
};
