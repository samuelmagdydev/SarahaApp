import {
  cloudFileUpload,
  fileValidation,
} from "../../utils/multer/cloud.multer.js";
import { validation } from "../../middleware/validation.middeware.js";
import * as messageService from "./message.service.js";
import * as validators from "./message.validation.js";
import { Router } from "express";
import { authenticationMiddleware } from "../../middleware/authentication.middleware.js";
const router = Router({
     caseSensitive: true ,
     strict: true
    });

router.post(
  "/:receiverId",
  cloudFileUpload({ validation: fileValidation.image }).array("attachments", 2),
  validation(validators.sendMessage),
  messageService.sendMessage
);

router.post(
  "/:receiverId/sender",
  authenticationMiddleware(),
  cloudFileUpload({ validation: fileValidation.image }).array("attachments", 2),
  validation(validators.sendMessage),
  messageService.sendMessage
);

export default router;
