import { roleEnum } from "../../DB/models/User.model.js";
import {
    auth,
  authenticationMiddleware,
  authorization,
} from "../../middleware/authentication.middleware.js";
import { tokenTypeEnum } from "../../utils/security/token.security.js";
import { endpoint } from "./user.authorization.js";
import * as userService from "./user.service.js";
import { Router } from "express";
const router = Router();
router.get(
  "/",
  auth({ accessRoles: endpoint.profile }),
  userService.profile
);
router.get(
  "/refresh-token",
  authenticationMiddleware({ tokenType: tokenTypeEnum.refresh }),
  userService.getNewLoginCredentials
);

export default router;
