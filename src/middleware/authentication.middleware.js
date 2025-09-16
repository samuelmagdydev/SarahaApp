import { asyncHandler } from "../utils/response.js";
import {
  decodedToken,
  tokenTypeEnum,
} from "../utils/security/token.security.js";

export const authenticationMiddleware = ({
  tokenType = tokenTypeEnum.access,
} = {}) => {
  return asyncHandler(async (req, res, next) => {
    req.user = await decodedToken({
      next,
      authorization: req.headers.authorization,
      tokenType,
    });
    return next();
  });
};

export const authorization = ({ accessRoles = [] } = {}) => {
  return asyncHandler(async (req, res, next) => {
    console.log({
      accessRoles,
      currentRole: req.user.role,
      match: accessRoles.includes(req.user.role),
    });
    if (!accessRoles.includes(req.user.role)) {
      return next(
        new Error("You are not authorized to access this resource", {
          cause: 403,
        })
      );
    }
    return next();
  });
};

export const auth = ({
  tokenType = tokenTypeEnum.access,
  accessRoles = [],
} = {}) => {
  return asyncHandler(async (req, res, next) => {
    req.user = await decodedToken({
      next,
      authorization: req.headers.authorization,
      tokenType,
    });
    console.log({
      accessRoles,
      currentRole: req.user.role,
      match: accessRoles.includes(req.user.role),
    });
    if (!accessRoles.includes(req.user.role)) {
      return next(
        new Error("You are not authorized to access this resource", {
          cause: 403,
        })
      );
    }
    return next();
  });
};
