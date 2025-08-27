import { asyncHandler } from "../utils/response.js";
import * as DBService from "../DB/db.service.js";
import { UserModel } from "../DB/models/User.model.js";
import jwt  from "jsonwebtoken";
import { verfiyToken } from "../utils/security/token.security.js";

export const authenticationMiddleware = () => {
  return asyncHandler(async (req, res, next) => {
    const { authorization } = req.headers;

    const decoded = await verfiyToken({ token: authorization });
    if (!decoded?._id) {
      return next(new Error("In-valid Token", { cause: 400 }));
    }
    const user = await DBService.findById({
      model: UserModel,
      id: decoded._id,
    });
    if (!user) {
      return next(new Error("In-valid User", { cause: 404 }));
    }
    req.user = user;
    return next();
  });
};
