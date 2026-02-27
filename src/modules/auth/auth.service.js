import {
  decodeToken,
  generateToken,
  ProviderEnums,
  decodeRefreshToken,
} from "../../common/index.js";
import {
  ConflictException,
  NotFoundException,
  UnauthorizedException,
} from "../../common/index.js";
import { userModel } from "../../database/index.js";
import {
  findById,
  findOne,
  insertOne,
} from "../../database/database.service.js";
import { generateHash, compareHash } from "../../common/index.js";
import jwt from "jsonwebtoken";
import { env } from "../../../config/index.js";
import { OAuth2Client } from "google-auth-library";

export const signup = async (data) => {
  let { userName, email, password } = data;
  let existingUser = await findOne({ model: userModel, filter: { email } });
  if (existingUser) {
    return ConflictException({ message: "email already exists" });
  }
  let hashedPassword = await generateHash(password);
  let newUser = await insertOne({
    model: userModel,
    data: {
      userName,
      email,
      password: hashedPassword,
    },
  });
  return newUser;
};

export const login = async (data, issuer) => {
  let { email, password } = data;
  // await userModel.findOne({ email ,password, provider: ProviderEnums.System});
  let existingUser = await findOne({
    model: userModel,
    filter: { email, provider: ProviderEnums.System },
  });

  if (existingUser) {
    let { accessToken, refreshToken } = generateToken(existingUser);
    const ismatching = await compareHash(password, existingUser.password);
    if (ismatching) {
      return { existingUser, accessToken, refreshToken };
    }
  }
  return notFoundException({ message: "invalid email or password" });
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

export const signupGoogle = async (data) => {
  const client = new OAuth2Client();
  const ticket = await client.verifyIdToken({
    idToken: data,
    audience: "WEB_CLIENT_ID",
  });
  const payload = ticket.getPayload();
};
