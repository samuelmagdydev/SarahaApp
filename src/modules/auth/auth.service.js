import { providerEnum, UserModel } from "../../DB/models/User.model.js";
import { asyncHandler, successResponse } from "../../utils/response.js";
import * as DBService from "../../DB/db.service.js";
import {
  generateHash,
  compareHash,
} from "../../utils/security/hash.security.js";
import { generateEncryption } from "../../utils/security/encryption.security.js";
import { generateLoginCredentials } from "../../utils/security/token.security.js";
import { OAuth2Client } from "google-auth-library";
import { sendEmail } from "../../utils/email/send.email.js";
import { emailEvent } from "../../utils/events/email.event.js";
import { customAlphabet } from "nanoid";

import * as validators from "./auth.validation.js";

export const signup = asyncHandler(async (req, res, next) => {
  const { firstName, lastName, email, password, phone } = req.body;
  if (await DBService.findOne({ model: UserModel, filter: { email } })) {
    return next(new Error("Email Already Exist", { cause: 409 }));
  }

  const hashPassword = await generateHash({ plaintext: password });
  const encPhone = await generateEncryption({ plaintext: phone });
  const otp = customAlphabet("1234567890", 6)();
  const confirmEmailOtp = await generateHash({ plaintext: otp });
  const [user] = await DBService.create({
    model: UserModel,
    data: [
      {
        firstName,
        lastName,
        email,
        password: hashPassword,
        phone: encPhone,
        confirmEmailOtp,
      },
    ],
  });

  emailEvent.emit("confirmEmail", { to: email, otp: otp });
  return successResponse({
    res,
    status: 201,
    message: "Account Created Successfuly",
    data: { user },
  });
});

export const confirmEmail = asyncHandler(async (req, res, next) => {
  const { email, otp } = req.body;

  const user = await DBService.findOne({
    model: UserModel,
    filter: {
      email,
      confirmEmailL: {
        $exists: false,
      },
      confirmEmailOtp: { $exists: true },
    },
  });

  if (!user) {
    return next(
      new Error("In-valid Email Or Email Already Confirmed", { cause: 404 })
    );
  }

  if (
    !(await compareHash({ plaintext: otp, hashValue: user.confirmEmailOtp }))
  ) {
    return next(new Error("In-valid OTP", { cause: 400 }));
  }

  const updatedUser = await DBService.updateOne({
    model: UserModel,
    filter: { email },
    data: {
      confirmEmail: Date.now(),
      $unset: { confirmEmailOtp: true },
      $inc: { __v: 1 },
    },
  });

  return updatedUser.matchedCount
    ? successResponse({
        res,
        status: 200,
        message: "Account Confirmed Successfuly",
      })
    : next(new Error("Fail to confirm email", { cause: 400 }));
});

export const login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;
  const user = await DBService.findOne({
    model: UserModel,
    filter: { email, provider: providerEnum.system },
  });
  if (!user) {
    return next(new Error("In-valid Email Or Paasword", { cause: 404 }));
  }

  if (!user.confirmEmail) {
    return next(new Error("Please Confirm Your Email", { cause: 400 }));
  }
  if(user.deletedAt){
    return next(new Error("Account Deleted", { cause: 400 }));
  } 
  const match = await compareHash({
    plaintext: password,
    hashValue: user.password,
  });
  if (!match) {
    return next(new Error("In-Valid Email Or Paasword", { cause: 404 }));
  }
  const credentials = await generateLoginCredentials({ user });
  return successResponse({ res, data: { credentials } });
});

export const forgetPassword = asyncHandler(async (req, res, next) => {
  const { email } = req.body;
  const otp = customAlphabet("0123456789", 6)();
  const user = await DBService.findOneAndUpdate({
    model: UserModel,
    filter: {
      email,
      provider: providerEnum.system,
      confirmEmail: { $exists: true },
      deletedAt: { $exists: false },
    },
    data: {
      forgotPasswordOtp: await generateHash({ plaintext: otp }),
    },
  });

  if (!user) {
    return next(new Error("In-valid Email", { cause: 404 }));
  }

  emailEvent.emit("SendForgotPasswordCode", {
    to: email,
    subject: "Forget Password",
    title: "Reset Password",
    otp,
  });
  return successResponse({ res, message: "Code Send Successfully" });
});

