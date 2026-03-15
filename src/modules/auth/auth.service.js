import {
  decodeToken,
  generateToken,
  ProviderEnums,
  decodeRefreshToken,
  BadRequestException,
  ConflictException,
  NotFoundException,
  UnauthorizedException,
} from "../../common/index.js";
import { userModel } from "../../database/index.js";
import {
  findById,
  findOne,
  findOneAndUpdate,
  insertOne,
} from "../../database/database.service.js";
import { generateHash, compareHash } from "../../common/index.js";
import jwt from "jsonwebtoken";
import { env } from "../../../config/index.js";
import { OAuth2Client } from "google-auth-library";
import { generateOTP } from "../../common/utils/otp/otp.js";
import { sendEmail } from "../../common/utils/emailServices/email.services.js";
import {
  set,
  createRevokeKey,
  ttl,
  get,
  redis_Delete,
} from "../../database/redis.service.js";
import { event } from "../../common/utils/emailServices/email.events.js";

export const signup = async (data, file) => {
  let { userName, email, password, shareProfileName } = data;
  let existingUser = await findOne({ model: userModel, filter: { email } });
  if (existingUser) {
    return ConflictException({ message: "email already exists" });
  }
  let image = "";
  if (file) {
    image = `${env.BASE_URL}/uploads/${file.filename}`;
  }
  let hashedPassword = await generateHash(password);
  let newUser = await insertOne({
    model: userModel,
    data: {
      userName,
      email,
      password: hashedPassword,
      image,
      shareProfileName,
    },
  });
  event.emit("verifyEmail", { userId: newUser._id, email });
  return newUser;
};

export const verifySignin = async ({ email, code }) => {
  let user = await findOne({ model: userModel, filter: { email } });
  if (!user) {
    return NotFoundException({ message: "user not found" });
  }
  if (user.isVerified) {
    return ConflictException({ message: "user already verified" });
  }
  let otp = await get(`otp::${user._id}`);
  if (await compareHash(code, otp)) {
    user = await findOneAndUpdate({
      model: userModel,
      filter: { _id: user._id },
      update: { isVerified: true },
      options: { new: true },
    });
  } else {
    return UnauthorizedException({ message: "invalid code" });
  }
};

export const login = async (data, issuer) => {
  let { email, password } = data;

  const user = await findOne({
    model: userModel,
    filter: { email, provider: ProviderEnums.System },
  });

  if (!user.email) {
    return NotFoundException({ message: "invalid email" });
  }

  if (user.banUntil && user.banUntil > Date.now()) {
    throw BadRequestException({
      message: "Account temporarily locked. Try again later.",
    });
  }

  const isMatching = await compareHash(password, user.password);

  if (!isMatching) {
    user.loginAttempts += 1;

    if (user.loginAttempts >= 5) {
      user.banUntil = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes
      user.loginAttempts = 0;
    }

    await user.save();

    throw BadRequestException(
      `Invalid email or password. ${5 - user.loginAttempts} attempts remaining`,
    );
  }

  user.loginAttempts = 0;
  user.banUntil = null;
  await user.save();

  //if 2FA enabled
  if (user.twoFactorEnabled) {
    const otp = generateOTP();

    user.otpCode = otp;
    user.otpExpires = new Date(Date.now() + 5 * 60 * 1000);

    await user.save();

    await sendEmail(
      user.email,
      "Login Verification Code",
      `Your login OTP is: ${otp}`,
    );

    return {
      twoFactorRequired: true,
      message: "OTP sent to your email",
    };
  }

  let { accessToken, refreshToken } = generateToken(user);

  return { user, accessToken, refreshToken };
};

export const getUserById = async (userId) => {
  let userData = await findById({ model: userModel, id: userId });
  return userData;
};

export const generateAccessToken = async (token) => {
  let decodedData = decodeRefreshToken(token);
  let signature = undefined;

  switch (decodedData.aud) {
    case "Admin":
      signature = env.adminSignature;
      break;
    default:
      signature = env.userSignature;
      break;
  }
  let accessToken = jwt.sign({ id: decodedData.id }, signature, {
    expiresIn: "30m",
    audience: decodedData.aud,
  });
  return accessToken;
};

// export const signupGoogle = async (data) => {
//   const client = new OAuth2Client();
//   const ticket = await client.verifyIdToken({
//     idToken: data,
//     audience: "WEB_CLIENT_ID",
//   });
//   const payload = ticket.getPayload();
// };

