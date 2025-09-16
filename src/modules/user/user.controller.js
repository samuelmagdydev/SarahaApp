import { roleEnum } from "../../DB/models/User.model.js";
import {
  auth,
  authenticationMiddleware,
  authorization,
} from "../../middleware/authentication.middleware.js";
import { tokenTypeEnum } from "../../utils/security/token.security.js";
import { endpoint } from "./user.authorization.js";
import { validation } from "../../middleware/validation.middeware.js";
import * as userService from "./user.service.js";
import * as validators from "./user.validation.js";
import { Router } from "express";
const router = Router();

router.get("/", auth({ accessRoles: endpoint.profile }), userService.profile);

router.get(
  "/:userId",
  validation(validators.shareProfileValidationSchema),
  userService.shareProfile
);

router.patch(
  "/",
  authenticationMiddleware(),
  validation(validators.updateBasicInfo),
  userService.updateBasicInfo
);

router.get(
  "/refresh-token",
  authenticationMiddleware({ tokenType: tokenTypeEnum.refresh }),
  userService.getNewLoginCredentials
);

export default router;
