import { BadRequestException } from "../response/error.response.js";

export const validation = (schema) => {
  return (req, res, next) => {
    let { value, error } = schema.validate({...req.body,...req.file,...req.files} ,{ abortEarly: false });
    if (error) {
      throw BadRequestException({ message: "validation error", extra: error });
    }
    next();
  };
};
