import jwt from "jsonwebtoken";
import { env } from "../../../config/index.js";

export const generateToken = (user) => {
  let signature = undefined;
  let audience = undefined;
  let refreshSignature = undefined;
  switch (user.role) {
    case "0":
      signature = env.adminSignature;
      refreshSignature = env.adminRefreshSignature;
      audience = "Admin";
      break;

    default:
      signature = env.userSignature;
      refreshSignature = env.userRefreshSignature;
      audience = "User";
      break;
  }

  let accessToken = jwt.sign({ id: user._id }, signature, {
    audience,
    expiresIn: "30m",
  });
  let refreshToken = jwt.sign({ id: user._id }, refreshSignature, {
    expiresIn: "1y",
    audience,
  });
  return { accessToken, refreshToken };
};

export const decodeToken = (token) => {
  let decoded = jwt.decode(token);
  let signature = undefined;
  switch (decoded.aud) {
    case "Admin":
      signature = env.adminSignature;
      break;
    default:
      signature = env.userSignature;
      break;
  }
  let decodedData = jwt.verify(token, signature);
  return decodedData;
};



export const decodeRefreshToken = (refreshToken) => {
  let decoded = jwt.decode(refreshToken);
  let refreshSignature = undefined;
  switch (decoded.aud) {
    case "Admin":
      refreshSignature = env.adminRefreshSignature;
      break;
    default:
      refreshSignature = env.userRefreshSignature;
      break;
  }
  let decodedData = jwt.verify(refreshToken, refreshSignature);
  return decodedData;
};
