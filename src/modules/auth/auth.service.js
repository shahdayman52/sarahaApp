import { ProviderEnums } from "../../common/index.js";
import {
  ConflictException,
  notFoundException,
  UnauthorizedException,
} from "../../common/index.js";
import { userModel } from "../../database/index.js";
import { findById, findOne } from "../../database/database.service.js";
import { generateHash, compareHash } from "../../common/index.js";
import jwt from "jsonwebtoken";

export const signup = async (data) => {
  let { userName, email, password } = data;
  let existingUser = await findOne({ model: userModel, filter: { email } });
  if (existingUser) {
    return ConflictException({ message: "email already exists" });
  }
  let hashedPassword = await generateHash(password);
  let newUser = await userModel.insertOne({
    userName,
    email,
    password: hashedPassword,
  });
  return newUser;
};

export const login = async (data) => {
  let { email, password } = data;
  // await userModel.findOne({ email ,password, provider: ProviderEnums.System});
  let existingUser = await findOne({
    model: userModel,
    filter: { email, provider: ProviderEnums.System },
  });
  if (existingUser) {
    const ismatching = await compareHash(password, existingUser.password);

    if (ismatching) {
      const token = jwt.sign({ id: existingUser._id }, "route");
      return { existingUser, token };
    }
  }
  return notFoundException({ message: "invalid email or password" });
};

export const getUserById = async (headers) => {
  let { authorization } = headers;
  if (!authorization) {
    UnauthorizedException("unauthorized");
  }
  let decoded = jwt.verify(authorization, "route");
  let userData = await findById({ model: userModel, id: decoded.id });
  return userData;
};
