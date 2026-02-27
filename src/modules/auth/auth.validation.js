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
  users: joi.array().items(joi.string()).required()
});

export const loginSchema = joi.object({
  email: joi.string().email().required(),
  password: joi.string().min(3).max(30).required().alphanum(),
});
