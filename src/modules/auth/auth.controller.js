import {Router} from 'express';
const router = Router();
import * as authService from "./auth.service.js";


router.post("/signup",authService.signup)





export default router