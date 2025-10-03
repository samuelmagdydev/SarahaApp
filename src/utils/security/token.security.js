import jwt from "jsonwebtoken";
import * as DBService from "../../DB/db.service.js";
import { roleEnum, UserModel } from "../../DB/models/User.model.js";
import { nanoid } from "nanoid";
import { TokenModel } from "../../DB/models/Token.model.js";

export const signatureLevelEnum = { bearer: "Bearer", system: "System" };
export const tokenTypeEnum = { access: "access", refresh: "refresh" };

// ✅ خلي generateToken يقبل secret بدل signature
export const generateToken = async ({
  payload = {},
  secret = process.env.ACCESS_USER_TOKEN_SIGNATURE,
  options = { expiresIn: Number(process.env.ACCESS_TOKEN_EXPIRES_IN) },
} = {}) => {
  return jwt.sign(payload, secret, options);
};

export const verfiyToken = async ({
  token = "",
  secret = process.env.ACCESS_USER_TOKEN_SIGNATURE, // ✅ خلي default يطابق generate
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

  const signatures = await getSignatures({ signatureLevel: bearer });

  const decoded = await verfiyToken({
    token,
    secret:
      tokenType === tokenTypeEnum.access
        ? signatures.accessSignature
        : signatures.refreshSignature,
  });

  console.log("Decoded Token:", decoded);

  // ✅ استخدم decoded.jti مش decode.jti
 if(decoded.jti && await DBService.findOne({model:TokenModel , filter:{jti:decoded.jti}})){
  return next(new Error("Token Expired", { cause: 401 }));
 }

  const user = await DBService.findById({
    model: UserModel,
    id: decoded._id,
  });

  if (!user) {
    return next(new Error("In-valid User", { cause: 404 }));
  }

  return { user, decoded };
};

export const generateLoginCredentials = async ({ user } = {}) => {
  let signtures = await getSignatures({
    signatureLevel:
      user.role != roleEnum.user
        ? signatureLevelEnum.system
        : signatureLevelEnum.bearer,
  });
  const jwtid = nanoid();

  const access_token = await generateToken({
    payload: { _id: user._id },
    secret: signtures.accessSignature,
    options: {
      jwtid,
      expiresIn: Number(process.env.ACCESS_TOKEN_EXPIRES_IN),
    },
  });

  const refresh_token = await generateToken({
    payload: { _id: user._id },
    secret: signtures.refreshSignature,
    options: {
      jwtid,
      expiresIn: Number(process.env.REFRESH_TOKEN_EXPIRES_IN),
    },
  });

  return { user, access_token, refresh_token };
};
