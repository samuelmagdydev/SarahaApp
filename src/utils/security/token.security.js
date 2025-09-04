import jwt from "jsonwebtoken";
import * as DBService from "../../DB/db.service.js";
import { roleEnum, UserModel } from "../../DB/models/User.model.js";

export const signatureLevelEnum = { bearer: "Bearer", system: "System" };
export const tokenTypeEnum = { access: "access", refresh: "refresh" };

export const generateToken = async ({
  payload = {},
  signature = process.env.ACCESS_USER_TOKEN_SIGNATURE,
  options = { expiresIn: Number(process.env.ACCESS_TOKEN_EXPIRES_IN) },
} = {}) => {
  return jwt.sign(payload, signature, options);
};

export const verfiyToken = async ({
  token = "",
  secret = process.env.ACCESS_TOKEN_SIGNATURE,
} = {}) => {
  return jwt.verify(token, secret);
};

export const getSignatures = async ({
  signatureLevel = signatureLevelEnum.bearer,
} = {}) => {
  let signtures = { accessSignature: undefined, refreshSignature: undefined };
  switch (signatureLevel) {
    case signatureLevelEnum.system:
      signtures.accessSignature = process.env.ACCESS_SYSTEM_TOKEN_SIGNATURE;
      signtures.refreshSignature = process.env.REFRESH_SYSTEM_TOKEN_SIGNATURE;
      break;

    default:
      signtures.accessSignature = process.env.ACCESS_USER_TOKEN_SIGNATURE;
      signtures.refreshSignature = process.env.REFRESH_USER_TOKEN_SIGNATURE;
      break;
  }
  return signtures;
};

export const decodedToken = async ({
  next,
  authorization = "",
  tokenType = tokenTypeEnum.access,
} = {}) => {
  const [bearer, token] = authorization?.split(" ") || [];
  if (!bearer || !token) {
    return next(new Error("missing token parts", { cause: 401 }));
  }

  let signatures = await getSignatures({ signatureLevel: bearer });

  const decoded = await verfiyToken({
    token,
    secret:
      tokenType === tokenTypeEnum.access
        ? signatures.accessSignature
        : signatures.refreshSignature,
  });
  console.log(decoded);

  const user = await DBService.findById({
    model: UserModel,
    id: decoded._id,
  });

  if (!user) {
    return next(new Error("In-valid User", { cause: 404 }));
  }

  return user;
};

export const generateLoginCredentials = async ({user}={}) => {
  let signtures = await getSignatures({
    signatureLevel:
      user.role != roleEnum.user
        ? signatureLevelEnum.system
        : signatureLevelEnum.bearer,
  });
  const access_token = await generateToken({
    payload: { _id: user._id },
    secret: signtures.accessSignature,
  });

  const refresh_token = await generateToken({
    payload: { _id: user._id },
    secret: signtures.refreshSignature,
    options: { expiresIn: Number(process.env.REFRESH_TOKEN_EXPIRES_IN) },
  });
  return { user, access_token, refresh_token };
};
