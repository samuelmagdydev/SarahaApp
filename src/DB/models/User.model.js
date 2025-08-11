import mongoose from "mongoose";

let genderEnum = { male: "male", female: "female" };

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      minLength: 2,
      maxLength: [20, "Max Length is 20 char"],
    },
    lastName: {
      type: String,
      required: true,
      minLength: 2,
      maxLength: [20, "Max Length is 20 char"],
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    confirmEmail: Date,
    password: {
      type: String,
      required: true,
    },
    gender: {
      type: String,
      enum: {
        values: Object.values(genderEnum),
        message: `gender only allow ${Object.values(genderEnum)}`,
      },
      default: genderEnum.male,
    },
    phone: String,
  },
  {
    timestamps: true,
  }
);

export const UserModel =
  mongoose.models.User || mongoose.model("User", userSchema);
UserModel.syncIndexes();
