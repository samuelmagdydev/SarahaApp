import { UserModel } from "../../DB/models/User.model.js";
import { asyncHandler } from "../../utils/response.js";

export const signup = asyncHandler(async (req, res, next) => {
  const { firstName, lastName, email, password, phone } = req.body;
  if (await UserModel.findOne({ email })) {
    return next(new Error("Email Already Exist", { cause: 409 }));
  }
  const [user] = await UserModel.create([
    {
      firstName,
      lastName,
      email,
      password,
      phone,
    },
  ]);
  return res
    .status(201)
    .json({ message: "Account Created Successfully", user });
});
