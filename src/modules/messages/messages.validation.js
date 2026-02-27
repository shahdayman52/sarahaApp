import joi from "joi";

export const createMessageSchema = joi.object({
  message: joi.string().required().min(10).max(500).messages({
    "string.min":"message must be more than 10 characters"
  }),
  image: joi.string().optional().uri(),

});