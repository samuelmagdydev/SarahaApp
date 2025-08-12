import bcrypt from "bcryptjs";

export const generateHash = async ({ plaintext = "", saltRound = 12 } = {}) => {
  return bcrypt.hashSync(plaintext, parseInt(saltRound));
};

export const compareHash = async ({ plaintext = "", hashValue = "" } = {}) => {
  return bcrypt.compareSync(plaintext, hashValue);
};
