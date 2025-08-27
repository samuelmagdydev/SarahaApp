import {authenticationMiddleware} from "../../middleware/authentication.middleware.js"
import * as userService from "./user.service.js"
import {Router} from "express"
const router = Router();
router.get("/",authenticationMiddleware(),userService.profile)

export default router