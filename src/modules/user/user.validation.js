import Joi from "joi";
import { Types } from "mongoose";
import { generalFields } from "../../middleware/validation.middeware.js";
import { logoutEnum } from "../../utils/security/token.security.js";
import { fileValidation } from "../../utils/multer/local.multer.js";

export const shareProfileValidationSchema = {
  params: Joi.object().keys({
    userId: generalFields.Id.required(),
  }),
};

export const logout = {
  body: Joi.object().keys({
    flag: Joi.string()
      .valid(...Object.values(logoutEnum))
      .default(logoutEnum.stayLoggedIn),
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
  body: logout.body
    .append({
      oldPassword: generalFields.password.required(),
      password: generalFields.password.not(Joi.ref("oldPassword")).required(),
      confirmPassword: generalFields.confirmPassword.required(),
    })
    .required(),
};

export const profileImage = {
  file:Joi.object().keys({
      fieldname: generalFields.file.filename.valid("image"),
        originalname: generalFields.file.originalname,
        encoding: generalFields.file.encoding,
        mimetype: generalFields.file.mimetype.valid(
          ...Object.values(fileValidation.image)
        ),
        // finalPath: generalFields.file.finalPath,
        destination: generalFields.file.destination,
        filename: generalFields.file.filename,
        path: generalFields.file.path,
        size: generalFields.file.size,
  }).required()
};


export const profileCoverImage = {
  files: Joi.array()
    .items(
      Joi.object().keys({
        fieldname: generalFields.file.filename.valid("coverImages"),
        originalname: generalFields.file.originalname,
        encoding: generalFields.file.encoding,
        mimetype: generalFields.file.mimetype.valid(
          ...Object.values(fileValidation.image)
        ),
        // finalPath: generalFields.file.finalPath,
        destination: generalFields.file.destination,
        filename: generalFields.file.filename,
        path: generalFields.file.path,
        size: generalFields.file.size,
      })
    )
    .min(1)
    .max(2),

  //   files: Joi.array().items(
  //   Joi.object().keys(generalFields.file).required()
  // ).min(1).max(2).required()
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
