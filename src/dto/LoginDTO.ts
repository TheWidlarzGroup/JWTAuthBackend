import * as Joi from "joi";

export interface LoginDTO {
  email: string;
  password: string;
}

export const loginSchema = Joi.object<LoginDTO>({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});
