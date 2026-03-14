import joi from "joi";

export const signupSchema = joi.object({
  userName: joi.string().required().min(3).max(50),
  age: joi.number().min(18).max(120).required().messages({
    "number.min": "age must be more that 18",
  }),
  email: joi.string().email().required(),
  password: joi
    .string()
    .required()
    .pattern(/^[a-zA-Z0-9@$*&]{6,30}$/),
  gender: joi.string().optional(),
  shareProfileName: joi.string().required(),
});

export const loginSchema = joi.object({
  email: joi.string().email().required(),
  password: joi.string().min(3).max(30).required().alphanum(),
});

export const fileSchema = joi.object({
  fieldname: joi.string().required(),
  originalname: joi.string().required(),
  encoding: joi.string().required(),
  mimetype: joi.string().required(),
  destination: joi.string().required(),
  filename: joi.string().required(),
  path: joi.string().required(),
  size: joi.number().required,
});
