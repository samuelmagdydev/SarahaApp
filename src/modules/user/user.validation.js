import Joi from "joi";
import { Types } from "mongoose";
import { generalFields } from "../../middleware/validation.middeware.js";
import { logoutEnum } from "../../utils/security/token.security.js";

export const shareProfileValidationSchema = {
  params: Joi.object().keys({
    userId: generalFields.Id.required(),
  }),
};

export const logout = {
  body: Joi.object().keys({
    flag: Joi.string().valid(...Object.values(logoutEnum)).default(logoutEnum.stayLoggedIn)
  }),
};

export const updateBasicInfo = {
  body: Joi.object().keys({
    firstName: generalFields.firstName,
    lastName: generalFields.lastName,
    phone: generalFields.phone,
    gender: generalFields.gender,
  }),
};

export const updatePassword = {
  body: Joi.object()
    .keys({
      oldPassword: generalFields.password.required(),
      password: generalFields.password.not(Joi.ref("oldPassword")).required(),
      confirmPassword: generalFields.confirmPassword.required(),
    })
    .required(),
};

export const freezeAccount = {
  params: Joi.object().keys({
    userId: generalFields.Id,
  }),
};

export const restoreAccount = {
  params: Joi.object().keys({
    userId: generalFields.Id.required(),
  }),
};

export const deleteAccount = {
  params: Joi.object().keys({
    userId: generalFields.Id.required(),
  }),
};
