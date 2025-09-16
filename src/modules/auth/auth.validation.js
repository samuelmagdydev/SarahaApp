import Joi from "joi";
import { generalFields } from "../../middleware/validation.middeware.js";

export const loginValidationSchema = {
  body: Joi.object()
    .keys({
      email: generalFields.email.required(),
      password: generalFields.password.required(),
    })
    .required(),
};

export const sigupValidationSchema = {
  body: loginValidationSchema.body
    .append({
      firstName: generalFields.firstName.required(),
      lastName: generalFields.lastName.required(),
      confirmPassword: generalFields.confirmPassword.required(),
      phone: generalFields.phone.required(),
    })
    .required(),
};


export const confirmEmailValidationSchema = {
  body: Joi.object().keys({
    email: generalFields.email.required(),
    otp: generalFields.otp.required(),
  }).required(),
};



export const loginWithGmailValidationSchema = {
  body: Joi.object().keys({
   idToken: Joi.string().required(),
  }).required(),
};
