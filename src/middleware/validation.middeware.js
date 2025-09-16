import { asyncHandler } from "../utils/response.js";

export const validation = (schema) => {
  return asyncHandler(async (req, res, next) => {
    const validationResult = schema.validate(req.body, {
      abortEarly: false,
    });
    if (validationResult.error) {
      return res
        .status(400)
        .json({ err_message: "Validation Error", validationResult });
    }
    return next();
  });
};
