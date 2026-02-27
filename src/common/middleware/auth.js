import jwt from "jsonwebtoken";
import { env } from "../../../config/index.js";
import { decodeToken, UnauthorizedException } from "../../common/index.js";
export const auth = async (req, res, next) => {
  let { authorization } = req.headers;
  const [flag, token] = authorization.split(" ");

  switch (flag) {
    case "Basic":
      let data = Buffer.from(token, "base64").toString();
      let [email, password] = data.split(":");
      break;
    case "Bearer":
      // let decoded = jwt.decode(authorization);
      let decodedData = decodeToken(token);
      req.userId = decodedData.id;
      next();
      break;

    default:
      break;
  }

  if (!authorization) {
    UnauthorizedException("unauthorized");
  }
};
