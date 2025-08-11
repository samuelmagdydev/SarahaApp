export const asyncHandler = (fn) => {
  return async (req, res, next) => {
    await fn(req, res, next).catch((error) => {
      return next(error, { cause: 500 });
    });
  };
};

export const globalErrorHandling = (error, req, res, next) => {
  return res
    .status(error.cause || 400)
    .json({ message: error.message, stack: error.stack });
};
