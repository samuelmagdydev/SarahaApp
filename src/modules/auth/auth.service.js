import { UserModel } from "../../DB/models/User.model.js";
import { asyncHandler, successResponse } from "../../utils/response.js";
import * as DBService from "../../DB/db.service.js";
import {
  generateHash,
  compareHash,
} from "../../utils/security/hash.security.js";
import { generateEncryption } from "../../utils/security/encryption.security.js";

export const signup = asyncHandler(async (req, res, next) => {
  const { firstName, lastName, email, password, phone } = req.body;
  if (await DBService.findOne({ model: UserModel, filter: { email } })) {
    return next(new Error("Email Already Exist", { cause: 409 }));
  }

  const hashPassword = await generateHash({ plaintext: password });
  const encPhone = await generateEncryption({ plaintext: phone });
  const [user] = await DBService.create({
    model: UserModel,
    data: [
      { firstName, lastName, email, password: hashPassword, phone: encPhone },
    ],
  });
  return successResponse({
    res,
    status: 201,
    message: "Account Created Successfuly",
    data: { user },
  });
});

export const login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;
  const user = await DBService.findOne({
    model: UserModel,
    filter: { email },
  });
  if (!user) {
    return next(new Error("In-valid Email Or Paasword", { cause: 404 }));
  }
  const match = await compareHash({
    plaintext: password,
    hashValue: user.password,
  });
  if (!match) {
    return next(new Error("In-Valid Email Or Paasword", { cause: 404 }));
  }
  return successResponse({ res, data: { user } });
});