export const verfiyForgotPassword = asyncHandler(async (req, res, next) => {
  const { email, otp } = req.body;
  const user = await DBService.findOne({
    model: UserModel,
    filter: {
      email,
      provider: providerEnum.system,
      confirmEmail: { $exists: true },
      deletedAt: { $exists: false },
      forgotPasswordOtp: { $exists: true },
    },
  });

  if (!user) {
    return next(new Error("In-valid Email", { cause: 404 }));
  }

  if (
    !(await compareHash({ plaintext: otp, hashValue: user.forgotPasswordOtp }))
  ) {
    return next(new Error("In-valid OTP", { cause: 400 }));
  }

  return successResponse({ res, message: "Code Verfied Successfully" });
});


export const resetForgotPassword = asyncHandler(async (req, res, next) => {
  const { email, otp , password } = req.body;
  const user = await DBService.findOne({
    model: UserModel,
    filter: {
      email,
      provider: providerEnum.system,
      confirmEmail: { $exists: true },
      deletedAt: { $exists: false },
      forgotPasswordOtp: { $exists: true },
    },
  });

  if (!user) {
    return next(new Error("In-valid Email", { cause: 404 }));
  }

  if (
    !(await compareHash({ plaintext: otp, hashValue: user.forgotPasswordOtp }))
  ) {
    return next(new Error("In-valid OTP", { cause: 400 }));
  }

  await DBService.updateOne({
    model: UserModel,
    filter: { email },
    data: {
      password: await generateHash({ plaintext: password }),
      changeCredentialsTime: Date.now(),
      $unset: { forgotPasswordOtp: 1 },
      
    }
  })

  return successResponse({ res, message: "Password Reset Successfully" });
});

async function verfiyGoogleAccount({ idToken } = {}) {
  const client = new OAuth2Client();

  const ticket = await client.verifyIdToken({
    idToken,
    audience: process.env.WEB_CLIENT_ID,
  });
  const payload = ticket.getPayload();
  return payload;
}

export const signupWithGmail = asyncHandler(async (req, res, next) => {
  const { idToken } = req.body;
  const { picture, name, email, email_verified } = await verfiyGoogleAccount({
    idToken,
  });
  if (!email_verified) {
    return next(new Error("Not Verified Account", { cause: 400 }));
  }
  const user = await DBService.findOne({
    model: UserModel,
    filter: { email },
  });
  if (user) {
    if (user.provider === providerEnum.google) {
      const credentials = await generateLoginCredentials({ user });

      return successResponse({
        res,
        status: 200,
        message: "Login Successfuly",
        data: { credentials },
      });
    }
    return next(new Error("Email Already Exist", { cause: 409 }));
  }
  const newUser = await DBService.create({
    model: UserModel,
    data: [
      {
        email,
        picture,
        firstName: name,
        confirmEmail: Date.now(),
        provider: providerEnum.google,
      },
    ],
  });

  const credentials = await generateLoginCredentials({ user: newUser });

  return successResponse({
    res,
    status: 201,
    data: { credentials },
  });
  // return successResponse({
  //   res,
  //   status: 201,
  //   message: "Account Created Successfuly",
  //   data: { user: newUser._id },
  // });
});

export const loginWithGmail = asyncHandler(async (req, res, next) => {
  const { idToken } = req.body;
  const { picture, name, email, email_verified } = await verfiyGoogleAccount({
    idToken,
  });
  if (!email_verified) {
    return next(new Error("Not Verified Account", { cause: 400 }));
  }
  const user = await DBService.findOne({
    model: UserModel,
    filter: { email, provider: providerEnum.google },
  });
  if (!user) {
    return next(
      new Error("In-valid login Data Or Invalid Provider", { cause: 404 })
    );
  }

  const credentials = await generateLoginCredentials({ user });

  return successResponse({
    res,
    status: 200,
    message: "Account Created Successfuly",
    data: { credentials },
  });
});
