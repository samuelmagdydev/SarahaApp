import { Router } from "express";
const router = Router();
import * as authService from "./auth.service.js";
import { validation } from "../../middleware/validation.middeware.js";
import * as validators from "./auth.validation.js";

router.post(
  "/signup",
  validation(validators.sigupValidationSchema),
  authService.signup
);
router.patch("/confirmEmail", authService.confirmEmail);

router.post(
  "/login",
  validation(validators.loginValidationSchema),
  authService.login
);

router.post("/signup/gmail", authService.signupWithGmail);
router.post("/login/gmail", authService.loginWithGmail);

export default router;
