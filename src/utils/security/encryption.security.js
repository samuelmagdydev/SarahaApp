import crypto from "crypto-js";

export const generateEncryption = async ({
  plaintext = "",
  secretKey = "sasaGamedFa45e",
} = {}) => {
  return crypto.AES.encrypt(plaintext, secretKey).toString();
};

export const decreyptEncryption = async ({
  cipherText = "",
  secretKey = "sasaGamedFa45e",
} = {}) => {
  return crypto.AES.decrypt(cipherText, secretKey).toString(crypto.enc.Utf8);
};
