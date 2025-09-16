import { Router } from "express";
const router = Router();
import * as authService from "./auth.service.js";

router.post("/signup", authService.signup);
router.patch("/confirmEmail", authService.confirmEmail);``
router.post("/login", authService.login);


router.post("/signup/gmail",authService.signupWithGmail);
router.post("/login/gmail",authService.loginWithGmail);

export default router;
