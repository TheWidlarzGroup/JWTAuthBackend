import * as Joi from "joi";

export interface LogoutDTO {
  refreshToken: string;
}

export const logoutSchema = Joi.object<LogoutDTO>({
  refreshToken: Joi.string().required(),
});
