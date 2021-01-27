import { prisma } from "@db";
import createError from "http-errors";
import { RegisterDTO, registerSchema } from "../dto/RegisterDTO";
import * as bcrypt from "bcrypt";
import { LoginDTO, loginSchema } from "src/dto/LoginDTO";
import { signAccessToken, signRefreshToken, verifyRefreshToken } from "./Token.Service";
import { RefreshTokenDTO, refreshTokenSchema } from "src/dto/RefreshTokenDTO";

export const register = async (registerDto: RegisterDTO): Promise<any> => {
  const result: RegisterDTO = await registerSchema.validateAsync(registerDto);
  const { email, password } = result;
  const doesExist = await prisma.user.findUnique({ where: { email: email } });
  if (doesExist) {
    throw new createError.Conflict(`${email} is already registered`);
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({
    data: { ...result, password: hashedPassword },
    select: { password: false, email: true, name: true, id: true },
  });

  const accessToken = await signAccessToken(user.id);
  const refreshToken = await signRefreshToken(user.id);

  return { accessToken, refreshToken };
};

export const login = async (loginDto: LoginDTO) => {
  const result: LoginDTO = await loginSchema.validateAsync(loginDto);
  const { email, password } = result;
  const user = await prisma.user.findUnique({
    rejectOnNotFound: true,
    where: { email },
    select: { password: true, id: true, email: true },
  });
  if (!user) throw new createError.Unauthorized("User not found");
  const isMatch = await bcrypt.compare(password, user?.password || "");
  if (!isMatch) throw new createError.Unauthorized("Username/password not valid");
  const accessToken = await signAccessToken(user.id);
  const refreshToken = await signRefreshToken(user.id);
  return { accessToken, refreshToken };
};

export const refreshToken = async (refreshTokenDTO: RefreshTokenDTO) => {
  const result: RefreshTokenDTO = await refreshTokenSchema.validateAsync(refreshTokenDTO);
  const { refreshToken } = result;
  if (!refreshToken) throw new createError.BadRequest();
  const userId = await verifyRefreshToken(refreshToken);
  const newAccessToken = await signAccessToken(userId);
  const newRefreshToken = await signRefreshToken(userId);
  return { accessToken: newAccessToken, refreshToken: newRefreshToken };
};
