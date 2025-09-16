import Joi from "joi";
export const loginValidationSchema = Joi.object()
  .keys({
    email: Joi.string()
      .email({
        minDomainSegments: 2,
        maxDomainSegments: 3,
        tlds: { allow: ["com", "net", "edu"] },
      })
      .required()
      .messages({
        "string.email": `Email must be a valid email`,
        "string.empty": `Email cannot be an empty field`,
        "any.required": `Email is a required field`,
      }),
    password: Joi.string()
      .pattern(
        new RegExp(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/)
      )
      .required()
      .messages({
        "string.empty": `Password cannot be an empty field`,
        "any.required": `Password is a required field`,
      }),
  })
  .required();

export const sigupValidationSchema = loginValidationSchema
  .append({
    firstName: Joi.string().min(3).max(30).required().messages({
      "string.empty": `First name cannot be an empty field`,
      "any.required": `First name is a required field`,
    }),
    lastName: Joi.string().min(3).max(30).required().messages({
      "string.empty": `Last name cannot be an empty field`,
      "any.required": `Last name is a required field`,
    }),

    confirmPassword: Joi.string()
      .valid(Joi.ref("password"))
      .required()
      .messages({ "any.only": "Confirm password does not match" }),

    phone: Joi.string()
      .pattern(new RegExp(/^(002|\+2)?01[0125][0-9]{8}$/))
      .required()
      .messages({
        "string.pattern.base": `Phone number must be a valid Egyptian mobile number`,
      }),
  })
  .required();
