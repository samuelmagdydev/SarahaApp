import { asyncHandler, successResponse } from "../../utils/response.js";
import * as DBService from "../../DB/db.service.js";
import { UserModel } from "../../DB/models/User.model.js";
import { decreyptEncryption } from "../../utils/security/encryption.security.js";

export const profile = asyncHandler(async (req, res, next) => {
  const user = await DBService.findById({
    model: UserModel,
    id: req.params.userId,
  });
  user.phone = await decreyptEncryption({ cipherText: user.phone });
  return successResponse({ res, data: { user } });
});
