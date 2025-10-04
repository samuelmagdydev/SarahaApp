import { Types } from "mongoose";
import { asyncHandler } from "../utils/response.js";
import Joi from "joi";
import { genderEnum } from "../DB/models/User.model.js";
import { fileValidation } from "../utils/multer/local.multer.js";

export const generalFields = {
  email: Joi.string()
    .email({
      minDomainSegments: 2,
      maxDomainSegments: 3,
      tlds: { allow: ["com", "net", "edu"] },
    })

    .messages({
      "string.email": `Email must be a valid email`,
      "string.empty": `Email cannot be an empty field`,
      "any.required": `Email is a required field`,
    }),
  password: Joi.string()
    .pattern(new RegExp(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/))

    .messages({
      "string.empty": `Password cannot be an empty field`,
      "any.required": `Password is a required field`,
    }),
  firstName: Joi.string().min(3).max(30).messages({
    "string.empty": `First name cannot be an empty field`,
    "any.required": `First name is a required field`,
  }),
  lastName: Joi.string().min(3).max(30).messages({
    "string.empty": `Last name cannot be an empty field`,
    "any.required": `Last name is a required field`,
  }),

  confirmPassword: Joi.string()
    .valid(Joi.ref("password"))

    .messages({ "any.only": "Confirm password does not match" }),

  phone: Joi.string()
    .pattern(new RegExp(/^(002|\+2)?01[0125][0-9]{8}$/))

    .messages({
      "string.pattern.base": `Phone number must be a valid Egyptian mobile number`,
    }),
  otp: Joi.string(),
  gender: Joi.string().valid(...Object.values(genderEnum)),
  Id: Joi.string().custom((value, helper) => {
    return Types.ObjectId.isValid(value) || helper.message("In-valid ObjectId");
  }),

  file: {
    fieldname: Joi.string().required(),
    originalname: Joi.string().required(),
    encoding: Joi.string().required(),
    mimetype:Joi.string().required(),
    finalPath: Joi.string().required(),
    destination: Joi.string().required(),
    filename: Joi.string().required(),
    path: Joi.string().required(),
    size: Joi.number().positive().required(),
  },

  
};

export const validation = (schema) => {
  return asyncHandler(async (req, res, next) => {
    console.log(req.files);

    const validationError = [];
    for (const key of Object.keys(schema)) {
      const validationResult = schema[key].validate(req[key], {
        abortEarly: false,
      });
      if (validationResult.error) {
        validationError.push({
          key,
          details: validationResult.error.details.map((ele) => {
            return { message: ele.message, path: ele.path[0] };
          }),
        });

        return res
          .status(400)
          .json({ err_message: "Validation Error", validationResult });
      }
    }

    if (validationError.length) {
      return res
        .status(400)
        .json({ err_message: "Validation Error", validationError });
    }

    return next();
  });
};