export const enable2FA = async (userId) => {
  const user = await findById({ model: userModel, id: userId });
  const otp = generateOTP();
  user.otpCode = otp;
  user.otpExpires = new Date(Date.now() + 5 * 60 * 1000);
  await user.save();

  await sendEmail(
    user.email,
    "Your OTP Code",
    `Your verification code is: ${otp}`,
  );
  return true;
};

export const verify2FA = async (userId, otp) => {
  const user = await userModel.findById(userId);
  if (!user.otpCode || user.otpCode !== otp) {
    throw BadRequestException({ message: "Invalid OTP" });
  }
  if (user.otpExpires < Date.now()) {
    throw BadRequestException({ message: "OTP expired" });
  }
  user.twoFactorEnabled = true;
  user.otpCode = null;
  user.otpExpires = null;
  await user.save();
  return true;
};

export const confirmLogin = async ({ email, otp }) => {
  const user = await userModel.findOne({ email });
  if (!user || user.otpCode !== otp) {
    throw BadRequestException({ message: "Invalid OTP" });
  }
  if (user.otpExpires < Date.now()) {
    throw BadRequestException({ message: "OTP expired" });
  }
  user.otpCode = null;
  user.otpExpires = null;
  await user.save();
  const { accessToken, refreshToken } = generateToken(user);
  return { accessToken, refreshToken };
};

export const updatePassword = async (userId, data) => {
  const { oldPassword, newPassword } = data;
  const user = await findOne({
    model: userModel,
    filter: { _id: userId },
  });
  if (!user) {
    throw NotFoundException({ message: "User not found" });
  }
  const isMatching = await compareHash(oldPassword, user.password);
  if (!isMatching) {
    throw BadRequestException({ message: "Old password is incorrect" });
  }
  user.password = await generateHash(newPassword);
  await user.save();
  return true;
};

export const forgetPassword = async (email) => {
  const user = await findOne({
    model: userModel,
    filter: { email: email },
  });
  if (!user) {
    throw NotFoundException({ message: "User not found" });
  }
  const otp = generateOTP();
  // user.otpCode = otp;
  // user.otpExpires = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes
  set({
    key: `otp::${user._id}`,
    value: await generateHash(otp),
    ttl: 5 * 60,
  });
  // await user.save();
  await sendEmail(
    user.email,
    "Password Reset OTP",
    `Your OTP for resetting your password is: ${otp}`,
  );
  return true;
};

export const verifyResetOTP = async (email, password, otp) => {
  const user = await userModel.findOne({ email });
  if (!user) {
    throw BadRequestException({ message: "USER NOT FOUND" });
  }
  let hashedOTP = await get(`otp::${user._id}`);
  if (await compareHash(otp, hashedOTP)) {
    if (await compareHash(password, user.password)) {
      throw BadRequestException({
        message: "New password should not match old password",
      });
    } else {
      let hashedPasssword = await generateHash(password);
      let updatedUser = await findOneAndUpdate({
        model: userModel,
        filter: { _id: user._id },
        update: { password: hashedPasssword },
        options: { new: true },
      });
      if (updatePassword) {
        await redis_Delete(`otp::${user._id}`);
      }
      return updatedUser;
    }
  } else {
    throw BadRequestException({
      message: "Incorrect otp",
    });
  }

  // if (!user || user.otpCode !== otp) {
  //   throw BadRequestException({ message: "Invalid OTP" });
  // }
  // if (user.otpExpires < Date.now()) {
  //   throw BadRequestException({ message: "OTP expired" });
  // }
  return true;
};

// export const resetPassword = async (email, otp, newPassword) => {
//   const user = await userModel.findOne({ email });
//   if (!user || user.otpCode !== otp) {
//     throw BadRequestException({ message: "Invalid OTP" });
//   }
//   if (user.otpExpires < Date.now()) {
//     throw BadRequestException({ message: "OTP expired" });
//   }
//   user.password = await generateHash(newPassword);
//   user.otpCode = null;
//   user.otpExpires = null;
//   await user.save();
//   return true;
// };

export const logout = async (req) => {
  let redisKey = createRevokeKey(req);

  await set({ key: redisKey, value: 1, ttl: req.decoded.iat + 30 * 60 });
};
