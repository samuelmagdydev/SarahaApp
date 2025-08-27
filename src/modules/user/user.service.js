import { asyncHandler, successResponse } from "../../utils/response.js";
import * as DBService from "../../DB/db.service.js";
import { UserModel } from "../../DB/models/User.model.js";
import { decreyptEncryption } from "../../utils/security/encryption.security.js";


export const profile = asyncHandler(async (req, res, next) => {
 
  

  req.user.phone = await decreyptEncryption({ cipherText: req.user.phone });
  return successResponse({ res, data: { user: req.user } });
});
