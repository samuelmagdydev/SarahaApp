import {authenticationMiddleware} from "../../middleware/authentication.middleware.js"
import { tokenTypeEnum } from "../../utils/security/token.security.js";
import * as userService from "./user.service.js"
import {Router} from "express"
const router = Router();
router.get("/",authenticationMiddleware() ,userService.profile)
router.get("/refresh-token",authenticationMiddleware({tokenType:tokenTypeEnum.refresh}),userService.getNewLoginCredentials)

export default router