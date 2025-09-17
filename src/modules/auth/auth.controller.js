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
router.patch(
  "/confirmEmail",
  validation(validators.confirmEmailValidationSchema),
  authService.confirmEmail
);

router.post(
  "/login",
  validation(validators.loginValidationSchema),
  authService.login
);


router.patch(
  "/forgot-password",
  validation(validators.forgetPasswordValidationSchema),
  authService.forgetPassword
);


router.patch(
  "/verfiy-forgot-password",
  validation(validators.verfiyForgotPasswordValidationSchema),
  authService.verfiyForgotPassword
);



router.patch(
  "/reset-forgot-password",
  validation(validators.resetForgotPasswordValidationSchema),
  authService.resetForgotPassword
);

router.post(
  "/signup/gmail",
  validation(validators.loginWithGmailValidationSchema),
  authService.signupWithGmail
);
router.post(
  "/login/gmail",
  validation(validators.loginWithGmailValidationSchema),
  authService.loginWithGmail
);

export default router;
