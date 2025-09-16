import Joi from "joi";
import { Types } from "mongoose";
import { generalFields } from "../../middleware/validation.middeware.js";

export const shareProfileValidationSchema = {
  params: Joi.object().keys({
    userId: generalFields.Id.required(),
  }),
};


export const updateBasicInfo = {
  body: Joi.object().keys({
    firstName: generalFields.firstName,
    lastName:generalFields.lastName,
    phone:generalFields.phone,
    gender:generalFields.gender
  })
}