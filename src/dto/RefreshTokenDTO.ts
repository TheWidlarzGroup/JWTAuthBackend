import * as Joi from "joi";

export interface RefreshTokenDTO {
  refreshToken: string;
}

export const refreshTokenSchema = Joi.object<RefreshTokenDTO>({
  refreshToken: Joi.string().required(),
});
