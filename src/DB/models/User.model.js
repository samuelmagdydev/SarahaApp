import mongoose from "mongoose";

export const genderEnum = { male: "male", female: "female" };
export const roleEnum = { user: "User", admin: "Admin" };
export const providerEnum = { system: "system", google: "google" };

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
      required: function () {
        return this.provider === providerEnum.system ? true : false;
      },
    },
    gender: {
      type: String,
      enum: {
        values: Object.values(genderEnum),
        message: `gender only allow ${Object.values(genderEnum)}`,
      },
      default: genderEnum.male,
    },
    phone: {
      type: String,
      required: function () {
        return this.provider === providerEnum.system ? true : false;
      },
    },
    role: {
      type: String,
      enum: Object.values(roleEnum),
      default: roleEnum.user,
    },
    picture: String,
    provider: {
      type: String,
      enum: Object.values(providerEnum),
      default: providerEnum.system,
    },
  },
  {
    timestamps: true,
  }
);

export const UserModel =
  mongoose.models.User || mongoose.model("User", userSchema);
UserModel.syncIndexes();
