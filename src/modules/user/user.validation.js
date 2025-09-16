import Joi from "joi";
import { Types } from "mongoose";
import { generalFields } from "../../middleware/validation.middeware.js";

export const shareProfileValidationSchema = {
  params: Joi.object().keys({
    userId: generalFields.Id.required(),
  }),
};
