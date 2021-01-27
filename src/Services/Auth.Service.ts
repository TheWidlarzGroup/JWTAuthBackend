import { prisma } from "@db";
import createError from "http-errors";
import { RegisterDTO, registerSchema } from "../dto/RegisterDTO";
import * as bcrypt from "bcrypt";

export const register = async (registerDto: RegisterDTO): Promise<any> => {
  try {
    const result: RegisterDTO = await registerSchema.validateAsync(registerDto);
    const { email, password } = result;
    const doesExist = await prisma.user.findUnique({ where: { email: email } });
    if (doesExist) {
      throw new createError.Conflict(`${email} is already registered`);
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: { ...result, password: hashedPassword },
      select: { password: false, email: true, name: true },
    });
    return user;
  } catch (error) {
    throw error;
  }
};
