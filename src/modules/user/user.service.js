import { asyncHandler, successResponse } from "../../utils/response.js";
import { decreyptEncryption } from "../../utils/security/encryption.security.js";
import { generateLoginCredentials } from "../../utils/security/token.security.js";

export const profile = asyncHandler(async (req, res, next) => {
  req.user.phone = await decreyptEncryption({ cipherText: req.user.phone });
  return successResponse({ res, data: { user: req.user } });
});

export const getNewLoginCredentials = asyncHandler(async (req, res, next) => {
  const credentials = await generateLoginCredentials({ user: req.user });
  return successResponse({ res, data: { credentials } });
});


