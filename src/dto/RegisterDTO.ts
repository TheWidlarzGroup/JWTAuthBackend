import * as Joi from "joi";

export interface RegisterDTO {
  email: string;
  name: string;
  password: string;
}

export const registerSchema = Joi.object<RegisterDTO>({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
  name: Joi.string().required(),
});
