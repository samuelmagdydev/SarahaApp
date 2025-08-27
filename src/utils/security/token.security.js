import jwt from "jsonwebtoken";

export const generateToken = async ({
  payload,
  signature = process.env.ACCESS_TOKEN_SIGNATURE,
  options = { expireIn: Number(process.env.ACCESS_TOKEN_EXPIRES_IN) },
} = {}) => {
  return jwt.sign(payload, signature, options);
};

export const verfiyToken = async ({
  token = "",
  signature = "afbkjbhafkl",
} = {}) => {
  return jwt.verify(token, signature);
};
