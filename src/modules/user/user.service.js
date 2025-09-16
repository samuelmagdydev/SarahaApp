import { UserModel } from "../../DB/models/User.model.js";
import { asyncHandler, successResponse } from "../../utils/response.js";
import {
  decreyptEncryption,
  generateEncryption,
} from "../../utils/security/encryption.security.js";
import { generateLoginCredentials } from "../../utils/security/token.security.js";
import * as DBService from "../../DB/db.service.js";

export const profile = asyncHandler(async (req, res, next) => {
  req.user.phone = await decreyptEncryption({ cipherText: req.user.phone });
  return successResponse({ res, data: { user: req.user } });
});

export const shareProfile = asyncHandler(async (req, res, next) => {
  const { userId } = req.params;
  const user = await DBService.findOne({
    model: UserModel,
    filter: {
      _id: userId,
      confirmEmail: { $exists: true },
    },
  });
  return user
    ? successResponse({ res, data: { user } })
    : next(new Error("In-valid Or Not Confirmed account", { cause: 404 }));
});

export const updateBasicInfo = asyncHandler(async (req, res, next) => {
  if (req.body.phone) {
    req.body.phone = await generateEncryption({ plaintext: req.body.phone });
  }

  const user = await DBService.findOneAndUpdate({
    model: UserModel,
    filter: {
      _id: req.user._id,
    },
    data: req.body,
  });
  return user
    ? successResponse({ res, data: { user } })
    : next(new Error("In-valid Or Not Confirmed account", { cause: 404 }));
});

export const getNewLoginCredentials = asyncHandler(async (req, res, next) => {
  const credentials = await generateLoginCredentials({ user: req.user });
  return successResponse({ res, data: { credentials } });
});
