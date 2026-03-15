import { decodeToken, UnauthorizedException } from "../../common/index.js";
import { createRevokeKey, get } from "../../database/redis.service.js";
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
      let revoked = await get(createRevokeKey({ userId: decodedData.id, token }));
      if (revoked) {
        throw new Error("already logged out");
      }
      req.userId = decodedData.id;
      req.token = token;
      req.decoded = decodedData;
      next();
      break;

    default:
      break;
  }

  if (!authorization) {
    UnauthorizedException("unauthorized");
  }
};
