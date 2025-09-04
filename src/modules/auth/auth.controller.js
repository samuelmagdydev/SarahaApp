import { Router } from "express";
const router = Router();
import * as authService from "./auth.service.js";

router.post("/signup", authService.signup);

router.post("/login", authService.login);
router.post("/signup/gmail",authService.signupWithGmail)

export default router;
